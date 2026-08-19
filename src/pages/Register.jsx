import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .wrap { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 16px; letter-spacing: 1px; }
  .page-title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .page-sub { font-size: 13px; color: #6B4F8B; margin-bottom: 24px; }
  .wb-box { background: rgba(196,25,125,0.1); border: 1px solid rgba(196,25,125,0.3); border-radius: 16px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
  .wb-label { font-size: 11px; color: #6B4F8B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .wb-num { font-family: 'Space Grotesk',sans-serif; font-size: 32px; font-weight: 800; color: #C4197D; }
  .wb-count { font-size: 11px; color: #4B3B6B; text-align: right; }
  .card { background: rgba(26,13,46,0.8); border: 1px solid rgba(196,25,125,0.2); border-radius: 20px; padding: 24px; backdrop-filter: blur(8px); margin-bottom: 16px; }
  .flabel { font-size: 11px; font-weight: 600; color: #7C3AED; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .finput { width: 100%; background: rgba(10,6,18,0.6); border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 14px 16px; font-size: 15px; color: #F3E8FF; font-family: 'Inter',sans-serif; outline: none; transition: all 0.2s; margin-bottom: 16px; }
  .finput:focus { border-color: #C4197D; box-shadow: 0 0 0 3px rgba(196,25,125,0.1); }
  .finput::placeholder { color: #4B3B6B; }
  .type-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .type-btn { border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 12px; font-size: 13px; font-weight: 600; color: #9CA3AF; text-align: center; cursor: pointer; font-family: 'Inter',sans-serif; background: rgba(10,6,18,0.4); transition: all 0.15s; }
  .type-btn.sel { border-color: #C4197D; color: #C4197D; background: rgba(196,25,125,0.1); }
  .btn-primary { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; transition: all 0.2s; letter-spacing: 0.3px; margin-bottom: 10px; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .err { color: #F87171; font-size: 13px; margin-bottom: 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); padding: 10px 14px; border-radius: 10px; }
  .success-box { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 16px; animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success-emoji { font-size: 40px; display: block; margin-bottom: 10px; }
  .success-title { font-family: 'Space Grotesk',sans-serif; font-size: 20px; font-weight: 800; color: #10B981; margin-bottom: 4px; }
  .success-wb { font-size: 28px; font-weight: 800; color: #fff; font-family: 'Space Grotesk',sans-serif; }
  .success-name { font-size: 13px; color: #6B4F8B; margin-top: 4px; }
  .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
  .divider { height: 1px; background: rgba(124,58,237,0.12); margin: 16px 0; }
  .section-title { font-size: 11px; font-weight: 600; color: #6B4F8B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .recent-list { display: flex; flex-direction: column; gap: 8px; }
  .recent-item { display: flex; align-items: center; gap: 10px; background: rgba(26,13,46,0.5); border: 1px solid rgba(124,58,237,0.12); border-radius: 10px; padding: 10px 12px; }
  .recent-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; flex-shrink: 0; }
  .recent-wb { font-size: 13px; font-weight: 700; color: #C4197D; width: 44px; flex-shrink: 0; }
  .recent-name { font-size: 13px; color: #E9D5FF; flex: 1; }
  .recent-type { font-size: 11px; color: #6B4F8B; }
  .count-box { background: rgba(196,25,125,0.06); border: 1px solid rgba(196,25,125,0.2); border-radius: 14px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .count-label { font-size: 11px; color: #6B4F8B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .count-num { font-family: 'Space Grotesk',sans-serif; font-size: 36px; font-weight: 800; color: #C4197D; }
  .count-sub { font-size: 11px; color: #4B3B6B; margin-top: 2px; }
`;

const COUNTER_PIN = "1234";

const DotGrid = () => (
  <div className="dot-grid">
    <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
  </div>
);

export default function Register() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("staff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nextWristband, setNextWristband] = useState(null);
  const [recentList, setRecentList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const getNextWristband = async () => {
    const { data } = await supabase
      .from("participants")
      .select("wristband_id")
      .not("wristband_id", "is", null)
      .order("wristband_id", { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      const last = data[0].wristband_id;
      const num = parseInt(last.replace("W", "")) + 1;
      setNextWristband(`W${String(num).padStart(3, "0")}`);
    } else {
      setNextWristband("W001");
    }
  };

  const [staffCount, setStaffCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);

  const loadRecent = async () => {
    const { data, count } = await supabase
      .from("participants")
      .select("wristband_id, display_name, participant_type, registered_at", { count: "exact" })
      .not("wristband_id", "is", null)
      .order("registered_at", { ascending: false })
      .limit(5);
    setRecentList(data || []);
    setTotalCount(count || 0);
    setStaffCount((data || []).filter(p => p.participant_type === "staff").length);
    setGuestCount((data || []).filter(p => p.participant_type === "guest").length);

    const { count: sCount } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("participant_type", "staff")
      .not("wristband_id", "is", null);

    const { count: gCount } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("participant_type", "guest")
      .not("wristband_id", "is", null);

    setStaffCount(sCount || 0);
    setGuestCount(gCount || 0);
  };

  useEffect(() => {
    if (unlocked) {
      getNextWristband();
      loadRecent();
    }
  }, [unlocked]);

  const handlePinUnlock = () => {
    if (pinInput === COUNTER_PIN) {
      setUnlocked(true);
    } else {
      setPinError("Incorrect PIN. Please try again.");
      setPinInput("");
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) { setError("Please enter participant name."); return; }
    setLoading(true);
    setError(null);
    try {
      const wristbandId = nextWristband;
      const staffId = `${type.toUpperCase()}-${wristbandId}`;
      const { error: insertError } = await supabase
        .from("participants")
        .insert({
          staff_id: staffId,
          wristband_id: wristbandId,
          display_name: name.trim(),
          participant_type: type,
          stamps: [],
          eligible: false,
          name: name.trim(),
        });
      if (insertError) throw insertError;
      setSuccess({ wristbandId, name: name.trim(), type });
      setName("");
      setType("staff");
      await getNextWristband();
      await loadRecent();
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setSuccess(null);
    setError(null);
  };

  // PIN screen
  if (!unlocked) return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="logo">MIMOS</div>
        <h2 className="page-title" style={{ textAlign: "center", marginBottom: 8 }}>Counter Staff Access</h2>
        <p className="page-sub" style={{ textAlign: "center", marginBottom: 28 }}>Enter the counter PIN to continue</p>
        <div className="card" style={{ width: "100%" }}>
          <label className="flabel">Counter PIN</label>
          <input
            className="finput"
            type="password"
            placeholder="Enter PIN"
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(""); }}
            onKeyDown={e => e.key === "Enter" && handlePinUnlock()}
          />
          {pinError && <div className="err">{pinError}</div>}
          <button className="btn-primary" onClick={handlePinUnlock}>
            Unlock →
          </button>
        </div>
      </div>
    </>
  );

  // Registration screen
  return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="logo">MIMOS</div>
        <h2 className="page-title">Registration Counter</h2>
        <p className="page-sub">MTR Innovation Passport Challenge 2026</p>

        {/* Prominent participant count */}
        <div className="count-box">
          <div>
            <div className="count-label">Total registered</div>
            <div className="count-num">{totalCount}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <div style={{ fontSize: 11, color: "#60A5FA" }}>Staff: <strong>{staffCount}</strong></div>
              <div style={{ fontSize: 11, color: "#F59E0B" }}>Guests: <strong>{guestCount}</strong></div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="wb-label">Next wristband</div>
            <div className="wb-num">{nextWristband || "..."}</div>
          </div>
        </div>

        {success ? (
          <>
            <div className="success-box">
              <span className="success-emoji">🎉</span>
              <div className="success-title">Registered!</div>
              <div className="success-wb">{success.wristbandId}</div>
              <div className="success-name">{success.name} · {success.type === "staff" ? "MIMOS Staff" : "External Guest"}</div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#6B4F8B" }}>
                Hand wristband <strong style={{ color: "#C4197D" }}>{success.wristbandId}</strong> to participant
              </div>
            </div>
            <button className="btn-primary" onClick={handleNext}>Register Next Participant →</button>
          </>
        ) : (
          <div className="card">
            <label className="flabel">Participant Name</label>
            <input
              className="finput"
              placeholder="Full name"
              value={name}
              onChange={e => { setName(e.target.value); setError(null); }}
              onKeyDown={e => e.key === "Enter" && handleRegister()}
            />
            <label className="flabel">Participant Type</label>
            <div className="type-row">
              <button className={`type-btn ${type === "staff" ? "sel" : ""}`} onClick={() => setType("staff")}>MIMOS Staff</button>
              <button className={`type-btn ${type === "guest" ? "sel" : ""}`} onClick={() => setType("guest")}>External Guest</button>
            </div>
            {error && <div className="err">{error}</div>}
            <button className="btn-primary" onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : `Register and issue wristband ${nextWristband || ""}`}
            </button>
          </div>
        )}

        {recentList.length > 0 && (
          <>
            <div className="divider" />
            <div className="section-title">Recently registered</div>
            <div className="recent-list">
              {recentList.map((p, i) => (
                <div key={i} className="recent-item">
                  <div className="recent-dot" />
                  <div className="recent-wb">{p.wristband_id}</div>
                  <div className="recent-name">{p.display_name || "—"}</div>
                  <div className="recent-type">{p.participant_type === "staff" ? "Staff" : "Guest"}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="divider" />
        <button className="btn-ghost" onClick={() => { setUnlocked(false); setPinInput(""); }}>
          🔒 Lock Counter
        </button>
      </div>
    </>
  );
}
