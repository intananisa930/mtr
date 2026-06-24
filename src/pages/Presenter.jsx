import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import QRCode from "qrcode";

export default function Presenter() {
  const { boothId } = useParams();
  const [qrSrc, setQrSrc] = useState(null);
  const [booth, setBooth] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const loadBooth = async () => {
      const { data } = await supabase
        .from("booths")
        .select("*")
        .eq("booth_id", boothId)
        .single();
      setBooth(data);
    };
    loadBooth();
  }, [boothId]);

  const generateToken = async () => {
    const token = crypto.randomUUID().slice(0, 12);
    const expiry = new Date(Date.now() + 60000).toISOString();

    await supabase
      .from("booths")
      .update({ token, token_expiry: expiry })
      .eq("booth_id", boothId);

    const payload = JSON.stringify({ boothId, token });
    const url = await QRCode.toDataURL(payload, { width: 400, margin: 2 });
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

  return (
    <div style={{ textAlign: "center", padding: 40, background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 8, fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
        {booth?.domain_name}
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{booth?.name}</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>{booth?.use_case}</p>

      {qrSrc && (
        <img
          src={qrSrc}
          alt="Booth QR"
          style={{ width: 300, height: 300, margin: "0 auto 24px", display: "block", borderRadius: 16 }}
        />
      )}

      <div style={{ fontSize: 64, fontWeight: 700, color: secondsLeft <= 10 ? "#E8002D" : "#10B981", marginBottom: 8 }}>
        {secondsLeft}s
      </div>
      <p style={{ color: "#444", fontSize: 13 }}>QR refreshes automatically every 60 seconds</p>
      <p style={{ color: "#333", fontSize: 12, marginTop: 8 }}>Booth ID: {boothId}</p>
    </div>
  );
}