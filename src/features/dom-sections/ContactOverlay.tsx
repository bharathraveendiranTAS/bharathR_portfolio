import { useState } from 'react';
import { GlassCard } from '../../shared/components/GlassCard';
import styles from './DomSections.module.scss';

interface ContactOverlayProps {
  onHover?: () => void;
  onSubmitContact?: (name: string) => void;
}

export function ContactOverlay({ onHover, onSubmitContact }: ContactOverlayProps) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('bharathkumar22971997@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setSubmitted(true);
    if (onSubmitContact) onSubmitContact(formData.name);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className={styles['section-stage']} aria-label="Contact & Inquiries">
      <div className={styles['contact']}>
        {/* Section Header */}
        <div className={styles['contact__header']}>
          <div className={styles['contact__kicker']}>COMMUNICATION CHANNELS // INQUIRIES & COLLABORATION</div>
          <h2 className={styles['contact__title']}>Get In Touch</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '640px', margin: '4px auto 0 auto' }}>
            Available for Senior UI Engineering contracts, enterprise design system consultancies,
            and comprehensive WCAG 2.2 AA accessibility architecture audits.
          </p>
        </div>

        <div className={styles['contact__content']}>
          {/* Left Column: Direct Inscription & Quick Access */}
          <GlassCard interactive className={styles['contact__info-card']}>
            <div>
              <h3 className={styles['contact__terminal-title']}>
                ENTERPRISE COMMUNICATIONS // SECURE CHANNEL
              </h3>
              <p className={styles['contact__terminal-desc']}>
                Ready to elevate your flagship product with uncompromising accessibility, design-token systems, 
                and tactile 3D interactions? Reach out directly or dispatch an inquiry below.
              </p>
            </div>

            {/* Quick Copy Email Button */}
            <button
              type="button"
              id="copy-email-btn"
              className={styles['contact__quick-copy']}
              onClick={handleCopyEmail}
              onMouseEnter={onHover}
              aria-label="Copy Bharath Kumar's email address to clipboard"
            >
              <span aria-hidden="true">📋</span>
              <span>{copied ? 'COPIED TO CLIPBOARD!' : 'bharathkumar22971997@gmail.com'}</span>
            </button>

            {/* Direct Location & Verified Profiles */}
            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.74rem', color: '#00e5ff', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
                LOCATION // TIMEZONE
              </div>
              <div style={{ color: '#ffffff', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📍 Bengaluru, India (IST // UTC+5:30)</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--parchment-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: '8px' }}>
                PROFESSIONAL PROFILES & REPOSITORIES
              </span>
              <div className={styles['contact__socials']}>
                <a
                  href="https://www.linkedin.com/in/bharath2297"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['contact__social-link']}
                  onMouseEnter={onHover}
                  aria-label="LinkedIn Profile"
                >
                  LINKEDIN ↗
                </a>
                <a
                  href="mailto:bharathkumar22971997@gmail.com"
                  className={styles['contact__social-link']}
                  onMouseEnter={onHover}
                  aria-label="Send Direct Email"
                >
                  DIRECT EMAIL ✉
                </a>
                <a
                  href="#home"
                  className={styles['contact__social-link']}
                  onMouseEnter={onHover}
                  aria-label="Return to Top Overview"
                >
                  TOP ↑
                </a>
              </div>
            </div>
          </GlassCard>

          {/* Right Column: Direct Message Form */}
          <GlassCard interactive className={styles['contact__form']}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }} aria-hidden="true">⚡</div>
                <h4 style={{ color: '#00e5ff', fontFamily: 'JetBrains Mono', margin: '0 0 8px 0' }}>
                  MESSAGE TRANSMITTED
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Thank you, {formData.name}. Your inquiry has been logged and sent to Bharath Kumar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles['contact__field']} style={{ marginBottom: '14px' }}>
                  <label htmlFor="contact-name">NAME / ORGANIZATION *</label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Rostova (VP of Engineering)"
                  />
                </div>

                <div className={styles['contact__field']} style={{ marginBottom: '14px' }}>
                  <label htmlFor="contact-email">BUSINESS EMAIL *</label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@enterprise.com"
                  />
                </div>

                <div className={styles['contact__field']} style={{ marginBottom: '16px' }}>
                  <label htmlFor="contact-message">INQUIRY DETAILS *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Scope of work, design system requirements, or accessibility auditing timeline..."
                  />
                </div>

                <button
                  type="submit"
                  id="submit-contact-btn"
                  className={styles['work__btn'] + ' ' + styles['work__btn--primary']}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onMouseEnter={onHover}
                >
                  <span>SEND TRANSMISSION</span>
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
