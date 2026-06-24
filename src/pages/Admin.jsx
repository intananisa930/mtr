import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { isEligible } from "../data";

export default function Admin() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const adminName = sessionStorage.getItem("adminName");

  const load = async () => {
    const { data } = await supabase
      .from("participants")
      .select("*")
      .order("last_updated", { ascending: false });
    setParticipants(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-live")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "participants",
      }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const eligible = participants.filter(p => isEligible(p.stamps));
  const totalEntries = eligible.reduce((sum, p) => sum + p.stamps.length, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "Inter, sans-serif", background: "#0A0E1A", minHeight: "100vh", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ display: "inline-block", background: "#E8002D", color: "#fff", fontWeight: 700, fontSize: 13, padding: "5px 10px", borderRadius: 6, marginBottom: 8 }}>MRT</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Admin Dashboard</h2>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Welcome, {adminName} · Smart Solutions, Connected Futures</p>
        </div>
        <button
          onClick={() => { sessionStorage.clear(); navigate("/admin-login"); }}
          style={{ background: "#1E2A3A", color: "#94A3B8", border: "1px solid #2D3F52", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { num: participants.length, label: "Registered", color: "#fff" },
          { num: eligible.length, label: "Eligible", color: "#10B981" },
          { num: totalEntries, label: "Total Entries", color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#0D1117", border: "1px solid #1E2A3A", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: s.color }}>{s.num}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => navigate("/admin/draw")}
          style={{ background: "#E8002D", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          🎰 Open Lucky Draw
        </button>
        <button
          onClick={load}
          style={{ background: "#1E2A3A", color: "#E2E8F0", border: "1px solid #2D3F52", borderRadius: 10, padding: "12px 20px", fontSize: 14, cursor: "pointer" }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "#64748B" }}>Loading...</p>
      ) : (
        <div style={{ background: "#0D1117", border: "1px solid #1E2A3A", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid #1E2A3A", fontSize: 10, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <div>Staff ID</div><div>Name</div><div>Stamps</div><div>Entries</div><div>Status</div><div>Last Active</div>
          </div>
          {participants.map(p => {
            const elig = isEligible(p.stamps);
            return (
              <div key={p.staff_id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr", padding: "12px 16px", borderBottom: "1px solid #0A0E1A", fontSize: 12, alignItems: "center" }}>
                <div style={{ color: "#64748B" }}>{p.staff_id}</div>
                <div style={{ fontWeight: 500 }}>{p.name || "—"}</div>
                <div style={{ color: elig ? "#10B981" : "#E2E8F0" }}>{p.stamps.length} / 38</div>
                <div style={{ color: "#F59E0B", fontWeight: 600 }}>{elig ? p.stamps.length : 0}</div>
                <div>
                  <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 600, ...(elig ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" } : { background: "#1E2A3A", color: "#64748B" }) }}>
                    {elig ? "✓ Eligible" : "In Progress"}
                  </span>
                </div>
                <div style={{ color: "#64748B" }}>{new Date(p.last_updated).toLocaleTimeString()}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}