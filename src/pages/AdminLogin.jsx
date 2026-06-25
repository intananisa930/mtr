import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }

  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }

  .wrap { max-width: 400px; margin: 0 auto; padding: 80px 20px; position: relative; z-index: 1; }

  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 24px; letter-spacing: 1px; }

  .title { font-family: 'Space Grotesk',sans-serif; font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 8px;
    background: linear-gradient(135deg,#fff,#E9D5FF,#C4197D);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .subtitle { font-size: 14px; color: #6B4F8B; margin-bottom: 32px; line-height: 1.6; }

  .card { background: rgba(26,13,46,0.8); border: 1px solid rgba(196,25,125,0.2); border-radius: 20px; padding: 28px; backdrop-filter: blur(8px); }
  .flabel { font-size: 11px; font-weight: 600; color: #7C3AED; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .finput { width: 100%; background: rgba(10,6,18,0.6); border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 14px 16px; font-size: 15px; color: #F3E8FF; font-family: 'Inter',sans-serif; outline: none; transition: all 0.2s; margin-bottom: 16px; }
  .finput:focus { border-color: #C4197D; box-shadow: 0 0 0 3px rgba(196,25,125,0.1); }
  .finput::placeholder { color: #4B3B6B; }

  .btn-primary { width: 100%; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; box-shadow: 0 4px 20px rgba(196,25,125,0.4); transition: all 0.2s; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(196,25,125,0.5); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .err { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); color: #F87171; font-size: 13px; padding: 12px 14px; border-radius: 10px; margin-bottom: 16px; }
  .back-link { text-align: center; margin-top: 16px; font-size: 12px; color: #4B3B6B; }
  .back-link a { color: #7C3AED; text-decoration: none; font-weight: 600; }
`;

export default function AdminLogin() {
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!staffId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await supabase
        .from("admins")
        .select("staff_id, name")
        .eq("staff_id", staffId.trim())
        .single();

      if (!data) {
        setError("Access denied. Your Staff ID is not authorised.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("adminName", data.name || staffId);
      navigate("/admin");
    } catch (err) {
      setError("Access denied. Your Staff ID is not authorised.");
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
        <div className="logo">MIMOS</div>
        <h2 className="title">Admin Login</h2>
        <p className="subtitle">Enter your Staff ID to access the MTR Innovation Passport Challenge dashboard.</p>
        <div className="card">
          <label className="flabel">Staff ID</label>
          <input
            className="finput"
            placeholder="Enter your Staff ID"
            value={staffId}
            onChange={e => setStaffId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          {error && <div className="err">{error}</div>}
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Checking..." : "Login →"}
          </button>
          <p className="back-link"><a href="/">← Back to Passport</a></p>
        </div>
      </div>
    </>
  );
}
