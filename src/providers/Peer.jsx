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
            }
        ]
    }), [])

    // Track which track ids we've already added, so calling sendStream
    // more than once (e.g. from an effect + a button) doesn't try to
    // add the same track twice, which throws.
    const addedTrackIds = useRef(new Set())

    const createAnswer = useCallback(async (offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }, [peer])

    const setRemoteAns = useCallback(async (ans) => {
        await peer.setRemoteDescription(ans)
    }, [peer])

    const createOffer = useCallback(async () => {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return offer
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

    const value = useMemo(() => ({
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        remoteStream
    }), [peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream])

    return <PeerContext.Provider value={value}>{props.children}</PeerContext.Provider>
}

