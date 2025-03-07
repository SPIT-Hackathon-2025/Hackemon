import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dragndrop from "./pages/Dragndrop";
import Home from "./pages/Home";
import History from "./pages/History";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dragndrop />} />
          <Route path="/history" element={<History/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;