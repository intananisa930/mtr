import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Passport from "./pages/Passport";
import Scan from "./pages/Scan";
import Presenter from "./pages/Presenter";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Draw from "./pages/Draw";
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/passport" element={<Passport />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/presenter/:boothId" element={<Presenter />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/admin/draw" element={<ProtectedRoute><Draw /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
);
