import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabase";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .wrap { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; }
  .hero { text-align: center; padding: 40px 0 32px; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 20px; letter-spacing: 1px; }
  .eyebrow { display: inline-flex; align-items: center; gap: 6px; background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3); color: #F9A8D4; font-size: 11px; font-weight: 600; padding: 5px 14px; border-radius: 100px; margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase; }
  .h1 { font-family: 'Space Grotesk',sans-serif; font-size: 30px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; background: linear-gradient(135deg,#fff 0%,#E9D5FF 50%,#C4197D 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .mission { font-size: 14px; color: #9CA3AF; line-height: 1.7; margin-bottom: 32px; }
  .domain-icons { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
  .domain-pill { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .card { background: rgba(26,13,46,0.8); border: 1px solid rgba(196,25,125,0.2); border-radius: 20px; padding: 28px; backdrop-filter: blur(8px); }
  .flabel { font-size: 11px; font-weight: 600; color: #7C3AED; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .finput { width: 100%; background: rgba(10,6,18,0.6); border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 14px 16px; font-size: 15px; color: #F3E8FF; font-family: 'Inter',sans-serif; outline: none; transition: all 0.2s; margin-bottom: 16px; }
  .finput:focus { border-color: #C4197D; box-shadow: 0 0 0 3px rgba(196,25,125,0.1); }
  .finput::placeholder { color: #4B3B6B; }
  .btn-primary { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .err { color: #F87171; font-size: 13px; margin-bottom: 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); padding: 10px 14px; border-radius: 10px; }
  .hint { text-align: center; margin-top: 14px; font-size: 12px; color: #4B3B6B; }
  .hint a { color: #7C3AED; text-decoration: none; font-weight: 600; }
  .scan-hint { background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.15); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; text-align: center; }
  .scan-hint-text { font-size: 12px; color: #6B4F8B; line-height: 1.6; }
`;

const DOMAINS = [
  { icon: "🌾", bg: "rgba(132,204,22,0.1)", border: "rgba(132,204,22,0.3)" },
  { icon: "🏙️", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)" },
  { icon: "⚙️", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.3)" },
  { icon: "❤️", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.3)" },
  { icon: "🏭", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  { icon: "💡", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
];

export default function Landing() {
  const [wristbandId, setWristbandId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-fill wristband ID from QR code URL param
  const idFromQR = searchParams.get("id");
  if (idFromQR && !wristbandId) setWristbandId(idFromQR.toUpperCase());

  const handleOpen = async () => {
    if (!wristbandId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Check if wristband exists
      const { data } = await supabase
        .from("participants")
        .select("*")
        .eq("wristband_id", wristbandId.trim().toUpperCase())
        .single();

      if (!data) {
        setError("Wristband ID not found. Please register at the counter first.");
        setLoading(false);
        return;
      }

      // Save to session
      localStorage.setItem("wristbandId", data.wristband_id);
      localStorage.setItem("staffId", data.staff_id);
      localStorage.setItem("displayName", data.display_name || "");
      navigate("/passport");

    } catch (err) {
      setError("Wristband ID not found. Please register at the counter first.");
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
      <div className="wrap">
        <div className="hero">
          <div className="logo">MIMOS</div>
          <div className="eyebrow">✦ Smart Solutions, Connected Futures</div>
          <h1 className="h1">MTR Innovation<br />Passport Challenge</h1>
          <p className="mission">Your mission: explore every domain, stamp your passport, and claim your spot in the lucky draw.</p>
          <div className="domain-icons">
            {DOMAINS.map((d, i) => (
              <div key={i} className="domain-pill" style={{ background: d.bg, border: `1px solid ${d.border}` }}>{d.icon}</div>
            ))}
          </div>
        </div>

        <div className="scan-hint">
          <p className="scan-hint-text">📷 Scan the QR code on your wristband to open your passport automatically<br />or enter your wristband ID below</p>
        </div>

        <div className="card">
          <label className="flabel">Wristband ID</label>
          <input
            className="finput"
            placeholder="e.g. W001"
            value={wristbandId}
            onChange={e => { setWristbandId(e.target.value.toUpperCase()); setError(null); }}
            onKeyDown={e => e.key === "Enter" && handleOpen()}
          />
          {error && <div className="err">{error}</div>}
          <button className="btn-primary" onClick={handleOpen} disabled={loading}>
            {loading ? "Loading..." : "Open My Passport →"}
          </button>
          <p className="hint">Not registered yet? Visit the <strong style={{ color: "#9CA3AF" }}>registration counter</strong></p>
          <p className="hint" style={{ marginTop: 8 }}>Admin? <a href="/admin-login">Login here</a></p>
        </div>
      </div>
    </>
  );
}
