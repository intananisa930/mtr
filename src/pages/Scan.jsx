import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "../supabase";
import { isEligible } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .app { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; min-height: 100vh; }

  .hdr { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .back-btn { background: none; border: none; color: #6B4F8B; font-size: 22px; cursor: pointer; }
  .hdr-title { font-family: 'Space Grotesk',sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
  .hdr-sub { font-size: 13px; color: #6B4F8B; margin-top: 2px; }

  .qr-frame { background: rgba(26,13,46,0.6); border: 1px solid rgba(196,25,125,0.2); border-radius: 20px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden; }
  .qr-scanline { position: absolute; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg,transparent,#C4197D,transparent); animation: scan 2s ease-in-out infinite; z-index: 1; }
  @keyframes scan { 0%,100% { top: 10%; } 50% { top: 90%; } }
  .corner { position: absolute; width: 24px; height: 24px; border-color: #C4197D; border-style: solid; }
  .corner-tl { top: 14px; left: 14px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
  .corner-br { bottom: 14px; right: 14px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }

  #qr-reader { width: 100%; border-radius: 12px; overflow: hidden; }
  #qr-reader video { border-radius: 12px; }

  .result-wrap { text-align: center; padding: 48px 20px; }
  .result-emoji { font-size: 72px; display: block; margin-bottom: 20px; animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from { transform: scale(0) rotate(-20deg); } to { transform: scale(1) rotate(0); } }
  .result-title { font-family: 'Space Grotesk',sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 8px; }
  .result-tech { font-size: 16px; font-weight: 600; color: #F3E8FF; margin-bottom: 4px; }
  .result-use { font-size: 13px; color: #6B4F8B; margin-bottom: 32px; }
  .result-err { font-size: 14px; color: #9CA3AF; margin-bottom: 32px; line-height: 1.6; }

  .btn-primary { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; box-shadow: 0 4px 20px rgba(196,25,125,0.4); transition: all 0.2s; margin-bottom: 10px; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-green { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#10B981,#059669); color: #fff; box-shadow: 0 4px 20px rgba(16,185,129,0.3); transition: all 0.2s; margin-bottom: 10px; }
  .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }

  .success-box { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 20px; padding: 28px; margin-bottom: 24px; }
  .error-box { background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.2); border-radius: 20px; padding: 28px; margin-bottom: 24px; }
  .already-box { background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.2); border-radius: 20px; padding: 28px; margin-bottom: 24px; }
`;

export default function Scan() {
  const [status, setStatus] = useState("scanning");
  const [boothInfo, setBoothInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!staffId) { navigate("/"); return; }
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scanner.render(
      async (rawText) => { await scanner.clear(); await handleScan(rawText); },
      () => {}
    );
    scannerRef.current = scanner;
    return () => { try { scanner.clear(); } catch {} };
  }, []);

  const handleScan = async (rawText) => {
    try {
      const { boothId, token } = JSON.parse(rawText);
      const { data: booth } = await supabase.from("booths").select("*").eq("booth_id", boothId).single();
      if (!booth) { setErrorMsg("Invalid QR code."); setStatus("error"); return; }
      if (booth.token !== token) { setErrorMsg("Invalid QR code. Ask the presenter to show their screen."); setStatus("error"); return; }
      if (new Date(booth.token_expiry) < new Date()) { setErrorMsg("QR code has expired. Ask the presenter to refresh."); setStatus("error"); return; }
      const { data: participant } = await supabase.from("participants").select("stamps").eq("staff_id", staffId).single();
      if (participant.stamps.includes(boothId)) { setBoothInfo(booth); setStatus("already"); return; }
      const newStamps = [...participant.stamps, boothId];
      await supabase.from("participants").update({ stamps: newStamps, eligible: isEligible(newStamps), last_updated: new Date().toISOString() }).eq("staff_id", staffId);
      await supabase.from("stamp_log").insert({ staff_id: staffId, booth_id: boothId });
      setBoothInfo(booth);
      setStatus("success");
    } catch (err) {
      setErrorMsg("Could not read QR. Please try again.");
      setStatus("error");
      console.error(err);
    }
  };

  const DotGrid = () => (
    <div className="dot-grid">
      <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
    </div>
  );

  if (status === "success") return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="app">
        <div className="result-wrap">
          <div className="success-box">
            <span className="result-emoji">🎖️</span>
            <div className="result-title" style={{ color: "#10B981" }}>Stamp Collected!</div>
            <div className="result-tech">{boothInfo?.name}</div>
            <div className="result-use">{boothInfo?.use_case}</div>
          </div>
          <button className="btn-green" onClick={() => navigate("/passport")}>Back to Passport →</button>
        </div>
      </div>
    </>
  );

  if (status === "already") return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="app">
        <div className="result-wrap">
          <div className="already-box">
            <span className="result-emoji">✅</span>
            <div className="result-title" style={{ color: "#A78BFA" }}>Already Stamped</div>
            <div className="result-use">You already have the {boothInfo?.name} stamp.</div>
          </div>
          <button className="btn-ghost" onClick={() => navigate("/passport")}>Back to Passport</button>
        </div>
      </div>
    </>
  );

  if (status === "error") return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="app">
        <div className="result-wrap">
          <div className="error-box">
            <span className="result-emoji">❌</span>
            <div className="result-title" style={{ color: "#F87171" }}>Scan Failed</div>
            <div className="result-err">{errorMsg}</div>
          </div>
          <button className="btn-primary" onClick={() => setStatus("scanning")}>Try Again</button>
          <button className="btn-ghost" onClick={() => navigate("/passport")}>Back to Passport</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="app">
        <div className="hdr">
          <button className="back-btn" onClick={() => navigate("/passport")}>←</button>
          <div>
            <div className="hdr-title">Scan Booth QR</div>
            <div className="hdr-sub">Complete the challenge first, then scan the QR.</div>
          </div>
        </div>
        <div className="qr-frame">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />
          <div className="qr-scanline" />
          <div id="qr-reader" />
        </div>
        <button className="btn-ghost" onClick={() => navigate("/passport")}>Cancel</button>
      </div>
    </>
  );
}
