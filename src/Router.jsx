import { createBrowserRouter, Navigate } from "react-router-dom";
import Homechild from "./components/Home/HomeChild";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/home"}/>,
  },
  Homechild()

]);

export default Router