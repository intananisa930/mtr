import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin-login");
  }, []);

  const isAdmin = sessionStorage.getItem("isAdmin");
  if (!isAdmin) return null;
  return children;
}