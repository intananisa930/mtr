import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import QRCode from "qrcode";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .wrap {
    max-width: 480px; margin: 0 auto;
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px; position: relative; z-index: 1; text-align: center;
  }

  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 16px; letter-spacing: 1px; }

  .domain-badge { display: inline-block; font-size: 11px; font-weight: 600; color: #A78BFA; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); padding: 4px 12px; border-radius: 100px; }

  .booth-name { font-family: 'Space Grotesk',sans-serif; font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 6px;
    background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .booth-use { font-size: 14px; color: #6B4F8B; margin-bottom: 36px; }

  .qr-wrap {
    background: #fff; border-radius: 24px; padding: 20px;
    box-shadow: 0 0 60px rgba(196,25,125,0.3), 0 0 120px rgba(124,58,237,0.2);
    margin-bottom: 32px; display: inline-block;
  }
  .qr-wrap img { display: block; width: 280px; height: 280px; border-radius: 8px; }

  .timer-wrap { margin-bottom: 12px; }
  .timer-num { font-family: 'Space Grotesk',sans-serif; font-size: 72px; font-weight: 800; line-height: 1; transition: color 0.3s; }
  .timer-lbl { font-size: 12px; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

  .timer-bar-bg { width: 200px; height: 4px; background: rgba(124,58,237,0.2); border-radius: 100px; overflow: hidden; margin: 16px auto 0; }
  .timer-bar-fill { height: 100%; border-radius: 100px; transition: width 1s linear, background 0.3s; }

  .refresh-hint { font-size: 12px; color: #4B3B6B; margin-top: 12px; }

  .loading { font-size: 14px; color: #6B4F8B; }
`;

export default function Presenter() {
  const { boothId } = useParams();
  const [qrSrc, setQrSrc] = useState(null);
  const [booth, setBooth] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const loadBooth = async () => {
      let retries = 0;
      while (retries < 5) {
        const { data, error } = await supabase.from("booths").select("*").eq("booth_id", boothId).single();
        if (data) { setBooth(data); break; }
        retries++;
        await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds and retry
      }
    };
    loadBooth();
  }, [boothId]);

  const generateToken = async () => {
    const token = crypto.randomUUID().slice(0, 12);
    const expiry = new Date(Date.now() + 60000).toISOString();
    await supabase.from("booths").update({ token, token_expiry: expiry }).eq("booth_id", boothId);
    const payload = JSON.stringify({ boothId, token });
    const url = await QRCode.toDataURL(payload, { width: 400, margin: 2, color: { dark: "#000000", light: "#FFFFFF" } });
    setQrSrc(url);
    setSecondsLeft(60);
  };

  useEffect(() => {
    if (!boothId) return;
    generateToken();
    const qrInterval = setInterval(generateToken, 60000);
    const countdown = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => { clearInterval(qrInterval); clearInterval(countdown); };
  }, [boothId]);

  const timerColor = secondsLeft <= 10 ? "#F87171" : secondsLeft <= 20 ? "#F59E0B" : "#10B981";
  const barWidth = `${(secondsLeft / 60) * 100}%`;

  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="wrap">
        <div className="logo">MIMOS</div>
        {booth ? (
          <>
            <div className="domain-badge">{booth.domain_name}</div>
            <h1 className="booth-name">{booth.name}</h1>
            <p className="booth-use">{booth.use_case}</p>
          </>
        ) : (
          <p className="loading">Loading booth info...</p>
        )}

        {qrSrc ? (
          <div className="qr-wrap">
            <img src={qrSrc} alt="Booth QR Code" />
          </div>
        ) : (
          <div style={{ width: 320, height: 320, background: "rgba(26,13,46,0.6)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
            <p className="loading">Generating QR...</p>
          </div>
        )}

        <div className="timer-wrap">
          <div className="timer-num" style={{ color: timerColor }}>{secondsLeft}</div>
          <div className="timer-lbl">seconds remaining</div>
          <div className="timer-bar-bg">
            <div className="timer-bar-fill" style={{ width: barWidth, background: timerColor }} />
          </div>
        </div>
        <p className="refresh-hint">QR refreshes automatically every 60 seconds</p>
      </div>
    </>
  );
}
