import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Users, TrendingUp, Award, ArrowRight, CheckCircle } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --ps-navy:#090e1a; --ps-navy2:#0f1829; --ps-slate:#1a2540;
    --ps-amber:#f0a500; --ps-amber2:#fbbf24; --ps-teal:#0fcfb0;
    --ps-muted:#6b7a99;
    --ps-font-head:'Syne',sans-serif; --ps-font-body:'DM Sans',sans-serif;
  }

  /* ── Scroll-reveal base state ── */
  .ps-reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
  }
  .ps-reveal.ps-reveal--left {
    transform: translateX(-40px);
  }
  .ps-reveal.ps-reveal--right {
    transform: translateX(40px);
  }
  .ps-reveal.ps-reveal--scale {
    transform: scale(0.92);
  }
  .ps-reveal.visible {
    opacity: 1;
    transform: none;
  }

  /* ── Stat counter ── */
  @keyframes ps-count-in {
    from { opacity:0; transform:translateY(12px) scale(0.9); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  .ps-stat-val {
    animation: none;
  }
  .ps-stat-val.counting {
    animation: ps-count-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  /* ── Stagger children inside a revealed container ── */
  .ps-stagger > * {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
  }
  .ps-stagger.visible > *:nth-child(1) { opacity:1; transform:none; transition-delay:0.05s; }
  .ps-stagger.visible > *:nth-child(2) { opacity:1; transform:none; transition-delay:0.12s; }
  .ps-stagger.visible > *:nth-child(3) { opacity:1; transform:none; transition-delay:0.19s; }
  .ps-stagger.visible > *:nth-child(4) { opacity:1; transform:none; transition-delay:0.26s; }
  .ps-stagger.visible > *:nth-child(5) { opacity:1; transform:none; transition-delay:0.33s; }
  .ps-stagger.visible > *:nth-child(6) { opacity:1; transform:none; transition-delay:0.40s; }

  /* ── Timeline line grow ── */
  .ps-timeline-line {
    width: 1px;
    height: 0;
    background: rgba(240,165,0,0.2);
    margin: 6px auto 0;
    transition: height 0.6s cubic-bezier(0.16,1,0.3,1);
  }
  .ps-timeline-item.visible .ps-timeline-line {
    height: 40px;
  }

  /* ── Value cards ── */
  .ps-value-card {
    background: linear-gradient(145deg,rgba(26,37,64,0.7),rgba(15,24,41,0.8));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 32px;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
  }
  .ps-value-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-color, #f0a500), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ps-value-card:hover {
    border-color: rgba(240,165,0,0.2);
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  }
  .ps-value-card:hover::before { opacity: 1; }

  /* ── Section label ── */
  .ps-section-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--ps-font-head); font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; color: #f0a500; margin-bottom: 16px;
  }
  .ps-section-label::before { content:''; display:block; width:20px; height:2px; background:#f0a500; }

  /* ── Stat grid border ── */
  .ps-stat-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    background: rgba(255,255,255,0.03);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ps-stat-cell {
    padding: 28px 16px;
    text-align: center;
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
  }
  .ps-stat-cell::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: rgba(255,255,255,0.05);
  }
  .ps-stat-cell:last-child::after { display: none; }
  .ps-stat-cell.visible { opacity:1; transform:none; }

  /* ── CTA button ── */
  .ps-cta-btn-primary {
    display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px;
    background: linear-gradient(135deg,#f0a500,#d97706); color: #090e1a;
    font-family: var(--ps-font-head); font-weight: 700; border-radius: 8px;
    text-decoration: none; box-shadow: 0 4px 20px rgba(240,165,0,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ps-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(240,165,0,0.45); }
  .ps-cta-btn-outline {
    display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px;
    background: transparent; color: #e2e8f0;
    font-family: var(--ps-font-head); font-weight: 600; border-radius: 8px;
    text-decoration: none; border: 1px solid rgba(255,255,255,0.15);
    transition: border-color 0.2s;
  }
  .ps-cta-btn-outline:hover { border-color: rgba(255,255,255,0.4); }
`;

const VALUES = [
  { icon:Shield,     color:'#f0a500', title:'Unmatched Quality',    desc:'We only partner with suppliers who meet our stringent 10-point quality standards — every time, no exceptions.' },
  { icon:Globe,      color:'#0fcfb0', title:'Global Network',        desc:'Access products from diverse markets across 140+ countries with transparent logistics and real-time tracking.' },
  { icon:Users,      color:'#818cf8', title:'Customer-First',        desc:'Our dedicated sales and support teams are always ready to help you find exactly what your business needs.' },
  { icon:TrendingUp, color:'#fb923c', title:'Data-Driven Insights',  desc:'Make smarter procurement decisions with our analytics dashboard, market intelligence, and demand forecasting.' },
  { icon:Zap,        color:'#34d399', title:'Speed & Efficiency',    desc:'Streamlined procurement workflows reduce order processing time by up to 60% compared to traditional methods.' },
  { icon:Award,      color:'#f472b6', title:'Certified & Compliant', desc:'ISO-certified platform with full GDPR compliance, SOC 2 Type II security, and industry-standard audit trails.' },
];

const MILESTONES = [
  { year:'2018', title:'Founded in New York',    desc:'Procurasure launched with a vision to digitize industrial procurement globally.' },
  { year:'2020', title:'Reached 10K Businesses', desc:'Expanded to Europe and Asia, crossing 10,000 active business customers.' },
  { year:'2022', title:'Series B Funding',        desc:'Raised $40M to accelerate platform development and global supplier network.' },
  { year:'2024', title:'50K+ Active Businesses', desc:'Now serving companies across 140+ countries with 12,000+ products.' },
];

const STATS = [
  { value:'50K+', label:'Active Businesses' },
  { value:'140+', label:'Countries Served'  },
  { value:'12K+', label:'Products Listed'   },
  { value:'$2B+', label:'GMV Processed'     },
];

/* ── Hook: attach IntersectionObserver to a ref ── */
function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        obs.disconnect();
      }
    }, { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Animated stat cells ── */
const StatGrid = () => {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const cells = container.querySelectorAll('.ps-stat-cell');
        cells.forEach((cell, i) => {
          setTimeout(() => cell.classList.add('visible'), i * 100);
        });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="ps-stat-grid" style={{ maxWidth: 800, margin: '0 auto' }}>
      {STATS.map(({ value, label }, i) => (
        <div key={label} className="ps-stat-cell" style={{ transitionDelay: `${i * 0.1}s` }}>
          <div style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.8rem', fontWeight:800, background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {value}
          </div>
          <div style={{ fontSize:'0.76rem', color:'#94a3b8', marginTop:6, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
        </div>
      ))}
    </div>
  );
};

/* ── Timeline with staggered reveal ── */
const Timeline = () => {
  const refs = MILESTONES.map(() => useRef(null));

  useEffect(() => {
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.disconnect();
        }
      }, { threshold: 0.3, rootMargin: '0px 0px -30px 0px' });
      obs.observe(el);
      return () => obs.disconnect();
    });
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {MILESTONES.map(({ year, title, desc }, i) => (
        <div key={year} ref={refs[i]} className="ps-reveal ps-timeline-item" style={{ display:'flex', gap:20, alignItems:'flex-start', transitionDelay:`${i * 0.12}s` }}>
          <div style={{ textAlign:'center', flexShrink:0, width:56 }}>
            <div style={{
              fontFamily:'var(--ps-font-head)', fontSize:'0.78rem', fontWeight:800,
              color:'#f0a500', background:'rgba(240,165,0,0.1)',
              border:'1px solid rgba(240,165,0,0.2)', borderRadius:8, padding:'4px 8px',
            }}>{year}</div>
            {i < MILESTONES.length - 1 && <div className="ps-timeline-line" />}
          </div>
          <div>
            <p style={{ fontFamily:'var(--ps-font-head)', fontWeight:700, color:'#f1f5f9', fontSize:'0.92rem', marginBottom:4 }}>{title}</p>
            <p style={{ color:'#94a3b8', fontSize:'0.82rem', lineHeight:1.6, margin:0 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Value cards with staggered reveal ── */
const ValueCards = () => {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const cards = container.querySelectorAll('.ps-value-card-wrap');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'none';
          }, i * 80);
        });
        obs.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
      {VALUES.map(({ icon:Icon, color, title, desc }) => (
        <div key={title} className="ps-value-card-wrap" style={{ opacity:0, transform:'translateY(28px)', transition:'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="ps-value-card" style={{ '--accent-color': color }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
              <Icon size={22} color={color}/>
            </div>
            <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.05rem', fontWeight:700, color:'#f1f5f9', marginBottom:10 }}>{title}</h3>
            <p style={{ color:'#94a3b8', fontSize:'0.88rem', lineHeight:1.7, margin:0 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const About = () => {
  const heroTextRef   = useReveal({ threshold: 0.2 });
  const visionLeftRef = useReveal({ threshold: 0.2 });
  const badgesRef     = useReveal({ threshold: 0.3 });
  const valuesHdRef   = useReveal({ threshold: 0.3 });
  const ctaRef        = useReveal({ threshold: 0.2 });

  return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0', overflowX:'hidden' }}>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section style={{
        position:'relative', padding:'100px 40px 80px', overflow:'hidden',
        background:'linear-gradient(180deg,#0f1829 0%,#090e1a 100%)',
        borderBottom:'1px solid rgba(240,165,0,0.08)',
      }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04, pointerEvents:'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="#f0a500" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 60% 80% at 50% 0%,rgba(240,165,0,0.07),transparent)', pointerEvents:'none' }}/>

        <div ref={heroTextRef} className="ps-reveal" style={{ maxWidth:900, margin:'0 auto 60px', textAlign:'center', position:'relative' }}>
          <div className="ps-section-label" style={{ justifyContent:'center' }}>Our Story</div>
          <h1 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(2.2rem,5vw,4rem)', fontWeight:800, color:'#f1f5f9', margin:'0 0 24px', lineHeight:1.1, letterSpacing:'-0.03em' }}>
            Revolutionizing<br/>
            <span style={{ background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Industrial Procurement
            </span>
          </h1>
          <p style={{ fontSize:'1.1rem', color:'#94a3b8', lineHeight:1.8, maxWidth:600, margin:'0 auto' }}>
            Procurasure was founded with a single mission: to make industrial procurement as simple, reliable, and transparent as consumer shopping.
          </p>
        </div>

        <StatGrid />
      </section>

      {/* ── Vision ── */}
      <section style={{ padding:'100px 40px', position:'relative' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          <div ref={visionLeftRef} className="ps-reveal ps-reveal--left">
            <div className="ps-section-label">Our Vision</div>
            <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.6rem,3vw,2.6rem)', fontWeight:800, color:'#f1f5f9', margin:'0 0 20px', letterSpacing:'-0.02em' }}>
              Where Industrial Buyers Meet Verified Suppliers
            </h2>
            <p style={{ color:'#94a3b8', lineHeight:1.8, marginBottom:20, fontSize:'0.95rem' }}>
              We envision a world where industrial procurement is frictionless. By connecting verified global suppliers with businesses of all sizes, we eliminate inefficiency from the supply chain.
            </p>
            <p style={{ color:'#94a3b8', lineHeight:1.8, fontSize:'0.95rem', marginBottom:0 }}>
              Every feature we build, every supplier we onboard, and every technology we adopt is driven by one question: does this make procurement better for our customers?
            </p>
            <div ref={badgesRef} className="ps-reveal" style={{ marginTop:32, display:'flex', gap:20, flexWrap:'wrap', transitionDelay:'0.15s' }}>
              {['ISO Certified','GDPR Compliant','SOC 2 Type II'].map(badge => (
                <div key={badge} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', color:'#94a3b8', fontWeight:600 }}>
                  <CheckCircle size={14} color="#10b981"/> {badge}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Timeline />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding:'60px 40px 100px', background:'linear-gradient(180deg,rgba(15,24,41,0.5),transparent)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div ref={valuesHdRef} className="ps-reveal" style={{ textAlign:'center', marginBottom:60 }}>
            <div className="ps-section-label" style={{ justifyContent:'center' }}>Our Values</div>
            <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:800, color:'#f1f5f9', margin:0 }}>
              Why Leading Businesses Choose Us
            </h2>
          </div>
          <ValueCards />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'0 40px 100px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div ref={ctaRef} className="ps-reveal ps-reveal--scale" style={{
            borderRadius:20, padding:'72px 60px', textAlign:'center', position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg,rgba(240,165,0,0.1) 0%,rgba(15,207,176,0.05) 100%)',
            border:'1px solid rgba(240,165,0,0.18)',
          }}>
            <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(240,165,0,0.08),transparent 70%)', pointerEvents:'none' }}/>
            <div style={{ position:'relative' }}>
              <div className="ps-section-label" style={{ justifyContent:'center' }}>Get Started</div>
              <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800, color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.02em' }}>
                Ready to Optimize Your Procurement?
              </h2>
              <p style={{ color:'#94a3b8', fontSize:'1rem', maxWidth:500, margin:'0 auto 40px' }}>
                Join thousands of businesses who trust Procurasure for reliable, fast, verified industrial sourcing.
              </p>
              <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                <Link to="/register" className="ps-cta-btn-primary">
                  Create Business Account <ArrowRight size={17}/>
                </Link>
                <Link to="/products" className="ps-cta-btn-outline">
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;