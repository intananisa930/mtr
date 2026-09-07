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
  .app { max-width: 480px; margin: 0 auto; padding: 20px; position: relative; z-index: 1; }
  .hdr { background: rgba(10,6,18,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(196,25,125,0.2); padding: 12px 20px; display: flex; align-items: center; gap: 10px; margin: -20px -20px 20px; position: sticky; top: 0; z-index: 20; }
  .logo { background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; letter-spacing: 1px; }
  .hdr-info { flex: 1; }
  .hdr-title { font-size: 14px; font-weight: 700; color: #F3E8FF; }
  .hdr-sub { font-size: 10px; color: #7C3AED; }
  .live { display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; color: #10B981; }
  .live::before { content: ''; width: 6px; height: 6px; background: #10B981; border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }
  .stat { background: rgba(26,13,46,0.8); border: 1px solid rgba(124,58,237,0.15); border-radius: 14px; padding: 14px; text-align: center; }
  .stat-n { font-family: 'Space Grotesk',sans-serif; font-size: 24px; font-weight: 800; line-height: 1; }
  .stat-l { font-size: 9px; color: #6B4F8B; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .quick-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .btn-primary { width: 100%; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; transition: all 0.2s; margin-bottom: 10px; display: block; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-ghost { width: 100%; padding: 11px; border-radius: 10px; font-size: 13px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; margin-bottom: 8px; display: block; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
  .tabs { display: flex; gap: 6px; margin-bottom: 14px; }
  .tab { flex: 1; padding: 9px 4px; border-radius: 9px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid rgba(124,58,237,0.2); background: rgba(26,13,46,0.6); color: #9CA3AF; font-family: 'Inter',sans-serif; text-align: center; transition: all 0.15s; }
  .tab.active { border-color: #C4197D; color: #C4197D; background: rgba(196,25,125,0.1); }
  .filter-tabs { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  .ftab { padding: 5px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; cursor: pointer; border: 1px solid rgba(124,58,237,0.2); background: rgba(26,13,46,0.6); color: #9CA3AF; font-family: 'Inter',sans-serif; transition: all 0.15s; }
  .ftab.active { border-color: #C4197D; color: #C4197D; background: rgba(196,25,125,0.1); }
  .card { background: rgba(26,13,46,0.8); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; padding: 14px; margin-bottom: 12px; }
  .section-title { font-size: 10px; font-weight: 700; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .p-row { display: flex; align-items: center; gap: 7px; padding: 9px 0; border-bottom: 1px solid rgba(124,58,237,0.07); }
  .p-row:last-child { border-bottom: none; }
  .badge { font-size: 8px; font-weight: 600; padding: 2px 6px; border-radius: 20px; display: inline-block; }
  .b-staff { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #60A5FA; }
  .b-guest { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #F59E0B; }
  .b-elig { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10B981; }
  .b-prog { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); color: #A78BFA; }
  .prog-bar { height: 3px; background: rgba(124,58,237,0.1); border-radius: 100px; overflow: hidden; margin-top: 4px; }
  .prog-fill { height: 100%; border-radius: 100px; }
  .del-btn { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); color: #F87171; border-radius: 6px; padding: 3px 8px; font-size: 10px; cursor: pointer; font-family: 'Inter',sans-serif; flex-shrink: 0; white-space: nowrap; }
  .e-row { display: flex; align-items: center; gap: 9px; padding: 9px 0; border-bottom: 1px solid rgba(124,58,237,0.07); }
  .e-row:last-child { border-bottom: none; }
  .e-rank { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
  .winner-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid rgba(124,58,237,0.07); }
  .winner-row:last-child { border-bottom: none; }
  .loading { text-align: center; padding: 40px; color: #6B4F8B; }
`;

const RANK_BG = ["rgba(212,175,55,0.25)","rgba(192,192,192,0.25)","rgba(205,127,50,0.25)","rgba(124,58,237,0.2)","rgba(59,130,246,0.2)","rgba(124,58,237,0.15)","rgba(124,58,237,0.1)"];
const RANK_COLOR = ["#D4AF37","#C0C0C0","#CD7F32","#A78BFA","#60A5FA","#6B4F8B","#4B3B6B"];

export default function Admin() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("participants");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: pData }, { data: eData }, { data: wData }] = await Promise.all([
      supabase.from("participants").select("*").not("wristband_id", "is", null).order("stamps", { ascending: false }),
      supabase.from("exhibitor_scores").select("*").order("points", { ascending: false }),
      supabase.from("winners").select("*").order("prize_number", { ascending: true }),
    ]);
    setParticipants(pData || []);
    setExhibitors(eData || []);
    setWinners(wData || []);
    setLoading(false);
  };

  const handleDelete = async (staffId, wristbandId) => {
    if (!window.confirm(`Delete ${wristbandId}? This cannot be undone.`)) return;
    await supabase.from("stamp_log").delete().eq("staff_id", staffId);
    await supabase.from("participants").delete().eq("staff_id", staffId);
    loadAll();
  };

  const exportCSV = () => {
    const rows = [["Wristband ID","Name","Type","Stamps","Eligible","Last Updated"]];
    participants.forEach(p => rows.push([p.wristband_id, p.display_name || p.name || "", p.participant_type, p.stamps.length, p.eligible ? "Yes" : "No", p.last_updated || ""]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mtr_participants.csv"; a.click();
  };

  const filteredParticipants = () => {
    if (filter === "staff") return participants.filter(p => p.participant_type === "staff");
    if (filter === "guest") return participants.filter(p => p.participant_type === "guest");
    if (filter === "eligible") return participants.filter(p => p.eligible);
    return participants;
  };

  const totalEntries = participants.reduce((s, p) => s + (p.stamps?.length || 0), 0);
  const eligibleCount = participants.filter(p => p.eligible).length;
  const maxStamps = Math.max(...participants.map(p => p.stamps?.length || 0), 1);
  const maxPts = Math.max(...exhibitors.map(e => e.points || 0), 1);

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="app"><div className="loading">Loading dashboard...</div></div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="app">
        <div className="hdr">
          <div className="logo">MIMOS</div>
          <div className="hdr-info">
            <div className="hdr-title">Admin Dashboard</div>
            <div className="hdr-sub">MTR Innovation Passport Challenge</div>
          </div>
          <div className="live">LIVE</div>
        </div>

        {/* Quick Actions */}
        <div className="quick-btns">
          <button className="btn-primary" style={{ margin: 0 }} onClick={() => navigate("/admin/draw")}>🎰 Lucky Draw</button>
          <button className="btn-ghost" style={{ margin: 0 }} onClick={() => navigate("/leaderboard")}>📊 Leaderboard</button>
        </div>
        <button className="btn-ghost" style={{ marginBottom: 16 }} onClick={() => navigate("/exhibitor-leaderboard")}>🏆 Exhibitor Leaderboard</button>

        {/* 3 Stats */}
        <div className="stats-row">
          <div className="stat">
            <div className="stat-n" style={{ color: "#fff" }}>{participants.length}</div>
            <div className="stat-l">Registered</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: "#10B981" }}>{eligibleCount}</div>
            <div className="stat-l">Eligible</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: "#C4197D" }}>{totalEntries}</div>
            <div className="stat-l">Total Entries</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab ${activeTab === "participants" ? "active" : ""}`} onClick={() => setActiveTab("participants")}>👥 Participants</div>
          <div className={`tab ${activeTab === "exhibitors" ? "active" : ""}`} onClick={() => setActiveTab("exhibitors")}>🏭 Exhibitors</div>
          <div className={`tab ${activeTab === "winners" ? "active" : ""}`} onClick={() => setActiveTab("winners")}>🎁 Winners</div>
        </div>

        {/* PARTICIPANTS TAB */}
        {activeTab === "participants" && (
          <>
            <div className="filter-tabs">
              {[["all", `All (${participants.length})`], ["staff", `Staff (${participants.filter(p => p.participant_type === "staff").length})`], ["guest", `Guest (${participants.filter(p => p.participant_type === "guest").length})`], ["eligible", `Eligible (${eligibleCount})`]].map(([key, label]) => (
                <div key={key} className={`ftab ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{label}</div>
              ))}
            </div>

            {/* Eligibility bar */}
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#10B981" }}>🎰 Lucky Draw Eligibility</div>
                <div style={{ fontSize: 11, color: "#6B4F8B" }}>{eligibleCount} / {participants.length}</div>
              </div>
              <div style={{ height: 6, background: "rgba(124,58,237,0.1)", borderRadius: 100, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${participants.length > 0 ? Math.round(eligibleCount / participants.length * 100) : 0}%`, height: "100%", borderRadius: 100, background: "linear-gradient(90deg,#10B981,#059669)" }}></div>
              </div>
              <div style={{ fontSize: 10, color: "#6B4F8B" }}>Minimum: Visit all 6 domains + 10 stamps</div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Stamp Leaderboard</div>
                <button onClick={exportCSV} style={{ fontSize: 10, color: "#C4197D", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Export CSV</button>
              </div>
              {filteredParticipants().length === 0 ? (
                <div style={{ textAlign: "center", color: "#4B3B6B", fontSize: 13, padding: "20px 0" }}>No participants found</div>
              ) : filteredParticipants().map((p, i) => (
                <div key={i} className="p-row">
                  <div style={{ width: 18, fontSize: 10, color: "#6B4F8B", fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ width: 38, fontSize: 10, fontWeight: 700, color: "#C4197D", flexShrink: 0 }}>{p.wristband_id}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#F3E8FF" }}>{p.display_name || p.name || "—"}</div>
                    <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                      <div className={`badge ${p.participant_type === "staff" ? "b-staff" : "b-guest"}`}>{p.participant_type === "staff" ? "Staff" : "Guest"}</div>
                      <div className={`badge ${p.eligible ? "b-elig" : "b-prog"}`}>{p.eligible ? "✓ Eligible" : "In Progress"}</div>
                    </div>
                    <div className="prog-bar"><div className="prog-fill" style={{ width: `${Math.round((p.stamps?.length || 0) / maxStamps * 100)}%`, background: "linear-gradient(90deg,#C4197D,#7C3AED)" }}></div></div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, margin: "0 6px" }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#C4197D" }}>{p.stamps?.length || 0}</div>
                    <div style={{ fontSize: 8, color: "#6B4F8B" }}>stamps</div>
                  </div>
                  <button className="del-btn" onClick={() => handleDelete(p.staff_id, p.wristband_id)}>Delete</button>
                </div>
              ))}
            </div>
            <button className="btn-ghost" onClick={loadAll}>🔄 Refresh Now</button>
          </>
        )}

        {/* EXHIBITORS TAB */}
        {activeTab === "exhibitors" && (
          <>
            <div style={{ background: "rgba(196,25,125,0.06)", border: "1px solid rgba(196,25,125,0.2)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, textAlign: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>{exhibitors.reduce((s, e) => s + (e.total_questions || 0), 0)}</div>
                  <div style={{ fontSize: 8, color: "#6B4F8B", marginTop: 3 }}>Questions</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: "#10B981" }}>{exhibitors.reduce((s, e) => s + (e.correct_answers || 0), 0)}</div>
                  <div style={{ fontSize: 8, color: "#6B4F8B", marginTop: 3 }}>Correct</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: "#C4197D" }}>
                    {exhibitors.reduce((s, e) => s + (e.total_questions || 0), 0) > 0
                      ? Math.round(exhibitors.reduce((s, e) => s + (e.correct_answers || 0), 0) / exhibitors.reduce((s, e) => s + (e.total_questions || 0), 0) * 100) + "%"
                      : "0%"}
                  </div>
                  <div style={{ fontSize: 8, color: "#6B4F8B", marginTop: 3 }}>Accuracy</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>🏆 Exhibitor Quiz Leaderboard</div>
              </div>
              {exhibitors.length === 0 ? (
                <div style={{ textAlign: "center", color: "#4B3B6B", fontSize: 13, padding: "20px 0" }}>No quiz scores yet</div>
              ) : exhibitors.map((e, i) => (
                <div key={i} className="e-row">
                  <div className="e-rank" style={{ background: RANK_BG[i] || "rgba(124,58,237,0.1)", color: RANK_COLOR[i] || "#4B3B6B" }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#F3E8FF" }}>{e.booth_name}</div>
                    <div style={{ fontSize: 9, color: "#6B4F8B" }}>{e.domain_name} · {e.correct_answers}/{e.total_questions} correct</div>
                    <div className="prog-bar"><div className="prog-fill" style={{ width: `${Math.round((e.points || 0) / maxPts * 100)}%`, background: "#C4197D" }}></div></div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#C4197D" }}>{e.points || 0}</div>
                    <div style={{ fontSize: 8, color: "#6B4F8B" }}>{e.total_questions || 0} questions</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-ghost" onClick={loadAll}>🔄 Refresh Now</button>
          </>
        )}

        {/* WINNERS TAB */}
        {activeTab === "winners" && (
          <>
            {/* Lucky draw winners */}
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🎰 Lucky Draw Winners — Participants</div>
              {winners.length === 0 ? (
                <div style={{ textAlign: "center", fontSize: 12, color: "#4B3B6B", padding: "10px 0" }}>No winners drawn yet</div>
              ) : winners.map((w, i) => (
                <div key={i} className="winner-row">
                  <div style={{ fontSize: 10, color: "#6B4F8B", width: 44 }}>Prize {w.prize_number}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C4197D", width: 38 }}>{w.wristband_id || w.staff_id}</div>
                  <div style={{ flex: 1, fontSize: 11, color: "#F3E8FF" }}>{w.display_name || "—"}</div>
                  <div style={{ fontSize: 18 }}>🎁</div>
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/admin/draw")}>🎰 Run Lucky Draw →</button>
            </div>

            {/* Exhibitor quiz awards */}
            <div style={{ background: "rgba(196,25,125,0.06)", border: "1px solid rgba(196,25,125,0.2)", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#C4197D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🏆 Exhibitor Quiz Awards</div>
              {exhibitors.filter(e => (e.points || 0) > 0).length === 0 ? (
                <div style={{ textAlign: "center", fontSize: 12, color: "#4B3B6B", padding: "10px 0" }}>No exhibitor quiz scores yet</div>
              ) : exhibitors.filter(e => (e.points || 0) > 0).slice(0, 3).map((e, i) => (
                <div key={i} className="winner-row">
                  <div style={{ fontSize: 10, color: "#6B4F8B", width: 80 }}>{["🥇 Champion", "🥈 Runner Up", "🥉 3rd Place"][i]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#F3E8FF" }}>{e.booth_name}</div>
                    <div style={{ fontSize: 9, color: "#6B4F8B" }}>{e.domain_name}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#C4197D" }}>{e.points} pts</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ height: 20 }} />
        <button className="btn-ghost" onClick={() => { localStorage.removeItem("adminAuth"); navigate("/admin-login"); }}>🔒 Logout</button>
      </div>
    </>
  );
}
