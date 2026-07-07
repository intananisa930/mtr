import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { isEligible } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .app { max-width: 600px; margin: 0 auto; padding: 32px 20px; position: relative; z-index: 1; min-height: 100vh; }

  .header { text-align: center; margin-bottom: 40px; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 16px; letter-spacing: 1px; }
  .title { font-family: 'Space Grotesk',sans-serif; font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;
    background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .subtitle { font-size: 14px; color: #6B4F8B; }

  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 32px; }
  .stat { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; padding: 16px 12px; text-align: center; }
  .stat-num { font-family: 'Space Grotesk',sans-serif; font-size: 28px; font-weight: 800; }
  .stat-lbl { font-size: 10px; color: #6B4F8B; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }

  .podium { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 28px; align-items: flex-end; }
  .podium-item { text-align: center; }
  .podium-card {
    border-radius: 16px 16px 0 0; padding: 16px 10px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .podium-1 { background: linear-gradient(180deg,rgba(212,175,55,0.2),rgba(212,175,55,0.05)); border: 1px solid rgba(212,175,55,0.4); min-height: 160px; justify-content: flex-end; }
  .podium-2 { background: linear-gradient(180deg,rgba(192,192,192,0.15),rgba(192,192,192,0.05)); border: 1px solid rgba(192,192,192,0.3); min-height: 120px; justify-content: flex-end; }
  .podium-3 { background: linear-gradient(180deg,rgba(205,127,50,0.15),rgba(205,127,50,0.05)); border: 1px solid rgba(205,127,50,0.3); min-height: 100px; justify-content: flex-end; }
  .podium-medal { font-size: 28px; }
  .podium-id { font-family: 'Space Grotesk',sans-serif; font-size: 13px; font-weight: 700; color: #fff; word-break: break-all; }
  .podium-name { font-size: 11px; color: #6B4F8B; }
  .podium-stamps { font-size: 12px; font-weight: 600; }
  .podium-base { height: 8px; border-radius: 0 0 8px 8px; }
  .podium-base-1 { background: rgba(212,175,55,0.5); }
  .podium-base-2 { background: rgba(192,192,192,0.4); }
  .podium-base-3 { background: rgba(205,127,50,0.4); }

  .leaderboard-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .lb-row {
    display: flex; align-items: center; gap: 14px;
    background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.12);
    border-radius: 14px; padding: 14px 16px; transition: all 0.2s;
  }
  .lb-row.eligible { border-color: rgba(16,185,129,0.2); background: rgba(16,185,129,0.04); }
  .lb-rank { font-family: 'Space Grotesk',sans-serif; font-size: 16px; font-weight: 800; color: #4B3B6B; width: 28px; text-align: center; flex-shrink: 0; }
  .lb-info { flex: 1; min-width: 0; }
  .lb-id { font-size: 14px; font-weight: 700; color: #F3E8FF; }
  .lb-name { font-size: 11px; color: #6B4F8B; margin-top: 1px; }
  .lb-right { text-align: right; flex-shrink: 0; }
  .lb-stamps { font-family: 'Space Grotesk',sans-serif; font-size: 18px; font-weight: 800; color: #C4197D; }
  .lb-label { font-size: 10px; color: #4B3B6B; margin-top: 1px; }
  .lb-elig { font-size: 10px; color: #10B981; font-weight: 600; margin-top: 3px; }

  .bar-wrap { flex: 1; margin: 0 12px; }
  .bar-bg { height: 4px; background: rgba(124,58,237,0.1); border-radius: 100px; overflow: hidden; }
  .bar-fill { height: 100%; background: linear-gradient(90deg,#C4197D,#7C3AED); border-radius: 100px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

  .refresh-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; margin-bottom: 16px; }
  .refresh-btn:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }

  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; animation: pulse 2s infinite; flex-shrink: 0; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

  .loading { text-align: center; padding: 60px 20px; color: #6B4F8B; }
  .empty { text-align: center; padding: 60px 20px; color: #6B4F8B; font-size: 14px; }

  .last-updated { text-align: center; font-size: 11px; color: #4B3B6B; margin-bottom: 20px; }
`;

export default function Leaderboard() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async () => {
    const { data } = await supabase
      .from("participants")
      .select("staff_id, name, stamps")
      .order("stamps", { ascending: false });

    const sorted = (data || []).sort((a, b) => b.stamps.length - a.stamps.length);
    setParticipants(sorted);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Auto refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-live")
      .on("postgres_changes", {
        event: "*", schema: "public", table: "participants",
      }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const top3 = participants.slice(0, 3);
  const rest = participants.slice(3);
  const eligible = participants.filter(p => isEligible(p.stamps));
  const totalStamps = participants.reduce((sum, p) => sum + p.stamps.length, 0);
  const maxStamps = participants.length > 0 ? participants[0].stamps.length : 1;

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const podiumStyles = ["podium-2", "podium-1", "podium-3"];
  const podiumBases = ["podium-base-2", "podium-base-1", "podium-base-3"];
  const medals = ["🥈", "🥇", "🥉"];
  const stampColors = ["#C0C0C0", "#D4AF37", "#CD7F32"];

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="app">
        <div className="header">
          <div className="logo">MIMOS</div>
          <h1 className="title">🏆 Leaderboard</h1>
          <p className="subtitle">MTR Innovation Passport Challenge · Live Rankings</p>
        </div>

        {loading ? (
          <div className="loading">Loading leaderboard...</div>
        ) : participants.length === 0 ? (
          <div className="empty">No participants yet.<br />Be the first to register!</div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-row">
              <div className="stat">
                <div className="stat-num" style={{ color: "#fff" }}>{participants.length}</div>
                <div className="stat-lbl">Participants</div>
              </div>
              <div className="stat">
                <div className="stat-num" style={{ color: "#10B981" }}>{eligible.length}</div>
                <div className="stat-lbl">Eligible</div>
              </div>
              <div className="stat">
                <div className="stat-num" style={{ color: "#C4197D" }}>{totalStamps}</div>
                <div className="stat-lbl">Total Stamps</div>
              </div>
            </div>

            {/* Live indicator + refresh */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <div className="live-dot" />
              <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>LIVE</span>
              <span style={{ fontSize: 11, color: "#4B3B6B" }}>· Updates automatically</span>
            </div>

            {lastUpdated && (
              <div className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}

            {/* Podium — top 3 */}
            {top3.length >= 2 && (
              <>
                <div className="section-title">Top 3</div>
                <div className="podium">
                  {podiumOrder.map((p, i) => p ? (
                    <div key={p.staff_id} className="podium-item">
                      <div className={`podium-card ${podiumStyles[i]}`}>
                        <div className="podium-medal">{medals[i]}</div>
                        <div className="podium-id">{p.staff_id}</div>
                        {p.name && <div className="podium-name">{p.name}</div>}
                        <div className="podium-stamps" style={{ color: stampColors[i] }}>
                          {p.stamps.length} stamps
                        </div>
                        {isEligible(p.stamps) && <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>✓ Eligible</div>}
                      </div>
                      <div className={`podium-base ${podiumBases[i]}`} />
                    </div>
                  ) : <div key={i} />)}
                </div>
              </>
            )}

            {/* Full leaderboard */}
            {rest.length > 0 && (
              <>
                <div className="section-title">All Participants</div>
                <div className="leaderboard-list">
                  {participants.map((p, i) => (
                    <div key={p.staff_id} className={`lb-row ${isEligible(p.stamps) ? "eligible" : ""}`}>
                      <div className="lb-rank">#{i + 1}</div>
                      <div className="lb-info">
                        <div className="lb-id">{p.staff_id}</div>
                        {p.name && <div className="lb-name">{p.name}</div>}
                        {isEligible(p.stamps) && <div className="lb-elig">✓ Eligible for Lucky Draw</div>}
                      </div>
                      <div className="bar-wrap">
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ width: `${(p.stamps.length / maxStamps) * 100}%` }} />
                        </div>
                      </div>
                      <div className="lb-right">
                        <div className="lb-stamps">{p.stamps.length}</div>
                        <div className="lb-label">stamps</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button className="refresh-btn" onClick={load}>🔄 Refresh Now</button>
          </>
        )}
      </div>
    </>
  );
}
