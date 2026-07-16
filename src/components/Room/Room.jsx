import { usePeer } from "../../providers/Peer"
import { useSocket } from "../../providers/Socket"
import { useCallback, useEffect, useRef, useState } from "react"

const Room = () => {
  const socket = useSocket()

  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer()

  const [myStream, setMyStream] = useState(null)
  const [remoteEmailId, setRemoteEmailId] = useState(null)

  const myVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // Keep a ref in sync with remoteEmailId so callbacks that must stay
  // stable (like the negotiationneeded handler) can always read the
  // latest value instead of capturing a stale one.
  const remoteEmailIdRef = useRef(null)
  useEffect(() => {
    remoteEmailIdRef.current = remoteEmailId
  }, [remoteEmailId])

  const handleNewUserJoined = useCallback(
    async ({ email }) => {
      console.log("New user joined room:", email)

      const offer = await createOffer()
      socket.emit("call-user", { email, offer })
      setRemoteEmailId(email)
    },
    [createOffer, socket]
  )

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from:", from, offer)

      const ans = await createAnswer(offer)
      socket.emit("call-accepted", { email: from, ans })
      setRemoteEmailId(from)
    },
    [createAnswer, socket]
  )

  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      console.log("Call accepted")
      await setRemoteAns(ans)
    },
    [setRemoteAns]
  )

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMyStream(stream)
  }, [])

  // This is the key fix: when negotiationneeded fires (e.g. because a
  // track was just added to the peer connection), we must create a
  // *fresh* offer via createOffer() and send that - not re-send
  // peer.localDescription, which is stale and won't include the new
  // media. We also read the target email from a ref so this callback
  // never goes stale even though it's only attached once.
  const handlenegotiation = useCallback(async () => {
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

  // Automatically push our local tracks onto the peer connection as
  // soon as we have them, instead of relying only on a manual button
  // click. sendStream is now guarded against re-adding the same track,
  // so this is safe to fire whenever myStream/sendStream change.
  useEffect(() => {
    if (myStream) {
      sendStream(myStream)
    }
  }, [myStream, sendStream])

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
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
      <button onClick={() => sendStream(myStream)}>Send my video</button>
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



