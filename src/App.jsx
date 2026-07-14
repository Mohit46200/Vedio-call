import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Meeting from "./Components/VedioCall/VedioCall";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting/:roomId" element={<Meeting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;