import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../providers/Socket";

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
    return () => {
      socket.off("joined-room", handleRoomJoined)
    }
  }, [socket, handleRoomJoined])

  const handlejoinroom = () => {
    if (!email || !room_id) return
    socket.emit("joined-room", { email: email, room_id: room_id })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Join Meeting
        </h1>

        <div className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />

          <input
            type="text"
            value={room_id}
            onChange={(e) => setRoom_id(e.target.value)}
            placeholder="Enter meeting code"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />

          <button
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            onClick={handlejoinroom}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;


