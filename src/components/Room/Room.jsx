// import { usePeer } from "../../providers/Peer"
// import { useSocket } from "../../providers/Socket"
// import { useCallback, useEffect, useRef, useState } from "react"
// import { useNavigate } from "react-router-dom";


// const Room = () => {
//   const socket = useSocket()

//   const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer()

//   const [myStream, setMyStream] = useState(null)
//   const [remoteEmailId, setRemoteEmailId] = useState(null)

//   const myVideoRef = useRef(null)
//   const remoteVideoRef = useRef(null)
//   const myStreamRef = useRef(null)//////////////////////////////////
//   const navigate = useNavigate()

//   const remoteEmailIdRef = useRef(null)
//   useEffect(() => {
//     remoteEmailIdRef.current = remoteEmailId
//   }, [remoteEmailId])

//   const handleNewUserJoined = useCallback(async ({ email }) => {
//       console.log("New user joined room:", email)

//       const offer = await createOffer()
//       socket.emit("call-user", { email, offer })
//       setRemoteEmailId(email)
//     },
//     [createOffer, socket]
//   )

//   const handleIncomingCall = useCallback(async ({ from, offer }) => {
//       console.log("Incoming call from:", from, offer)

//       const ans = await createAnswer(offer)
//       socket.emit("call-accepted", { email: from, ans })
//       setRemoteEmailId(from)
//     },
//     [createAnswer, socket]
//   )

//   const handleCallAccepted = useCallback(async ({ ans }) => {
//       console.log("Call accepted")
//       await setRemoteAns(ans)
//     },
//     [setRemoteAns]
//   )

//   const getUserMediaStream = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     setMyStream(stream)
//   }, [])


//   const leaveRoom = () => {
//   socket.emit("leave_room");

//   if (myStreamRef.current) {
//     myStreamRef.current.getTracks().forEach(track => track.stop());
//   }

//   navigate("/");
// }

  
//   const handlenegotiation = useCallback(async () => {
//     const localOffer = await createOffer()
//     socket.emit('call-user', { email: remoteEmailIdRef.current, offer: localOffer })
//   }, [createOffer, socket])

//   useEffect(() => {
//     socket.on("user-joined", handleNewUserJoined)
//     socket.on("incoming-call", handleIncomingCall)
//     socket.on("call-accepted", handleCallAccepted)

//     return () => {
//       socket.off("user-joined", handleNewUserJoined)
//       socket.off("incoming-call", handleIncomingCall)
//       socket.off("call-accepted", handleCallAccepted)
//     }
//   }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

//   useEffect(() => {
//     getUserMediaStream()
//   }, [getUserMediaStream])

  
//   useEffect(() => {
//     if (myStream) {
//       sendStream(myStream)
//     }
//   }, [myStream, sendStream])

//   useEffect(() => {
//     if (myVideoRef.current && myStream) {
//       myVideoRef.current.srcObject = myStream;
//     }
//   }, [myStream])

//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream
//       console.log(remoteVideoRef)
//     }
//   }, [remoteStream])

//   useEffect(() => {
//     peer.addEventListener('negotiationneeded', handlenegotiation)
//     return () => {
//       peer.removeEventListener('negotiationneeded', handlenegotiation)
//     }
//   }, [peer, handlenegotiation])

// ////////////////////////////////////////////////////////////////
//   useEffect(() => {
//   myStreamRef.current = myStream;
// }, [myStream]);


//   useEffect(() => {
//   return () => {
//     socket.emit("leave_room");

//     if (myStreamRef.current) {
//       myStreamRef.current.getTracks().forEach(track => track.stop());
//     }
    
//   };
// }, []);




// ///////////////////////////////////////////////////////////////
//   return (
//   <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-8">
//     <div className="w-full max-w-6xl">
//       <div className="flex items-center gap-2 mb-4">
//         <span className="relative inline-flex w-2 h-2">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
//           <span className="relative inline-flex rounded-full w-2 h-2 bg-amber-400" />
//         </span>
//         <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
//           Meeting Room · Live
//         </span>
//       </div>

//       <h1 className="text-3xl font-extrabold text-zinc-100 mb-2">
//         Meeting Room
//       </h1>

//       <p className="text-zinc-400 mb-8 flex items-center gap-2">
//         <span
//           className={`w-1.5 h-1.5 rounded-full ${
//             remoteEmailId ? "bg-emerald-400" : "bg-amber-400"
//           }`}
//         />
//         Connected to{" "}
//         <span className="text-zinc-100 font-medium">
//           {remoteEmailId || "Waiting for participant..."}
//         </span>
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* My Video */}
//         <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
//           <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
//             <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
//               Your Camera
//             </h2>
//             <span className="text-xs font-mono text-zinc-600">You</span>
//           </div>

//           <video
//             ref={myVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full aspect-video bg-black object-cover scale-x-[-1]"
//           />
//         </div>

//         {/* Remote Video */}
//         <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
//           <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
//             <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
//               Remote Camera
//             </h2>
//             <span
//               className={`flex items-center gap-1.5 text-xs font-mono ${
//                 remoteEmailId ? "text-emerald-400" : "text-amber-400"
//               }`}
//             >
//               <span
//                 className={`w-1.5 h-1.5 rounded-full ${
//                   remoteEmailId ? "bg-emerald-400" : "bg-amber-400"
//                 }`}
//               />
//               {remoteEmailId ? "Live" : "Waiting"}
//             </span>
//           </div>

//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full aspect-video bg-black object-cover scale-x-[-1]"
//           />
//         </div>
//       </div>

//       {/* Leave Room Button */}
//       <div className="mt-8 flex justify-center">
//         <button
//           onClick={leaveRoom}
//           className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all font-semibold"
//         >
//           Leave Room
//         </button>
//       </div>
//     </div>
//   </div>
// )
// }


// export default Room









import { usePeer } from "../../providers/Peer";
import { useSocket } from "../../providers/Socket";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const socket = useSocket();

  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const myStreamRef = useRef(null);
  const remoteEmailIdRef = useRef(null);

  const navigate = useNavigate();

  /*
   * Prevent multiple simultaneous offers.
   */
  const makingOffer = useRef(false);

  /*
   * Prevent negotiationneeded from firing repeatedly.
   */
  const negotiationInProgress = useRef(false);

  /*
   * Keep remote email in a ref so negotiationneeded
   * always gets the latest value.
   */
  useEffect(() => {
    remoteEmailIdRef.current = remoteEmailId;
  }, [remoteEmailId]);

  // --------------------------------------------------
  // GET CAMERA + MICROPHONE
  // --------------------------------------------------

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      console.log("Local stream received");

      myStreamRef.current = stream;
      setMyStream(stream);
    } catch (error) {
      console.error("getUserMedia error:", error);
    }
  }, []);

  // --------------------------------------------------
  // USER JOINED
  // --------------------------------------------------

  const handleNewUserJoined = useCallback(({ email }) => {
    console.log("New user joined:", email);

    /*
     * IMPORTANT:
     * Do NOT create an offer here.
     *
     * We only save the remote user.
     *
     * Once remoteEmailId is available,
     * another effect adds our tracks.
     *
     * Adding tracks triggers negotiationneeded.
     */
    setRemoteEmailId(email);
  }, []);

  // --------------------------------------------------
  // INCOMING OFFER
  // --------------------------------------------------

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      try {
        console.log("Incoming call from:", from);

        /*
         * If we are already creating an offer,
         * don't create another competing negotiation.
         */
        if (makingOffer.current) {
          console.log("Ignoring incoming offer because we are making an offer");
          return;
        }

        setRemoteEmailId(from);

        const answer = await createAnswer(offer);

        socket.emit("call-accepted", {
          email: from,
          ans: answer,
        });

        console.log("Answer sent");
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [createAnswer, socket]
  );

  // --------------------------------------------------
  // CALL ACCEPTED
  // --------------------------------------------------

  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      try {
        console.log("Call accepted");

        await setRemoteAns(ans);

        console.log("Remote answer applied");
      } catch (error) {
        console.error(
          "Error setting remote answer:",
          error
        );
      }
    },
    [setRemoteAns]
  );

  // --------------------------------------------------
  // NEGOTIATION NEEDED
  // --------------------------------------------------

  const handleNegotiation = useCallback(async () => {
    const remoteEmail = remoteEmailIdRef.current;

    /*
     * VERY IMPORTANT:
     *
     * negotiationneeded can happen before another
     * participant joins.
     *
     * In that case there is nobody to call.
     */
    if (!remoteEmail) {
      console.log(
        "Negotiation needed but no remote user yet"
      );
      return;
    }

    /*
     * Prevent duplicate offers.
     */
    if (negotiationInProgress.current) {
      console.log("Negotiation already in progress");
      return;
    }

    if (makingOffer.current) {
      console.log("Already making an offer");
      return;
    }

    try {
      negotiationInProgress.current = true;
      makingOffer.current = true;

      console.log(
        "Creating offer for:",
        remoteEmail
      );

      const offer = await createOffer();

      socket.emit("call-user", {
        email: remoteEmail,
        offer,
      });

      console.log("Offer sent");
    } catch (error) {
      console.error(
        "Negotiation error:",
        error
      );
    } finally {
      makingOffer.current = false;

      /*
       * Give the browser time to finish the current
       * negotiation before another negotiation can start.
       */
      setTimeout(() => {
        negotiationInProgress.current = false;
      }, 0);
    }
  }, [createOffer, socket]);

  // --------------------------------------------------
  // SOCKET LISTENERS
  // --------------------------------------------------

  useEffect(() => {
    socket.on(
      "user-joined",
      handleNewUserJoined
    );

    socket.on(
      "incoming-call",
      handleIncomingCall
    );

    socket.on(
      "call-accepted",
      handleCallAccepted
    );

    return () => {
      socket.off(
        "user-joined",
        handleNewUserJoined
      );

      socket.off(
        "incoming-call",
        handleIncomingCall
      );

      socket.off(
        "call-accepted",
        handleCallAccepted
      );
    };
  }, [
    socket,
    handleNewUserJoined,
    handleIncomingCall,
    handleCallAccepted,
  ]);

  // --------------------------------------------------
  // GET LOCAL MEDIA
  // --------------------------------------------------

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  // --------------------------------------------------
  // ADD LOCAL TRACKS
  // --------------------------------------------------

  useEffect(() => {
    /*
     * IMPORTANT:
     *
     * Don't add tracks until we know who the remote
     * participant is.
     *
     * This prevents negotiationneeded from firing
     * before remoteEmailId exists.
     */
    if (!myStream) return;

    if (!remoteEmailId) {
      console.log(
        "Local stream ready, waiting for remote user"
      );
      return;
    }

    console.log(
      "Remote user exists -> adding local tracks"
    );

    sendStream(myStream);
  }, [
    myStream,
    remoteEmailId,
    sendStream,
  ]);

  // --------------------------------------------------
  // ATTACH LOCAL VIDEO
  // --------------------------------------------------

  useEffect(() => {
    if (
      myVideoRef.current &&
      myStream
    ) {
      myVideoRef.current.srcObject =
        myStream;
    }
  }, [myStream]);

  // --------------------------------------------------
  // ATTACH REMOTE VIDEO
  // --------------------------------------------------

  useEffect(() => {
    if (
      remoteVideoRef.current &&
      remoteStream
    ) {
      console.log(
        "Attaching remote stream to video"
      );

      remoteVideoRef.current.srcObject =
        remoteStream;

      remoteVideoRef.current
        .play()
        .catch((error) => {
          console.log(
            "Remote video play error:",
            error
          );
        });
    }
  }, [remoteStream]);

  // --------------------------------------------------
  // NEGOTIATION EVENT
  // --------------------------------------------------

  useEffect(() => {
    peer.addEventListener(
      "negotiationneeded",
      handleNegotiation
    );

    return () => {
      peer.removeEventListener(
        "negotiationneeded",
        handleNegotiation
      );
    };
  }, [
    peer,
    handleNegotiation,
  ]);

  // --------------------------------------------------
  // SAVE STREAM REF
  // --------------------------------------------------

  useEffect(() => {
    myStreamRef.current = myStream;
  }, [myStream]);

  // --------------------------------------------------
  // LEAVE ROOM / CLEANUP
  // --------------------------------------------------

  const leaveRoom = useCallback(() => {
    console.log("Leaving room");

    socket.emit("leave_room");

    if (myStreamRef.current) {
      myStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    peer.close();

    navigate("/");
  }, [socket, peer, navigate]);

  useEffect(() => {
    return () => {
      socket.emit("leave_room");

      if (myStreamRef.current) {
        myStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, [socket]);

///////////////////////////////////////////////////////////////////
  useEffect(() => {
  const handleUserLeft = () => {
    console.log("Remote user left");

    setRemoteEmailId(null);

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  socket.on("user-left", handleUserLeft);

  return () => {
    socket.off("user-left", handleUserLeft);
  };
}, [socket]);
///////////////////////////////////////////////////////////////////////
  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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

        <h1 className="text-3xl font-extrabold text-zinc-100 mb-2">
          Meeting Room
        </h1>

        <p className="text-zinc-400 mb-8 flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              remoteEmailId
                ? "bg-emerald-400"
                : "bg-amber-400"
            }`}
          />

          Connected to{" "}

          <span className="text-zinc-100 font-medium">
            {remoteEmailId ||
              "Waiting for participant..."}
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LOCAL VIDEO */}

          <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">

            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Your Camera
              </h2>

              <span className="text-xs font-mono text-zinc-600">
                You
              </span>
            </div>

            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video bg-black object-cover scale-x-[-1]"
            />

          </div>

          {/* REMOTE VIDEO */}

          <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">

            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">

              <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Remote Camera
              </h2>

              <span
                className={`flex items-center gap-1.5 text-xs font-mono ${
                  remoteStream
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    remoteStream
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }`}
                />

                {remoteStream
                  ? "Live"
                  : "Waiting"}
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

        <div className="mt-8 flex justify-center">

          <button
            onClick={leaveRoom}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all font-semibold"
          >
            Leave Room
          </button>

        </div>

      </div>
    </div>
  );
};

export default Room;