import { useRef, useState, useEffect } from "react";

export default function SpinWheel({ entries, onWinner }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const rotRef = useRef(0);
  const animRef = useRef(null);

  const COLORS = ["#E8002D","#6366F1","#F59E0B","#10B981","#3B82F6","#EC4899","#84CC16","#F43F5E","#8B5CF6","#06B6D4"];
  const n = entries.length;

  const drawWheel = (rot) => {
    const canvas = canvasRef.current;
    if (!canvas || n === 0) return;
    const ctx = canvas.getContext("2d");
    const cx = 140, cy = 140, r = 136;
    ctx.clearRect(0, 0, 280, 280);
    const arc = (2 * Math.PI) / n;
    entries.forEach((entry, i) => {
      const start = rot + i * arc;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Inter, sans-serif";
      const label = entry.name.length > 10 ? entry.name.slice(0, 9) + "…" : entry.name;
      ctx.fillText(label, r - 10, 4);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "#0A0E1A";
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => { if (n > 0) drawWheel(rotRef.current); }, [entries]);

  const spin = () => {
    if (spinning || n === 0) return;
    setSpinning(true);
    const extraSpins = 6 + Math.random() * 4;
    const target = rotRef.current + extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000;
    const start = performance.now();
    const startRot = rotRef.current;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startRot + (target - startRot) * ease;
      rotRef.current = current;
      drawWheel(current);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const norm = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointer = (2 * Math.PI - norm + 3 * Math.PI / 2) % (2 * Math.PI);
        const arc = (2 * Math.PI) / n;
        const idx = Math.floor(pointer / arc) % n;
        onWinner(entries[idx]);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  if (n === 0) return <p style={{ color: "#64748B", textAlign: "center" }}>No eligible participants yet.</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto 24px" }}>
        <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "24px solid #F59E0B", filter: "drop-shadow(0 2px 8px rgba(245,158,11,0.6))" }} />
        <canvas ref={canvasRef} width={280} height={280} style={{ borderRadius: "50%", boxShadow: "0 0 40px rgba(232,0,45,0.3)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: "50%", background: "#0A0E1A", border: "3px solid #1E2A3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎲</div>
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        style={{ background: spinning ? "#1E2A3A" : "linear-gradient(135deg,#E8002D,#C8001F)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: spinning ? "not-allowed" : "pointer", width: "100%" }}
      >
        {spinning ? "Spinning…" : "🎰 Spin the Wheel"}
      </button>
    </div>
  );
}