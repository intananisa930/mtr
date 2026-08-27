import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { isEligible } from "../data";

const EXTRA_COLORS = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FCF","#FF9F43","#A8E6CF","#FF8B94","#B5EAD7","#C7CEEA","#FFDAC1","#E2F0CB","#FF6B6B","#FFD93D","#6BCB77","#4D96FF"];
const BALL_COLORS = ["#E8334A","#F59E0B","#10B981","#3B82F6","#C4197D","#F97316","#84CC16","#EC4899","#38BDF8","#8B5CF6","#06B6D4","#7C3AED"];

const CW = 380, CH = 420;
const MX=25,MY=10,MW=330,MH=370;
const WALL=8;
const INNER_X=MX+WALL,INNER_Y=MY+52,INNER_W=MW-WALL*2,INNER_H=MH-65;
const FLOOR_Y=INNER_Y+INNER_H;
const RAIL_Y=MY+32;
const RAIL_X1=INNER_X+10,RAIL_X2=INNER_X+INNER_W-10;
const BR=26;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .app { max-width: 480px; margin: 0 auto; padding: 20px; position: relative; z-index: 1; }
  .back-btn { background: none; border: none; color: #6B4F8B; font-size: 22px; cursor: pointer; margin-bottom: 8px; display: block; }
  .title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 4px; }
  .subtitle { font-size: 13px; color: #6B4F8B; margin-bottom: 16px; }
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }
  .stat { background: rgba(26,13,46,0.8); border: 1px solid rgba(124,58,237,0.15); border-radius: 12px; padding: 12px; text-align: center; }
  .stat-n { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; }
  .stat-l { font-size: 9px; color: #6B4F8B; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .canvas-wrap { width: 100%; display: flex; justify-content: center; margin-bottom: 0; }
  .btn-draw { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; transition: all 0.2s; margin: 12px 0; box-shadow: 0 4px 30px rgba(196,25,125,0.4); }
  .btn-draw:hover { transform: translateY(-2px); }
  .btn-draw:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  .winner-card { background: rgba(196,25,125,0.06); border: 2px solid rgba(196,25,125,0.4); border-radius: 18px; padding: 20px; text-align: center; margin-bottom: 10px; animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .winner-emoji { font-size: 36px; display: block; margin-bottom: 8px; }
  .winner-prize { font-size: 10px; color: #C4197D; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 4px; }
  .winner-wb { font-family: 'Space Grotesk',sans-serif; font-size: 26px; font-weight: 800; color: #fff; }
  .winner-name { font-size: 13px; color: #9CA3AF; margin-top: 3px; margin-bottom: 6px; }
  .winner-stamps { font-size: 11px; color: #6B4F8B; }
  .btn-confirm { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#10B981,#059669); color: #fff; margin-bottom: 8px; }
  .btn-ghost { width: 100%; padding: 11px; border-radius: 10px; font-size: 13px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); margin-bottom: 8px; }
  .winners-list { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 12px; padding: 12px; margin-bottom: 10px; }
  .wl-title { font-size: 10px; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px; }
  .wr { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(124,58,237,0.08); }
  .wr:last-child { border-bottom: none; }
  .wnum { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg,#C4197D,#7C3AED); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .wball { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .wtext { flex: 1; font-size: 11px; color: #E9D5FF; font-weight: 600; }
  .wsub { font-size: 9px; color: #6B4F8B; }
  .no-eligible { text-align: center; padding: 40px 20px; color: #6B4F8B; font-size: 14px; }
  .loading { text-align: center; padding: 40px; color: #6B4F8B; }
  .btn-clear { width: 100%; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(248,113,113,0.06); color: #F87171; border: 1px solid rgba(248,113,113,0.2); margin-top: 8px; }
`;

export default function Draw() {
  const [eligible, setEligible] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showWinnerCard, setShowWinnerCard] = useState(false);
  const [drawPhase, setDrawPhase] = useState("idle");
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const ballsRef = useRef([]);
  const clRef = useRef({ x: (RAIL_X1+RAIL_X2)/2, y: RAIL_Y, wireLen: 18, grip: 0, swingAngle: 0.5, swingDir: -1, tx: 0 });
  const phaseRef = useRef("idle");
  const winBallRef = useRef(null);
  const curWRef = useRef(null);
  const eligRef = useRef([]);
  const winnersCountRef = useRef(0);

  useEffect(() => {
    loadData();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: winnersData } = await supabase.from("winners").select("*").order("prize_number", { ascending: true });
    const { data: participantsData } = await supabase.from("participants").select("*").not("wristband_id", "is", null);
    const elig = (participantsData || []).filter(p => isEligible(p.stamps));
    const wonIds = (winnersData || []).map(w => w.staff_id);
    const eligRemaining = elig.filter(p => !wonIds.includes(p.staff_id));
    setEligible(elig);
    setWinners(winnersData || []);
    winnersCountRef.current = (winnersData || []).length;
    eligRef.current = eligRemaining;
    buildBalls(eligRemaining);
    setLoading(false);
  };

  const buildBalls = (eligList) => {
    const all = [];
    eligList.forEach((p, i) => all.push({ real: true, p, color: BALL_COLORS[i % BALL_COLORS.length] }));
    for (let i = 0; i < 16; i++) all.push({ real: false, color: EXTRA_COLORS[i % EXTRA_COLORS.length] });
    all.sort(() => Math.random() - 0.5);
    const balls = all.map(b => ({
      x: INNER_X + BR + 5 + Math.random() * (INNER_W - BR * 2 - 10),
      y: INNER_Y + BR + Math.random() * 20,
      vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2,
      color: b.color, p: b.real ? b.p : null,
      r: BR, grabbed: false, real: b.real, ox: 0, oy: 0,
    }));
    for (let step = 0; step < 500; step++) {
      balls.forEach(b => {
        b.vy += 0.5; b.x += b.vx; b.y += b.vy; b.vx *= 0.8; b.vy *= 0.8;
        if (b.x - b.r < INNER_X) { b.x = INNER_X + b.r; b.vx = Math.abs(b.vx) * 0.3; }
        if (b.x + b.r > INNER_X + INNER_W) { b.x = INNER_X + INNER_W - b.r; b.vx = -Math.abs(b.vx) * 0.3; }
        if (b.y - b.r < INNER_Y + 30) { b.y = INNER_Y + 30 + b.r; b.vy = Math.abs(b.vy) * 0.3; }
        if (b.y + b.r > FLOOR_Y) { b.y = FLOOR_Y - b.r; b.vy = -Math.abs(b.vy) * 0.3; }
      });
      for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], b = balls[j];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (d < a.r + b.r && d > 0) {
          const nx = dx / d, ny = dy / d, dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (dot > 0) { a.vx -= dot * nx * 0.4; a.vy -= dot * ny * 0.4; b.vx += dot * nx * 0.4; b.vy += dot * ny * 0.4; }
          const ov = (a.r + b.r - d) / 2;
          a.x -= ov * nx; a.y -= ov * ny; b.x += ov * nx; b.y += ov * ny;
        }
      }
    }
    balls.forEach(b => { b.ox = b.x; b.oy = b.y; b.vx = 0; b.vy = 0; });
    ballsRef.current = balls;
    clRef.current = { x: (RAIL_X1 + RAIL_X2) / 2, y: RAIL_Y, wireLen: 18, grip: 0, swingAngle: 0.5, swingDir: -1, tx: 0 };
  };

  useEffect(() => {
    if (!loading && canvasRef.current) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      startRender();
    }
  }, [loading]);

  const lighten = (h) => {
    const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
    return `rgb(${Math.min(255, r + 75)},${Math.min(255, g + 75)},${Math.min(255, b + 75)})`;
  };

  const drawBall = (ctx, b) => {
    ctx.save();
    if (b.grabbed) { ctx.shadowColor = b.color; ctx.shadowBlur = 30; }
    const g = ctx.createRadialGradient(b.x - b.r * .35, b.y - b.r * .4, b.r * .05, b.x, b.y, b.r);
    g.addColorStop(0, lighten(b.color)); g.addColorStop(1, b.color);
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    const s = ctx.createRadialGradient(b.x - b.r * .3, b.y - b.r * .35, 0, b.x, b.y, b.r * .55);
    s.addColorStop(0, "rgba(255,255,255,0.55)"); s.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = s; ctx.fill();
    if (b.real && b.p) {
      ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "bold 9px Inter"; ctx.fillText(b.p.wristband_id || "", b.x, b.y - 5.5);
      ctx.font = "6.5px Inter"; ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText((b.p.display_name || b.p.name || "").split(" ")[0], b.x, b.y + 6);
    }
    ctx.restore();
  };

  const drawArm = (ctx, px, py, dir, grip) => {
    const open = 1 - grip;
    const j1x = px + Math.sin(dir * 0.65 * open) * 28 * dir;
    const j1y = py + Math.cos(Math.abs(dir * 0.65 * open)) * 28;
    const loA = dir * (1.1 * open - 0.62);
    const tipX = j1x + Math.sin(loA) * 26;
    const tipY = j1y + Math.cos(Math.abs(loA)) * 26;
    ctx.strokeStyle = "rgba(215,175,255,1)"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(j1x, j1y); ctx.stroke();
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(j1x, j1y); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = "rgba(160,100,220,1)";
    ctx.beginPath(); ctx.arc(j1x, j1y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = grip > 0.5 ? "#C4197D" : "rgba(190,145,255,0.9)";
    ctx.shadowColor = grip > 0.5 ? "#C4197D" : "transparent"; ctx.shadowBlur = grip > 0.5 ? 16 : 0;
    ctx.beginPath(); ctx.arc(tipX, tipY, grip > 0.5 ? 11 : 8, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  };

  const drawClaw = (ctx, cl) => {
    const { x, y, wireLen, grip } = cl;
    const headY = y + wireLen;
    ctx.save();
    ctx.strokeStyle = "rgba(210,205,245,0.85)"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x, RAIL_Y); ctx.lineTo(x, headY); ctx.stroke();
    const hw = 52, hh = 26;
    const hg = ctx.createLinearGradient(x - hw / 2, headY, x + hw / 2, headY + hh);
    hg.addColorStop(0, "rgba(155,75,230,1)"); hg.addColorStop(1, "rgba(85,28,150,1)");
    ctx.fillStyle = hg; ctx.strokeStyle = "rgba(196,25,125,1)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(x - hw / 2, headY, hw, hh, 8); ctx.fill(); ctx.stroke();
    drawArm(ctx, x, headY + hh, -1, grip);
    drawArm(ctx, x, headY + hh, 1, grip);
    ctx.restore();
  };

  const drawRail = (ctx) => {
    ctx.save();
    ctx.strokeStyle = "rgba(196,25,125,0.9)"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(RAIL_X1, RAIL_Y); ctx.lineTo(RAIL_X2, RAIL_Y); ctx.stroke();
    for (let rx = RAIL_X1 + 20; rx < RAIL_X2 - 10; rx += 38) {
      ctx.fillStyle = "rgba(255,130,195,0.7)"; ctx.beginPath(); ctx.arc(rx, RAIL_Y, 5, 0, Math.PI * 2); ctx.fill();
    }
    [RAIL_X1, RAIL_X2].forEach(ex => {
      ctx.fillStyle = "rgba(110,38,180,0.9)"; ctx.strokeStyle = "rgba(196,25,125,0.9)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ex, RAIL_Y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.restore();
  };

  const drawMachine = (ctx) => {
    ctx.save();
    const cabG = ctx.createLinearGradient(MX, MY, MX + MW, MY + MH);
    cabG.addColorStop(0, "rgba(90,35,160,1)"); cabG.addColorStop(0.5, "rgba(55,18,110,1)"); cabG.addColorStop(1, "rgba(32,10,75,1)");
    ctx.fillStyle = cabG; ctx.strokeStyle = "rgba(196,25,125,0.85)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(MX, MY, MW, MH, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(196,25,125,0.95)";
    ctx.beginPath(); ctx.roundRect(MX + 8, MY + 6, MW - 16, 40, 9); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 14px 'Space Grotesk',sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("✦  MTR LUCKY DRAW  ✦", MX + MW / 2, MY + 26);
    ctx.fillStyle = "rgba(180,230,255,0.03)"; ctx.strokeStyle = "rgba(180,220,255,0.3)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(INNER_X, INNER_Y, INNER_W, INNER_H, 8); ctx.fill(); ctx.stroke();
    for (let dy = MY + 70; dy < MY + MH - 20; dy += 18) {
      ctx.fillStyle = "rgba(196,25,125,0.4)";
      ctx.beginPath(); ctx.arc(MX + 5, dy, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(MX + MW - 5, dy, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(70,18,120,0.9)"; ctx.strokeStyle = "rgba(196,25,125,0.5)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(MX, MY + MH, MW, 28, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,180,220,0.3)"; ctx.font = "11px Inter";
    ctx.textAlign = "center"; ctx.fillText("PRIZE TRAY", MX + MW / 2, MY + MH + 14);
    ctx.restore();
  };

  const updateClaw = () => {
    const cl = clRef.current;
    const wb = winBallRef.current;
    const p = phaseRef.current;

    if (p === "swinging") {
      cl.swingAngle += 0.032 * cl.swingDir;
      if (Math.abs(cl.swingAngle) > 0.55) cl.swingDir *= -1;
      const range = (RAIL_X2 - RAIL_X1) / 2;
      cl.x = RAIL_X1 + range + Math.sin(cl.swingAngle) * range;
    }
    if (p === "settling") {
      cl.swingAngle *= 0.88;
      const range = (RAIL_X2 - RAIL_X1) / 2;
      cl.x = RAIL_X1 + range + Math.sin(cl.swingAngle) * range;
      if (Math.abs(cl.swingAngle) < 0.04) { cl.x = cl.tx; phaseRef.current = "descending"; }
    }
    if (p === "descending") {
      cl.wireLen += 5;
      if (wb) {
        const tipY = RAIL_Y + cl.wireLen + 26 + 26;
        if (tipY >= wb.y && Math.abs(cl.x - wb.x) < 28) phaseRef.current = "closing";
      }
      if (cl.wireLen > INNER_H - 25) phaseRef.current = "closing";
    }
    if (p === "closing") {
      cl.grip = Math.min(1, cl.grip + 0.04);
      if (cl.grip >= 1) { if (wb) wb.grabbed = true; phaseRef.current = "lifting"; }
    }
    if (p === "lifting") {
      cl.wireLen -= 5;
      if (wb) { wb.x = cl.x; wb.y = RAIL_Y + cl.wireLen + 26 + BR + 4; }
      if (cl.wireLen <= 18) {
        cl.wireLen = 18; phaseRef.current = "holding";
        setTimeout(() => {
          setCurrentWinner({ ...curWRef.current });
          setShowWinnerCard(true);
          setDrawPhase("holding");
        }, 400);
      }
    }
  };

  const startRender = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      ctx.clearRect(0, 0, CW, CH);
      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, "#100525"); bg.addColorStop(1, "#060215");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);

      drawMachine(ctx);

      ctx.save();
      ctx.beginPath(); ctx.rect(INNER_X + 2, INNER_Y + 2, INNER_W - 4, INNER_H - 4); ctx.clip();
      updateClaw();
      ballsRef.current.filter(b => !b.grabbed).forEach(b => drawBall(ctx, b));
      drawRail(ctx);
      drawClaw(ctx, clRef.current);
      ballsRef.current.filter(b => b.grabbed).forEach(b => drawBall(ctx, b));
      ctx.restore();

      ctx.save();
      ctx.beginPath(); ctx.roundRect(INNER_X, INNER_Y, INNER_W, INNER_H, 8); ctx.clip();
      const rg = ctx.createLinearGradient(INNER_X, INNER_Y, INNER_X + 50, INNER_Y + INNER_H);
      rg.addColorStop(0, "rgba(255,255,255,0.07)"); rg.addColorStop(0.4, "rgba(255,255,255,0)");
      ctx.fillStyle = rg; ctx.fillRect(INNER_X, INNER_Y, INNER_W, INNER_H);
      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const handleDraw = () => {
    if (phaseRef.current !== "idle" || eligRef.current.length === 0) return;
    setShowWinnerCard(false);
    setCurrentWinner(null);
    setDrawPhase("drawing");
    const pool = [];
    eligRef.current.forEach(p => { for (let i = 0; i < p.stamps.length; i++) pool.push(p); });
    const winner = pool[Math.floor(Math.random() * pool.length)];
    curWRef.current = winner;
    const wb = ballsRef.current.find(b => b.real && b.p && b.p.staff_id === winner.staff_id);
    winBallRef.current = wb;
    const cl = clRef.current;
    cl.tx = wb ? wb.x : (RAIL_X1 + RAIL_X2) / 2;
    cl.grip = 0; cl.wireLen = 18; cl.swingAngle = 0.55; cl.swingDir = -1;
    phaseRef.current = "swinging";
    setTimeout(() => { phaseRef.current = "settling"; }, 2500);
  };

  const handleConfirm = async () => {
    const winner = curWRef.current;
    if (!winner) return;
    await supabase.from("winners").insert({ staff_id: winner.staff_id, prize_number: winnersCountRef.current + 1 });
    if (winBallRef.current) ballsRef.current = ballsRef.current.filter(b => b !== winBallRef.current);
    eligRef.current = eligRef.current.filter(p => p.staff_id !== winner.staff_id);
    winBallRef.current = null; curWRef.current = null;
    clRef.current = { x: (RAIL_X1 + RAIL_X2) / 2, y: RAIL_Y, wireLen: 18, grip: 0, swingAngle: 0.5, swingDir: -1, tx: 0 };
    phaseRef.current = "idle";
    setShowWinnerCard(false); setCurrentWinner(null); setDrawPhase("idle");
    await loadData();
  };

  const handleRedraw = () => {
    const wb = winBallRef.current;
    if (wb) { wb.grabbed = false; wb.x = wb.ox; wb.y = wb.oy; }
    winBallRef.current = null; curWRef.current = null;
    clRef.current = { x: (RAIL_X1 + RAIL_X2) / 2, y: RAIL_Y, wireLen: 18, grip: 0, swingAngle: 0.5, swingDir: -1, tx: 0 };
    phaseRef.current = "idle";
    setShowWinnerCard(false); setCurrentWinner(null); setDrawPhase("idle");
  };

  const clearWinners = async () => {
    if (!window.confirm("Clear all winners?")) return;
    await supabase.from("winners").delete().gte("id", 0);
    await loadData();
  };

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="app">
        <button className="back-btn" onClick={() => navigate("/admin")}>←</button>
        <h2 className="title">🎰 Lucky Ball Draw</h2>
        <p className="subtitle">MTR Innovation Passport Challenge</p>

        <div className="stats-row">
          <div className="stat"><div className="stat-n" style={{ color: "#fff" }}>{eligible.length}</div><div className="stat-l">Eligible</div></div>
          <div className="stat"><div className="stat-n" style={{ color: "#C4197D" }}>{winners.length}</div><div className="stat-l">Winners</div></div>
          <div className="stat"><div className="stat-n" style={{ color: "#F59E0B" }}>{eligRef.current.length}</div><div className="stat-l">Remaining</div></div>
        </div>

        {loading ? (
          <div className="loading">Setting up lucky draw...</div>
        ) : eligible.length === 0 ? (
          <div className="no-eligible">No eligible participants yet.</div>
        ) : (
          <>
            <div className="canvas-wrap">
              <canvas ref={canvasRef} width={CW} height={CH} style={{ maxWidth: "100%" }} />
            </div>

            {showWinnerCard && currentWinner && (
              <>
                <div className="winner-card">
                  <span className="winner-emoji">🎉</span>
                  <div className="winner-prize">Prize {winners.length + 1} Winner!</div>
                  <div className="winner-wb">{currentWinner.wristband_id}</div>
                  <div className="winner-name">{currentWinner.display_name || currentWinner.name}</div>
                  <div className="winner-stamps">🎖️ {currentWinner.stamps.length} stamps collected</div>
                </div>
                <button className="btn-confirm" onClick={handleConfirm}>✓ Confirm Winner & Draw Next</button>
                <button className="btn-ghost" onClick={handleRedraw}>↩ Put back & Redraw</button>
              </>
            )}

            {!showWinnerCard && (
              <button className="btn-draw" onClick={handleDraw} disabled={drawPhase !== "idle"}>
                {drawPhase === "drawing" ? "Drawing..." : "🎰 Draw a Winner!"}
              </button>
            )}

            {winners.length > 0 && (
              <>
                <div className="winners-list">
                  <div className="wl-title">🏆 Winners</div>
                  {winners.map((w, i) => (
                    <div key={i} className="wr">
                      <div className="wnum">{i + 1}</div>
                      <div className="wball" style={{ background: BALL_COLORS[i % BALL_COLORS.length] }}>
                        {(w.wristband_id || w.staff_id || "").slice(0, 3)}
                      </div>
                      <div>
                        <div className="wtext">{w.wristband_id || w.staff_id}</div>
                        <div className="wsub">Prize {i + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-clear" onClick={clearWinners}>🗑️ Clear All Winners</button>
              </>
            )}
          </>
        )}
        <button className="btn-ghost" style={{ marginTop: 8 }} onClick={() => navigate("/admin")}>← Back to Dashboard</button>
      </div>
    </>
  );
}
