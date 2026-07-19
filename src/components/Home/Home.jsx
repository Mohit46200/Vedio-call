import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Hash, ArrowRight, Lock } from "lucide-react"
import { useSocket } from "../../providers/Socket"

const Home = () => {
  const socket = useSocket();
  const [email, setEmail] = useState("")
  const [room_id, setRoom_id] = useState("")
  const navigate = useNavigate()

  const handleRoomJoined = useCallback(({ room_id }) => {
    navigate(`/room/${room_id}`)
  }, [navigate])

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined)

    const handleRoomFull = () => {
      alert("This room already has 2 participants. Please join another room.");
      }
    socket.on("room-full", handleRoomFull)


    return () => {
      socket.off("joined-room", handleRoomJoined)
      socket.off("room-full", handleRoomFull)
    }
  }, [socket, handleRoomJoined])

  const handlejoinroom = () => {
    if (!email || !room_id) return
    socket.emit("joined-room", { email: email, room_id: room_id })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md relative bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
        <div className="px-8 pt-8 pb-6">
           
          <h1 className="text-3xl font-extrabold text-zinc-100 mb-1">
            Join Meeting
          </h1>
          <p className="text-sm text-zinc-400 mb-8">
            Enter your details below to get in.
          </p>
 
          <label className="font-mono text-xs uppercase tracking-widest text-zinc-400 block mb-2">
            Passenger
          </label>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-zinc-500 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-transparent border-0 border-b border-zinc-700 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>
 
        
        <div className="relative px-8">
          <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-zinc-950" />
          <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-zinc-950" />
          <div className="border-t border-dashed border-zinc-700" />
        </div>
 
        <div className="px-8 pt-6 pb-8">
          <label className="font-mono text-xs uppercase tracking-widest text-zinc-400 block mb-2">
            Meeting Code
          </label>
          <div className="flex items-center gap-3 mb-8">
            <Hash size={16} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              value={room_id}
              onChange={(e) => setRoom_id(e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              className="w-full bg-transparent border-0 border-b border-zinc-700 py-2 text-sm font-mono tracking-wider text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-400 transition-colors"
            />
          </div>
 
          <button
            onClick={handlejoinroom}
            className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2 text-zinc-950 bg-gradient-to-br from-amber-300 to-amber-600 hover:from-amber-200 hover:to-amber-500 active:scale-95 transition-all"
          >
            Enter Meeting
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home


