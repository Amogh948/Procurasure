import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, ArrowRight, MessageSquare, Clock } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --ps-navy:#090e1a; --ps-navy2:#0f1829; --ps-slate:#1a2540;
    --ps-amber:#f0a500; --ps-teal:#0fcfb0; --ps-muted:#6b7a99;
    --ps-font-head:'Syne',sans-serif; --ps-font-body:'DM Sans',sans-serif;
  }
  @keyframes ps-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ps-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ps-success-pop { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }

  .ps-input {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08); border-radius:10px;
    padding:13px 16px; font-family:var(--ps-font-body); font-size:0.92rem;
    color:#e2e8f0; outline:none; transition:border-color 0.2s, box-shadow 0.2s;
    box-sizing:border-box;
  }
  .ps-input:focus { border-color:var(--ps-amber); box-shadow:0 0 0 3px rgba(240,165,0,0.1); }
  .ps-input::placeholder { color:#334155; }

  .ps-label {
    display:block; font-family:var(--ps-font-head); font-size:0.78rem; font-weight:700;
    text-transform:uppercase; letter-spacing:0.08em; color:#64748b; margin-bottom:8px;
  }

  .ps-submit-btn {
    width:100%; padding:15px; border:none; cursor:pointer; border-radius:10px;
    background:linear-gradient(135deg,#f0a500,#d97706);
    font-family:var(--ps-font-head); font-size:1rem; font-weight:700; letter-spacing:0.02em;
    color:#090e1a; display:flex; align-items:center; justify-content:center; gap:10px;
    transition:all 0.25s; box-shadow:0 4px 20px rgba(240,165,0,0.3);
  }
  .ps-submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(240,165,0,0.45); }
  .ps-submit-btn:disabled { opacity:0.6; cursor:not-allowed; }

  .ps-contact-info-card {
    display:flex; align-items:flex-start; gap:16px; padding:24px;
    background:linear-gradient(145deg,rgba(26,37,64,0.7),rgba(15,24,41,0.8));
    border:1px solid rgba(255,255,255,0.06); border-radius:14px;
    transition:border-color 0.2s, transform 0.2s;
  }
  .ps-contact-info-card:hover { border-color:rgba(240,165,0,0.2); transform:translateX(4px); }
`;

const CONTACT_ITEMS = [
  {
    icon: Mail, color: '#f0a500',
    title: 'Email Us',
    value: 'sales.procurasure@gmail.com',
    sub: 'Usually responds within 2 hours',
  },
  {
    icon: Phone, color: '#0fcfb0',
    title: 'Call Us',
    value: '+1 (555) 000-1234',
    sub: 'Mon–Fri, 9am–6pm EST',
  },
  {
    icon: MapPin, color: '#818cf8',
    title: 'Visit Us',
    value: '123 Industrial Way',
    sub: 'Business District, NY 10001',
  },
  {
    icon: Clock, color: '#fb923c',
    title: 'Working Hours',
    value: 'Mon–Fri: 9am–6pm',
    sub: 'Weekend: Emergency support only',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState({ loading:false, success:false, error:null });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading:true, success:false, error:null });
    try {
      await axios.post('/api/contact', formData);
      setStatus({ loading:false, success:true, error:null });
      setFormData({ name:'', email:'', subject:'', message:'' });
    } catch {
      setStatus({ loading:false, success:false, error:'Failed to send message. Please try again.' });
    }
  };

  return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0', minHeight:'100vh' }}>
      <style>{STYLES}</style>

      {/* ── Header ── */}
      <div style={{
        background:'linear-gradient(180deg,#0f1829,#090e1a)',
        borderBottom:'1px solid rgba(240,165,0,0.1)',
        padding:'60px 40px 52px', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(240,165,0,0.06), transparent)' }}/>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:16,
            fontFamily:'var(--ps-font-head)', fontSize:'0.72rem', fontWeight:700, color:'#f0a500',
            textTransform:'uppercase', letterSpacing:'0.14em' }}>
            <span style={{ width:20, height:2, background:'#f0a500', display:'inline-block' }}/>
            Contact Us
            <span style={{ width:20, height:2, background:'#f0a500', display:'inline-block' }}/>
          </div>
          <h1 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:800, color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.02em' }}>
            Let's Talk <span style={{ background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Business</span>
          </h1>
          <p style={{ color:'#94a3b8', fontSize:'1.05rem', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
            Our industrial sales team is ready to help you source the right products at the right price.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'60px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:60, alignItems:'start' }}>

          {/* Left: Info cards */}
          <div style={{ animation:'ps-fade-up 0.6s ease both' }}>
            <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.4rem', fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>Contact Information</h2>
            <p style={{ color:'#94a3b8', marginBottom:32, fontSize:'0.9rem', lineHeight:1.7 }}>
              Reach out through any of the channels below or use the form to send us a message directly.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {CONTACT_ITEMS.map(({ icon:Icon, color, title, value, sub }, i) => (
                <div key={title} className="ps-contact-info-card" style={{ animationDelay:`${i*0.08}s` }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={20} color={color}/>
                  </div>
                  <div>
                    <p style={{ fontFamily:'var(--ps-font-head)', fontSize:'0.78rem', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{title}</p>
                    <p style={{ color:'#e2e8f0', fontWeight:600, marginBottom:2, fontSize:'0.92rem' }}>{value}</p>
                    <p style={{ color:'#334155', fontSize:'0.78rem' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative map-like graphic */}
            <div style={{
              marginTop:28, padding:24, borderRadius:14,
              background:'linear-gradient(135deg,rgba(240,165,0,0.06),rgba(15,207,176,0.04))',
              border:'1px solid rgba(240,165,0,0.12)', textAlign:'center',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:8 }}>
                <MessageSquare size={18} color="#f0a500"/>
                <span style={{ fontFamily:'var(--ps-font-head)', fontWeight:700, color:'#94a3b8', fontSize:'0.85rem' }}>Average Response Time</span>
              </div>
              <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'2rem', fontWeight:800, background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                &lt; 2 Hours
              </div>
              <p style={{ color:'#334155', fontSize:'0.78rem', marginTop:4 }}>During business hours</p>
            </div>
          </div>

          {/* Right: Form */}
          <div style={{
            background:'linear-gradient(145deg,rgba(26,37,64,0.85),rgba(15,24,41,0.9))',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:20, padding:'40px',
            animation:'ps-fade-up 0.7s ease both 0.1s',
          }}>
            {status.success ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(16,185,129,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', animation:'ps-success-pop 0.5s ease' }}>
                  <Send size={32} color="#10b981"/>
                </div>
                <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.4rem', fontWeight:800, color:'#f1f5f9', marginBottom:10 }}>Message Sent!</h3>
                <p style={{ color:'#64748b', lineHeight:1.7, marginBottom:32, fontSize:'0.92rem' }}>
                  Thank you for reaching out. Our team will get back to you within 2 business hours.
                </p>
                <button style={{
                  padding:'12px 28px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
                  background:'transparent', color:'#94a3b8', cursor:'pointer',
                  fontFamily:'var(--ps-font-head)', fontWeight:600, transition:'all 0.2s',
                }}
                onClick={()=>setStatus({...status,success:false})}
                onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'}
                onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.2rem', fontWeight:800, color:'#f1f5f9', marginBottom:28 }}>Send a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                    <div>
                      <label className="ps-label">Full Name</label>
                      <input className="ps-input" type="text" name="name" placeholder="John Smith" required value={formData.name} onChange={handleChange}/>
                    </div>
                    <div>
                      <label className="ps-label">Email Address</label>
                      <input className="ps-input" type="email" name="email" placeholder="john@company.com" required value={formData.email} onChange={handleChange}/>
                    </div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label className="ps-label">Subject</label>
                    <input className="ps-input" type="text" name="subject" placeholder="How can we help you?" required value={formData.subject} onChange={handleChange}/>
                  </div>
                  <div style={{ marginBottom:24 }}>
                    <label className="ps-label">Message</label>
                    <textarea className="ps-input" name="message" rows={5} placeholder="Describe your procurement needs in detail…" required style={{ resize:'vertical' }} value={formData.message} onChange={handleChange}/>
                  </div>
                  {status.error && (
                    <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, color:'#f87171', fontSize:'0.84rem', marginBottom:20 }}>
                      {status.error}
                    </div>
                  )}
                  <button type="submit" className="ps-submit-btn" disabled={status.loading}>
                    {status.loading ? 'Sending…' : <><Send size={17}/> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;