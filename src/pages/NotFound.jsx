import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0612; color: #E9D5FF; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .dot-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .dot-grid svg { opacity: 0.06; width: 100%; height: 100%; }
  .wrap { max-width: 480px; margin: 0 auto; padding: 40px 20px; position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .logo { display: inline-block; background: #C4197D; color: #fff; font-family: 'Space Grotesk',sans-serif; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 6px; margin-bottom: 32px; letter-spacing: 1px; }
  .code { font-family: 'Space Grotesk',sans-serif; font-size: 80px; font-weight: 800; color: #C4197D; line-height: 1; margin-bottom: 12px; opacity: 0.4; }
  .title { font-family: 'Space Grotesk',sans-serif; font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 10px; }
  .sub { font-size: 14px; color: #6B4F8B; line-height: 1.7; margin-bottom: 32px; }
  .btn-primary { padding: 14px 32px; border-radius: 14px; font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; cursor: pointer; border: none; background: linear-gradient(135deg,#C4197D,#7C3AED); color: #fff; transition: all 0.2s; margin-bottom: 10px; display: block; width: 100%; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-ghost { padding: 13px 32px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: 'Inter',sans-serif; cursor: pointer; background: rgba(26,13,46,0.6); color: #9CA3AF; border: 1px solid rgba(124,58,237,0.2); transition: all 0.2s; display: block; width: 100%; }
  .btn-ghost:hover { border-color: rgba(196,25,125,0.4); color: #E9D5FF; }
`;

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <style>{css}</style>
      <div className="dot-grid">
        <svg><defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C4197D" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      </div>
      <div className="wrap">
        <div className="logo">MIMOS</div>
        <div className="code">404</div>
        <h1 className="title">Page not found</h1>
        <p className="sub">The page you're looking for doesn't exist.<br />Check the URL or go back to the passport.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Go to Passport →</button>
        <button className="btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    </>
  );
}
