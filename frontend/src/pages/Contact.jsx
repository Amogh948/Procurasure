import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    try {
      await axios.post('/api/contact', formData);
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          {/* Contact Info */}
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Get in Touch</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.125rem' }}>
              Have a question about a product or category? Our industrial sales team is ready to assist you.
            </p>

            <div style={{ display: 'grid', gap: '30px' }}>
              <div className="flex gap-4 items-start">
                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', color: 'var(--accent)' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Email Us</h4>
                  <p style={{ color: 'var(--text-muted)' }}>sales.procurasure@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', color: 'var(--accent)' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Call Us</h4>
                  <p style={{ color: 'var(--text-muted)' }}>+1 (555) 000-1234</p>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', color: 'var(--accent)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Visit Us</h4>
                  <p style={{ color: 'var(--text-muted)' }}>123 Industrial Way, Business District</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: '40px' }}>
            {status.success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ backgroundColor: 'var(--success)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Send size={30} />
                </div>
                <h2 style={{ marginBottom: '10px' }}>Message Sent!</h2>
                <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                <button 
                  className="btn btn-outline" 
                  style={{ marginTop: '30px' }}
                  onClick={() => setStatus({ ...status, success: false })}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    placeholder="Your name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-input" 
                    placeholder="your@email.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    className="form-input" 
                    placeholder="Inquiry subject" 
                    required 
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea 
                    name="message" 
                    className="form-input" 
                    rows="5" 
                    placeholder="How can we help you?" 
                    required
                    style={{ resize: 'vertical' }}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                {status.error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{status.error}</p>}
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '15px', gap: '10px' }}
                  disabled={status.loading}
                >
                  {status.loading ? 'Sending...' : 'Send Message'}
                  {!status.loading && <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
