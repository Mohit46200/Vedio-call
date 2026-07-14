import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import Router from "./Router";
import { SocketProvider } from "./providers/Socket";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
      <RouterProvider router={Router} />
  </SocketProvider>
  
);