import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Passport from "./pages/Passport";
import Register from "./pages/Register";
import Booth from "./pages/Booth";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Draw from "./pages/Draw";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/passport" element={<Passport />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booth/:boothId" element={<Booth />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/admin/draw" element={<ProtectedRoute><Draw /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  </BrowserRouter>
);
