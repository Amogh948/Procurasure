import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Package, Users } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

/* ─── Shared animation styles injected once ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --ps-navy:   #090e1a;
    --ps-navy2:  #0f1829;
    --ps-slate:  #1a2540;
    --ps-amber:  #f0a500;
    --ps-amber2: #fbbf24;
    --ps-teal:   #0fcfb0;
    --ps-muted:  #6b7a99;
    --ps-line:   rgba(240,165,0,0.18);
    --ps-font-head: 'Syne', sans-serif;
    --ps-font-body: 'DM Sans', sans-serif;
  }

  @keyframes ps-fade-up {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ps-fade-in {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes ps-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-12px) rotate(2deg); }
  }
  @keyframes ps-pulse-ring {
    0%   { transform:scale(1);   opacity:0.6; }
    100% { transform:scale(1.8); opacity:0; }
  }
  @keyframes ps-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes ps-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes ps-bar-grow {
    from { width:0; }
    to   { width:var(--bar-w); }
  }
  @keyframes ps-orbit {
    from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
  }

  .ps-fade-up-1 { animation: ps-fade-up 0.7s ease both 0.1s; }
  .ps-fade-up-2 { animation: ps-fade-up 0.7s ease both 0.25s; }
  .ps-fade-up-3 { animation: ps-fade-up 0.7s ease both 0.4s; }
  .ps-fade-up-4 { animation: ps-fade-up 0.7s ease both 0.55s; }

  .ps-btn-primary {
    display:inline-flex; align-items:center; gap:10px;
    background: linear-gradient(135deg, var(--ps-amber), #d97706);
    color: var(--ps-navy);
    font-family: var(--ps-font-head);
    font-weight:700; font-size:0.95rem; letter-spacing:0.02em;
    padding:14px 28px; border-radius:6px; border:none; cursor:pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(240,165,0,0.35);
    text-decoration:none;
  }
  .ps-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(240,165,0,0.5);
  }
  .ps-btn-outline {
    display:inline-flex; align-items:center; gap:10px;
    background: transparent;
    color: #e2e8f0;
    font-family: var(--ps-font-head);
    font-weight:600; font-size:0.95rem; letter-spacing:0.02em;
    padding:14px 28px; border-radius:6px; border:1px solid rgba(226,232,240,0.3); cursor:pointer;
    transition: all 0.2s;
    text-decoration:none;
  }
  .ps-btn-outline:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(226,232,240,0.6);
  }

  .ps-stat-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    border: 1px solid rgba(240,165,0,0.15);
    border-radius:12px; padding:24px 28px;
    backdrop-filter:blur(8px);
    transition: border-color 0.2s, transform 0.2s;
  }
  .ps-stat-card:hover {
    border-color: rgba(240,165,0,0.4);
    transform: translateY(-4px);
  }

  .ps-feature-card {
    background: linear-gradient(145deg, rgba(26,37,64,0.9), rgba(15,24,41,0.95));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius:16px; padding:36px 28px;
    transition: all 0.3s ease;
    position:relative; overflow:hidden;
  }
  .ps-feature-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, var(--ps-amber), transparent);
    opacity:0; transition:opacity 0.3s;
  }
  .ps-feature-card:hover { transform:translateY(-6px); border-color:rgba(240,165,0,0.2); }
  .ps-feature-card:hover::before { opacity:1; }

  .ps-ticker-wrap {
    overflow:hidden; white-space:nowrap;
    background: linear-gradient(90deg, var(--ps-amber), #d97706);
    padding:10px 0;
  }
  .ps-ticker-inner {
    display:inline-block;
    animation: ps-ticker 30s linear infinite;
  }
  .ps-ticker-item {
    display:inline-flex; align-items:center; gap:8px;
    font-family: var(--ps-font-head); font-size:0.8rem; font-weight:700;
    color: var(--ps-navy); text-transform:uppercase; letter-spacing:0.08em;
    padding:0 40px;
  }

  .ps-section-label {
    display:inline-flex; align-items:center; gap:8px;
    font-family:var(--ps-font-head); font-size:0.72rem; font-weight:700;
    letter-spacing:0.14em; text-transform:uppercase;
    color: var(--ps-amber); margin-bottom:16px;
  }
  .ps-section-label::before {
    content:''; display:block; width:24px; height:2px;
    background: var(--ps-amber);
  }
`;

const TICKER_ITEMS = [
  'Verified Suppliers', 'Global Logistics', 'Bulk Orders', 'Fast Procurement',
  'ISO Certified', 'B2B Solutions', '50k+ Businesses', 'Real-time Inventory',
  'Verified Suppliers', 'Global Logistics', 'Bulk Orders', 'Fast Procurement',
  'ISO Certified', 'B2B Solutions', '50k+ Businesses', 'Real-time Inventory',
];

const STATS = [
  { value: '50K+',  label: 'Active Businesses', icon: Users },
  { value: '12K+',  label: 'Products Listed',   icon: Package },
  { value: '98%',   label: 'Fulfillment Rate',  icon: TrendingUp },
  { value: '140+',  label: 'Countries Served',  icon: Globe },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified Suppliers',
    desc: 'Every supplier on our platform undergoes a rigorous 10-point verification process ensuring quality and compliance.',
    color: '#f0a500',
  },
  {
    icon: Zap,
    title: 'Fast Procurement',
    desc: 'Streamlined workflows move your orders from warehouse to doorstep in record time with live tracking.',
    color: '#0fcfb0',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Access markets and products from across the globe with full transparency in shipping and logistics.',
    color: '#818cf8',
  },
];

/* ─── Animated background grid ─── */
const GridBg = () => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f0a500" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

/* ─── Orbiting dot graphic ─── */
const OrbitGraphic = () => (
  <div style={{ position:'relative', width:160, height:160, flexShrink:0 }}>
    <div style={{
      position:'absolute', inset:0, borderRadius:'50%',
      border:'1px solid rgba(240,165,0,0.2)',
    }}/>
    <div style={{
      position:'absolute', inset:20, borderRadius:'50%',
      border:'1px dashed rgba(240,165,0,0.15)',
    }}/>
    <div style={{
      position:'absolute', top:'50%', left:'50%',
      transform:'translate(-50%,-50%)',
      width:48, height:48, borderRadius:'50%',
      background:'linear-gradient(135deg,#f0a500,#d97706)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 0 30px rgba(240,165,0,0.5)',
    }}>
      <Package size={22} color="#090e1a"/>
    </div>
    {[0,120,240].map((deg, i) => (
      <div key={i} style={{
        position:'absolute', top:'50%', left:'50%',
        width:12, height:12, borderRadius:'50%',
        background: i===0 ? '#f0a500' : i===1 ? '#0fcfb0' : '#818cf8',
        marginTop:-6, marginLeft:-6,
        animation:`ps-orbit ${3+i}s linear infinite`,
        animationDelay:`${i*-1}s`,
        transformOrigin:'center',
      }}/>
    ))}
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const localPopularity = localStorage.getItem('cartPopularity');
        const popularity = localPopularity ? JSON.parse(localPopularity) : {};
        const sorted = data.sort((a, b) => (popularity[b._id]||0) - (popularity[a._id]||0));
        setFeaturedProducts(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error fetching popular products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'var(--ps-navy)', color:'#e2e8f0', overflowX:'hidden' }}>
      <style>{STYLES}</style>

      {/* ── Ticker ── */}
      <div className="ps-ticker-wrap">
        <div className="ps-ticker-inner">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="ps-ticker-item">
              <span style={{ width:4, height:4, borderRadius:'50%', background:'currentColor', display:'inline-block' }}/>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{
        position:'relative', minHeight:'92vh',
        background: `radial-gradient(ellipse 80% 60% at 60% 40%, rgba(240,165,0,0.08) 0%, transparent 70%),
                     radial-gradient(ellipse 50% 50% at 10% 80%, rgba(15,207,176,0.05) 0%, transparent 60%),
                     linear-gradient(180deg, #090e1a 0%, #0f1829 100%)`,
        display:'flex', alignItems:'center', padding:'80px 0 60px',
        overflow:'hidden',
      }}>
        <GridBg/>

        {/* Decorative blur blobs */}
        <div style={{ position:'absolute', top:'15%', right:'5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(240,165,0,0.07), transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'10%', left:'-5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(15,207,176,0.06), transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', width:'100%', position:'relative', zIndex:1 }}>
          {/* Left copy */}
          <div>
            <div className="ps-section-label ps-fade-up-1">Industrial Procurement Platform</div>
            <h1 className="ps-fade-up-2" style={{
              fontFamily:'var(--ps-font-head)', fontSize:'clamp(2.4rem,5vw,3.8rem)',
              fontWeight:800, lineHeight:1.1, color:'#f1f5f9', margin:'0 0 24px',
              letterSpacing:'-0.02em',
            }}>
              Precision Procurement<br/>
              <span style={{ background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                for Modern
              </span>{' '}Industries
            </h1>
            <p className="ps-fade-up-3" style={{ fontSize:'1.1rem', color:'#94a3b8', lineHeight:1.75, marginBottom:40, maxWidth:460 }}>
              Procurasure connects you with high-quality industrial products and verified suppliers globally — streamlining every step of your supply chain.
            </p>
            <div className="ps-fade-up-4" style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <Link to="/products" className="ps-btn-primary">
                Browse Catalog <ArrowRight size={18}/>
              </Link>
              <Link to="/contact" className="ps-btn-outline">
                Contact Sales
              </Link>
            </div>

            {/* Mini stats row */}
            <div style={{ display:'flex', gap:32, marginTop:48, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              {[['50K+','Businesses'],['12K+','Products'],['98%','Fulfillment']].map(([v,l]) => (
                <div key={l} style={{ animation:'ps-fade-up 0.7s ease both 0.7s', opacity:0, animationFillMode:'both' }}>
                  <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.6rem', fontWeight:800, color:'#f0a500', lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:'0.78rem', color:'#64748b', marginTop:4, fontWeight:500, letterSpacing:'0.05em', textTransform:'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right graphic */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', position:'relative' }}>
            <div style={{
              position:'relative', width:380, height:380,
              animation:'ps-float 6s ease-in-out infinite',
            }}>
              {/* Outer ring */}
              <div style={{
                position:'absolute', inset:0, borderRadius:'50%',
                border:'1px solid rgba(240,165,0,0.12)',
              }}/>
              {/* Middle ring */}
              <div style={{
                position:'absolute', inset:40, borderRadius:'50%',
                border:'1px dashed rgba(240,165,0,0.1)',
              }}/>
              {/* Center card */}
              <div style={{
                position:'absolute', top:'50%', left:'50%',
                transform:'translate(-50%,-50%)',
                width:200, height:200, borderRadius:20,
                background:'linear-gradient(135deg, rgba(26,37,64,0.95), rgba(15,24,41,0.98))',
                border:'1px solid rgba(240,165,0,0.25)',
                boxShadow:'0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(240,165,0,0.08)',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
              }}>
                <div style={{
                  width:56, height:56, borderRadius:14,
                  background:'linear-gradient(135deg,#f0a500,#d97706)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 8px 24px rgba(240,165,0,0.4)',
                }}>
                  <Package size={28} color="#090e1a"/>
                </div>
                <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.3rem', fontWeight:800, color:'#f1f5f9' }}>12K+</div>
                <div style={{ fontSize:'0.75rem', color:'#64748b', fontWeight:500 }}>Products Listed</div>
              </div>

              {/* Orbiting chips */}
              {[
                { label:'Verified', color:'#f0a500', angle:0 },
                { label:'Global',   color:'#0fcfb0', angle:120 },
                { label:'Fast',     color:'#818cf8', angle:240 },
              ].map(({ label, color, angle }) => {
                const rad = (angle * Math.PI) / 180;
                const r = 155;
                return (
                  <div key={label} style={{
                    position:'absolute',
                    top: `calc(50% + ${Math.sin(rad)*r}px)`,
                    left:`calc(50% + ${Math.cos(rad)*r}px)`,
                    transform:'translate(-50%,-50%)',
                    background:'rgba(15,24,41,0.95)',
                    border:`1px solid ${color}33`,
                    borderRadius:20, padding:'6px 14px',
                    fontFamily:'var(--ps-font-head)',
                    fontSize:'0.72rem', fontWeight:700,
                    color, whiteSpace:'nowrap',
                    boxShadow:`0 4px 16px rgba(0,0,0,0.3)`,
                  }}>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:scrolled?0:0.5, transition:'opacity 0.4s' }}>
          <span style={{ fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#64748b' }}>Scroll</span>
          <div style={{ width:1, height:40, background:'linear-gradient(180deg,#f0a500,transparent)' }}/>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section style={{
        background:'linear-gradient(90deg, #0f1829, #1a2540, #0f1829)',
        borderTop:'1px solid rgba(240,165,0,0.1)',
        borderBottom:'1px solid rgba(240,165,0,0.1)',
        padding:'48px 40px',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
          {STATS.map(({ value, label, icon:Icon }) => (
            <div key={label} className="ps-stat-card" style={{ display:'flex', alignItems:'center', gap:18 }}>
              <div style={{ width:44, height:44, borderRadius:10, background:'rgba(240,165,0,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={20} color="#f0a500"/>
              </div>
              <div>
                <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9', lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:'0.78rem', color:'#64748b', marginTop:4, fontWeight:500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding:'100px 40px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(240,165,0,0.03), transparent)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div className="ps-section-label" style={{ justifyContent:'center' }}>Why Procurasure</div>
            <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800, color:'#f1f5f9', margin:'0 auto', maxWidth:600 }}>
              Built for Serious Industrial Buyers
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:24 }}>
            {FEATURES.map(({ icon:Icon, title, desc, color }, i) => (
              <div key={title} className="ps-feature-card" style={{ animationDelay:`${i*0.1}s` }}>
                <div style={{
                  width:52, height:52, borderRadius:12, marginBottom:24,
                  background:`${color}18`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Icon size={24} color={color}/>
                </div>
                <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.15rem', fontWeight:700, color:'#f1f5f9', marginBottom:12 }}>{title}</h3>
                <p style={{ fontSize:'0.9rem', color:'#94a3b8', lineHeight:1.7 }}>{desc}</p>
                <div style={{ marginTop:24, display:'flex', alignItems:'center', gap:8, color, fontSize:'0.82rem', fontWeight:600 }}>
                  Learn more <ArrowRight size={14}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{
        padding:'80px 40px 100px',
        background:'linear-gradient(180deg, rgba(15,24,41,0.6) 0%, rgba(9,14,26,0.8) 100%)',
        borderTop:'1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:52, flexWrap:'wrap', gap:16 }}>
            <div>
              <div className="ps-section-label">Top Picks</div>
              <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:800, color:'#f1f5f9', margin:0 }}>
                Featured Products
              </h2>
              <p style={{ color:'#64748b', marginTop:8, fontSize:'0.9rem' }}>Our top-selling industrial essentials</p>
            </div>
            <Link to="/products" style={{ display:'flex', alignItems:'center', gap:8, color:'#f0a500', fontFamily:'var(--ps-font-head)', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', transition:'gap 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.gap='14px'}
              onMouseOut={e=>e.currentTarget.style.gap='8px'}>
              View All Catalog <ArrowRight size={16}/>
            </Link>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  height:320, borderRadius:16,
                  background:'linear-gradient(90deg, rgba(26,37,64,0.5) 25%, rgba(26,37,64,0.8) 50%, rgba(26,37,64,0.5) 75%)',
                  backgroundSize:'600px 100%',
                  animation:'ps-shimmer 1.4s infinite linear',
                }}/>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', color:'#64748b', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:16 }}>
              <Package size={40} style={{ opacity:0.3, marginBottom:16 }}/>
              <p>No products available yet.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px,1fr))', gap:24 }}>
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        margin:'0 40px 80px',
        borderRadius:20,
        background:'linear-gradient(135deg, rgba(240,165,0,0.12) 0%, rgba(15,207,176,0.06) 100%)',
        border:'1px solid rgba(240,165,0,0.2)',
        padding:'64px 60px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(240,165,0,0.1),transparent 70%)' }}/>
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:32 }}>
          <div>
            <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#f1f5f9', margin:'0 0 12px' }}>
              Ready to Optimize Your Procurement?
            </h2>
            <p style={{ color:'#94a3b8', fontSize:'1rem', maxWidth:480 }}>
              Join thousands of businesses trusting Procurasure for reliable, fast, verified industrial sourcing.
            </p>
          </div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <Link to="/register" className="ps-btn-primary">
              Create Business Account <ArrowRight size={18}/>
            </Link>
            <Link to="/products" className="ps-btn-outline">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;