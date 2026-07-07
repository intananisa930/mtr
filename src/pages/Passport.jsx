import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { DOMAINS, isEligible } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; position: relative; z-index: 1; padding-bottom: 100px; }

  .hdr { background: rgba(10,6,18,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(196,25,125,0.2); padding: 14px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 20; }
  .hdr-logo { background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; letter-spacing: 1px; flex-shrink: 0; }
  .hdr-title { font-size: 13px; font-weight: 600; color: #F3E8FF; }
  .hdr-sub { font-size: 11px; color: #7C3AED; margin-top: 1px; }
  .hdr-badge { background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3); padding: 5px 10px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #F9A8D4; flex-shrink: 0; font-family: 'Space Grotesk',sans-serif; }

  .page { padding: 20px; }

  .progress-card { background: linear-gradient(135deg, rgba(26,13,46,0.9) 0%, rgba(124,58,237,0.1) 100%); border: 1px solid rgba(196,25,125,0.25); border-radius: 20px; padding: 22px; margin-bottom: 20px; position: relative; overflow: hidden; }
  .progress-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(196,25,125,0.15) 0%, transparent 70%); }
  .prog-num { font-family: 'Space Grotesk',sans-serif; font-size: 40px; font-weight: 800; color: #fff; line-height: 1; }
  .prog-num span { font-size: 20px; color: #6B4F8B; }
  .prog-entries { font-family: 'Space Grotesk',sans-serif; font-size: 32px; font-weight: 800; color: #C4197D; line-height: 1; }
  .elig-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 100px; margin-top: 8px; }
  .elig-yes { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10B981; }
  .elig-no { background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.2); color: #7C3AED; }
  .bar-bg { height: 5px; background: rgba(124,58,237,0.2); border-radius: 100px; overflow: hidden; margin-top: 16px; }
  .bar-fill { height: 100%; background: linear-gradient(90deg,#C4197D,#7C3AED,#A78BFA); border-radius: 100px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }

  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }

  .domain-card { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; margin-bottom: 10px; overflow: hidden; transition: all 0.2s; cursor: pointer; backdrop-filter: blur(4px); }
  .domain-card:hover { border-color: rgba(196,25,125,0.3); }
  .domain-card.open { border-color: rgba(196,25,125,0.4); }
  .domain-hdr { display: flex; align-items: center; gap: 12px; padding: 16px; }
  .domain-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .domain-name { font-size: 14px; font-weight: 600; color: #F3E8FF; }
  .domain-prog { font-size: 11px; margin-top: 2px; }
  .stamp-dots { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; }
  .stamp-dot { width: 6px; height: 6px; border-radius: 50%; transition: background 0.3s; }
  .chevron { color: #4B3B6B; font-size: 11px; transition: transform 0.2s; margin-left: auto; flex-shrink: 0; }
  .domain-card.open .chevron { transform: rotate(180deg); }

  .tech-list { border-top: 1px solid rgba(124,58,237,0.1); padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
  .tech-row { display: flex; align-items: center; gap: 12px; background: rgba(10,6,18,0.5); border: 1px solid rgba(124,58,237,0.12); border-radius: 12px; padding: 12px 14px; }
  .tech-row.done { border-color: rgba(16,185,129,0.25); background: rgba(16,185,129,0.05); }
  .tech-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .tech-icon.done { background: rgba(16,185,129,0.15); }
  .tech-icon.empty { background: rgba(124,58,237,0.1); }
  .tech-name { font-size: 13px; font-weight: 600; color: #F3E8FF; }
  .tech-use { font-size: 11px; color: #6B4F8B; margin-top: 1px; }

  .fab { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; border: none; border-radius: 100px; padding: 16px 36px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; box-shadow: 0 8px 40px rgba(196,25,125,0.5), 0 0 0 1px rgba(196,25,125,0.3); white-space: nowrap; transition: all 0.2s; z-index: 10; letter-spacing: 0.3px; }
  .fab:hover { transform: translateX(-50%) translateY(-3px); box-shadow: 0 12px 50px rgba(196,25,125,0.6); }

  .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; margin-top: 10px; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }

  /* Completion overlay */
  .completion-overlay { position: fixed; inset: 0; background: rgba(5,3,10,0.95); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .completion-card { background: linear-gradient(135deg,rgba(26,13,46,0.95),rgba(124,58,237,0.1)); border: 2px solid rgba(196,25,125,0.4); border-radius: 28px; padding: 40px 28px; text-align: center; max-width: 400px; width: 100%; position: relative; overflow: hidden; animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .completion-medal { font-size: 80px; display: block; margin-bottom: 20px; animation: bounce 1s ease infinite alternate; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
  .completion-title { font-family: 'Space Grotesk',sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 10px; background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .completion-sub { font-size: 14px; color: #9CA3AF; line-height: 1.7; margin-bottom: 24px; }
  .completion-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10B981; font-size: 14px; font-weight: 700; padding: 10px 20px; border-radius: 100px; margin-bottom: 28px; }
  .completion-entries { background: rgba(196,25,125,0.08); border: 1px solid rgba(196,25,125,0.2); border-radius: 16px; padding: 16px; margin-bottom: 24px; }
  .completion-entries-num { font-family: 'Space Grotesk',sans-serif; font-size: 44px; font-weight: 800; color: #C4197D; line-height: 1; }
  .completion-entries-lbl { font-size: 12px; color: #6B4F8B; margin-top: 4px; }
  .btn-completion { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; box-shadow: 0 4px 20px rgba(196,25,125,0.4); }

  /* Confetti */
  .confetti-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 99; overflow: hidden; }
  .confetti-piece { position: absolute; width: 10px; height: 10px; top: -20px; animation: confettiFall linear forwards; border-radius: 2px; }
  @keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
`;

// Confetti component
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ["#C4197D","#7C3AED","#F59E0B","#10B981","#38BDF8","#F43F5E","#A78BFA"][i % 7],
    duration: `${2 + Math.random() * 3}s`,
    delay: `${Math.random() * 2}s`,
    size: `${6 + Math.random() * 8}px`,
  }));

  return (
    <div className="confetti-wrap">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left,
          background: p.color,
          width: p.size,
          height: p.size,
          animationDuration: p.duration,
          animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

export default function Passport() {
  const [stamps, setStamps] = useState([]);
  const [eligible, setEligible] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");
  const staffName = localStorage.getItem("staffName");

  useEffect(() => { if (!staffId) navigate("/"); }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("participants").select("stamps, eligible").eq("staff_id", staffId).single();
      if (data) {
        setStamps(data.stamps || []);
        setEligible(data.eligible || false);
      }
    };
    if (staffId) load();
  }, [staffId]);

  useEffect(() => {
    if (!staffId) return;
    const channel = supabase.channel("passport-live")
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "participants",
        filter: `staff_id=eq.${staffId}`,
      }, (payload) => {
        const newStamps = payload.new.stamps || [];
        const newEligible = payload.new.eligible || false;
        const wasEligible = eligible;
        setStamps(newStamps);
        setEligible(newEligible);
        // Show completion celebration if just became eligible
        if (newEligible && !wasEligible) {
          setJustCompleted(true);
          setShowCompletion(true);
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [staffId, eligible]);

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>

      {/* Completion celebration */}
      {showCompletion && (
        <>
          <Confetti />
          <div className="completion-overlay">
            <div className="completion-card">
              <span className="completion-medal">🏆</span>
              <h2 className="completion-title">
                {staffName ? `Well done, ${staffName}!` : "Congratulations!"}
              </h2>
              <p className="completion-sub">
                You've visited all 7 domains and completed the MTR Innovation Passport Challenge!
              </p>
              <div className="completion-badge">✓ Eligible for Lucky Draw</div>
              <div className="completion-entries">
                <div className="completion-entries-num">{stamps.length}</div>
                <div className="completion-entries-lbl">Lucky Draw {stamps.length === 1 ? "Entry" : "Entries"}</div>
              </div>
              <p style={{ fontSize: 13, color: "#6B4F8B", marginBottom: 20 }}>
                Keep collecting stamps from more booths to increase your chances of winning!
              </p>
              <button className="btn-completion" onClick={() => setShowCompletion(false)}>
                Continue Collecting →
              </button>
            </div>
          </div>
        </>
      )}

      <div className="app">
        <div className="hdr">
          <div className="hdr-logo">MIMOS</div>
          <div style={{ flex: 1 }}>
            <div className="hdr-title">MTR Innovation Passport Challenge</div>
            <div className="hdr-sub">
              {staffName ? `${staffName} · ` : ""}Staff ID: {staffId}
            </div>
          </div>
          <div className="hdr-badge">{stamps.length} / 38 🎖️</div>
        </div>

        <div className="page">
          <div className="progress-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="section-title">Stamps Collected</div>
                <div className="prog-num">{stamps.length}<span> / 38</span></div>
                <div className={`elig-badge ${eligible ? "elig-yes" : "elig-no"}`}>
                  {eligible ? "✓ Eligible for Lucky Draw" : "Visit all 7 domains to qualify"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="section-title">Lucky Draw</div>
                <div className="prog-entries">{stamps.length}</div>
                <div style={{ fontSize: 11, color: "#6B4F8B", marginTop: 4 }}>entries</div>
              </div>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${(stamps.length / 38) * 100}%` }} />
            </div>
          </div>

          <div className="section-title">7 Solution Domains</div>
          {DOMAINS.map(domain => {
            const ds = stamps.filter(s => domain.techs.some(t => t.id === s));
            const isOpen = expandedDomain === domain.id;
            return (
              <div key={domain.id} className={`domain-card ${isOpen ? "open" : ""}`}>
                <div className="domain-hdr" onClick={() => setExpandedDomain(isOpen ? null : domain.id)}>
                  <div className="domain-icon" style={{ background: domain.colorBg, border: `1px solid ${domain.colorBorder}` }}>
                    {domain.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="domain-name">{domain.name}</div>
                    <div className="domain-prog" style={{ color: ds.length > 0 ? domain.color : "#4B3B6B" }}>
                      {ds.length}/{domain.techs.length} stamps
                      {ds.length > 0 && <span style={{ marginLeft: 6, fontSize: 10 }}>✓ visited</span>}
                    </div>
                    <div className="stamp-dots">
                      {domain.techs.map(t => (
                        <div key={t.id} className="stamp-dot" style={{ background: stamps.includes(t.id) ? domain.color : "rgba(124,58,237,0.15)" }} />
                      ))}
                    </div>
                  </div>
                  <div className="chevron">▼</div>
                </div>
                {isOpen && (
                  <div className="tech-list">
                    {domain.techs.map(tech => {
                      const done = stamps.includes(tech.id);
                      return (
                        <div key={tech.id} className={`tech-row ${done ? "done" : ""}`}>
                          <div className={`tech-icon ${done ? "done" : "empty"}`}>{done ? "✅" : "⬜"}</div>
                          <div style={{ flex: 1 }}>
                            <div className="tech-name">{tech.name}</div>
                            <div className="tech-use">{tech.use}</div>
                          </div>
                          {done && <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600, flexShrink: 0 }}>Stamped</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <button className="btn-ghost" onClick={() => { localStorage.removeItem("staffId"); localStorage.removeItem("staffName"); navigate("/"); }}>
            ← Logout
          </button>
        </div>

        <button className="fab" onClick={() => navigate("/scan")}>📷 &nbsp;Scan Booth QR</button>
      </div>
    </>
  );
}
