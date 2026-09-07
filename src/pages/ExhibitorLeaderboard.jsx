import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .app { max-width: 600px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; }
  .hdr { text-align: center; margin-bottom: 28px; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 12px; border-radius: 6px; letter-spacing: 1px; margin-bottom: 14px; }
  .title { font-family: 'Space Grotesk',sans-serif; font-size: 28px; font-weight: 800; background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
  .subtitle { font-size: 13px; color: #6B4F8B; }
  .live { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #10B981; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 4px 12px; border-radius: 20px; margin-top: 8px; }
  .live::before { content: ''; width: 7px; height: 7px; background: #10B981; border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 28px; }
  .stat { background: rgba(26,13,46,0.8); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; padding: 16px; text-align: center; }
  .stat-n { font-family: 'Space Grotesk',sans-serif; font-size: 28px; font-weight: 800; line-height: 1; }
  .stat-l { font-size: 9px; color: #6B4F8B; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 5px; }
  .podium { display: flex; align-items: flex-end; justify-content: center; gap: 10px; margin-bottom: 28px; }
  .podium-slot { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .podium-card { border-radius: 16px; padding: 16px 12px; text-align: center; width: 130px; border: 2px solid; }
  .podium-medal { font-size: 32px; display: block; margin-bottom: 6px; }
  .podium-name { font-family: 'Space Grotesk',sans-serif; font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 3px; line-height: 1.2; }
  .podium-domain { font-size: 9px; color: #9CA3AF; margin-bottom: 8px; }
  .podium-pts { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; }
  .podium-stats { font-size: 9px; color: #6B4F8B; margin-top: 4px; line-height: 1.5; }
  .podium-block { border-radius: 10px 10px 0 0; width: 130px; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk',sans-serif; font-size: 20px; font-weight: 800; color: rgba(255,255,255,0.4); }
  .lb-card { background: rgba(26,13,46,0.8); border: 1px solid rgba(124,58,237,0.15); border-radius: 20px; padding: 20px; margin-bottom: 16px; }
  .lb-title { font-size: 11px; font-weight: 700; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .lb-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(124,58,237,0.07); }
  .lb-row:last-child { border-bottom: none; }
  .lb-rank { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
  .lb-info { flex: 1; }
  .lb-name { font-size: 14px; font-weight: 700; color: #F3E8FF; margin-bottom: 3px; }
  .lb-domain { font-size: 11px; color: #6B4F8B; margin-bottom: 5px; }
  .lb-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 5px; }
  .chip { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
  .lb-bar-bg { height: 4px; background: rgba(124,58,237,0.1); border-radius: 100px; overflow: hidden; }
  .lb-bar-fill { height: 100%; border-radius: 100px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
  .lb-score { text-align: right; flex-shrink: 0; }
  .lb-pts { font-family: 'Space Grotesk',sans-serif; font-size: 20px; font-weight: 800; color: #C4197D; }
  .lb-sub { font-size: 10px; color: #6B4F8B; margin-top: 2px; }
  .empty { text-align: center; padding: 60px 20px; color: #6B4F8B; font-size: 14px; }
  .loading { text-align: center; padding: 60px 20px; color: #6B4F8B; }
  .updated { text-align: center; font-size: 10px; color: #4B3B6B; margin-top: 16px; }
  .scoring-card { background: rgba(26,13,46,0.6); border: 1px solid rgba(124,58,237,0.12); border-radius: 14px; padding: 14px; margin-bottom: 16px; }
  .scoring-title { font-size: 10px; font-weight: 700; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .scoring-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid rgba(124,58,237,0.07); }
  .scoring-row:last-child { border-bottom: none; }
`;

const RANK_BG = ["rgba(212,175,55,0.25)","rgba(192,192,192,0.25)","rgba(205,127,50,0.25)","rgba(124,58,237,0.2)","rgba(59,130,246,0.2)","rgba(124,58,237,0.15)","rgba(124,58,237,0.1)","rgba(124,58,237,0.08)"];
const RANK_COLOR = ["#D4AF37","#C0C0C0","#CD7F32","#A78BFA","#60A5FA","#6B4F8B","#4B3B6B","#3D2B5E"];
const DOMAIN_COLORS = { agri: "#84CC16", city: "#3B82F6", ind: "#EC4899", health: "#F43F5E", mfg: "#F59E0B", rmk13: "#8B5CF6" };
const DOMAIN_ICONS = { agri: "🌾", city: "🏙️", ind: "⚙️", health: "❤️", mfg: "🏭", rmk13: "💡" };

export default function ExhibitorLeaderboard() {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const channel = supabase.channel("exhibitor-lb-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "exhibitor_scores" }, () => loadData())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from("exhibitor_scores").select("*").order("points", { ascending: false });
    setExhibitors(data || []);
    setLastUpdated(new Date());
    setLoading(false);
  };

  // Sort by: points DESC, then correct_answers DESC, then questions_unlocked DESC
  const sorted = [...exhibitors].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
    if ((b.correct_answers || 0) !== (a.correct_answers || 0)) return (b.correct_answers || 0) - (a.correct_answers || 0);
    return (b.questions_unlocked || 0) - (a.questions_unlocked || 0);
  });

  const activeExhibitors = sorted.filter(e => (e.questions_unlocked || 0) > 0 || (e.points || 0) > 0);
  const totalUnlocked = exhibitors.reduce((s, e) => s + (e.questions_unlocked || 0), 0);
  const totalCorrect = exhibitors.reduce((s, e) => s + (e.correct_answers || 0), 0);
  const totalAnswered = exhibitors.reduce((s, e) => s + (e.total_questions || 0), 0);
  const maxPts = Math.max(...activeExhibitors.map(e => e.points || 0), 1);
  const top3 = activeExhibitors.slice(0, 3);

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="app"><div className="loading">Loading exhibitor leaderboard...</div></div>
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
          <h1 className="title">Exhibitor Quiz Challenge</h1>
          <p className="subtitle">MTR Innovation Passport Challenge 2026</p>
          <div className="live">LIVE</div>
        </div>

        {/* How winners are chosen */}
        <div className="scoring-card">
          <div className="scoring-title">🏆 How Top 3 is Chosen</div>
          <div className="scoring-row">
            <div style={{ fontSize: 20, width: 28 }}>🔓</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#F9A8D4" }}>Questions Unlocked</div><div style={{ fontSize: 10, color: "#6B4F8B" }}>Each participant who visits unlocks 1 question</div></div>
            <div style={{ fontSize: 11, color: "#C4197D", fontWeight: 600 }}>Popularity</div>
          </div>
          <div className="scoring-row">
            <div style={{ fontSize: 20, width: 28 }}>✍️</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#A78BFA" }}>Questions Answered</div><div style={{ fontSize: 10, color: "#6B4F8B" }}>Exhibitor answers during free time</div></div>
            <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 600 }}>Activity</div>
          </div>
          <div className="scoring-row">
            <div style={{ fontSize: 20, width: 28 }}>✅</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>Correct Answers = Points</div><div style={{ fontSize: 10, color: "#6B4F8B" }}>5 pts per correct answer — ranked by total points</div></div>
            <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>5 pts each</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat">
            <div className="stat-n" style={{ color: "#C4197D" }}>{totalUnlocked}</div>
            <div className="stat-l">Total Unlocked</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: "#A78BFA" }}>{totalAnswered}</div>
            <div className="stat-l">Total Answered</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: "#10B981" }}>{totalCorrect}</div>
            <div className="stat-l">Total Correct</div>
          </div>
        </div>

        {activeExhibitors.length === 0 ? (
          <div className="empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: "#F3E8FF", marginBottom: 8 }}>Quiz Challenge Not Started Yet</div>
            <div>Exhibitors will appear here once participants start visiting booths!</div>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 2 && (
              <div className="podium">
                {top3[1] && (
                  <div className="podium-slot">
                    <div className="podium-card" style={{ background: "rgba(192,192,192,0.06)", borderColor: "rgba(192,192,192,0.3)" }}>
                      <span className="podium-medal">🥈</span>
                      <div className="podium-name">{top3[1].booth_name}</div>
                      <div className="podium-domain">{top3[1].domain_name}</div>
                      <div className="podium-pts" style={{ color: "#C0C0C0" }}>{top3[1].points || 0}</div>
                      <div className="podium-stats">🔓 {top3[1].questions_unlocked || 0} · ✅ {top3[1].correct_answers || 0}</div>
                    </div>
                    <div className="podium-block" style={{ height: 70, background: "rgba(192,192,192,0.15)" }}>2</div>
                  </div>
                )}
                {top3[0] && (
                  <div className="podium-slot">
                    <div className="podium-card" style={{ background: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.4)", boxShadow: "0 0 30px rgba(212,175,55,0.15)" }}>
                      <span className="podium-medal">🥇</span>
                      <div className="podium-name">{top3[0].booth_name}</div>
                      <div className="podium-domain">{top3[0].domain_name}</div>
                      <div className="podium-pts" style={{ color: "#D4AF37" }}>{top3[0].points || 0}</div>
                      <div className="podium-stats">🔓 {top3[0].questions_unlocked || 0} · ✅ {top3[0].correct_answers || 0}</div>
                    </div>
                    <div className="podium-block" style={{ height: 100, background: "rgba(212,175,55,0.2)" }}>1</div>
                  </div>
                )}
                {top3[2] && (
                  <div className="podium-slot">
                    <div className="podium-card" style={{ background: "rgba(205,127,50,0.06)", borderColor: "rgba(205,127,50,0.3)" }}>
                      <span className="podium-medal">🥉</span>
                      <div className="podium-name">{top3[2].booth_name}</div>
                      <div className="podium-domain">{top3[2].domain_name}</div>
                      <div className="podium-pts" style={{ color: "#CD7F32" }}>{top3[2].points || 0}</div>
                      <div className="podium-stats">🔓 {top3[2].questions_unlocked || 0} · ✅ {top3[2].correct_answers || 0}</div>
                    </div>
                    <div className="podium-block" style={{ height: 50, background: "rgba(205,127,50,0.15)" }}>3</div>
                  </div>
                )}
              </div>
            )}

            {/* Full leaderboard */}
            <div className="lb-card">
              <div className="lb-title">🏆 Full Leaderboard</div>
              {activeExhibitors.map((e, i) => {
                const domainColor = DOMAIN_COLORS[e.domain_id] || "#7C3AED";
                const acc = e.total_questions > 0 ? Math.round(e.correct_answers / e.total_questions * 100) : 0;
                return (
                  <div key={i} className="lb-row">
                    <div className="lb-rank" style={{ background: RANK_BG[i] || "rgba(124,58,237,0.08)", color: RANK_COLOR[i] || "#3D2B5E" }}>{i + 1}</div>
                    <div className="lb-info">
                      <div className="lb-name">{e.booth_name}</div>
                      <div className="lb-domain">{DOMAIN_ICONS[e.domain_id] || "🔬"} {e.domain_name}</div>
                      <div className="lb-chips">
                        <span className="chip" style={{ background: "rgba(196,25,125,0.1)", color: "#F9A8D4", border: "1px solid rgba(196,25,125,0.2)" }}>🔓 {e.questions_unlocked || 0} unlocked</span>
                        <span className="chip" style={{ background: "rgba(124,58,237,0.1)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.2)" }}>✍️ {e.total_questions || 0} answered</span>
                        <span className="chip" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>✅ {e.correct_answers || 0} correct</span>
                      </div>
                      <div className="lb-bar-bg">
                        <div className="lb-bar-fill" style={{ width: `${Math.round((e.points || 0) / maxPts * 100)}%`, background: `linear-gradient(90deg,${domainColor},${domainColor}88)` }}></div>
                      </div>
                    </div>
                    <div className="lb-score">
                      <div className="lb-pts">{e.points || 0}</div>
                      <div className="lb-sub">pts</div>
                      <div style={{ fontSize: 9, color: "#6B4F8B", marginTop: 2 }}>{acc}% acc</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {lastUpdated && (
          <div className="updated">Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 30 seconds</div>
        )}
      </div>
    </>
  );
}
