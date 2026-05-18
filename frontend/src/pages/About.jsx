import React from 'react';

const About = () => {
  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '30px' }}>About Procurasure</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.8' }}>
            Procurasure was founded with a single mission: to revolutionize the industrial procurement process through technology, transparency, and trust.
          </p>
          
          <div style={{ display: 'grid', gap: '60px' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Our Vision</h2>
              <p style={{ color: 'var(--text-main)', fontSize: '1.125rem' }}>
                We envision a world where industrial procurement is as simple and reliable as consumer shopping. By connecting verified global suppliers with businesses of all sizes, we eliminate the friction in the supply chain.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Why Procurasure?</h2>
              <ul style={{ display: 'grid', gap: '20px' }}>
                <li style={{ padding: '20px', borderLeft: '4px solid var(--accent)', backgroundColor: 'white', borderRadius: '0 var(--radius) var(--radius) 0', boxShadow: 'var(--shadow)' }}>
                  <strong>Unmatched Quality:</strong> We only partner with suppliers who meet our stringent quality standards.
                </li>
                <li style={{ padding: '20px', borderLeft: '4px solid var(--accent)', backgroundColor: 'white', borderRadius: '0 var(--radius) var(--radius) 0', boxShadow: 'var(--shadow)' }}>
                  <strong>Global Network:</strong> Access products from diverse markets with ease.
                </li>
                <li style={{ padding: '20px', borderLeft: '4px solid var(--accent)', backgroundColor: 'white', borderRadius: '0 var(--radius) var(--radius) 0', boxShadow: 'var(--shadow)' }}>
                  <strong>Customer-First:</strong> Our sales and support teams are always here to help you find exactly what you need.
                </li>
              </ul>
            </section>

            <section style={{ padding: '60px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '20px' }}>Ready to optimize your procurement?</h2>
              <p style={{ marginBottom: '30px', color: '#94a3b8' }}>Join thousands of businesses who trust Procurasure.</p>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--accent)', padding: '15px 30px' }}>
                Create Business Account
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
