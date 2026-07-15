import { createBrowserRouter, Navigate } from "react-router-dom";
import Homechild from "./components/Home/HomeChild";
import RoomChild from "./components/Room/RoomChild";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/home"}/>,
  },
  Homechild(),
  RoomChild()

]);

export default Router