import { useEffect } from "react";
import { useSocket } from "../../providers/Socket";

const Home = () => {
  const socket  = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", {
      room_id: "1",
      email: "any@gmail.com",
    });
  }, [socket]);
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Join Meeting
        </h1>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />

          <input
            type="text"
            placeholder="Enter meeting code"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />

          <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]">
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;