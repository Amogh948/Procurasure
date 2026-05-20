import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Building2, Eye, EyeOff, Check } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --ps-navy:#090e1a; --ps-navy2:#0f1829;
    --ps-amber:#f0a500; --ps-teal:#0fcfb0;
    --ps-font-head:'Syne',sans-serif; --ps-font-body:'DM Sans',sans-serif;
  }
  @keyframes ps-fade-up  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ps-fade-in  { from{opacity:0} to{opacity:1} }
  @keyframes ps-slide-down { from{opacity:0;height:0;transform:translateY(-8px)} to{opacity:1;height:auto;transform:translateY(0)} }

  .ps-input {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08); border-radius:10px;
    padding:12px 16px; font-family:var(--ps-font-body); font-size:0.9rem;
    color:#e2e8f0; outline:none; transition:border-color 0.2s, box-shadow 0.2s;
    box-sizing:border-box;
  }
  .ps-input:focus { border-color:var(--ps-amber); box-shadow:0 0 0 3px rgba(240,165,0,0.1); }
  .ps-input::placeholder { color:#334155; }
  .ps-input.pw { padding-right:44px; }

  .ps-label {
    display:block; font-family:var(--ps-font-head); font-size:0.73rem; font-weight:700;
    text-transform:uppercase; letter-spacing:0.08em; color:#64748b; margin-bottom:6px;
  }
  .ps-fg { margin-bottom:16px; }

  .ps-tab-btn {
    flex:1; padding:11px 8px; border:none; cursor:pointer; border-radius:8px;
    font-family:var(--ps-font-head); font-size:0.82rem; font-weight:700;
    display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.25s;
  }

  .ps-submit {
    width:100%; padding:14px; border:none; cursor:pointer; border-radius:10px;
    background:linear-gradient(135deg,#f0a500,#d97706);
    font-family:var(--ps-font-head); font-size:0.95rem; font-weight:700;
    color:#090e1a; display:flex; align-items:center; justify-content:center; gap:10px;
    transition:all 0.25s; box-shadow:0 4px 20px rgba(240,165,0,0.3); margin-top:8px;
  }
  .ps-submit:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(240,165,0,0.45); }

  .ps-company-section {
    border:1px solid rgba(240,165,0,0.15); border-radius:12px;
    padding:20px; margin-bottom:16px;
    background:rgba(240,165,0,0.03);
    animation:ps-slide-down 0.3s ease;
  }

  .ps-pw-strength { display:flex; gap:4px; margin-top:8px; }
  .ps-pw-bar { flex:1; height:3px; border-radius:3px; transition:background 0.3s; }

  .ps-perks { display:grid; gap:8px; margin-top:12px; }
  .ps-perk { display:flex; align-items:center; gap:8px; font-size:0.8rem; color:rgba(255,255,255,0.5); }
`;

const getStrength = pw => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH_LABELS = ['','Weak','Fair','Good','Strong'];
const STRENGTH_COLORS = ['#334155','#ef4444','#f59e0b','#3b82f6','#10b981'];

const PERKS = ['Access verified industrial suppliers','Bulk order management','Real-time inventory tracking','Dedicated account manager'];
const PERKS_BUSINESS = ['Priority procurement support','Custom pricing & contracts','Multi-user team accounts','Advanced analytics dashboard'];

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'', companyName:'', taxId:'', address:'', website:'' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const pwStrength = getStrength(formData.password);

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    try {
      await register({
        name:formData.name, email:formData.email, password:formData.password, role,
        companyDetails: role==='superadmin' ? { companyName:formData.companyName, taxId:formData.taxId, address:formData.address, website:formData.website } : undefined
      });
      navigate(redirect ? (redirect.startsWith('/')?redirect:`/${redirect}`) : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const perks = role === 'superadmin' ? PERKS_BUSINESS : PERKS;

  return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', overflow:'hidden' }}>
      <style>{STYLES}</style>

      {/* BG blobs */}
      <div style={{ position:'fixed', top:'10%', right:'5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(240,165,0,0.05),transparent 70%)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'fixed', bottom:'10%', left:'5%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(15,207,176,0.04),transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:40, maxWidth:860, width:'100%', position:'relative', zIndex:1, animation:'ps-fade-up 0.6s ease' }}>

        {/* Left: Benefits panel */}
        <div style={{
          background:'linear-gradient(145deg,rgba(26,37,64,0.8),rgba(15,24,41,0.9))',
          border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'36px 28px',
          display:'flex', flexDirection:'column',
        }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.3rem', fontWeight:800, color:'#f1f5f9', marginBottom:6 }}>
              Join Procura<span style={{ color:'#f0a500' }}>sure</span>
            </div>
            <p style={{ color:'#475569', fontSize:'0.84rem', lineHeight:1.6 }}>
              {role==='superadmin' ? 'Business account for sourcing managers and procurement teams.' : 'Personal account for browsing, ordering and tracking products.'}
            </p>
          </div>

          {/* Animated illustration */}
          <div style={{ position:'relative', height:120, marginBottom:28 }}>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:90, height:90, borderRadius:'50%', border:'1px solid rgba(240,165,0,0.15)', position:'absolute' }}/>
              <div style={{ width:60, height:60, borderRadius:'50%', border:'1px dashed rgba(240,165,0,0.1)', position:'absolute' }}/>
              <div style={{
                width:48, height:48, borderRadius:12,
                background:'linear-gradient(135deg,#f0a500,#d97706)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 8px 24px rgba(240,165,0,0.3)',
                animation:'ps-fade-up 0.5s ease',
              }}>
                {role==='superadmin' ? <Building2 size={22} color="#090e1a"/> : <UserPlus size={22} color="#090e1a"/>}
              </div>
            </div>
          </div>

          <div style={{ marginBottom:'auto' }}>
            <p style={{ fontFamily:'var(--ps-font-head)', fontSize:'0.73rem', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>
              What you get
            </p>
            <div className="ps-perks">
              {perks.map(p => (
                <div key={p} className="ps-perk">
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(240,165,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Check size={10} color="#f0a500"/>
                  </div>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:28, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:'0.8rem', color:'#334155', textAlign:'center' }}>
            Already registered?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color:'#f0a500', fontWeight:600, textDecoration:'none' }}>
              Sign in here
            </Link>
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ background:'linear-gradient(145deg,rgba(26,37,64,0.8),rgba(15,24,41,0.9))', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'36px 32px' }}>
          <h1 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9', marginBottom:6 }}>Create Account</h1>
          <p style={{ color:'#475569', fontSize:'0.85rem', marginBottom:28 }}>Join the Procurasure business network</p>

          {/* Role toggle */}
          <div style={{ display:'flex', gap:6, marginBottom:28, padding:5, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>
            {[['user','Regular User', UserPlus], ['superadmin','Business Admin', Building2]].map(([r, label, Icon]) => (
              <button key={r} className="ps-tab-btn" onClick={()=>setRole(r)} style={{
                background: role===r ? 'linear-gradient(135deg,rgba(240,165,0,0.15),rgba(240,165,0,0.08))' : 'transparent',
                color: role===r ? '#f0a500' : '#475569',
                border: role===r ? '1px solid rgba(240,165,0,0.25)' : '1px solid transparent',
              }}>
                <Icon size={15}/> {label}
              </button>
            ))}
          </div>

          {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', color:'#f87171', fontSize:'0.83rem', marginBottom:18, textAlign:'center' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="ps-fg">
                <label className="ps-label">Full Name</label>
                <input className="ps-input" type="text" name="name" placeholder="John Smith" required onChange={handleChange}/>
              </div>
              <div className="ps-fg">
                <label className="ps-label">Email Address</label>
                <input className="ps-input" type="email" name="email" placeholder="john@company.com" required onChange={handleChange}/>
              </div>
            </div>

            {role === 'superadmin' && (
              <div className="ps-company-section">
                <p style={{ fontFamily:'var(--ps-font-head)', fontSize:'0.75rem', fontWeight:700, color:'#f0a500', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>Business Details</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="ps-fg" style={{ marginBottom:10 }}>
                    <label className="ps-label">Company Name</label>
                    <input className="ps-input" type="text" name="companyName" placeholder="Procurasure Ltd" required onChange={handleChange}/>
                  </div>
                  <div className="ps-fg" style={{ marginBottom:10 }}>
                    <label className="ps-label">Tax ID / Reg. No.</label>
                    <input className="ps-input" type="text" name="taxId" placeholder="123-456-789" required onChange={handleChange}/>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="ps-fg">
                <label className="ps-label">Password</label>
                <div style={{ position:'relative' }}>
                  <input className="ps-input pw" type={showPw?'text':'password'} name="password" placeholder="Min. 8 characters" required onChange={handleChange}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:'#475569', padding:4 }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {formData.password && (
                  <div className="ps-pw-strength">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="ps-pw-bar" style={{ background: i<=pwStrength ? STRENGTH_COLORS[pwStrength] : 'rgba(255,255,255,0.06)' }}/>
                    ))}
                  </div>
                )}
                {formData.password && <p style={{ fontSize:'0.72rem', color:STRENGTH_COLORS[pwStrength], marginTop:4 }}>{STRENGTH_LABELS[pwStrength]}</p>}
              </div>
              <div className="ps-fg">
                <label className="ps-label">Confirm Password</label>
                <input className="ps-input" type="password" name="confirmPassword" placeholder="••••••••" required onChange={handleChange}/>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p style={{ fontSize:'0.72rem', color:'#f87171', marginTop:4 }}>Passwords don't match</p>
                )}
              </div>
            </div>

            <button type="submit" className="ps-submit">
              <Check size={16}/>
              Register as {role === 'superadmin' ? 'Business Admin' : 'User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;