import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Landing() {
  const [staffId, setStaffId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!staffId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data: existing } = await supabase
        .from("participants")
        .select("*")
        .eq("staff_id", staffId.trim())
        .single();

      if (existing) {
        localStorage.setItem("staffId", staffId.trim());
        localStorage.setItem("staffName", existing.name || "");
        navigate("/passport");
      } else {
        const { error: insertError } = await supabase
          .from("participants")
          .insert({
            staff_id: staffId.trim(),
            name: name.trim() || null,
            stamps: [],
            eligible: false,
          });

        if (insertError) throw insertError;

        localStorage.setItem("staffId", staffId.trim());
        localStorage.setItem("staffName", name.trim());
        navigate("/passport");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>MRT Technology Ecosystem Passport</h1>
      <p style={{ color: "#64748B", marginBottom: 32 }}>Enter your Staff ID to begin your journey.</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#64748B", textTransform: "uppercase" }}>Staff ID *</label>
        <input
          placeholder="e.g. 12345"
          value={staffId}
          onChange={e => setStaffId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleStart()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 16, outline: "none" }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#64748B", textTransform: "uppercase" }}>Your Name (optional)</label>
        <input
          placeholder="e.g. John Tan"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleStart()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 16, outline: "none" }}
        />
      </div>

      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <button
        onClick={handleStart}
        disabled={loading}
        style={{ width: "100%", padding: 14, background: "#E8002D", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        {loading ? "Loading..." : "Start My Passport →"}
      </button>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#94A3B8" }}>
        Admin? <a href="/admin-login" style={{ color: "#E8002D" }}>Login here</a>
      </p>
    </div>
  );
}