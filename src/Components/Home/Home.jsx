import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Video, Keyboard, Plus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const createMeeting = () => {
    const id = uuid();
    navigate(`/meeting/${id}`);
  };

  const joinMeeting = () => {
    if (!roomId.trim()) return;
    navigate(`/meeting/${roomId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A]">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[150px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/10 px-8 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-orange-500 p-3">
            <Video className="text-white" size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              VideoCall
            </h1>

            <p className="text-sm text-slate-400">
              HD Meetings
            </p>
          </div>
        </div>

        <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10">
          Login with Google
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl items-center px-8">

        <div className="w-full">

          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
            Secure • Fast • Reliable
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white md:text-7xl">
            Connect.
            <br />
            Meet.
            <br />
            Collaborate.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Start HD video meetings instantly. Create a room,
            invite your friends and enjoy crystal-clear video
            and audio powered by WebRTC.
          </p>

          {/* Meeting Controls */}

          <div className="mt-12 flex flex-col gap-5 lg:flex-row">

            <button
              onClick={createMeeting}
              className="flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-orange-600"
            >
              <Plus size={22} />
              Start Instant Meeting
            </button>

            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">

              <div className="flex items-center px-4">
                <Keyboard
                  size={20}
                  className="text-slate-400"
                />
              </div>

              <input
                type="text"
                placeholder="Enter Meeting Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-72 bg-transparent px-2 text-white placeholder:text-slate-500 outline-none"
              />

              <button
                onClick={joinMeeting}
                className="border-l border-white/10 px-8 text-slate-300 transition hover:bg-white/10"
              >
                Join
              </button>

            </div>

          </div>

          

        </div>

      </section>
    </div>
  );
}