import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { isEligible } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .app { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; }

  .back-btn { background: none; border: none; color: #6B4F8B; font-size: 20px; cursor: pointer; margin-bottom: 8px; display: block; }
  .title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 4px; }
  .subtitle { font-size: 13px; color: #6B4F8B; margin-bottom: 6px; }
  .hint { font-size: 11px; color: #4B3B6B; text-align: center; margin-bottom: 28px; }

  .wheel-wrap { position: relative; width: 300px; height: 300px; margin: 0 auto 28px; }
  .wheel-pointer { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 28px solid #C4197D; filter: drop-shadow(0 0 8px rgba(196,25,125,0.8)); z-index: 2; }
  .wheel-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 44px; height: 44px; border-radius: 50%; background: #0A0612; border: 2px solid #C4197D; display: flex; align-items: center; justify-content: center; font-size: 18px; z-index: 2; }

  .btn-spin { width: 100%; padding: 16px; border-radius: 14px; font-size: 16px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; box-shadow: 0 4px 30px rgba(196,25,125,0.4); transition: all 0.2s; letter-spacing: 0.3px; margin-bottom: 24px; }
  .btn-spin:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(196,25,125,0.5); }
  .btn-spin:disabled { background: rgba(26,13,46,0.7); box-shadow: none; cursor: not-allowed; transform: none; color: #6B4F8B; }

  .winner-card { background: rgba(196,25,125,0.06); border: 2px solid rgba(196,25,125,0.35); border-radius: 24px; padding: 32px; text-align: center; animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .winner-emoji { font-size: 56px; display: block; margin-bottom: 16px; }
  .winner-label { font-size: 12px; font-weight: 600; color: #C4197D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .winner-name { font-family: 'Space Grotesk',sans-serif; font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .winner-entries { font-size: 13px; color: #6B4F8B; margin-top: 8px; }

  .no-eligible { text-align: center; padding: 60px 20px; color: #6B4F8B; font-size: 14px; }

  .btn-back { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; margin-top: 16px; }
  .btn-back:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
`;

function SpinWheel({ entries, onWinner }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const rotRef = useRef(0);
  const animRef = useRef(null);
  const COLORS = ["#C4197D","#7C3AED","#A78BFA","#F59E0B","#10B981","#38BDF8","#F43F5E","#84CC16","#8B5CF6","#EC4899"];
  const n = entries.length;

  const drawWheel = (rot) => {
    const canvas = canvasRef.current;
    if (!canvas || n === 0) return;
    const ctx = canvas.getContext("2d");
    const cx = 150, cy = 150, r = 145;
    ctx.clearRect(0, 0, 300, 300);
    const arc = (2 * Math.PI) / n;
    entries.forEach((entry, i) => {
      const start = rot + i * arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + arc);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Inter, sans-serif";
      const label = entry.name.length > 10 ? entry.name.slice(0, 9) + "…" : entry.name;
      ctx.fillText(label, r - 8, 4);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "#0A0612";
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => { if (n > 0) drawWheel(rotRef.current); }, [entries]);

  const spin = () => {
    if (spinning || n === 0) return;
    setSpinning(true);
    const target = rotRef.current + (6 + Math.random() * 4) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4500;
    const start = performance.now();
    const startRot = rotRef.current;
    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const cur = startRot + (target - startRot) * ease;
      rotRef.current = cur;
      drawWheel(cur);
      if (p < 1) { animRef.current = requestAnimationFrame(animate); }
      else {
        setSpinning(false);
        const norm = ((cur % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const ptr = (2 * Math.PI - norm + 3 * Math.PI / 2) % (2 * Math.PI);
        const idx = Math.floor(ptr / ((2 * Math.PI) / n)) % n;
        onWinner(entries[idx]);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  return (
    <div>
      <div className="wheel-wrap">
        <div className="wheel-pointer" />
        <canvas ref={canvasRef} width={300} height={300} style={{ borderRadius: "50%", boxShadow: "0 0 60px rgba(196,25,125,0.3), 0 0 120px rgba(124,58,237,0.2)" }} />
        <div className="wheel-center">🎲</div>
      </div>
      <button className="btn-spin" onClick={spin} disabled={spinning}>
        {spinning ? "Spinning…" : "🎰 Spin the Wheel"}
      </button>
    </div>
  );
}

export default function Draw() {
  const [eligible, setEligible] = useState([]);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("participants").select("staff_id, name, stamps");
      setEligible((data || []).filter(p => isEligible(p.stamps)));
    };
    load();
  }, []);

  const wheelEntries = eligible.flatMap(p =>
    Array(p.stamps.length).fill({ id: p.staff_id, name: p.staff_id, entries: p.stamps.length })
  );

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="app">
        <button className="back-btn" onClick={() => navigate("/admin")}>←</button>
        <h2 className="title">Lucky Draw</h2>
        <p className="subtitle">{wheelEntries.length} entries · {eligible.length} eligible participants</p>
        <p className="hint">More stamps = more entries = higher chance of winning</p>

        {wheelEntries.length > 0
          ? <SpinWheel entries={wheelEntries} onWinner={setWinner} />
          : <div className="no-eligible">No eligible participants yet.<br />Participants need at least 1 stamp from each of the 7 domains.</div>
        }

        {winner && (
          <div className="winner-card">
            <span className="winner-emoji">🎉</span>
            <div className="winner-label">Lucky Draw Winner</div>
            <div className="winner-name">Staff ID: {winner.id}</div>
            <div className="winner-entries">🎖️ {winner.entries} stamps collected</div>
          </div>
        )}

        <button className="btn-back" onClick={() => navigate("/admin")}>← Back to Dashboard</button>
      </div>
    </>
  );
}
