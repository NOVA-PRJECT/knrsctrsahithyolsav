import React from 'react';
import { Link } from 'react-router-dom';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid rgba(201, 168, 76, 0.15)',
      padding: '60px 0 30px 0',
      marginTop: '80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)', opacity: 0.5, boxShadow: '0 0 20px 2px var(--gold-primary)' }} />
      
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <img src="/top-bar-logo-also may use at footer.png" alt="Sahityotsav Logo" style={{ height: '50px', width: 'fit-content' }} />
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Celebrating linguistic diversity and cultural heritage through excellence in literature and arts.
            </p>
          </div>
          
          {/* Quick Links Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold-primary)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Home</Link>
              <Link to="/results" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold-primary)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Event Results</Link>
              <Link to="/search" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold-primary)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Participant Search</Link>
              <Link to="/admin" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold-primary)'} onMouseLeave={e => e.target.style.color='var(--text-secondary)'}>Admin Portal</Link>
            </div>
          </div>
          
          {/* Connect Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>Connect With Us</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.borderColor = '#E1306C'; e.currentTarget.style.transform = 'translateY(-4px)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <InstagramIcon />
              </a>
              <a href="#" className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.color = '#1DA1F2'; e.currentTarget.style.borderColor = '#1DA1F2'; e.currentTarget.style.transform = 'translateY(-4px)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <TwitterIcon />
              </a>
              <a href="#" className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.color = '#4267B2'; e.currentTarget.style.borderColor = '#4267B2'; e.currentTarget.style.transform = 'translateY(-4px)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <FacebookIcon />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Credits */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          paddingTop: '30px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: '12px' 
        }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Crafted with excellence by <span className="nova-credit" style={{ fontSize: '1rem', cursor: 'pointer', padding: '0 4px' }}>Project NOVA</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.5 }}>
            &copy; {new Date().getFullYear()} Sahityotsav. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
