import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import Router from "./Router";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";

createRoot(document.getElementById("root")).render(
  <PeerProvider>
    <SocketProvider>
        <RouterProvider router={Router} />
    </SocketProvider>
  </PeerProvider>
  
);