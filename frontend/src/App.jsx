import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Agriculture from "./pages/Agriculture";
import Healthcare from "./pages/Healthcare";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agriculture" element={<Agriculture />} />
      <Route path="/healthcare" element={<Healthcare />} />
    </Routes>
  );
}
