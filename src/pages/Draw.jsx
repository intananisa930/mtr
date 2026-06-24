import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { isEligible } from "../data";
import SpinWheel from "../components/SpinWheel";

export default function Draw() {
  const [eligible, setEligible] = useState([]);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("participants")
        .select("staff_id, name, stamps");
      setEligible((data || []).filter(p => isEligible(p.stamps)));
    };
    load();
  }, []);

  const wheelEntries = eligible.flatMap(p =>
    Array(p.stamps.length).fill({
      id: p.staff_id,
      name: p.staff_id,
      entries: p.stamps.length,
    })
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20, fontFamily: "Inter, sans-serif", background: "#0A0E1A", minHeight: "100vh", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate("/admin")}
          style={{ background: "none", border: "none", color: "#64748B", fontSize: 20, cursor: "pointer" }}
        >←</button>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Lucky Draw</h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
            {wheelEntries.length} entries · {eligible.length} eligible participants
          </p>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#2D3F52", marginBottom: 24, textAlign: "center" }}>
        More stamps = more entries = higher chance of winning
      </p>

      <SpinWheel entries={wheelEntries} onWinner={setWinner} />

      {winner && (
        <div style={{ marginTop: 24, background: "rgba(245,158,11,0.08)", border: "2px solid rgba(245,158,11,0.4)", borderRadius: 20, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Lucky Draw Winner</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Staff ID: {winner.id}</div>
          <div style={{ fontSize: 13, color: "#64748B" }}>{winner.entries} stamps collected</div>
        </div>
      )}
    </div>
  );
}