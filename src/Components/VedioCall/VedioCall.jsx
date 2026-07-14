import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Copy,
  MonitorUp,
  Settings,
} from "lucide-react";

export default function Meeting() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleMic = () => {
    const audioTrack = streamRef.current
      ?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  const toggleCamera = () => {
    const videoTrack = streamRef.current
      ?.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Meeting ID copied!");
  };

  const leaveMeeting = () => {
    streamRef.current?.getTracks().forEach((track) =>
      track.stop()
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-white">

      {/* Navbar */}

      <nav className="flex items-center justify-between border-b border-white/10 px-8 py-5">

        <div>
          <h1 className="text-2xl font-bold">
            VideoCall
          </h1>

          <p className="text-slate-400">
            Meeting Room
          </p>
        </div>

        <div className="flex items-center gap-4">

          <span className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300">
            Room: {roomId}
          </span>

          <button
            onClick={copyRoomId}
            className="rounded-lg bg-orange-500 p-3 hover:bg-orange-600 transition"
          >
            <Copy size={18} />
          </button>

        </div>

      </nav>

      {/* Video */}

      <div className="flex justify-center p-10">

        <div className="relative">

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-[70vh] w-[1100px] rounded-2xl border border-white/10 bg-black object-cover shadow-2xl"
          />

          <div className="absolute left-5 top-5 rounded-lg bg-black/60 px-4 py-2 backdrop-blur">
            You
          </div>

        </div>

      </div>

      {/* Controls */}

      <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-5 rounded-full border border-white/10 bg-[#242428] px-8 py-4 shadow-2xl">

        {/* Mic */}

        <button
          onClick={toggleMic}
          className={`rounded-full p-4 transition ${
            micOn
              ? "bg-white/10 hover:bg-white/20"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {micOn ? <Mic /> : <MicOff />}
        </button>

        {/* Camera */}

        <button
          onClick={toggleCamera}
          className={`rounded-full p-4 transition ${
            cameraOn
              ? "bg-white/10 hover:bg-white/20"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {cameraOn ? <Video /> : <VideoOff />}
        </button>

        {/* Screen Share */}

        <button className="rounded-full bg-white/10 p-4 hover:bg-white/20 transition">
          <MonitorUp />
        </button>

        {/* Settings */}

        <button className="rounded-full bg-white/10 p-4 hover:bg-white/20 transition">
          <Settings />
        </button>

        {/* Leave */}

        <button
          onClick={leaveMeeting}
          className="rounded-full bg-red-600 p-4 hover:bg-red-700 transition"
        >
          <PhoneOff />
        </button>

      </div>

    </div>
  );
}