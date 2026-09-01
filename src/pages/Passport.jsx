import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  .type-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px; margin-bottom: 16px; }
  .type-staff { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #60A5FA; }
  .type-guest { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #F59E0B; }

  /* PROGRESS RING */
  .ring-section { display: flex; align-items: center; gap: 20px; background: linear-gradient(135deg,rgba(26,13,46,0.9) 0%,rgba(124,58,237,0.1) 100%); border: 1px solid rgba(196,25,125,0.25); border-radius: 20px; padding: 20px; margin-bottom: 20px; }
  .ring-container { position: relative; flex-shrink: 0; }
  .ring-svg { transform: rotate(-90deg); }
  .ring-bg { fill: none; stroke: rgba(124,58,237,0.15); stroke-width: 10; }
  .ring-fill { fill: none; stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1); }
  .ring-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
  .ring-num { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; color: #fff; line-height: 1; }
  .ring-total { font-size: 9px; color: #6B4F8B; margin-top: 2px; }
  .ring-info { flex: 1; }
  .ring-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .ring-entries { font-family: 'Space Grotesk',sans-serif; font-size: 28px; font-weight: 800; color: #C4197D; line-height: 1; }
  .ring-entries-lbl { font-size: 11px; color: #6B4F8B; margin-top: 2px; }
  .elig-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 100px; margin-top: 8px; }
  .elig-yes { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10B981; }
  .elig-no { background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.2); color: #7C3AED; }
  .rank-row { font-size: 11px; color: #6B4F8B; margin-top: 6px; }

  /* HOW TO */
  .how-box { background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; padding: 16px 18px; margin-bottom: 20px; }
  .how-title { font-size: 11px; font-weight: 600; color: #7C3AED; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .how-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
  .how-row:last-child { margin-bottom: 0; }

  /* DOMAIN CARDS */
  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
  .domain-card { border-radius: 16px; margin-bottom: 10px; overflow: hidden; transition: all 0.2s; cursor: pointer; border: 1px solid; }
  .domain-hdr { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
  .domain-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; border: 1px solid; }
  .domain-name { font-size: 14px; font-weight: 600; }
  .domain-prog { font-size: 11px; margin-top: 2px; }
  .stamp-dots { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; }
  .stamp-dot { width: 7px; height: 7px; border-radius: 50%; transition: all 0.4s; }
  .stamp-dot.just-stamped { animation: stampPop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes stampPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.4); } 100% { transform: scale(1); opacity: 1; } }
  .chevron-icon { font-size: 11px; transition: transform 0.2s; margin-left: auto; flex-shrink: 0; }
  .tech-list { border-top: 1px solid rgba(124,58,237,0.1); padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
  .tech-row { display: flex; align-items: center; gap: 12px; background: rgba(10,6,18,0.5); border: 1px solid rgba(124,58,237,0.12); border-radius: 12px; padding: 12px 14px; }
  .tech-row.done { border-color: rgba(16,185,129,0.25); background: rgba(16,185,129,0.05); }
  .tech-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .tech-icon.done { background: rgba(16,185,129,0.15); }
  .tech-icon.empty { background: rgba(124,58,237,0.1); }
  .tech-name { font-size: 13px; font-weight: 600; color: #F3E8FF; }
  .tech-use { font-size: 11px; color: #6B4F8B; margin-top: 1px; }
  .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; margin-top: 10px; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }

  /* STAMP ANIMATION OVERLAY */
  .stamp-anim-wrap { position: fixed; inset: 0; z-index: 50; pointer-events: none; display: flex; align-items: center; justify-content: center; }
  .stamp-anim { font-size: 80px; animation: stampSlam 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  @keyframes stampSlam { 0% { transform: scale(3) rotate(-15deg); opacity: 0; } 50% { opacity: 1; } 80% { transform: scale(0.95) rotate(2deg); } 100% { transform: scale(1) rotate(0); opacity: 0; } }

  /* COMPLETION */
  .completion-overlay { position: fixed; inset: 0; background: rgba(5,3,10,0.95); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .completion-card { background: linear-gradient(135deg,rgba(26,13,46,0.95),rgba(124,58,237,0.1)); border: 2px solid rgba(196,25,125,0.4); border-radius: 28px; padding: 40px 28px; text-align: center; max-width: 400px; width: 100%; animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .completion-medal { font-size: 72px; display: block; margin-bottom: 16px; }
  .completion-title { font-family: 'Space Grotesk',sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 10px; background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .completion-sub { font-size: 14px; color: #9CA3AF; line-height: 1.7; margin-bottom: 20px; }
  .completion-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10B981; font-size: 14px; font-weight: 700; padding: 10px 20px; border-radius: 100px; margin-bottom: 20px; }
  .entries-box { background: rgba(196,25,125,0.08); border: 1px solid rgba(196,25,125,0.2); border-radius: 16px; padding: 16px; margin-bottom: 20px; }
  .entries-num { font-family: 'Space Grotesk',sans-serif; font-size: 48px; font-weight: 800; color: #C4197D; line-height: 1; }
  .entries-lbl { font-size: 13px; color: #6B4F8B; margin-top: 4px; }
  .btn-completion { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; }
  .loading-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .loading-text { font-size: 14px; color: #6B4F8B; }
`;

const CIRC = 2 * Math.PI * 52;

export default function Passport() {
  const [participant, setParticipant] = useState(null);
  const [stamps, setStamps] = useState([]);
  const [prevStamps, setPrevStamps] = useState([]);
  const [eligible, setEligible] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rank, setRank] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [stampAnim, setStampAnim] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const wristbandId = searchParams.get("id")?.toUpperCase() || localStorage.getItem("wristbandId");

  useEffect(() => {
    if (!wristbandId) { navigate("/"); return; }
    loadParticipant();
  }, [wristbandId]);

  const loadParticipant = async () => {
    setLoading(true);
    const { data } = await supabase.from("participants").select("*").eq("wristband_id", wristbandId).single();
    if (!data) { setNotFound(true); setLoading(false); return; }
    setParticipant(data);
    setStamps(data.stamps || []);
    setPrevStamps(data.stamps || []);
    setEligible(data.eligible || false);
    localStorage.setItem("wristbandId", wristbandId);
    localStorage.setItem("staffId", data.staff_id);

    const { data: all } = await supabase.from("participants").select("staff_id, stamps").not("wristband_id", "is", null);
    if (all) {
      const sorted = [...all].sort((a, b) => b.stamps.length - a.stamps.length);
      const myRank = sorted.findIndex(p => p.staff_id === data.staff_id) + 1;
      setRank(myRank);
      setTotalParticipants(all.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!wristbandId) return;
    const channel = supabase.channel("passport-live")
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "participants",
        filter: `wristband_id=eq.${wristbandId}`,
      }, (payload) => {
        const newStamps = payload.new.stamps || [];
        const wasEligible = eligible;
        const nowEligible = payload.new.eligible || false;

        // Find new stamp and show animation
        const added = newStamps.find(s => !stamps.includes(s));
        if (added) {
          const domain = DOMAINS.find(d => d.techs.some(t => t.id === added));
          if (domain) {
            setStampAnim(domain.icon);
            setTimeout(() => setStampAnim(null), 800);
          }
        }

        setPrevStamps(stamps);
        setStamps(newStamps);
        setEligible(nowEligible);
        if (nowEligible && !wasEligible) setShowCompletion(true);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [wristbandId, eligible, stamps]);

  const handleLogout = () => {
    localStorage.removeItem("wristbandId");
    localStorage.removeItem("staffId");
    navigate("/");
  };

  const ringOffset = CIRC - (CIRC * Math.min(stamps.length / 38, 1));

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-wrap"><div className="loading-text">Loading passport...</div></div>
    </>
  );

  if (notFound) return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2 style={{ color: "#F87171", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Wristband not found</h2>
        <p style={{ color: "#6B4F8B", marginBottom: 24 }}>Please register at the counter first.</p>
        <button style={{ background: "#C4197D", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/")}>← Back</button>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>

      {/* Stamp animation overlay */}
      {stampAnim && (
        <div className="stamp-anim-wrap">
          <div className="stamp-anim">{stampAnim}</div>
        </div>
      )}

      {/* Completion overlay */}
      {showCompletion && (
        <div className="completion-overlay">
          <div className="completion-card">
            <span className="completion-medal">🏆</span>
            <h2 className="completion-title">
              {participant?.display_name ? `Well done, ${participant.display_name.split(" ")[0]}!` : "Congratulations!"}
            </h2>
            <p className="completion-sub">You've visited all 6 domains and completed the MTR Innovation Passport Challenge!</p>
            <div className="completion-badge">✓ Eligible for Lucky Draw</div>
            <div className="entries-box">
              <div className="entries-num">{stamps.length}</div>
              <div className="entries-lbl">Lucky Draw {stamps.length === 1 ? "Entry" : "Entries"}</div>
            </div>
            <button className="btn-completion" onClick={() => setShowCompletion(false)}>Continue Collecting →</button>
          </div>
        </div>
      )}

      <div className="app">
        <div className="hdr">
          <div className="hdr-logo">MIMOS</div>
          <div style={{ flex: 1 }}>
            <div className="hdr-title">Innovation Passport</div>
            <div className="hdr-sub">{wristbandId}{participant?.display_name ? ` · ${participant.display_name}` : ""}</div>
          </div>
          <div className="hdr-badge">{stamps.length} / 38 🎖️</div>
        </div>

        <div className="page">
          <div className={`type-badge ${participant?.participant_type === "guest" ? "type-guest" : "type-staff"}`}>
            {participant?.participant_type === "guest" ? "External Guest" : "MIMOS Staff"}
          </div>

          {/* Progress Ring */}
          <div className="ring-section">
            <div className="ring-container">
              <svg className="ring-svg" width="120" height="120" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4197D" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <circle className="ring-bg" cx="60" cy="60" r="52" />
                <circle className="ring-fill" cx="60" cy="60" r="52"
                  stroke={eligible ? "#10B981" : "url(#ringGrad)"}
                  strokeDasharray={CIRC}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="ring-center">
                <div className="ring-num">{stamps.length}</div>
                <div className="ring-total">of 38</div>
              </div>
            </div>
            <div className="ring-info">
              <div className="ring-title">Lucky Draw</div>
              <div className="ring-entries">{stamps.length}</div>
              <div className="ring-entries-lbl">{stamps.length === 1 ? "entry" : "entries"}</div>
              <div className={`elig-badge ${eligible ? "elig-yes" : "elig-no"}`}>
                {eligible ? "✓ Eligible!" : "Visit all 6 domains + 10 stamps"}
              </div>
              {rank && totalParticipants > 1 && (
                <div className="rank-row">
                  🏅 Ranked <strong style={{ color: "#C4197D" }}>#{rank}</strong> of {totalParticipants}
                </div>
              )}
            </div>
          </div>

          {/* How it works — only when 0 stamps */}
          {stamps.length === 0 && (
            <div className="how-box">
              <div className="how-title">How to collect stamps</div>
              {[
                { icon: "🏃", text: "Visit any booth across the 6 domains below" },
                { icon: "🎯", text: "Complete the challenge at the booth" },
                { icon: "📷", text: "Ask the exhibitor to scan your wristband" },
                { icon: "🎰", text: "Visit all 6 domains + 10 stamps = lucky draw!" },
              ].map((s, i) => (
                <div key={i} className="how-row">
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{s.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Domain Cards */}
          <div className="section-title">6 Solution Domains</div>
          {DOMAINS.map(domain => {
            const ds = stamps.filter(s => domain.techs.some(t => t.id === s));
            const isOpen = expandedDomain === domain.id;
            const isVisited = ds.length > 0;

            return (
              <div key={domain.id} className="domain-card"
                style={{
                  background: isVisited ? domain.colorBg : "rgba(26,13,46,0.7)",
                  borderColor: isVisited ? domain.colorBorder : "rgba(124,58,237,0.15)",
                }}>
                <div className="domain-hdr" onClick={() => setExpandedDomain(isOpen ? null : domain.id)}>
                  <div className="domain-icon"
                    style={{ background: domain.colorBg, borderColor: domain.colorBorder }}>
                    {domain.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="domain-name" style={{ color: isVisited ? domain.color : "#F3E8FF" }}>
                      {domain.name}
                    </div>
                    <div className="domain-prog" style={{ color: isVisited ? domain.color : "#4B3B6B" }}>
                      {ds.length}/{domain.techs.length} stamps
                      {isVisited && <span style={{ marginLeft: 6, fontSize: 10 }}>✓ visited</span>}
                      {!isVisited && <span style={{ marginLeft: 6, fontSize: 10, color: "#4B3B6B" }}>· not visited yet</span>}
                    </div>
                    <div className="stamp-dots">
                      {domain.techs.map(t => {
                        const isNew = stamps.includes(t.id) && !prevStamps.includes(t.id);
                        return (
                          <div key={t.id}
                            className={`stamp-dot ${isNew ? "just-stamped" : ""}`}
                            style={{
                              background: stamps.includes(t.id)
                                ? domain.color
                                : isVisited ? `${domain.color}33` : "rgba(124,58,237,0.15)"
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="chevron-icon"
                    style={{
                      color: isVisited ? domain.color : "#4B3B6B",
                      transform: isVisited ? "none" : isOpen ? "rotate(180deg)" : "none",
                    }}>
                    {isVisited ? "✓" : "▼"}
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: `1px solid ${domain.color}22`, padding: "14px 16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                      {domain.techs.map(tech => {
                        const done = stamps.includes(tech.id);
                        return (
                          <div key={tech.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            {/* Stamp circle */}
                            <div style={{
                              width: 70, height: 70,
                              borderRadius: "50%",
                              border: done ? `3px solid ${domain.color}` : "3px dashed rgba(124,58,237,0.2)",
                              background: done ? domain.colorBg : "rgba(10,6,18,0.4)",
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center",
                              position: "relative",
                              boxShadow: done ? `0 0 16px ${domain.color}44` : "none",
                              transition: "all 0.4s",
                              animation: done ? "none" : "none",
                            }}>
                              {done ? (
                                <>
                                  {/* Outer ring detail */}
                                  <div style={{
                                    position: "absolute", inset: 4,
                                    borderRadius: "50%",
                                    border: `1px solid ${domain.color}66`,
                                  }} />
                                  <div style={{ fontSize: 22 }}>{domain.icon}</div>
                                  <div style={{
                                    fontSize: 7, fontWeight: 800, color: domain.color,
                                    textTransform: "uppercase", letterSpacing: 0.5,
                                    textAlign: "center", lineHeight: 1.2,
                                    padding: "0 6px",
                                  }}>✓</div>
                                </>
                              ) : (
                                <>
                                  <div style={{ fontSize: 20, opacity: 0.2 }}>{domain.icon}</div>
                                </>
                              )}
                            </div>
                            {/* Tech name below stamp */}
                            <div style={{
                              fontSize: 9, fontWeight: 600,
                              color: done ? domain.color : "#4B3B6B",
                              textAlign: "center", lineHeight: 1.3,
                              maxWidth: 72,
                            }}>
                              {tech.name}
                            </div>
                            {done && (
                              <div style={{
                                fontSize: 8, color: "#10B981", fontWeight: 600,
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.2)",
                                padding: "2px 6px", borderRadius: 20,
                              }}>Stamped</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button className="btn-ghost" onClick={handleLogout}>← Exit Passport</button>
        </div>
      </div>
    </>
  );
}
