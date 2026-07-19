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

  const remoteEmailIdRef = useRef(null)
  useEffect(() => {
    remoteEmailIdRef.current = remoteEmailId
  }, [remoteEmailId])

  const handleNewUserJoined = useCallback(async ({ email }) => {
      console.log("New user joined room:", email)

      const offer = await createOffer()
      socket.emit("call-user", { email, offer })
      setRemoteEmailId(email)
    },
    [createOffer, socket]
  )

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
      console.log("Incoming call from:", from, offer)

      const ans = await createAnswer(offer)
      socket.emit("call-accepted", { email: from, ans })
      setRemoteEmailId(from)
    },
    [createAnswer, socket]
  )

  const handleCallAccepted = useCallback(async ({ ans }) => {
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
  <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-8">
    <div className="w-full max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Meeting Room</h1>

      <p className="text-gray-400 mb-8">
        Connected to{" "}
        <span className="text-white font-medium">
          {remoteEmailId || "Waiting for participant..."}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* My Video */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-xl border border-slate-700">
          <div className="px-5 py-3 border-b border-slate-700">
            <h2 className="text-lg font-semibold">Your Camera</h2>
          </div>

          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video bg-black object-cover"
          />
        </div>

        {/* Remote Video */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-xl border border-slate-700">
          <div className="px-5 py-3 border-b border-slate-700">
            <h2 className="text-lg font-semibold">Remote Camera</h2>
          </div>

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full aspect-video bg-black object-cover"
          />
        </div>
      </div>
    </div>
  </div>
)
}

export default Room;



