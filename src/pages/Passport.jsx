import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { DOMAINS, isEligible } from "../data";

export default function Passport() {
  const [stamps, setStamps] = useState([]);
  const [eligible, setEligible] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");
  const staffName = localStorage.getItem("staffName");

  useEffect(() => {
    if (!staffId) { navigate("/"); return; }
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("participants")
        .select("stamps, eligible")
        .eq("staff_id", staffId)
        .single();
      if (data) {
        setStamps(data.stamps || []);
        setEligible(data.eligible || false);
      }
    };
    if (staffId) load();
  }, [staffId]);

  useEffect(() => {
    if (!staffId) return;
    const channel = supabase
      .channel("passport-live")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "participants",
        filter: `staff_id=eq.${staffId}`,
      }, (payload) => {
        setStamps(payload.new.stamps || []);
        setEligible(payload.new.eligible || false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [staffId]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "Inter, sans-serif", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: "#0D1117", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ background: "#E8002D", color: "#fff", fontWeight: 700, fontSize: 13, padding: "5px 10px", borderRadius: 6 }}>MRT</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>Technology Ecosystem Passport</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>Staff ID: {staffId} {staffName ? `· ${staffName}` : ""}</div>
        </div>
        <div style={{ background: "#1E2A3A", border: "1px solid #2D3F52", padding: "5px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
          {stamps.length} / 38 🎖️
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Progress */}
        <div style={{ background: "#0D1117", border: "1px solid #1E2A3A", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stamps Collected</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{stamps.length}<span style={{ fontSize: 18, color: "#64748B" }}> / 38</span></div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, marginTop: 6, ...(eligible ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981" } : { background: "rgba(100,116,139,0.1)", border: "1px solid #1E2A3A", color: "#64748B" }) }}>
                {eligible ? "✓ Eligible for Lucky Draw" : "Visit all 7 domains to qualify"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase" }}>Lucky Draw</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#F59E0B" }}>{stamps.length}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>entries</div>
            </div>
          </div>
          <div style={{ height: 4, background: "#1E2A3A", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,#E8002D,#FF6B35)", borderRadius: 100, width: `${(stamps.length / 38) * 100}%`, transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Domain cards */}
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Your Passport — 7 Domains</div>
        {DOMAINS.map(domain => {
          const domainStamps = stamps.filter(s => domain.techs.some(t => t.id === s));
          const isOpen = expandedDomain === domain.id;
          return (
            <div key={domain.id} style={{ background: "#0D1117", border: `1px solid ${isOpen ? "#2D3F52" : "#1E2A3A"}`, borderRadius: 14, marginBottom: 10, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16 }} onClick={() => setExpandedDomain(isOpen ? null : domain.id)}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: domain.colorBg, border: `1px solid ${domain.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {domain.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{domain.name}</div>
                  <div style={{ fontSize: 11, color: domainStamps.length > 0 ? domain.color : "#64748B" }}>
                    {domainStamps.length}/{domain.techs.length} stamps
                    {domainStamps.length > 0 && <span style={{ marginLeft: 6 }}>✓ domain visited</span>}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                    {domain.techs.map(t => (
                      <div key={t.id} style={{ width: 6, height: 6, borderRadius: "50%", background: stamps.includes(t.id) ? domain.color : "#1E2A3A" }} />
                    ))}
                  </div>
                </div>
                <div style={{ color: "#2D3F52", fontSize: 12, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #1E2A3A", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {domain.techs.map(tech => {
                    const done = stamps.includes(tech.id);
                    return (
                      <div key={tech.id} style={{ display: "flex", alignItems: "center", gap: 12, background: done ? "rgba(16,185,129,0.05)" : "#0A0E1A", border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "#1E2A3A"}`, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "rgba(16,185,129,0.2)" : "#1E2A3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                          {done ? "✅" : "⬜"}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{tech.name}</div>
                          <div style={{ fontSize: 11, color: "#64748B" }}>{tech.use}</div>
                        </div>
                        {done && <div style={{ marginLeft: "auto", fontSize: 11, color: "#10B981", fontWeight: 600 }}>Stamped</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scan button */}
      <button
        onClick={() => navigate("/scan")}
        style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#E8002D,#C8001F)", color: "#fff", border: "none", borderRadius: 100, padding: "16px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(232,0,45,0.4)", whiteSpace: "nowrap" }}
      >
        📷 Scan Booth QR
      </button>
    </div>
  );
}