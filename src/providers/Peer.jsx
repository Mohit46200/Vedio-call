import React, { useMemo, useEffect, useState, useCallback, useRef } from "react"

const PeerContext = React.createContext(null)

export const usePeer = () => React.useContext(PeerContext)

export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null)

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ],
            },
            {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
            },
            {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject",
            },
            {
                urls: "turn:openrelay.metered.ca:443?transport=tcp",
                username: "openrelayproject",
                credential: "openrelayproject",
            },
        ]
    }), [])

    const addedTrackIds = useRef(new Set())

    const politeRef = useRef(true)
    const makingOfferRef = useRef(false)

    const setPolite = useCallback((value) => {
        politeRef.current = value
    }, [])

    const createAnswer = useCallback(async (offer) => {
        const offerCollision = makingOfferRef.current || peer.signalingState !== "stable"

        if (offerCollision) {
            if (!politeRef.current) {
                return null
            }
            await peer.setLocalDescription({ type: "rollback" })
        }

        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }, [peer])

    const setRemoteAns = useCallback(async (ans) => {
        await peer.setRemoteDescription(ans)
    }, [peer])

    const createOffer = useCallback(async () => {
        try {
            makingOfferRef.current = true
            const offer = await peer.createOffer()
            await peer.setLocalDescription(offer)
            return offer
        } finally {
            makingOfferRef.current = false
        }
    }, [peer])

    const sendStream = useCallback(async (stream) => {
        if (!stream) return
        const tracks = stream.getTracks()
        for (const track of tracks) {
            if (!addedTrackIds.current.has(track.id)) {
                peer.addTrack(track, stream)
                addedTrackIds.current.add(track.id)
            }
        }
    }, [peer])

    const handleTrackEvent = useCallback((ev) => {
        const streams = ev.streams
        setRemoteStream(streams[0])
    }, [])

    useEffect(() => {
        peer.addEventListener('track', handleTrackEvent)

        return () => {
            peer.removeEventListener('track', handleTrackEvent)
        }
    }, [peer, handleTrackEvent])

    useEffect(() => {
        const logIce = () => console.log("[peer] iceConnectionState:", peer.iceConnectionState)
        const logConn = () => console.log("[peer] connectionState:", peer.connectionState)
        const logIceError = (ev) => console.warn("[peer] ICE candidate error:", ev.errorText || ev)

        peer.addEventListener('iceconnectionstatechange', logIce)
        peer.addEventListener('connectionstatechange', logConn)
        peer.addEventListener('icecandidateerror', logIceError)

        return () => {
            peer.removeEventListener('iceconnectionstatechange', logIce)
            peer.removeEventListener('connectionstatechange', logConn)
            peer.removeEventListener('icecandidateerror', logIceError)
        }
    }, [peer])

    const value = useMemo(() => ({peer,createOffer,createAnswer,setRemoteAns,sendStream,remoteStream,
        setPolite
    }), [peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream, setPolite])

    return <PeerContext.Provider value={value}>{props.children}</PeerContext.Provider>
}