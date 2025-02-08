import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dragndrop from "./pages/Dragndrop";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dragndrop />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;