import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "../supabase";
import { isEligible } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .wrap { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; min-height: 100vh; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 12px; letter-spacing: 1px; }
  .domain-badge { display: inline-block; font-size: 11px; font-weight: 600; color: #A78BFA; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); padding: 4px 12px; border-radius: 100px; }
  .booth-name { font-family: 'Space Grotesk',sans-serif; font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .booth-use { font-size: 13px; color: #6B4F8B; margin-bottom: 24px; }
  .card { background: rgba(26,13,46,0.8); border: 1px solid rgba(196,25,125,0.2); border-radius: 20px; padding: 24px; backdrop-filter: blur(8px); margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 600; color: #F3E8FF; margin-bottom: 16px; text-align: center; }
  .pin-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; }
  .pin-d { width: 52px; height: 52px; background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #C4197D; font-weight: 700; font-family: 'Space Grotesk',sans-serif; }
  .pin-d.empty { color: #4B3B6B; }
  .numpad { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 12px; }
  .num-btn { background: rgba(26,13,46,0.6); border: 1px solid rgba(124,58,237,0.2); border-radius: 12px; padding: 14px; font-size: 18px; font-weight: 600; color: #E9D5FF; cursor: pointer; font-family: 'Space Grotesk',sans-serif; transition: all 0.15s; text-align: center; }
  .num-btn:hover { border-color: rgba(196,25,125,0.4); background: rgba(196,25,125,0.1); }
  .num-btn.del { font-size: 14px; color: #9CA3AF; }
  .btn-primary { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; transition: all 0.2s; letter-spacing: 0.3px; margin-bottom: 10px; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
  .err { color: #F87171; font-size: 13px; margin-bottom: 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); padding: 10px 14px; border-radius: 10px; text-align: center; }
  .stamp-count { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .sc-label { font-size: 12px; color: #6B7280; }
  .sc-num { font-family: 'Space Grotesk',sans-serif; font-size: 24px; font-weight: 800; color: #10B981; }
  .qr-wrap { background: rgba(10,6,18,0.6); border: 1px solid rgba(124,58,237,0.2); border-radius: 16px; padding: 16px; margin-bottom: 16px; overflow: hidden; }
  #qr-reader { width: 100%; border-radius: 10px; overflow: hidden; }
  #qr-reader video { border-radius: 10px; }
  .divider { height: 1px; background: rgba(124,58,237,0.12); margin: 16px 0; }
  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .scan-list { display: flex; flex-direction: column; gap: 8px; }
  .scan-item { display: flex; align-items: center; gap: 10px; background: rgba(26,13,46,0.5); border: 1px solid rgba(124,58,237,0.12); border-radius: 10px; padding: 10px 12px; }
  .scan-check { width: 24px; height: 24px; border-radius: 50%; background: rgba(16,185,129,0.15); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #10B981; flex-shrink: 0; }
  .scan-wb { font-size: 13px; font-weight: 700; color: #C4197D; width: 50px; flex-shrink: 0; }
  .scan-name { font-size: 13px; color: #E9D5FF; flex: 1; }
  .scan-time { font-size: 10px; color: #4B3B6B; }
  .result-wrap { text-align: center; padding: 20px 0; }
  .result-emoji { font-size: 56px; display: block; margin-bottom: 16px; animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from { transform: scale(0) rotate(-20deg); } to { transform: scale(1) rotate(0); } }
  .result-title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .result-wb { font-size: 28px; font-weight: 800; color: #C4197D; font-family: 'Space Grotesk',sans-serif; }
  .result-name { font-size: 14px; color: #9CA3AF; margin-top: 4px; margin-bottom: 20px; }
`;

export default function Booth() {
  const { boothId } = useParams();
  const [booth, setBooth] = useState(null);
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [stampCount, setStampCount] = useState(0);
  const scannerRef = useRef(null);

  useEffect(() => {
    const loadBooth = async () => {
      const { data } = await supabase
        .from("booths")
        .select("*")
        .eq("booth_id", boothId)
        .single();
      setBooth(data);
    };
    if (boothId) loadBooth();
  }, [boothId]);

  useEffect(() => {
    if (!scanning) return;
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scanner.render(
      async (rawText) => {
        await scanner.clear();
        setScanning(false);
        await handleScan(rawText);
      },
      () => {}
    );
    scannerRef.current = scanner;
    return () => { try { scanner.clear(); } catch {} };
  }, [scanning]);

  const handlePinInput = (num) => {
    if (pin.length < 4) setPin(p => p + num);
  };

  const handlePinDelete = () => setPin(p => p.slice(0, -1));

  const handleUnlock = async () => {
    const { data } = await supabase
      .from("booth_pins")
      .select("pin")
      .eq("booth_id", boothId)
      .single();

    if (!data || data.pin !== pin) {
      setPinError("Incorrect PIN. Please try again.");
      setPin("");
      return;
    }
    setUnlocked(true);
    setPinError("");
  };

  const handleScan = async (rawText) => {
    setScanError("");
    try {
      // Extract wristband ID from URL or plain text
      let wristbandId = rawText;
      if (rawText.includes("?id=")) {
        wristbandId = rawText.split("?id=")[1].toUpperCase();
      }
      wristbandId = wristbandId.trim().toUpperCase();

      // Get participant
      const { data: participant } = await supabase
        .from("participants")
        .select("*")
        .eq("wristband_id", wristbandId)
        .single();

      if (!participant) {
        setScanError(`Wristband ${wristbandId} not found. Ask participant to register first.`);
        return;
      }

      // Check already stamped
      if (participant.stamps.includes(boothId)) {
        setScanError(`${wristbandId} already has a stamp for this booth.`);
        return;
      }

      // Add stamp
      const newStamps = [...participant.stamps, boothId];
      const eligible = isEligible(newStamps);

      await supabase
        .from("participants")
        .update({
          stamps: newStamps,
          eligible,
          last_updated: new Date().toISOString(),
        })
        .eq("wristband_id", wristbandId);

      await supabase.from("stamp_log").insert({
        staff_id: participant.staff_id,
        booth_id: boothId,
      });

      setScanResult({
        wristbandId,
        name: participant.display_name || participant.name || "",
        eligible,
        totalStamps: newStamps.length,
      });

      setScanHistory(prev => [{
        wristbandId,
        name: participant.display_name || participant.name || "",
        time: new Date().toLocaleTimeString(),
      }, ...prev.slice(0, 4)]);

      setStampCount(prev => prev + 1);

    } catch (err) {
      setScanError("Could not read QR. Please try again.");
      console.error(err);
    }
  };

  const DotGrid = () => (
    <div className="dot-grid">
      <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
    </div>
  );

  // PIN entry screen
  if (!unlocked) return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="logo">MIMOS</div>
        {booth && (
          <>
            <div className="domain-badge">{booth.domain_name}</div>
            <div className="booth-name">{booth.name}</div>
            <div className="booth-use">{booth.use_case}</div>
          </>
        )}
        <div className="card">
          <div className="card-title">Enter Booth PIN</div>
          <div className="pin-row">
            {[0,1,2,3].map(i => (
              <div key={i} className={`pin-d ${pin[i] ? "" : "empty"}`}>
                {pin[i] ? "●" : "○"}
              </div>
            ))}
          </div>
          {pinError && <div className="err">{pinError}</div>}
          <div className="numpad">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} className="num-btn" onClick={() => handlePinInput(String(n))}>{n}</button>
            ))}
            <div></div>
            <button className="num-btn" onClick={() => handlePinInput("0")}>0</button>
            <button className="num-btn del" onClick={handlePinDelete}>DEL</button>
          </div>
          <button className="btn-primary" onClick={handleUnlock} disabled={pin.length !== 4}>
            Unlock Booth
          </button>
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: "#4B3B6B" }}>
          Booth ID: {boothId}
        </div>
      </div>
    </>
  );

  // Scan result screen
  if (scanResult) return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="logo">MIMOS</div>
        <div className="domain-badge">{booth?.domain_name}</div>
        <div className="booth-name">{booth?.name}</div>
        <div className="result-wrap">
          <div className="card" style={{ textAlign: "center" }}>
            <span className="result-emoji">🎖️</span>
            <div className="result-title" style={{ color: "#10B981" }}>Stamp Awarded!</div>
            <div className="result-wb">{scanResult.wristbandId}</div>
            <div className="result-name">
              {scanResult.name && <span>{scanResult.name} · </span>}
              {scanResult.totalStamps} stamps total
              {scanResult.eligible && <span style={{ color: "#10B981" }}> · ✓ Now eligible!</span>}
            </div>
          </div>
          <button className="btn-primary" onClick={() => { setScanResult(null); setScanError(""); }}>
            Scan Next Participant →
          </button>
        </div>
      </div>
    </>
  );

  // Main scanner screen
  return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="logo">MIMOS</div>
        {booth && (
          <>
            <div className="domain-badge">{booth.domain_name}</div>
            <div className="booth-name">{booth.name}</div>
            <div className="booth-use">{booth.use_case}</div>
          </>
        )}

        <div className="stamp-count">
          <div className="sc-label">Stamps awarded this session</div>
          <div className="sc-num">{stampCount}</div>
        </div>

        {scanError && <div className="err">{scanError}</div>}

        {scanning ? (
          <>
            <div className="qr-wrap">
              <div id="qr-reader" />
            </div>
            <button className="btn-ghost" onClick={() => { setScanning(false); setScanError(""); }}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={() => { setScanResult(null); setScanError(""); setScanning(true); }}>
            📷 Scan Participant Wristband
          </button>
        )}

        {scanHistory.length > 0 && (
          <>
            <div className="divider" />
            <div className="section-title">Last scanned</div>
            <div className="scan-list">
              {scanHistory.map((s, i) => (
                <div key={i} className="scan-item">
                  <div className="scan-check">✓</div>
                  <div className="scan-wb">{s.wristbandId}</div>
                  <div className="scan-name">{s.name || "—"}</div>
                  <div className="scan-time">{s.time}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="divider" />
        <button className="btn-ghost" onClick={() => { setUnlocked(false); setPin(""); setScanHistory([]); setStampCount(0); }}>
          🔒 Lock Booth
        </button>
      </div>
    </>
  );
}
