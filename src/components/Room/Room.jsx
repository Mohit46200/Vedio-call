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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative inline-flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-amber-400" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Meeting Room · Live
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-zinc-100 mb-2">Meeting Room</h1>

        <p className="text-zinc-400 mb-8 flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              remoteEmailId ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          Connected to{" "}
          <span className="text-zinc-100 font-medium">
            {remoteEmailId || "Waiting for participant..."}
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* My Video */}
          <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Your Camera
              </h2>
              <span className="text-xs font-mono text-zinc-600">You</span>
            </div>

            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video bg-black object-cover scale-x-[-1]"
            />
          </div>

          {/* Remote Video */}
          <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Remote Camera
              </h2>
              <span
                className={`flex items-center gap-1.5 text-xs font-mono ${
                  remoteEmailId ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    remoteEmailId ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                {remoteEmailId ? "Live" : "Waiting"}
              </span>
            </div>

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full aspect-video bg-black object-cover scale-x-[-1]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


export default Room



