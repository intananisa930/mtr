import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "../supabase";
import { isEligible } from "../data";

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
      async (rawText) => {
        await scanner.clear();
        await handleScan(rawText);
      },
      () => {}
    );

    scannerRef.current = scanner;
    return () => { try { scanner.clear(); } catch {} };
  }, []);

  const handleScan = async (rawText) => {
    try {
      const { boothId, token } = JSON.parse(rawText);

      const { data: booth } = await supabase
        .from("booths")
        .select("*")
        .eq("booth_id", boothId)
        .single();

      if (!booth) {
        setErrorMsg("Invalid QR code.");
        setStatus("error");
        return;
      }

      if (booth.token !== token) {
        setErrorMsg("Invalid QR code. Ask the presenter to show their screen.");
        setStatus("error");
        return;
      }

      if (new Date(booth.token_expiry) < new Date()) {
        setErrorMsg("QR code has expired. Ask the presenter to refresh.");
        setStatus("error");
        return;
      }

      const { data: participant } = await supabase
        .from("participants")
        .select("stamps")
        .eq("staff_id", staffId)
        .single();

      if (participant.stamps.includes(boothId)) {
        setBoothInfo(booth);
        setStatus("already");
        return;
      }

      const newStamps = [...participant.stamps, boothId];

      await supabase
        .from("participants")
        .update({
          stamps: newStamps,
          eligible: isEligible(newStamps),
          last_updated: new Date().toISOString(),
        })
        .eq("staff_id", staffId);

      await supabase.from("stamp_log").insert({
        staff_id: staffId,
        booth_id: boothId,
      });

      setBoothInfo(booth);
      setStatus("success");

    } catch (err) {
      setErrorMsg("Could not read QR. Please try again.");
      setStatus("error");
      console.error(err);
    }
  };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: 40, fontFamily: "Inter, sans-serif", background: "#0A0E1A", minHeight: "100vh", color: "#fff" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎖️</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>Stamp Collected!</h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{boothInfo?.name}</p>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 32 }}>{boothInfo?.use_case}</p>
      <button
        onClick={() => navigate("/passport")}
        style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        Back to Passport →
      </button>
    </div>
  );

  if (status === "already") return (
    <div style={{ textAlign: "center", padding: 40, fontFamily: "Inter, sans-serif", background: "#0A0E1A", minHeight: "100vh", color: "#fff" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Already Stamped</h2>
      <p style={{ color: "#64748B", marginBottom: 32 }}>You already have the {boothInfo?.name} stamp.</p>
      <button
        onClick={() => navigate("/passport")}
        style={{ background: "#1E2A3A", color: "#fff", border: "1px solid #2D3F52", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        Back to Passport
      </button>
    </div>
  );

  if (status === "error") return (
    <div style={{ textAlign: "center", padding: 40, fontFamily: "Inter, sans-serif", background: "#0A0E1A", minHeight: "100vh", color: "#fff" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Scan Failed</h2>
      <p style={{ color: "#64748B", marginBottom: 32 }}>{errorMsg}</p>
      <button
        onClick={() => setStatus("scanning")}
        style={{ background: "#E8002D", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", marginRight: 10 }}
      >
        Try Again
      </button>
      <button
        onClick={() => navigate("/passport")}
        style={{ background: "#1E2A3A", color: "#fff", border: "1px solid #2D3F52", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        Back to Passport
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20, fontFamily: "Inter, sans-serif", background: "#0A0E1A", minHeight: "100vh", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate("/passport")}
          style={{ background: "none", border: "none", color: "#64748B", fontSize: 20, cursor: "pointer" }}
        >←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Scan Booth QR</h2>
      </div>
      <p style={{ color: "#64748B", marginBottom: 20, fontSize: 13 }}>
        Complete the booth challenge first, then scan the QR the presenter shows you.
      </p>
      <div id="qr-reader" style={{ width: "100%", borderRadius: 16, overflow: "hidden" }} />
    </div>
  );
}