import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { isEligible } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .app { max-width: 900px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; }

  .hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 10px; letter-spacing: 1px; }
  .title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin: 0; }
  .subtitle { font-size: 13px; color: #6B4F8B; margin-top: 4px; }

  .btn-logout { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.2); border-radius: 8px; padding: 8px 14px; font-size: 12px; color: #9CA3AF; cursor: pointer; font-family: 'Inter',sans-serif; transition: all 0.2s; }
  .btn-logout:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }

  .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .stat { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; padding: 18px 12px; text-align: center; }
  .stat-num { font-family: 'Space Grotesk',sans-serif; font-size: 32px; font-weight: 800; }
  .stat-lbl { font-size: 10px; color: #6B4F8B; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  .btn-draw { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; box-shadow: 0 4px 20px rgba(196,25,125,0.4); transition: all 0.2s; margin-bottom: 24px; letter-spacing: 0.3px; }
  .btn-draw:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(196,25,125,0.5); }

  .btn-refresh { background: rgba(26,13,46,0.6); border: 1px solid rgba(124,58,237,0.2); border-radius: 10px; padding: 10px 16px; font-size: 13px; color: #9CA3AF; cursor: pointer; font-family: 'Inter',sans-serif; margin-bottom: 16px; transition: all 0.2s; }
  .btn-refresh:hover { border-color: rgba(196,25,125,0.3); color: #E9D5FF; }

  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }

  .table-wrap { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 18px; overflow: hidden; }
  .t-head { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1.5fr; padding: 12px 16px; border-bottom: 1px solid rgba(124,58,237,0.1); font-size: 10px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 0.5px; }
  .t-row { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1.5fr; padding: 13px 16px; border-bottom: 1px solid rgba(10,6,18,0.5); font-size: 12px; align-items: center; }
  .t-row:last-child { border-bottom: none; }
  .pill { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 600; }
  .pill-g { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: #10B981; }
  .pill-p { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); color: #A78BFA; }
  .loading { text-align: center; padding: 40px; color: #6B4F8B; }
`;

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
    const channel = supabase.channel("admin-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "participants" }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const eligible = participants.filter(p => isEligible(p.stamps));
  const totalEntries = eligible.reduce((sum, p) => sum + p.stamps.length, 0);

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="app">
        <div className="hdr">
          <div>
            <div className="logo">MIMOS</div>
            <h2 className="title">Admin Dashboard</h2>
            <p className="subtitle">MTR Innovation Passport Challenge · Welcome, {adminName}</p>
          </div>
          <button className="btn-logout" onClick={() => { sessionStorage.clear(); navigate("/admin-login"); }}>Logout</button>
        </div>

        <div className="stats">
          {[
            { num: participants.length, label: "Registered", color: "#fff" },
            { num: eligible.length, label: "Eligible", color: "#10B981" },
            { num: totalEntries, label: "Total Entries", color: "#C4197D" },
          ].map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        <button className="btn-draw" onClick={() => navigate("/admin/draw")}>🎰 Open Lucky Draw</button>
        <button className="btn-refresh" onClick={load}>🔄 Refresh</button>

        <div className="section-title">Participants</div>
        <div className="table-wrap">
          <div className="t-head">
            <div>Staff ID</div><div>Name</div><div>Stamps</div><div>Entries</div><div>Status</div><div>Last Active</div>
          </div>
          {loading ? (
            <div className="loading">Loading participants...</div>
          ) : (
            participants.map(p => {
              const elig = isEligible(p.stamps);
              return (
                <div key={p.staff_id} className="t-row">
                  <div style={{ color: "#6B4F8B", fontSize: 11 }}>{p.staff_id}</div>
                  <div style={{ fontWeight: 500, color: "#E9D5FF" }}>{p.name || "—"}</div>
                  <div style={{ color: elig ? "#10B981" : "#E9D5FF" }}>{p.stamps.length} / 38</div>
                  <div style={{ color: "#C4197D", fontWeight: 600 }}>{elig ? p.stamps.length : 0}</div>
                  <div><span className={`pill ${elig ? "pill-g" : "pill-p"}`}>{elig ? "✓ Eligible" : "In Progress"}</span></div>
                  <div style={{ color: "#6B4F8B" }}>{new Date(p.last_updated).toLocaleTimeString()}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
