import { useState, useRef, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const DOMAINS = [
  {
    id: "edu", name: "Education", icon: "🎓",
    color: "#A78BFA", colorBg: "rgba(167,139,250,0.1)", colorBorder: "rgba(167,139,250,0.3)",
    techs: [
      { id: "edu-1", name: "Mi-KidzAlert", use: "Smart Attendance & Child Safety" },
      { id: "edu-2", name: "Mi-BehavIQ", use: "AI Behaviour Monitoring" },
      { id: "edu-3", name: "Mi-ITS", use: "Real-Time Indoor Tracking" },
      { id: "edu-4", name: "Mi-Graphink", use: "Conductive STEM Learning Tools" },
      { id: "edu-5", name: "Mi-Nexa", use: "Smart Campus Connectivity" },
    ],
  },
  {
    id: "mfg", name: "Smart Manufacturing", icon: "🏭",
    color: "#F59E0B", colorBg: "rgba(245,158,11,0.1)", colorBorder: "rgba(245,158,11,0.3)",
    techs: [
      { id: "mfg-1", name: "Mi-TEMS", use: "Predictive Equipment Monitoring" },
      { id: "mfg-2", name: "Mi-VisionAOI", use: "AI Quality Inspection" },
      { id: "mfg-3", name: "Mi-ITS", use: "Industrial IoT Integration" },
      { id: "mfg-4", name: "Mi-IndusData++", use: "Synthetic Data Generation" },
      { id: "mfg-5", name: "Mi-GraphInk", use: "Smart Sensor Design" },
    ],
  },
  {
    id: "bld", name: "Smart Building", icon: "🏢",
    color: "#10B981", colorBg: "rgba(16,185,129,0.1)", colorBorder: "rgba(16,185,129,0.3)",
    techs: [
      { id: "bld-1", name: "Mi-ACE", use: "Intelligent Chiller Optimisation" },
      { id: "bld-2", name: "AIREM", use: "Smart Energy Monitoring" },
      { id: "bld-3", name: "Mi-Suria", use: "Solar Asset Monitoring" },
      { id: "bld-4", name: "Mi-ITS", use: "Smart Building Automation" },
      { id: "bld-5", name: "Mi-FaceIQ", use: "Intelligent Access Control" },
      { id: "bld-6", name: "Mi-BehavIQ", use: "Occupancy Behaviour Analytics" },
      { id: "bld-7", name: "Mi-PlateIQ", use: "Smart Vehicle Access Control" },
    ],
  },
  {
    id: "city", name: "Smart City", icon: "🏙️",
    color: "#38BDF8", colorBg: "rgba(56,189,248,0.1)", colorBorder: "rgba(56,189,248,0.3)",
    techs: [
      { id: "city-1", name: "Mi-NEXA", use: "Smart City IoT Connectivity" },
      { id: "city-2", name: "Mi-PlateIQ", use: "Intelligent Vehicle Recognition" },
      { id: "city-3", name: "Mi-Percept", use: "AI Environment Perception" },
      { id: "city-4", name: "Mi-FaceIQ", use: "AI Identity Verification" },
      { id: "city-5", name: "Mi-Lumens", use: "Smart Streetlight Management" },
      { id: "city-6", name: "Mi-Safety", use: "AI Public Safety Monitoring" },
      { id: "city-7", name: "IDFOS", use: "Intelligent Infrastructure Monitoring" },
    ],
  },
  {
    id: "ind", name: "Industry Support & Services", icon: "⚙️",
    color: "#C4197D", colorBg: "rgba(196,25,125,0.1)", colorBorder: "rgba(196,25,125,0.3)",
    techs: [
      { id: "ind-1", name: "ITIC", use: "Technology Innovation Centre" },
      { id: "ind-2", name: "FAB", use: "Semiconductor Fabrication Services" },
      { id: "ind-3", name: "DDTM", use: "Digital Manufacturing Enablement" },
      { id: "ind-4", name: "I4DAP", use: "Industry 4.0 Transformation" },
      { id: "ind-5", name: "REL Lab", use: "Reliability Testing Services" },
    ],
  },
  {
    id: "agri", name: "Smart Agriculture", icon: "🌾",
    color: "#84CC16", colorBg: "rgba(132,204,22,0.1)", colorBorder: "rgba(132,204,22,0.3)",
    techs: [
      { id: "agri-1", name: "INSPECTRA", use: "Palm Oil Quality Monitoring" },
      { id: "agri-2", name: "UGV", use: "Autonomous Plantation Operations" },
      { id: "agri-3", name: "Mi-Percept", use: "Precision Plantation Mapping" },
      { id: "agri-4", name: "Mi-SWIS", use: "Smart Weighbridge Monitoring" },
      { id: "agri-5", name: "Mi-FFB Grader", use: "AI FFB Grading" },
      { id: "agri-6", name: "Mi-VGuard", use: "Smart Plantation Surveillance" },
    ],
  },
  {
    id: "health", name: "Healthcare", icon: "❤️",
    color: "#F43F5E", colorBg: "rgba(244,63,94,0.1)", colorBorder: "rgba(244,63,94,0.3)",
    techs: [
      { id: "health-1", name: "REVA", use: "Non-Invasive Health Screening" },
      { id: "health-2", name: "Bioscan", use: "AI Saliva Diagnostics" },
      { id: "health-3", name: "AINS", use: "AI Spectroscopy Analytics" },
    ],
  },
];

const TOTAL = 38;
function isEligible(stamps) {
  return DOMAINS.every(d => d.techs.some(t => stamps.includes(t.id)));
}

// Mock participants
const MOCK_PARTICIPANTS = [
  { id: "10001", name: "Alice Wong", stamps: ["edu-1","edu-3","mfg-1","mfg-2","bld-1","city-1","ind-1","agri-1","health-1","city-2","edu-2"] },
  { id: "10002", name: "Brian Lim", stamps: ["edu-1","mfg-1","bld-2","city-3","ind-2","agri-2","health-2"] },
  { id: "10003", name: "Carol Tan", stamps: ["edu-2","mfg-3","bld-1","city-1","ind-1","agri-1","health-1"] },
  { id: "10004", name: "David Ho", stamps: ["edu-1","mfg-1","bld-1","city-1","ind-1"] },
  { id: "10005", name: "Eva Chong", stamps: ["edu-1","edu-2","mfg-1","mfg-2","bld-1","city-1","ind-1","agri-1","health-1","city-2","agri-2","health-2","bld-2","edu-3"] },
];

// ─── SPIN WHEEL ──────────────────────────────────────────────────────────────
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
    ctx.strokeStyle = "#1A0D2E";
    ctx.lineWidth = 3;
    ctx.stroke();
    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#0A0612";
    ctx.fill();
    ctx.strokeStyle = "#C4197D";
    ctx.lineWidth = 2;
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

  if (n === 0) return <p style={{ color: "#6B7280", textAlign: "center", padding: 40 }}>No eligible participants yet.</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 300, height: 300, margin: "0 auto 24px" }}>
        {/* Pointer */}
        <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "28px solid #C4197D", filter: "drop-shadow(0 0 8px rgba(196,25,125,0.8))" }} />
        </div>
        <canvas ref={canvasRef} width={300} height={300} style={{ borderRadius: "50%", boxShadow: "0 0 60px rgba(196,25,125,0.3), 0 0 120px rgba(124,58,237,0.2)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 18 }}>🎲</div>
      </div>
      <button onClick={spin} disabled={spinning} style={{ background: spinning ? "#1A0D2E" : "linear-gradient(135deg,#C4197D,#7C3AED)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: spinning ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", boxShadow: spinning ? "none" : "0 0 30px rgba(196,25,125,0.4)", transition: "all 0.3s", letterSpacing: "0.5px" }}>
        {spinning ? "Spinning…" : "🎰 Spin the Wheel"}
      </button>
    </div>
  );
}

// ─── MIMOS ARCH SVG ──────────────────────────────────────────────────────────
function MimosArches({ size = 120, opacity = 0.15 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" fill="none" style={{ opacity }}>
      <path d="M10 85 Q10 20 60 20 Q110 20 110 85" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M25 85 Q25 35 60 35 Q95 35 95 85" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M40 85 Q40 48 60 48 Q80 48 80 85" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ─── DOT GRID BACKGROUND ─────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#C4197D" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; position: relative; z-index: 1; }

  /* Glow effects */
  .glow-pink { box-shadow: 0 0 30px rgba(196,25,125,0.25); }
  .glow-purple { box-shadow: 0 0 30px rgba(124,58,237,0.25); }

  /* Header */
  .hdr {
    background: rgba(10,6,18,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(196,25,125,0.2);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    position: sticky; top: 0; z-index: 20;
  }
  .hdr-logo {
    background: #C4197D;
    color: #fff; font-family: 'Space Grotesk', sans-serif;
    font-weight: 800; font-size: 13px; padding: 5px 10px;
    border-radius: 6px; letter-spacing: 1px; flex-shrink: 0;
  }
  .hdr-title { font-size: 13px; font-weight: 600; color: #F3E8FF; }
  .hdr-sub { font-size: 11px; color: #7C3AED; margin-top: 1px; }
  .hdr-badge {
    background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3);
    padding: 5px 10px; border-radius: 8px; font-size: 13px;
    font-weight: 700; color: #F9A8D4; flex-shrink: 0;
    font-family: 'Space Grotesk', sans-serif;
  }

  /* Page */
  .page { padding: 24px 20px; }

  /* Landing */
  .land-hero { text-align: center; padding: 48px 0 36px; position: relative; }
  .land-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3);
    color: #F9A8D4; font-size: 11px; font-weight: 600;
    padding: 5px 14px; border-radius: 100px; margin-bottom: 24px;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .land-h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 34px; font-weight: 800; color: #fff;
    line-height: 1.1; margin-bottom: 12px;
    background: linear-gradient(135deg, #fff 0%, #E9D5FF 50%, #C4197D 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .land-sub { font-size: 14px; color: #9CA3AF; line-height: 1.7; margin-bottom: 32px; }
  .arches-wrap { margin: 0 auto 8px; opacity: 0.2; }

  /* Card */
  .card {
    background: rgba(26,13,46,0.8);
    border: 1px solid rgba(196,25,125,0.2);
    border-radius: 20px; padding: 28px;
    backdrop-filter: blur(8px);
  }
  .flabel { font-size: 11px; font-weight: 600; color: #7C3AED; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .finput {
    width: 100%; background: rgba(10,6,18,0.6);
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 12px; padding: 14px 16px; font-size: 15px;
    color: #F3E8FF; font-family: 'Inter', sans-serif; outline: none;
    transition: all 0.2s; margin-bottom: 16px;
  }
  .finput:focus { border-color: #C4197D; box-shadow: 0 0 0 3px rgba(196,25,125,0.1); }
  .finput::placeholder { color: #4B3B6B; }

  /* Buttons */
  .btn { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; border: none; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-primary { background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; box-shadow: 0 4px 20px rgba(196,25,125,0.4); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(196,25,125,0.5); }
  .btn-ghost { background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); margin-top: 10px; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
  .btn-green { background: linear-gradient(135deg,#10B981,#059669); color: #fff; box-shadow: 0 4px 20px rgba(16,185,129,0.3); }

  /* Progress card */
  .progress-card {
    background: linear-gradient(135deg, rgba(26,13,46,0.9) 0%, rgba(124,58,237,0.1) 100%);
    border: 1px solid rgba(196,25,125,0.25);
    border-radius: 20px; padding: 22px; margin-bottom: 20px;
    position: relative; overflow: hidden;
  }
  .progress-card::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, rgba(196,25,125,0.15) 0%, transparent 70%);
  }
  .prog-num { font-family: 'Space Grotesk', sans-serif; font-size: 40px; font-weight: 800; color: #fff; line-height: 1; }
  .prog-num span { font-size: 20px; color: #6B4F8B; }
  .prog-entries-num { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 800; color: #C4197D; line-height: 1; }
  .bar-bg { height: 5px; background: rgba(124,58,237,0.2); border-radius: 100px; overflow: hidden; margin-top: 16px; }
  .bar-fill { height: 100%; background: linear-gradient(90deg,#C4197D,#7C3AED,#A78BFA); border-radius: 100px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .elig-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 100px; margin-top: 8px; }
  .elig-yes { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10B981; }
  .elig-no { background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.2); color: #7C3AED; }

  /* Domain cards */
  .domain-card {
    background: rgba(26,13,46,0.7);
    border: 1px solid rgba(124,58,237,0.15);
    border-radius: 16px; margin-bottom: 10px; overflow: hidden;
    transition: all 0.2s; cursor: pointer; backdrop-filter: blur(4px);
  }
  .domain-card:hover { border-color: rgba(196,25,125,0.3); }
  .domain-card.open { border-color: rgba(196,25,125,0.4); }
  .domain-hdr { display: flex; align-items: center; gap: 12px; padding: 16px; }
  .domain-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .domain-name { font-size: 14px; font-weight: 600; color: #F3E8FF; }
  .domain-prog { font-size: 11px; margin-top: 2px; }
  .stamp-dots { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; }
  .stamp-dot { width: 6px; height: 6px; border-radius: 50%; transition: background 0.3s; }
  .domain-chevron { color: #4B3B6B; font-size: 11px; transition: transform 0.2s; margin-left: auto; flex-shrink: 0; }
  .domain-card.open .domain-chevron { transform: rotate(180deg); }

  /* Tech rows */
  .tech-list { border-top: 1px solid rgba(124,58,237,0.1); padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
  .tech-row { display: flex; align-items: center; gap: 12px; background: rgba(10,6,18,0.5); border: 1px solid rgba(124,58,237,0.12); border-radius: 12px; padding: 12px 14px; transition: all 0.15s; }
  .tech-row.done { border-color: rgba(16,185,129,0.25); background: rgba(16,185,129,0.05); }
  .tech-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .tech-icon.done { background: rgba(16,185,129,0.15); }
  .tech-icon.empty { background: rgba(124,58,237,0.1); }
  .tech-name { font-size: 13px; font-weight: 600; color: #F3E8FF; }
  .tech-use { font-size: 11px; color: #6B4F8B; margin-top: 1px; }

  /* FAB */
  .fab {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg,#C4197D,#7C3AED);
    color: #fff; border: none; border-radius: 100px;
    padding: 16px 36px; font-size: 15px; font-weight: 700;
    font-family: 'Inter', sans-serif; cursor: pointer;
    box-shadow: 0 8px 40px rgba(196,25,125,0.5), 0 0 0 1px rgba(196,25,125,0.3);
    white-space: nowrap; transition: all 0.2s; z-index: 10;
    letter-spacing: 0.3px;
  }
  .fab:hover { transform: translateX(-50%) translateY(-3px); box-shadow: 0 12px 50px rgba(196,25,125,0.6); }
  .spacer { height: 100px; }

  /* Modal */
  .overlay { position: fixed; inset: 0; background: rgba(5,3,10,0.85); backdrop-filter: blur(8px); z-index: 50; display: flex; align-items: flex-end; justify-content: center; }
  .modal {
    background: linear-gradient(180deg, #120820 0%, #0A0612 100%);
    border: 1px solid rgba(196,25,125,0.25);
    border-radius: 28px 28px 0 0; padding: 28px 20px 48px;
    width: 100%; max-width: 480px;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
    max-height: 90vh; overflow-y: auto;
  }
  @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-handle { width: 40px; height: 4px; background: rgba(196,25,125,0.3); border-radius: 100px; margin: 0 auto 24px; }
  .modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .modal-sub { font-size: 13px; color: #6B4F8B; margin-bottom: 24px; }

  /* QR scanner */
  .qr-frame { background: rgba(10,6,18,0.8); border: 1px solid rgba(196,25,125,0.2); border-radius: 20px; padding: 48px 20px; text-align: center; margin-bottom: 20px; position: relative; overflow: hidden; }
  .qr-scanline { position: absolute; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, #C4197D, transparent); animation: scan 2s ease-in-out infinite; }
  @keyframes scan { 0%,100% { top: 15%; } 50% { top: 85%; } }
  .qr-corners::before, .qr-corners::after { content: ''; position: absolute; width: 28px; height: 28px; border-color: #C4197D; border-style: solid; }
  .qr-corners::before { top: 14px; left: 14px; border-width: 3px 0 0 3px; border-radius: 6px 0 0 0; }
  .qr-corners::after { bottom: 14px; right: 14px; border-width: 0 3px 3px 0; border-radius: 0 0 6px 0; }

  /* Stamp success */
  .stamp-success { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 20px; padding: 28px; text-align: center; margin-bottom: 20px; }
  .stamp-emoji { font-size: 56px; display: block; margin-bottom: 14px; animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from { transform: scale(0) rotate(-20deg); } to { transform: scale(1) rotate(0); } }
  .stamp-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 800; color: #10B981; margin-bottom: 6px; }
  .stamp-sub { font-size: 13px; color: #6B7280; line-height: 1.5; }
  .entry-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3); color: #F9A8D4; font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 100px; margin-top: 14px; }

  /* Complete */
  .complete-hero { text-align: center; padding: 48px 0 32px; }
  .complete-medal { font-size: 80px; display: block; animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1); margin-bottom: 20px; }
  .complete-h { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 800; background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
  .complete-sub { font-size: 14px; color: #6B7280; line-height: 1.7; }
  .entries-hero { background: rgba(196,25,125,0.08); border: 1px solid rgba(196,25,125,0.25); border-radius: 20px; padding: 24px; text-align: center; margin: 20px 0; }
  .entries-num { font-family: 'Space Grotesk', sans-serif; font-size: 56px; font-weight: 800; color: #C4197D; line-height: 1; }
  .entries-lbl { font-size: 13px; color: #6B4F8B; margin-top: 6px; }

  /* Admin */
  .admin-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 16px; padding: 18px 12px; text-align: center; }
  .stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 800; }
  .stat-lbl { font-size: 11px; color: #6B4F8B; margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .table-wrap { background: rgba(26,13,46,0.7); border: 1px solid rgba(124,58,237,0.15); border-radius: 18px; overflow: hidden; margin-bottom: 20px; }
  .t-head { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr; padding: 12px 16px; border-bottom: 1px solid rgba(124,58,237,0.1); font-size: 10px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 0.5px; }
  .t-row { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr; padding: 12px 16px; border-bottom: 1px solid rgba(10,6,18,0.5); font-size: 12px; align-items: center; }
  .t-row:last-child { border-bottom: none; }
  .pill { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 600; }
  .pill-g { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: #10B981; }
  .pill-p { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); color: #A78BFA; }

  /* Winner */
  .winner-card { background: rgba(196,25,125,0.06); border: 2px solid rgba(196,25,125,0.35); border-radius: 24px; padding: 32px; text-align: center; margin-top: 28px; animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .winner-name { font-family: 'Space Grotesk', sans-serif; font-size: 34px; font-weight: 800; color: #fff; margin: 14px 0 6px; }
  .winner-id { font-size: 14px; color: #6B4F8B; }
  .winner-entries { font-size: 13px; color: #C4197D; margin-top: 10px; font-weight: 600; }

  /* Sim grid */
  .sim-label { font-size: 10px; color: #4B3B6B; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; font-weight: 600; }
  .sim-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
  .sim-btn { background: rgba(10,6,18,0.6); border: 1px solid rgba(124,58,237,0.15); border-radius: 10px; padding: 10px 6px; font-size: 11px; font-weight: 600; color: #9CA3AF; cursor: pointer; text-align: center; font-family: 'Inter', sans-serif; transition: all 0.15s; line-height: 1.4; }
  .sim-btn:hover { border-color: rgba(196,25,125,0.4); color: #F9A8D4; }
  .sim-btn.used { opacity: 0.25; cursor: not-allowed; pointer-events: none; }

  /* Toast */
  .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#10B981,#059669); color: #fff; padding: 13px 28px; border-radius: 100px; font-size: 13px; font-weight: 600; z-index: 100; white-space: nowrap; animation: fadeUp 0.3s ease; pointer-events: none; box-shadow: 0 4px 20px rgba(16,185,129,0.4); }
  @keyframes fadeUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
  .divider { height: 1px; background: rgba(124,58,237,0.12); margin: 18px 0; }
`;

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [staffId, setStaffId] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [stamps, setStamps] = useState([]);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [pendingStamp, setPendingStamp] = useState(null);
  const [toast, setToast] = useState(null);
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [winner, setWinner] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const eligible = isEligible(stamps);

  const handleStart = () => {
    if (!staffId.trim()) return;
    if (staffId.trim().toUpperCase() === "ADMIN") { setView("admin"); return; }
    const existing = participants.find(p => p.id === staffId.trim());
    if (existing) setStamps(existing.stamps);
    else setStamps([]);
    setView("passport");
  };

  const handleScanTech = (tech, domain) => {
    if (stamps.includes(tech.id)) { showToast("Already stamped!"); return; }
    setPendingStamp({ tech, domain });
    setView("stamped");
  };

  const handleCollect = () => {
    const newStamps = [...stamps, pendingStamp.tech.id];
    setStamps(newStamps);
    setParticipants(prev => {
      const exists = prev.find(p => p.id === staffId);
      if (exists) return prev.map(p => p.id === staffId ? { ...p, stamps: newStamps } : p);
      return [...prev, { id: staffId, name: nameInput || "Guest", stamps: newStamps }];
    });
    if (isEligible(newStamps) && !eligible) { setView("complete"); }
    else { showToast(`✅ ${pendingStamp.tech.name} stamped!`); setView("passport"); }
  };

  const luckyEntries = participants
    .filter(p => isEligible(p.stamps))
    .flatMap(p => Array(p.stamps.length).fill({ id: p.id, name: p.id, entries: p.stamps.length }));

  return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="app">

        {/* Header */}
        {view !== "landing" && (
          <div className="hdr">
            <div className="hdr-logo">MIMOS</div>
            <div style={{ flex: 1 }}>
              <div className="hdr-title">MTR Innovation Passport Challenge</div>
              <div className="hdr-sub">
                {view === "admin" || view === "draw" ? "Admin Dashboard" : `Staff ID: ${staffId}`}
              </div>
            </div>
            {view !== "admin" && view !== "draw" && (
              <div className="hdr-badge">{stamps.length} / {TOTAL} 🎖️</div>
            )}
          </div>
        )}

        {/* ── LANDING ── */}
        {view === "landing" && (
          <div className="page">
            <div className="land-hero">
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <MimosArches size={100} opacity={0.35} />
              </div>
              <div className="land-eyebrow">✦ MTR Innovation Passport Challenge</div>
              <h1 className="land-h1">MTR Innovation<br />Passport Challenge</h1>
              <p className="land-sub">Your mission: explore every domain, stamp your passport, and claim your spot in the Lucky Draw.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                {DOMAINS.map(d => (
                  <div key={d.id} style={{ width: 36, height: 36, borderRadius: 10, background: d.colorBg, border: `1px solid ${d.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{d.icon}</div>
                ))}
              </div>
            </div>

            <div className="card">
              <label className="flabel">Staff ID</label>
              <input className="finput" placeholder="Enter your staff ID" value={staffId} onChange={e => setStaffId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleStart()} />
              <label className="flabel">Your Name (optional)</label>
              <input className="finput" placeholder="e.g. Ahmad Razif" value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleStart()} />
              <button className="btn btn-primary" onClick={handleStart}>Begin My Journey →</button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#4B3B6B", marginTop: 14 }}>
                Admin access: enter <strong style={{ color: "#7C3AED" }}>ADMIN</strong> as Staff ID
              </p>
            </div>
          </div>
        )}

        {/* ── PASSPORT ── */}
        {view === "passport" && (
          <div className="page">
            <div className="progress-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="section-title">Stamps Collected</div>
                  <div className="prog-num">{stamps.length}<span> / {TOTAL}</span></div>
                  <div className={`elig-badge ${eligible ? "elig-yes" : "elig-no"}`}>
                    {eligible ? "✓ Eligible for Lucky Draw" : "Visit all 7 domains to qualify"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="section-title">Lucky Draw</div>
                  <div className="prog-entries-num">{stamps.length}</div>
                  <div style={{ fontSize: 11, color: "#6B4F8B", marginTop: 4 }}>entries</div>
                </div>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${(stamps.length / TOTAL) * 100}%` }} />
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
                    <div className="domain-chevron">▼</div>
                  </div>
                  {isOpen && (
                    <div className="tech-list">
                      {domain.techs.map(tech => {
                        const done = stamps.includes(tech.id);
                        return (
                          <div key={tech.id} className={`tech-row ${done ? "done" : ""}`}>
                            <div className={`tech-icon ${done ? "done" : "empty"}`}>
                              {done ? "✅" : "⬜"}
                            </div>
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
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => { setStamps([]); setView("landing"); }}>← Logout</button>
            </div>
            <div className="spacer" />
            <button className="fab" onClick={() => setView("scan")}>📷 &nbsp;Scan Booth QR</button>
          </div>
        )}

        {/* ── SCAN ── */}
        {view === "scan" && (
          <div className="overlay" onClick={() => setView("passport")}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-title">Scan Booth QR</div>
              <div className="modal-sub">Complete the booth challenge, then scan the QR your presenter shows.</div>
              <div className="qr-frame">
                <div className="qr-corners" />
                <div className="qr-scanline" />
                <div style={{ fontSize: 48, marginBottom: 10 }}>📷</div>
                <div style={{ fontSize: 13, color: "#4B3B6B" }}>Camera is active — align QR within frame</div>
              </div>
              <div className="divider" />
              <div className="sim-label">— Prototype: tap a booth to simulate scanning —</div>
              <div className="sim-grid">
                {DOMAINS.map(domain => domain.techs.map(tech => (
                  <button key={tech.id} className={`sim-btn ${stamps.includes(tech.id) ? "used" : ""}`} onClick={() => handleScanTech(tech, domain)}>
                    {domain.icon} {tech.name}
                    <div style={{ fontSize: 9, color: "#4B3B6B", marginTop: 2 }}>{domain.name.split(" ")[0]}</div>
                  </button>
                )))}
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-ghost" onClick={() => setView("passport")}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STAMPED ── */}
        {view === "stamped" && pendingStamp && (
          <div className="overlay">
            <div className="modal">
              <div className="modal-handle" />
              <div className="stamp-success">
                <span className="stamp-emoji">🎖️</span>
                <div className="stamp-title">Stamp Collected!</div>
                <div className="stamp-sub">
                  <strong style={{ color: "#F3E8FF" }}>{pendingStamp.tech.name}</strong><br />
                  {pendingStamp.tech.use}
                </div>
                <div className="entry-badge">🎰 +1 Lucky Draw Entry · {stamps.length + 1} total {stamps.length + 1 === 1 ? "entry" : "entries"}</div>
              </div>
              {!isEligible([...stamps, pendingStamp.tech.id]) && (
                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#6B4F8B", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Domains still needed</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {DOMAINS.filter(d => !d.techs.some(t => [...stamps, pendingStamp.tech.id].includes(t.id))).map(d => (
                      <span key={d.id} style={{ background: d.colorBg, border: `1px solid ${d.colorBorder}`, color: d.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>
                        {d.icon} {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {isEligible([...stamps, pendingStamp.tech.id]) && (
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: 14, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ color: "#10B981", fontWeight: 700, fontSize: 14 }}>🎉 You are now eligible for the Lucky Draw!</div>
                </div>
              )}
              <button className="btn btn-green" onClick={handleCollect}>Collect Stamp →</button>
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {view === "complete" && (
          <div className="page">
            <div className="complete-hero">
              <MimosArches size={80} opacity={0.2} />
              <span className="complete-medal">🏆</span>
              <h2 className="complete-h">All Domains Visited!</h2>
              <p className="complete-sub">You've earned your place in the Lucky Draw.<br />Keep collecting for more chances to win!</p>
            </div>
            <div className="entries-hero">
              <div className="entries-num">{stamps.length}</div>
              <div className="entries-lbl">Lucky Draw {stamps.length === 1 ? "Entry" : "Entries"}</div>
            </div>
            <button className="btn btn-primary" onClick={() => setView("passport")}>Keep Collecting →</button>
          </div>
        )}

        {/* ── ADMIN ── */}
        {view === "admin" && (
          <div className="page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ display: "inline-block", background: "#C4197D", color: "#fff", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 12, padding: "4px 10px", borderRadius: 6, marginBottom: 10, letterSpacing: 1 }}>MIMOS</div>
                <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>Admin Dashboard</h2>
                <p style={{ fontSize: 13, color: "#6B4F8B", marginTop: 4 }}>MTR Innovation Passport Challenge · Live</p>
              </div>
              <button onClick={() => setView("landing")} style={{ background: "rgba(26,13,46,0.7)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#9CA3AF", cursor: "pointer" }}>Logout</button>
            </div>

            <div className="admin-stats">
              {[
                { num: participants.length, label: "Registered", color: "#fff" },
                { num: participants.filter(p => isEligible(p.stamps)).length, label: "Eligible", color: "#10B981" },
                { num: participants.filter(p => isEligible(p.stamps)).reduce((s, p) => s + p.stamps.length, 0), label: "Total Entries", color: "#C4197D" },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={() => setView("draw")} style={{ marginBottom: 16 }}>🎰 Open Lucky Draw</button>

            <div className="section-title">Participants</div>
            <div className="table-wrap">
              <div className="t-head"><div>ID</div><div>Name</div><div>Stamps</div><div>Entries</div><div>Status</div></div>
              {participants.map(p => {
                const elig = isEligible(p.stamps);
                return (
                  <div key={p.id} className="t-row">
                    <div style={{ color: "#6B4F8B", fontSize: 11 }}>{p.id}</div>
                    <div style={{ fontWeight: 500, color: "#E9D5FF" }}>{p.name || "—"}</div>
                    <div style={{ color: elig ? "#10B981" : "#E9D5FF" }}>{p.stamps.length}/{TOTAL}</div>
                    <div style={{ color: "#C4197D", fontWeight: 600 }}>{elig ? p.stamps.length : 0}</div>
                    <div><span className={`pill ${elig ? "pill-g" : "pill-p"}`}>{elig ? "✓ Done" : "In Progress"}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DRAW ── */}
        {view === "draw" && (
          <div className="page">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <button onClick={() => setView("admin")} style={{ background: "none", border: "none", color: "#6B4F8B", fontSize: 20, cursor: "pointer" }}>←</button>
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>Lucky Draw</h2>
                <p style={{ fontSize: 12, color: "#6B4F8B", margin: 0 }}>{luckyEntries.length} entries · {participants.filter(p=>isEligible(p.stamps)).length} eligible</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#4B3B6B", textAlign: "center", marginBottom: 28 }}>More stamps = more entries = higher chance of winning</p>
            <SpinWheel entries={luckyEntries} onWinner={setWinner} />
            {winner && (
              <div className="winner-card">
                <div style={{ fontSize: 48 }}>🎉</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#C4197D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Lucky Draw Winner</div>
                <div className="winner-name">Staff ID: {winner.id}</div>
                <div className="winner-entries">🎖️ {winner.entries} stamps collected</div>
              </div>
            )}
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
