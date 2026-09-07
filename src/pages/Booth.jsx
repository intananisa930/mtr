import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { isEligible, QUIZ_QUESTIONS } from "../data";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .wrap { max-width: 480px; margin: 0 auto; padding: 24px 20px; position: relative; z-index: 1; min-height: 100vh; }
  .top-header { text-align: center; margin-bottom: 16px; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 10px; letter-spacing: 1px; }
  .booth-header { text-align: center; margin-bottom: 20px; }
  .domain-badge { display: inline-block; font-size: 11px; font-weight: 600; color: #A78BFA; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); padding: 4px 12px; border-radius: 100px; }
  .booth-name { font-family: 'Space Grotesk',sans-serif; font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 4px; text-align: center; }
  .booth-use { font-size: 13px; color: #6B4F8B; margin-bottom: 0; text-align: center; }
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
  .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; margin-bottom: 8px; display: block; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
  .btn-green { width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#10B981,#059669); color: #fff; margin-bottom: 8px; display: block; }
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
  .result-wrap { text-align: center; padding: 10px 0; }
  .result-emoji { font-size: 56px; display: block; margin-bottom: 16px; animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop { from { transform: scale(0) rotate(-20deg); } to { transform: scale(1) rotate(0); } }
  .result-title { font-family: 'Space Grotesk',sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .result-wb { font-size: 28px; font-weight: 800; color: #C4197D; font-family: 'Space Grotesk',sans-serif; }
  .result-name { font-size: 14px; color: #9CA3AF; margin-top: 4px; margin-bottom: 20px; }
  .tab-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .tab-btn { flex: 1; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid rgba(124,58,237,0.2); background: rgba(26,13,46,0.6); color: #9CA3AF; font-family: 'Inter',sans-serif; transition: all 0.15s; text-align: center; }
  .tab-btn.active { border-color: #C4197D; color: #C4197D; background: rgba(196,25,125,0.1); }
  .visitor-item { display: flex; align-items: center; gap: 10px; background: rgba(26,13,46,0.5); border: 1px solid rgba(124,58,237,0.1); border-radius: 10px; padding: 8px 12px; margin-bottom: 6px; }
  .visitor-wb { font-size: 12px; font-weight: 700; color: #C4197D; width: 44px; flex-shrink: 0; }
  .visitor-name { font-size: 12px; color: #E9D5FF; flex: 1; }
  .visitor-time { font-size: 10px; color: #4B3B6B; }
  .booth-id-label { text-align: center; font-size: 11px; color: #2D1B4E; margin-top: 8px; }
  .score-bar { display: flex; justify-content: space-between; background: rgba(26,13,46,0.8); border: 1px solid rgba(124,58,237,0.15); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; }
  .score-item { text-align: center; }
  .score-num { font-family: 'Space Grotesk',sans-serif; font-size: 20px; font-weight: 800; }
  .score-lbl { font-size: 8px; color: #6B4F8B; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .score-div { width: 1px; background: rgba(124,58,237,0.2); }
  .cat-btn { width: 100%; padding: 14px 16px; border-radius: 12px; cursor: pointer; border: 1px solid; background: rgba(26,13,46,0.6); font-family: 'Inter',sans-serif; transition: all 0.2s; text-align: left; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .cat-btn:hover { transform: translateX(4px); }
  .q-timer { font-family: 'Space Grotesk',sans-serif; font-size: 28px; font-weight: 800; color: #C4197D; }
  .q-timer.urgent { color: #F43F5E; animation: blink 0.5s infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .q-text { font-size: 15px; font-weight: 600; color: #F3E8FF; line-height: 1.6; background: rgba(26,13,46,0.5); border-radius: 12px; padding: 14px; margin-bottom: 14px; }
  .q-opts { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .q-opt { padding: 12px 14px; border-radius: 12px; font-size: 13px; cursor: pointer; border: 1px solid rgba(124,58,237,0.2); background: rgba(26,13,46,0.6); color: #E9D5FF; font-family: 'Inter',sans-serif; transition: all 0.15s; display: flex; align-items: center; gap: 10px; }
  .q-opt:hover { border-color: rgba(196,25,125,0.4); background: rgba(196,25,125,0.05); }
  .q-opt.selected { border-color: #C4197D; background: rgba(196,25,125,0.1); color: #F9A8D4; }
  .q-opt.correct { border-color: #10B981; background: rgba(16,185,129,0.1); color: #10B981; }
  .q-opt.wrong { border-color: #F43F5E; background: rgba(244,63,94,0.08); color: #F87171; }
  .opt-letter { width: 26px; height: 26px; border-radius: 8px; background: rgba(124,58,237,0.15); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .q-dots { display: flex; gap: 5px; margin-bottom: 10px; }
  .q-dot { height: 5px; flex: 1; border-radius: 100px; background: rgba(124,58,237,0.2); transition: background 0.3s; }
  .q-dot.done { background: #10B981; }
  .q-dot.active { background: #C4197D; }
  .result-mini { border-radius: 12px; padding: 12px; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 10px; }
  .result-mini.ok { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); }
  .result-mini.no { background: rgba(244,63,94,0.06); border: 1px solid rgba(244,63,94,0.2); }
  .lb-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(124,58,237,0.08); }
  .lb-row:last-child { border-bottom: none; }
  .lb-rank { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
  .prog-bar { height: 3px; background: rgba(124,58,237,0.1); border-radius: 100px; overflow: hidden; margin-top: 4px; }
  .prog-fill { height: 100%; border-radius: 100px; }
  .challenge-box { background: linear-gradient(135deg,rgba(196,25,125,0.08),rgba(124,58,237,0.06)); border: 2px solid rgba(196,25,125,0.3); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 12px; }
  .done-box { text-align: center; padding: 20px 0; }
`;

const DotGrid = () => (
  <div className="dot-grid">
    <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
  </div>
);

const CAT_INFO = {
  mimos: { label: "Know MIMOS", color: "#60A5FA", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", icon: "🏢" },
  tech: { label: "Know the Technologies", color: "#F9A8D4", bg: "rgba(196,25,125,0.1)", border: "rgba(196,25,125,0.3)", icon: "💡" },
  industry: { label: "Industry & Applications", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", icon: "🏭" },
};

const RANK_BG = ["rgba(212,175,55,0.25)", "rgba(192,192,192,0.25)", "rgba(205,127,50,0.25)", "rgba(124,58,237,0.2)", "rgba(59,130,246,0.2)"];
const RANK_COLOR = ["#D4AF37", "#C0C0C0", "#CD7F32", "#A78BFA", "#60A5FA"];

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
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState("scanner");

  // Quiz state
  const [quizView, setQuizView] = useState("home"); // home | category | question | done
  const [quizMode, setQuizMode] = useState("self"); // self | participant
  const [currentCat, setCurrentCat] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [catAnswered, setCatAnswered] = useState(0);
  const [catCorrect, setCatCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalPts, setTotalPts] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState("-");
  const [challengeWb, setChallengeWb] = useState(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const timerRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const loadBooth = async () => {
      const { data } = await supabase.from("booths").select("*").eq("booth_id", boothId).single();
      setBooth(data);
    };
    if (boothId) loadBooth();
  }, [boothId]);

  const loadVisitors = async () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { data } = await supabase.from("stamp_log").select("staff_id, scanned_at, participants(wristband_id, display_name)").eq("booth_id", boothId).gte("scanned_at", today.toISOString()).order("scanned_at", { ascending: false });
    setVisitors(data || []);
    setStampCount(data?.length || 0);
  };

  const loadLeaderboard = async () => {
    const { data } = await supabase.from("exhibitor_scores").select("*").order("points", { ascending: false }).limit(10);
    setLeaderboard(data || []);
    if (data) {
      const idx = data.findIndex(e => e.booth_id === boothId);
      setMyRank(idx >= 0 ? idx + 1 : "-");
    }
  };

  useEffect(() => { if (unlocked) { loadVisitors(); loadLeaderboard(); } }, [unlocked]);

  useEffect(() => {
    if (!scanning) return;
    const loadScanner = async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(async (rawText) => { await scanner.clear(); setScanning(false); await handleScan(rawText); }, () => {});
      scannerRef.current = scanner;
    };
    loadScanner();
    return () => { try { scannerRef.current?.clear(); } catch {} };
  }, [scanning]);

  // Timer effect
  useEffect(() => {
    if (quizView !== "question") return;
    clearInterval(timerRef.current);
    setTimeLeft(25);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); if (!submitted) handleSubmit(-1); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, quizView]);

  const handlePinInput = (num) => { if (pin.length < 4) setPin(p => p + num); };
  const handlePinDelete = () => setPin(p => p.slice(0, -1));

  const handleUnlock = async () => {
    const { data } = await supabase.from("booth_pins").select("pin").eq("booth_id", boothId).single();
    if (!data || data.pin !== pin) { setPinError("Incorrect PIN. Please try again."); setPin(""); return; }
    setUnlocked(true); setPinError("");
  };

  const handleScan = async (rawText) => {
    setScanError("");
    try {
      let wristbandId = rawText;
      if (rawText.includes("?id=")) wristbandId = rawText.split("?id=")[1].toUpperCase();
      wristbandId = wristbandId.trim().toUpperCase();
      const { data: participant } = await supabase.from("participants").select("*").eq("wristband_id", wristbandId).single();
      if (!participant) { setScanError(`Wristband ${wristbandId} not found. Ask participant to register first.`); return; }
      if (participant.stamps.includes(boothId)) { setScanError(`${wristbandId} already has a stamp for this booth.`); return; }
      const newStamps = [...participant.stamps, boothId];
      const eligible = isEligible(newStamps);
      await supabase.from("participants").update({ stamps: newStamps, eligible, last_updated: new Date().toISOString() }).eq("wristband_id", wristbandId);
      await supabase.from("stamp_log").insert({ staff_id: participant.staff_id, booth_id: boothId });
      const { data: current } = await supabase.from("exhibitor_scores").select("*").eq("booth_id", boothId).single();
      if (current) {
        await supabase.from("exhibitor_scores").update({
          questions_unlocked: (current.questions_unlocked || 0) + 1,
          updated_at: new Date().toISOString(),
        }).eq("booth_id", boothId);
      }
      setScanResult({ wristbandId, name: participant.display_name || participant.name || "", eligible, totalStamps: newStamps.length });
      setScanHistory(prev => [{ wristbandId, name: participant.display_name || participant.name || "", time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
      setStampCount(prev => prev + 1);
      setChallengeWb(wristbandId);
      setShowChallenge(true);
      await loadVisitors();
    } catch (err) { setScanError("Could not read QR. Please try again."); }
  };

  // Quiz functions
  const startCategory = (cat) => {
    setCurrentCat(cat);
    setCatAnswered(0);
    setCatCorrect(0);
    pickQuestion(cat, 0);
  };

  const pickQuestion = (cat, answered) => {
    const pool = QUIZ_QUESTIONS[cat];
    const q = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQ(q);
    setSelected(null);
    setSubmitted(false);
    setCatAnswered(answered + 1);
    setTotalAnswered(prev => prev + 1);
    setQuizView("question");
  };

  const handleSubmit = async (forcedAnswer) => {
    clearInterval(timerRef.current);
    const ans = forcedAnswer !== undefined ? forcedAnswer : selected;
    const isCorrect = ans === currentQ.correct;
    setSubmitted(true);
    setSelected(ans);

    if (isCorrect) {
      const newCorrect = totalCorrect + 1;
      const newPts = newCorrect * 5;
      setTotalCorrect(newCorrect);
      setTotalPts(newPts);
      setCatCorrect(prev => prev + 1);

      // Update Supabase exhibitor_scores
      const { data: current } = await supabase.from("exhibitor_scores").select("*").eq("booth_id", boothId).single();
      if (current) {
        await supabase.from("exhibitor_scores").update({
          total_questions: current.total_questions + 1,
          correct_answers: current.correct_answers + 1,
          points: (current.correct_answers + 1) * 5,
          updated_at: new Date().toISOString(),
        }).eq("booth_id", boothId);
      }
    } else {
      const { data: current } = await supabase.from("exhibitor_scores").select("*").eq("booth_id", boothId).single();
      if (current) {
        await supabase.from("exhibitor_scores").update({
          total_questions: current.total_questions + 1,
          updated_at: new Date().toISOString(),
        }).eq("booth_id", boothId);
      }
    }

    // Log quiz attempt
    await supabase.from("quiz_log").insert({
      booth_id: boothId,
      wristband_id: challengeWb || "self",
      category: currentCat,
      mode: quizMode,
      correct: isCorrect ? 1 : 0,
      total: 1,
      points_earned: isCorrect ? 5 : 0,
    });

    await loadLeaderboard();
  };

  const nextQuestion = () => {
    if (quizMode === "participant" && catAnswered >= 3) {
      setQuizView("done");
      return;
    }
    pickQuestion(currentCat, catAnswered);
  };

  const endSelfSession = () => {
    setCatAnswered(0);
    setCatCorrect(0);
    setQuizView("home");
    loadLeaderboard();
  };

  // PIN screen
  if (!unlocked) return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="top-header"><div className="logo">MIMOS</div></div>
        {booth && (<div className="booth-header"><div className="domain-badge">{booth.domain_name}</div><div className="booth-name">{booth.name}</div>{booth.use_case && <div className="booth-use">{booth.use_case}</div>}</div>)}
        <div className="card">
          <div className="card-title">Enter Booth PIN</div>
          <div className="pin-row">{[0,1,2,3].map(i => (<div key={i} className={`pin-d ${pin[i] ? "" : "empty"}`}>{pin[i] ? "●" : "○"}</div>))}</div>
          {pinError && <div className="err">{pinError}</div>}
          <div className="numpad">{[1,2,3,4,5,6,7,8,9].map(n => (<button key={n} className="num-btn" onClick={() => handlePinInput(String(n))}>{n}</button>))}<div></div><button className="num-btn" onClick={() => handlePinInput("0")}>0</button><button className="num-btn del" onClick={handlePinDelete}>DEL</button></div>
          <button className="btn-primary" onClick={handleUnlock} disabled={pin.length !== 4}>Unlock Booth</button>
        </div>
        <div className="booth-id-label">Booth ID: {boothId}</div>
      </div>
    </>
  );

  // Scan result + challenge prompt
  if (scanResult) return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="top-header"><div className="logo">MIMOS</div></div>
        {booth && (<div className="booth-header"><div className="domain-badge">{booth.domain_name}</div><div className="booth-name">{booth.name}</div></div>)}
        <div className="card" style={{ textAlign: "center" }}>
          <span className="result-emoji">🎖️</span>
          <div className="result-title" style={{ color: "#10B981" }}>Stamp Awarded!</div>
          <div className="result-wb">{scanResult.wristbandId}</div>
          <div className="result-name">{scanResult.name && <span>{scanResult.name} · </span>}{scanResult.totalStamps} stamps total{scanResult.eligible && <span style={{ color: "#10B981" }}> · ✓ Eligible!</span>}</div>
        </div>
        {showChallenge && (
          <div className="challenge-box">
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, color: "#F3E8FF", marginBottom: 6 }}>Challenge the Exhibitor!</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>{scanResult.wristbandId} activated a quiz challenge</div>
            <div style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "3px 12px", fontSize: 10, color: "#F59E0B", fontWeight: 600, marginBottom: 14 }}>⚡ Exactly 3 questions — auto ends</div>
            <button className="btn-primary" onClick={() => { setQuizMode("participant"); setQuizView("category"); setScanResult(null); setShowChallenge(false); setActiveTab("quiz"); }}>🎯 Start Challenge →</button>
            <button className="btn-ghost" onClick={() => { setScanResult(null); setShowChallenge(false); }}>Skip for now</button>
          </div>
        )}
        {!showChallenge && (
          <button className="btn-primary" onClick={() => { setScanResult(null); setScanError(""); }}>Scan Next Participant →</button>
        )}
      </div>
    </>
  );

  // Main screen
  return (
    <>
      <style>{css}</style>
      <DotGrid />
      <div className="wrap">
        <div className="top-header"><div className="logo">MIMOS</div></div>
        {booth && (<div className="booth-header"><div className="domain-badge">{booth.domain_name}</div><div className="booth-name">{booth.name}</div>{booth.use_case && <div className="booth-use">{booth.use_case}</div>}</div>)}

        <div className="stamp-count"><div className="sc-label">Visitors today</div><div className="sc-num">{stampCount}</div></div>

        <div className="tab-row">
          <button className={`tab-btn ${activeTab === "scanner" ? "active" : ""}`} onClick={() => setActiveTab("scanner")}>📷 Scanner</button>
          <button className={`tab-btn ${activeTab === "visitors" ? "active" : ""}`} onClick={() => { setActiveTab("visitors"); loadVisitors(); }}>👥 Visitors ({stampCount})</button>
          <button className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`} onClick={() => { setActiveTab("quiz"); loadLeaderboard(); }}>🎯 Quiz</button>
        </div>

        {/* SCANNER TAB */}
        {activeTab === "scanner" && (
          <>
            {scanError && <div className="err">{scanError}</div>}
            {scanning ? (
              <><div className="qr-wrap"><div id="qr-reader" /></div><button className="btn-ghost" onClick={() => { setScanning(false); setScanError(""); }}>Cancel</button></>
            ) : (
              <button className="btn-primary" onClick={() => { setScanResult(null); setScanError(""); setScanning(true); }}>📷 Scan Participant Wristband</button>
            )}
            {scanHistory.length > 0 && (<><div className="divider" /><div className="section-title">Last scanned</div><div className="scan-list">{scanHistory.map((s, i) => (<div key={i} className="scan-item"><div className="scan-check">✓</div><div className="scan-wb">{s.wristbandId}</div><div className="scan-name">{s.name || "—"}</div><div className="scan-time">{s.time}</div></div>))}</div></>)}
          </>
        )}

        {/* VISITORS TAB */}
        {activeTab === "visitors" && (
          <>
            <div className="section-title">All visitors today ({visitors.length})</div>
            {visitors.length === 0 ? (<div style={{ textAlign: "center", padding: "40px 20px", color: "#4B3B6B", fontSize: 14 }}>No visitors yet today</div>) : (visitors.map((v, i) => (<div key={i} className="visitor-item"><div style={{ fontSize: 12, fontWeight: 700, color: "#C4197D", width: 30 }}>#{i + 1}</div><div className="visitor-wb">{v.participants?.wristband_id || "—"}</div><div className="visitor-name">{v.participants?.display_name || "—"}</div><div className="visitor-time">{new Date(v.scanned_at).toLocaleTimeString()}</div></div>)))}
            <button className="btn-ghost" style={{ marginTop: 12 }} onClick={loadVisitors}>🔄 Refresh</button>
          </>
        )}

        {/* QUIZ TAB */}
        {activeTab === "quiz" && (
          <>
            {/* QUIZ HOME */}
            {quizView === "home" && (
              <>
                <div className="score-bar">
                  <div className="score-item"><div className="score-num" style={{ color: "#fff" }}>{totalAnswered}</div><div className="score-lbl">Answered</div></div>
                  <div className="score-div"></div>
                  <div className="score-item"><div className="score-num" style={{ color: "#10B981" }}>{totalCorrect}</div><div className="score-lbl">Correct</div></div>
                  <div className="score-div"></div>
                  <div className="score-item"><div className="score-num" style={{ color: "#C4197D" }}>{totalPts}</div><div className="score-lbl">Points</div></div>
                  <div className="score-div"></div>
                  <div className="score-item"><div className="score-num" style={{ color: "#F59E0B" }}>#{myRank}</div><div className="score-lbl">Rank</div></div>
                </div>

                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 14, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 22 }}>🧠</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#A78BFA" }}>Self Practice</div><div style={{ fontSize: 10, color: "#6B4F8B", marginTop: 2 }}>Pick category → questions keep going → stop anytime</div></div>
                  </div>
                  <button className="btn-primary" style={{ marginBottom: 0 }} onClick={() => { setQuizMode("self"); setQuizView("category"); }}>🧠 Start Practice →</button>
                </div>

                <div style={{ background: "rgba(196,25,125,0.06)", border: "1px solid rgba(196,25,125,0.25)", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 22 }}>👥</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#F9A8D4" }}>Participant Challenge</div><div style={{ fontSize: 10, color: "#6B4F8B", marginTop: 2 }}>Exactly 3 questions · activated after stamp scan</div></div>
                  </div>
                  <button className="btn-ghost" style={{ marginBottom: 0, opacity: 0.5 }} disabled>Waiting for participant scan...</button>
                </div>

                <div className="card">
                  <div className="section-title">🏆 Exhibitor Leaderboard</div>
                  {leaderboard.length === 0 ? (<div style={{ textAlign: "center", color: "#4B3B6B", fontSize: 12, padding: "10px 0" }}>No scores yet</div>) : (
                    leaderboard.slice(0, 5).map((e, i) => (
                      <div key={i} className="lb-row" style={e.booth_id === boothId ? { background: "rgba(196,25,125,0.06)", borderRadius: 10, padding: "6px 8px", margin: "3px -4px" } : {}}>
                        <div className="lb-rank" style={{ background: RANK_BG[i] || "rgba(124,58,237,0.1)", color: RANK_COLOR[i] || "#6B4F8B" }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: e.booth_id === boothId ? "#C4197D" : "#F3E8FF" }}>{e.booth_name}{e.booth_id === boothId ? " ← You" : ""}</div>
                          <div style={{ fontSize: 9, color: "#6B4F8B" }}>{e.domain_name} · {e.correct_answers}/{e.total_questions} correct</div>
                          <div className="prog-bar"><div className="prog-fill" style={{ width: leaderboard[0]?.points > 0 ? Math.round(e.points / leaderboard[0].points * 100) + "%" : "0%", background: "#C4197D" }}></div></div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#C4197D" }}>{e.points}</div>
                          <div style={{ fontSize: 8, color: "#6B4F8B" }}>pts</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* CATEGORY SELECT */}
            {quizView === "category" && (
              <>
                <div style={{ background: quizMode === "participant" ? "rgba(196,25,125,0.08)" : "rgba(124,58,237,0.08)", border: `1px solid ${quizMode === "participant" ? "rgba(196,25,125,0.25)" : "rgba(124,58,237,0.25)"}`, borderRadius: 12, padding: 12, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 20 }}>{quizMode === "participant" ? "👥" : "🧠"}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: quizMode === "participant" ? "#F9A8D4" : "#A78BFA" }}>{quizMode === "participant" ? `Participant Challenge · ${challengeWb}` : "Self Practice"}</div>
                    <div style={{ fontSize: 10, color: "#6B4F8B", marginTop: 2 }}>{quizMode === "participant" ? "Exactly 3 questions — ends automatically" : "Questions keep going. Stop anytime."}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginBottom: 14 }}>🎯 Pick a category — questions stay in that category!</div>
                {Object.entries(CAT_INFO).map(([key, info]) => (
                  <button key={key} className="cat-btn" style={{ borderColor: info.border }} onClick={() => startCategory(key)}>
                    <div style={{ fontSize: 22 }}>{info.icon}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: info.color }}>{info.label}</div><div style={{ fontSize: 10, color: "#6B4F8B", marginTop: 2 }}>5 pts each</div></div>
                    <div style={{ fontSize: 18, color: info.color }}>→</div>
                  </button>
                ))}
                <button className="btn-ghost" onClick={() => setQuizView("home")}>← Back</button>
              </>
            )}

            {/* QUESTION */}
            {quizView === "question" && currentQ && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: CAT_INFO[currentCat]?.bg, border: `1px solid ${CAT_INFO[currentCat]?.border}`, color: CAT_INFO[currentCat]?.color }}>{CAT_INFO[currentCat]?.label}</div>
                  <div className={`q-timer ${timeLeft <= 10 ? "urgent" : ""}`}>{timeLeft}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: quizMode === "participant" ? "rgba(196,25,125,0.1)" : "rgba(124,58,237,0.1)", color: quizMode === "participant" ? "#F9A8D4" : "#A78BFA" }}>{quizMode === "participant" ? `👥 Participant Challenge · Q${catAnswered} of 3` : "🧠 Self Practice"}</div>
                </div>
                <div className="q-dots">
                  {Array(quizMode === "participant" ? 3 : Math.max(catAnswered, 5)).fill(0).map((_, i) => (
                    <div key={i} className={`q-dot ${i < catAnswered - 1 ? "done" : i === catAnswered - 1 ? "active" : ""}`}></div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: "rgba(26,13,46,0.8)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: 9, padding: 8, textAlign: "center" }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#10B981" }}>{totalCorrect}</div><div style={{ fontSize: 8, color: "#6B4F8B" }}>Correct</div></div>
                  <div style={{ flex: 1, background: "rgba(26,13,46,0.8)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: 9, padding: 8, textAlign: "center" }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#C4197D" }}>{totalPts}</div><div style={{ fontSize: 8, color: "#6B4F8B" }}>Points</div></div>
                  <div style={{ flex: 1, background: "rgba(26,13,46,0.8)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: 9, padding: 8, textAlign: "center" }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>{totalAnswered}</div><div style={{ fontSize: 8, color: "#6B4F8B" }}>Total</div></div>
                </div>
                <div className="q-text">{currentQ.text}</div>
                <div className="q-opts">
                  {currentQ.options.map((opt, i) => {
                    let cls = "q-opt";
                    if (submitted) { if (i === currentQ.correct) cls += " correct"; else if (i === selected) cls += " wrong"; }
                    else if (i === selected) cls += " selected";
                    return (
                      <div key={i} className={cls} onClick={() => !submitted && setSelected(i)}>
                        <div className="opt-letter">{["A","B","C","D"][i]}</div>{opt}
                      </div>
                    );
                  })}
                </div>
                {submitted && (
                  <div className={`result-mini ${selected === currentQ.correct ? "ok" : "no"}`}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>{selected === currentQ.correct ? "🎉" : "😔"}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: selected === currentQ.correct ? "#10B981" : "#F43F5E", marginBottom: 3 }}>{selected === currentQ.correct ? "Correct! +5 pts" : "Incorrect!"}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.4 }}>{currentQ.explain}</div>
                    </div>
                  </div>
                )}
                {!submitted ? (
                  <button className="btn-primary" onClick={() => handleSubmit()} disabled={selected === null}>Submit Answer</button>
                ) : quizMode === "participant" && catAnswered >= 3 ? (
                  <button className="btn-green" onClick={() => setQuizView("done")}>✓ See Challenge Result →</button>
                ) : (
                  <>
                    <button className="btn-primary" onClick={nextQuestion}>{quizMode === "participant" ? `Next Question (${3 - catAnswered} left) →` : "Next Question →"}</button>
                    {quizMode === "self" && <button className="btn-ghost" onClick={endSelfSession}>Stop Session</button>}
                  </>
                )}
              </>
            )}

            {/* CHALLENGE DONE */}
            {quizView === "done" && (
              <div className="done-box">
                <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#F3E8FF", marginBottom: 4 }}>Challenge Complete!</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>{challengeWb}'s challenge completed</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
                  <div style={{ background: "rgba(26,13,46,0.8)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12, padding: 12 }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>3</div><div style={{ fontSize: 9, color: "#6B4F8B", marginTop: 2 }}>Questions</div></div>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 12 }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#10B981" }}>{catCorrect}</div><div style={{ fontSize: 9, color: "#6B4F8B", marginTop: 2 }}>Correct</div></div>
                  <div style={{ background: "rgba(196,25,125,0.08)", border: "1px solid rgba(196,25,125,0.2)", borderRadius: 12, padding: 12 }}><div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#C4197D" }}>{totalPts}</div><div style={{ fontSize: 9, color: "#6B4F8B", marginTop: 2 }}>Points</div></div>
                </div>
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "#F59E0B", fontWeight: 600 }}>Current Rank: #{myRank} on Exhibitor Leaderboard 🎯</div>
                </div>
                <button className="btn-primary" onClick={() => { setQuizView("home"); setChallengeWb(null); setActiveTab("scanner"); }}>← Back to Scanner</button>
                <button className="btn-ghost" onClick={() => { setQuizMode("self"); setQuizView("category"); }}>🧠 Continue Self Practice</button>
              </div>
            )}
          </>
        )}

        <div className="divider" />
        <button className="btn-ghost" onClick={() => { setUnlocked(false); setPin(""); setScanHistory([]); setStampCount(0); setQuizView("home"); setActiveTab("scanner"); }}>🔒 Lock Booth</button>
      </div>
    </>
  );
}
