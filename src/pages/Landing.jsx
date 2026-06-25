import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .land-wrap { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; }
  .land-hero { text-align: center; padding: 40px 0 32px; }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3);
    color: #F9A8D4; font-size: 11px; font-weight: 600;
    padding: 5px 14px; border-radius: 100px; margin-bottom: 24px;
    letter-spacing: 1px; text-transform: uppercase;
  }

  .land-h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 32px; font-weight: 800; line-height: 1.1; margin-bottom: 24px;
    background: linear-gradient(135deg, #fff 0%, #E9D5FF 50%, #C4197D 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; text-align: left; }
  .step {
    display: flex; align-items: center; gap: 14px;
    background: rgba(196,25,125,0.06); border: 1px solid rgba(196,25,125,0.15);
    border-radius: 14px; padding: 14px 16px;
  }
  .step-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg,#C4197D,#7C3AED);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 14px;
    color: #fff; flex-shrink: 0;
  }
  .step-text { font-size: 14px; color: #E9D5FF; font-weight: 500; }

  .domain-icons { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
  .domain-icon-pill {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }

  .card {
    background: rgba(26,13,46,0.8); border: 1px solid rgba(196,25,125,0.2);
    border-radius: 20px; padding: 28px; backdrop-filter: blur(8px);
  }
  .flabel { font-size: 11px; font-weight: 600; color: #7C3AED; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .finput {
    width: 100%; background: rgba(10,6,18,0.6); border: 1px solid rgba(124,58,237,0.3);
    border-radius: 12px; padding: 14px 16px; font-size: 15px;
    color: #F3E8FF; font-family: 'Inter', sans-serif; outline: none;
    transition: all 0.2s; margin-bottom: 16px;
  }
  .finput:focus { border-color: #C4197D; box-shadow: 0 0 0 3px rgba(196,25,125,0.1); }
  .finput::placeholder { color: #4B3B6B; }

  .btn-primary {
    width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700;
    font-family: 'Inter', sans-serif; cursor: pointer; border: none;
    background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff;
    box-shadow: 0 4px 20px rgba(196,25,125,0.4); transition: all 0.2s; letter-spacing: 0.3px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(196,25,125,0.5); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .err { color: #F87171; font-size: 13px; margin-bottom: 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); padding: 10px 14px; border-radius: 10px; }
  .admin-link { text-align: center; margin-top: 16px; font-size: 12px; color: #4B3B6B; }
  .admin-link a { color: #7C3AED; text-decoration: none; font-weight: 600; }
`;

const DOMAINS = [
  { icon: "🎓", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
  { icon: "🏭", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  { icon: "🏢", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
  { icon: "🏙️", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.3)" },
  { icon: "⚙️", bg: "rgba(196,25,125,0.1)", border: "rgba(196,25,125,0.3)" },
  { icon: "🌾", bg: "rgba(132,204,22,0.1)", border: "rgba(132,204,22,0.3)" },
  { icon: "❤️", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.3)" },
];

export default function Landing() {
  const [staffId, setStaffId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!staffId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data: existing } = await supabase
        .from("participants")
        .select("*")
        .eq("staff_id", staffId.trim())
        .single();

      if (existing) {
        localStorage.setItem("staffId", staffId.trim());
        localStorage.setItem("staffName", existing.name || "");
        navigate("/passport");
      } else {
        const { error: insertError } = await supabase
          .from("participants")
          .insert({ staff_id: staffId.trim(), name: name.trim() || null, stamps: [], eligible: false });
        if (insertError) throw insertError;
        localStorage.setItem("staffId", staffId.trim());
        localStorage.setItem("staffName", name.trim());
        navigate("/passport");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="land-wrap">
        <div className="land-hero">
          <svg width="90" height="68" viewBox="0 0 120 90" fill="none" style={{ opacity: 0.3, marginBottom: 20 }}>
            <path d="M10 85 Q10 20 60 20 Q110 20 110 85" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
            <path d="M25 85 Q25 35 60 35 Q95 35 95 85" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M40 85 Q40 48 60 48 Q80 48 80 85" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
          </svg>
          <div className="eyebrow">✦ Smart Solutions, Connected Futures</div>
          <h1 className="land-h1">MTR Innovation<br />Passport Challenge</h1>
          <div className="steps">
            {[
              { num: "1", text: "Explore every domain & visit the booths" },
              { num: "2", text: "Stamp your passport at each booth" },
              { num: "3", text: "Claim your spot in the Lucky Draw" },
            ].map(s => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-text">{s.text}</div>
              </div>
            ))}
          </div>
          <div className="domain-icons">
            {DOMAINS.map((d, i) => (
              <div key={i} className="domain-icon-pill" style={{ background: d.bg, border: `1px solid ${d.border}` }}>{d.icon}</div>
            ))}
          </div>
        </div>

        <div className="card">
          <label className="flabel">Staff ID</label>
          <input className="finput" placeholder="Enter your staff ID" value={staffId} onChange={e => setStaffId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleStart()} />
          <label className="flabel">Your Name (optional)</label>
          <input className="finput" placeholder="e.g. Ahmad Razif" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleStart()} />
          {error && <div className="err">{error}</div>}
          <button className="btn-primary" onClick={handleStart} disabled={loading}>
            {loading ? "Loading..." : "Begin My Journey →"}
          </button>
          <p className="admin-link">Admin? <a href="/admin-login">Login here</a></p>
        </div>
      </div>
    </>
  );
}
