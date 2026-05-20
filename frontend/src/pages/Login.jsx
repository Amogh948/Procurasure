import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, Users, Globe2, Eye, EyeOff, ArrowRight } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --ps-navy:#090e1a; --ps-navy2:#0f1829; --ps-slate:#1a2540;
    --ps-amber:#f0a500; --ps-teal:#0fcfb0;
    --ps-font-head:'Syne',sans-serif; --ps-font-body:'DM Sans',sans-serif;
  }
  @keyframes ps-fade-up  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ps-fade-in  { from{opacity:0} to{opacity:1} }
  @keyframes ps-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes ps-ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes ps-pulse    { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }

  .ps-split { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
  @media(max-width:900px){ .ps-split{ grid-template-columns:1fr; } .ps-hero-panel{ display:none!important; } }

  .ps-input-wrap { position:relative; }
  .ps-input {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08); border-radius:10px;
    padding:13px 16px; font-family:var(--ps-font-body); font-size:0.92rem;
    color:#e2e8f0; outline:none; transition:border-color 0.2s, box-shadow 0.2s;
    box-sizing:border-box;
  }
  .ps-input:focus { border-color:var(--ps-amber); box-shadow:0 0 0 3px rgba(240,165,0,0.1); }
  .ps-input::placeholder { color:#334155; }
  .ps-input.with-icon { padding-right:44px; }

  .ps-label {
    display:block; font-family:var(--ps-font-head); font-size:0.75rem; font-weight:700;
    text-transform:uppercase; letter-spacing:0.08em; color:FBF5DD; margin-bottom:8px;
  }
  .ps-form-group { margin-bottom:18px; }

  .ps-submit-btn {
    width:100%; padding:14px; border:none; cursor:pointer; border-radius:10px;
    background:linear-gradient(135deg,#f0a500,#d97706);
    font-family:var(--ps-font-head); font-size:0.95rem; font-weight:700; letter-spacing:0.02em;
    color:#090e1a; display:flex; align-items:center; justify-content:center; gap:10px;
    transition:all 0.25s; box-shadow:0 4px 20px rgba(240,165,0,0.3); margin-bottom:18px;
  }
  .ps-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(240,165,0,0.45); }

  .ps-google-btn {
    width:100%; padding:13px; border:1px solid rgba(255,255,255,0.1); border-radius:10px;
    background:transparent; cursor:pointer; font-family:var(--ps-font-head); font-weight:600; font-size:0.88rem;
    color:#94a3b8; display:flex; align-items:center; justify-content:center; gap:10px;
    transition:all 0.2s; margin-bottom:24px;
  }
  .ps-google-btn:hover { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.2); }

  .ps-error {
    background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);
    border-radius:8px; padding:10px 14px; color:#f87171; font-size:0.84rem; margin-bottom:18px; text-align:center;
  }

  .ps-feature-row {
    display:flex; align-items:flex-start; gap:14px;
    transition:transform 0.2s;
  }
  .ps-feature-row:hover { transform:translateX(4px); }

  .ps-icon-wrap {
    width:40px; height:40px; border-radius:10px; flex-shrink:0;
    background:rgba(255,255,255,0.1); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
  }
`;

const FEATURES = [
  { icon: Users,      color:'#fbbf24', title:'50K+ Satisfied Businesses', sub:'Global operations from SMB to enterprise.' },
  { icon: ShieldCheck,color:'#0fcfb0', title:'100% Certified Suppliers',  sub:'Every supplier vetted for maximum quality.' },
  { icon: Globe2,     color:'#818cf8', title:'Worldwide Sourcing & Logistics', sub:'Seamless supply chain, fast express shipping.' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(redirect ? (redirect.startsWith('/')?redirect:`/${redirect}`) : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'https://localhost:5000';
    window.location.href = `${apiURL}/api/auth/google`;
  };

  return (
    <div className="ps-split" style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0' }}>
      <style>{STYLES}</style>

      {/* ── Left: Hero Panel ── */}
      <div className="ps-hero-panel" style={{
        position:'relative', overflow:'hidden',
        background:'linear-gradient(145deg,#090e1a,#0f1829)',
        display:'flex', alignItems:'center',
      }}>
        {/* Background image overlay */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:"url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize:'cover', backgroundPosition:'center',
          opacity:0.12,
        }}/>
        {/* Gradient overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(9,14,26,0.95) 0%,rgba(9,14,26,0.7) 100%)' }}/>
        {/* Amber blob */}
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(240,165,0,0.1),transparent 70%)' }}/>
        <div style={{ position:'absolute', top:'15%', left:'-5%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(15,207,176,0.06),transparent 70%)' }}/>

        <div style={{ position:'relative', padding:'60px 48px', zIndex:1, animation:'ps-fade-in 0.8s ease' }}>
          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8, marginBottom:28,
            background:'rgba(240,165,0,0.15)', backdropFilter:'blur(8px)',
            border:'1px solid rgba(240,165,0,0.25)', borderRadius:20,
            padding:'6px 16px', fontSize:'0.75rem', fontFamily:'var(--ps-font-head)',
            fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#f0a500',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#f0a500', display:'inline-block', animation:'ps-pulse 2s ease infinite' }}/>
            Industry Leader Since 2018
          </div>

          <h2 style={{
            fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.8rem,3vw,2.8rem)',
            fontWeight:800, lineHeight:1.15, color:'#f1f5f9', marginBottom:20, letterSpacing:'-0.02em',
          }}>
            Procurement<br/>
            <span style={{ background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Simplified,
            </span>{' '}Globally.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:44, lineHeight:1.75, fontSize:'0.95rem', maxWidth:380 }}>
            Join 50,000+ active businesses who trust Procurasure for daily operations, bulk sourcing, and precision industrial procurement.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {FEATURES.map(({ icon:Icon, color, title, sub }) => (
              <div key={title} className="ps-feature-row">
                <div className="ps-icon-wrap">
                  <Icon size={18} color={color}/>
                </div>
                <div>
                  <p style={{ fontFamily:'var(--ps-font-head)', fontWeight:700, color:'#f1f5f9', fontSize:'0.9rem', marginBottom:3 }}>{title}</p>
                  <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.45)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stat row */}
          <div style={{ display:'flex', gap:32, marginTop:44, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            {[['50K+','Businesses'],['99%','Uptime'],['140+','Countries']].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.4rem', fontWeight:800, color:'#f0a500' }}>{v}</div>
                <div style={{ fontSize:'0.73rem', color:'rgba(255,255,255,0.35)', marginTop:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div style={{ background:'#090e1a', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 50% 40%, rgba(240,165,0,0.04), transparent 60%)' }}/>
        <div style={{ width:'100%', maxWidth:420, position:'relative', animation:'ps-fade-up 0.6s ease' }}>

          {/* Logo / Brand */}
          <div style={{ marginBottom:36, textAlign:'center' }}>
            <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9', letterSpacing:'-0.02em', marginBottom:8 }}>
              Procura<span style={{ color:'#f0a500' }}>sure</span>
            </div>
            <p style={{ color:'#475569', fontSize:'0.88rem' }}>Sign in to your account</p>
          </div>

          <div style={{
            background:'linear-gradient(145deg,rgba(26,37,64,0.85),rgba(15,24,41,0.9))',
            border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'36px 32px',
          }}>
            {error && <div className="ps-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="ps-form-group">
                <label className="ps-label">Email Address</label>
                <input className="ps-input" type="email" placeholder="company@email.com" required value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
              <div className="ps-form-group" style={{ marginBottom:28 }}>
                <label className="ps-label">Password</label>
                <div className="ps-input-wrap">
                  <input className="ps-input with-icon" type={showPw?'text':'password'} placeholder="••••••••" required value={password} onChange={e=>setPassword(e.target.value)}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{
                    position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'transparent', border:'none', cursor:'pointer', color:'#475569', padding:4,
                  }}>
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button type="submit" className="ps-submit-btn">
                <LogIn size={17}/> Sign In to Account
              </button>
            </form>

            <div style={{ position:'relative', textAlign:'center', marginBottom:18 }}>
              <div style={{ height:1, background:'rgba(255,255,255,0.07)' }}/>
              <span style={{
                position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                background:'#0f1829', padding:'0 12px', fontSize:'0.72rem', color:'#94a3b8',
                textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap',
              }}>or continue with</span>
            </div>

            <button type="button" onClick={handleGoogleLogin} className="ps-google-btn">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width:18 }}/>
              Continue with Google
            </button>

            <p style={{ textAlign:'center', fontSize:'0.84rem', color:'#475569' }}>
              No account?{' '}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color:'#f0a500', fontFamily:'var(--ps-font-head)', fontWeight:700, textDecoration:'none' }}>
                Register here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;