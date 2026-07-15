import { usePeer } from "../../providers/Peer"
import { useSocket } from "../../providers/Socket"
import { useCallback, useEffect, useRef, useState } from "react"

const Room = () => {
  const socket = useSocket()

  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream, setPolite } = usePeer()

  const [myStream, setMyStream] = useState(null)
  const [remoteEmailId, setRemoteEmailId] = useState(null)

  const myVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)


  const remoteEmailIdRef = useRef(null)
  useEffect(() => {
    remoteEmailIdRef.current = remoteEmailId
  }, [remoteEmailId])

  const mediaPromiseRef = useRef(null)
  const getUserMediaStream = useCallback(() => {
    if (!mediaPromiseRef.current) {
      mediaPromiseRef.current = navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMyStream(stream)
          sendStream(stream)
          return stream
        })
        .catch((err) => {
          console.error("Could not access camera/microphone:", err)
          mediaPromiseRef.current = null
          throw err
        })
    }
    return mediaPromiseRef.current
  }, [sendStream])

  const handleNewUserJoined = useCallback(
    async ({ email }) => {
      console.log("New user joined room:", email)
      setPolite(false) // we're the caller in this exchange
      await getUserMediaStream() // make sure our own tracks are attached first
      const offer = await createOffer()
      socket.emit("call-user", { email, offer })
      setRemoteEmailId(email)
    },
    [createOffer, socket, getUserMediaStream, setPolite]
  )

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from:", from, offer)
      setPolite(true) // we're the callee in this exchange
      await getUserMediaStream() // make sure our own tracks are attached first
      const ans = await createAnswer(offer)
      if (!ans) return // offer lost a negotiation collision, nothing to answer
      socket.emit("call-accepted", { email: from, ans })
      setRemoteEmailId(from)
    },
    [createAnswer, socket, getUserMediaStream, setPolite]
  )

  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      console.log("Call accepted")
      await setRemoteAns(ans)
    },
    [setRemoteAns]
  )

  const handlenegotiation = useCallback(async () => {
    if (!remoteEmailIdRef.current) return
    const localOffer = await createOffer()
    socket.emit('call-user', { email: remoteEmailIdRef.current, offer: localOffer })
  }, [createOffer, socket])

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined)
    socket.on("incoming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccepted)

    return () => {
      socket.off("user-joined", handleNewUserJoined)
      socket.off("incoming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccepted)
    }
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    getUserMediaStream()
  }, [getUserMediaStream])

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
      remoteVideoRef.current.play().catch((err) => {
        console.warn("Remote video playback was blocked:", err)
      })
    }
  }, [remoteStream])

  useEffect(() => {
    peer.addEventListener('negotiationneeded', handlenegotiation)
    return () => {
      peer.removeEventListener('negotiationneeded', handlenegotiation)
    }
  }, [peer, handlenegotiation])

  return (
    <div>
      <h1>Room</h1>
      <h2>My Video</h2>
      <h4>you are connected to {remoteEmailId}</h4>
      <video
        ref={myVideoRef}
        autoPlay
        playsInline
        muted
        width={400}
      />

      <h2>Remote Video</h2>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width={400}
      />
    </div>
  );
};

export default Room;