import { useEffect, useRef, useState } from 'react';
import {
  X,
  ExternalLink,
  GitBranch,
  Star,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Maximize2,
  Send,
  Printer,
} from 'lucide-react';
import {
  CONTACT_PROFILE,
  RESUME_MILESTONES,
  SKILL_CLUSTERS,
} from '../../data/portfolioData';
import { ActiveModalPayload } from '../../types/portfolio';

interface DetailModalProps {
  payload: ActiveModalPayload;
  onClose: () => void;
}

let supportsDisplayTransition: boolean | undefined;
function canTransitionDisplay(): boolean {
  if (typeof document === 'undefined' || !document.body) return false;
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDisplay();
}

export function DetailModal({ payload, onClose }: DetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderMessage, setSenderMessage] = useState('');

  // Open modal via native showModal() when payload arrives
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (payload) {
      dialog.removeAttribute('data-closing');
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [payload]);

  // Smooth top-layer exit animation helper + Safari/Firefox fallback
  const closeTopLayer = async () => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open) {
      onClose();
      return;
    }

    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 400)),
        ]);
      }
      if (!dialog.hasAttribute('data-closing')) return;
      dialog.removeAttribute('data-closing');
    }

    dialog.close();
    onClose();
  };

  // Fallback for browsers without native HTMLDialogElement.prototype.closedBy support (e.g., Safari)
  // and intercept `cancel` event so Esc also runs the exit animation cleanly.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      void closeTopLayer();
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isDialogContent) {
        void closeTopLayer();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="atelier-dialog-title"
      className="atelier-dialog"
    >
      {payload && (
        <div className="modal-card">
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => void closeTopLayer()}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* 1. DIGITAL DRAWING LIGHTBOX */}
          {payload.type === 'drawing' && (
            <div className="modal-grid-drawing">
              <div className="drawing-preview-frame">
                <img
                  src={payload.item.imageUrl || payload.generatedDataUrl}
                  alt={payload.item.title}
                  className="drawing-img"
                />
              </div>
              <div className="drawing-details">
                <span className="modal-eyebrow">
                  <Sparkles size={14} /> NORTH WALL · DIGITAL DRAWING
                </span>
                <h2 id="atelier-dialog-title" className="modal-heading">
                  {payload.item.title}
                </h2>
                <p className="modal-subtitle">{payload.item.subtitle}</p>

                <div className="modal-meta-pills">
                  <span>
                    <Calendar size={14} /> {payload.item.year}
                  </span>
                  <span>
                    <Maximize2 size={14} /> {payload.item.dimensions}
                  </span>
                </div>

                <p className="modal-body-text">{payload.item.description}</p>

                <div className="palette-row">
                  <span className="palette-label">Pigment Palette:</span>
                  <div className="palette-swatches">
                    {payload.item.palette.map((hex) => (
                      <div
                        key={hex}
                        className="palette-swatch"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <div className="modal-note-box">
                  <strong>Medium & Tools:</strong> {payload.item.medium}
                </div>
              </div>
            </div>
          )}

          {/* 2. GITHUB CODING PROJECT EXHIBITION */}
          {payload.type === 'project' && (
            <div className="modal-project">
              <span className="modal-eyebrow">
                <GitBranch size={14} /> EAST WALL · GITHUB REPOSITORY EXHIBIT
              </span>
              <h2 id="atelier-dialog-title" className="modal-heading">
                {payload.item.name}
              </h2>

              <div className="project-stats-row">
                <span className="lang-badge" style={{ borderColor: payload.item.languageColor }}>
                  <i
                    className="lang-dot"
                    style={{ backgroundColor: payload.item.languageColor }}
                  />
                  {payload.item.language}
                </span>
                <span className="stat-pill">
                  <Star size={14} /> {payload.item.stars} Stars
                </span>
                <span className="stat-pill">
                  <GitBranch size={14} /> {payload.item.forks} Forks
                </span>
                <span className="stat-pill">Updated {payload.item.updatedAt}</span>
              </div>

              <p className="modal-body-text">{payload.item.description}</p>

              {payload.item.architectureNote && (
                <div className="modal-note-box">
                  <strong>Architectural Highlight:</strong> {payload.item.architectureNote}
                </div>
              )}

              <div className="topic-tags">
                {payload.item.topics.map((topic) => (
                  <span key={topic} className="topic-tag">
                    #{topic}
                  </span>
                ))}
              </div>

              <div className="modal-cta-row">
                <a
                  href={payload.item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  <span>View Repository on GitHub</span>
                  <ExternalLink size={16} />
                </a>
                {payload.item.homepage && (
                  <a
                    href={payload.item.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    <span>Live Demo</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 3. RESUME ("ART ON THE WALL" RETROSPECTIVE) */}
          {payload.type === 'resume' && (
            <div className="modal-resume">
              <div className="resume-header-row">
                <div>
                  <span className="modal-eyebrow">WEST WALL · CURRICULUM VITAE</span>
                  <h2 id="atelier-dialog-title" className="modal-heading">
                    {CONTACT_PROFILE.artistName} — Retrospective CV
                  </h2>
                  <p className="modal-subtitle">{CONTACT_PROFILE.tagline}</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  <span>Print / Save PDF</span>
                </button>
              </div>

              <div className="resume-timeline">
                {RESUME_MILESTONES.map((m) => {
                  const isHighlighted = payload.milestone?.id === m.id;
                  return (
                    <div
                      key={m.id}
                      className={`resume-card ${isHighlighted ? 'highlighted' : ''}`}
                      style={{ borderLeftColor: m.accentColor }}
                    >
                      <div className="resume-card-top">
                        <div>
                          <h3>{m.role}</h3>
                          <span className="resume-org">{m.organization}</span>
                        </div>
                        <div className="resume-period">
                          <span>{m.period}</span>
                          <small>{m.location}</small>
                        </div>
                      </div>
                      <ul>
                        {m.highlights.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="resume-skills-grid">
                {SKILL_CLUSTERS.map((cluster) => (
                  <div key={cluster.category} className="skill-cluster-box">
                    <h4>{cluster.category}</h4>
                    <div className="topic-tags">
                      {cluster.items.map((skill) => (
                        <span key={skill} className="topic-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CONTACT & ARTIST DESK */}
          {payload.type === 'contact' && (
            <div className="modal-contact">
              <span className="modal-eyebrow">SOUTH LOUNGE · STUDIO GUESTBOOK & CONTACT</span>
              <h2 id="atelier-dialog-title" className="modal-heading">
                Connect with {CONTACT_PROFILE.artistName}
              </h2>
              <p className="modal-subtitle">{CONTACT_PROFILE.availability}</p>

              <div className="contact-channels">
                <div className="contact-email-box">
                  <div>
                    <small>Direct Studio Email</small>
                    <strong>{CONTACT_PROFILE.email}</strong>
                  </div>
                  <button type="button" className="btn-secondary" onClick={handleCopyEmail}>
                    {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>

                <div className="social-links-grid">
                  <a
                    href={CONTACT_PROFILE.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="social-card"
                  >
                    <span>GitHub</span>
                    <strong>@{CONTACT_PROFILE.githubUsername}</strong>
                  </a>
                  <a
                    href={CONTACT_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="social-card"
                  >
                    <span>LinkedIn</span>
                    <strong>Professional Profile</strong>
                  </a>
                  <a
                    href={CONTACT_PROFILE.artstationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="social-card"
                  >
                    <span>ArtStation / IG</span>
                    <strong>{CONTACT_PROFILE.instagramHandle}</strong>
                  </a>
                </div>
              </div>

              <form
                className="guestbook-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const subject = encodeURIComponent(
                    `Studio Inquiry from ${senderName || 'Gallery Visitor'}`
                  );
                  const body = encodeURIComponent(senderMessage);
                  window.location.href = `mailto:${CONTACT_PROFILE.email}?subject=${subject}&body=${body}`;
                }}
              >
                <h4>Send a Direct Dispatch</h4>
                <input
                  type="text"
                  placeholder="Your Name or Studio"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
                <textarea
                  rows={3}
                  placeholder="Tell me about your project, commission, or engineering opportunity..."
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">
                  <Send size={16} />
                  <span>Compose Email Dispatch</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
