import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminLogin() {
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!staffId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await supabase
        .from("admins")
        .select("staff_id, name")
        .eq("staff_id", staffId.trim())
        .single();

      if (!data) {
        setError("Access denied. Your Staff ID is not authorised.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("adminName", data.name || staffId);
      navigate("/admin");

    } catch (err) {
      setError("Access denied. Your Staff ID is not authorised.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20, fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "inline-block", background: "#E8002D", color: "#fff", fontWeight: 700, fontSize: 13, padding: "5px 10px", borderRadius: 6, marginBottom: 16 }}>MRT</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Admin Login</h2>
        <p style={{ color: "#64748B", fontSize: 14 }}>Enter your Staff ID to access the admin dashboard.</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#64748B", textTransform: "uppercase" }}>Staff ID</label>
        <input
          placeholder="Enter your Staff ID"
          value={staffId}
          onChange={e => setStaffId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 16, outline: "none", fontFamily: "Inter, sans-serif" }}
        />
      </div>

      {error && (
        <div style={{ background: "rgba(232,0,45,0.08)", border: "1px solid rgba(232,0,45,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ color: "#E8002D", fontSize: 13, margin: 0 }}>{error}</p>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ width: "100%", padding: 14, background: "#E8002D", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
      >
        {loading ? "Checking..." : "Login →"}
      </button>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#94A3B8" }}>
        <a href="/" style={{ color: "#64748B" }}>← Back to Passport</a>
      </p>
    </div>
  );
}