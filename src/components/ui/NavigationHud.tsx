import { useState } from 'react';
import {
  Compass,
  Frame,
  GitBranch,
  FileText,
  Mail,
  Sun,
  Sunset,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CAMERA_WAYPOINTS, CONTACT_PROFILE } from '../../data/portfolioData';
import { ZoneId } from '../../types/portfolio';

interface NavigationHudProps {
  activeZone: ZoneId;
  goldenHour: boolean;
  githubUsername: string;
  repoSource: 'live' | 'curated';
  isSyncingGithub: boolean;
  onSelectZone: (zone: ZoneId) => void;
  onToggleGoldenHour: () => void;
  onUpdateGithubUsername: (username: string) => void;
  onOpenQuickContact: () => void;
}

const ZONE_ORDER: ZoneId[] = ['overview', 'drawings', 'projects', 'resume', 'contact'];

export function NavigationHud({
  activeZone,
  goldenHour,
  githubUsername,
  repoSource,
  isSyncingGithub,
  onSelectZone,
  onToggleGoldenHour,
  onUpdateGithubUsername,
  onOpenQuickContact,
}: NavigationHudProps) {
  const [editingGh, setEditingGh] = useState(false);
  const [ghInput, setGhInput] = useState(githubUsername);

  const currentWaypoint = CAMERA_WAYPOINTS[activeZone];
  const currentIndex = ZONE_ORDER.indexOf(activeZone);

  const stepZone = (delta: number) => {
    const nextIdx = (currentIndex + delta + ZONE_ORDER.length) % ZONE_ORDER.length;
    onSelectZone(ZONE_ORDER[nextIdx]);
  };

  const getZoneIcon = (id: ZoneId) => {
    switch (id) {
      case 'overview':
        return <Compass size={16} />;
      case 'drawings':
        return <Frame size={16} />;
      case 'projects':
        return <GitBranch size={16} />;
      case 'resume':
        return <FileText size={16} />;
      case 'contact':
        return <Mail size={16} />;
    }
  };

  return (
    <>
      {/* Top Studio Header Bar */}
      <header className="hud-topbar">
        <div className="hud-brand" onClick={() => onSelectZone('overview')} role="button" tabIndex={0}>
          <span className="hud-badge">3D ATELIER</span>
          <div>
            <h1 className="hud-title">{CONTACT_PROFILE.artistName}</h1>
            <p className="hud-subtitle">{CONTACT_PROFILE.tagline}</p>
          </div>
        </div>

        <div className="hud-actions">
          {/* Live GitHub Handle Switcher */}
          {editingGh ? (
            <form
              className="hud-gh-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (ghInput.trim()) {
                  onUpdateGithubUsername(ghInput.trim());
                }
                setEditingGh(false);
              }}
            >
              <input
                type="text"
                value={ghInput}
                onChange={(e) => setGhInput(e.target.value)}
                placeholder="GitHub username..."
                aria-label="GitHub username"
                autoFocus
              />
              <button type="submit" className="hud-pill-btn">
                Sync
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="hud-pill-btn"
              onClick={() => setEditingGh(true)}
              title="Click to sync another GitHub username onto the East Wall"
            >
              <RefreshCw size={14} className={isSyncingGithub ? 'spin-icon' : ''} />
              <span>
                GitHub: <strong>@{githubUsername}</strong> ({repoSource})
              </span>
            </button>
          )}

          {/* Studio Lighting Toggle (Sunlit Day vs Golden Hour Loft) */}
          <button
            type="button"
            className="hud-pill-btn"
            onClick={onToggleGoldenHour}
            title="Toggle Skylight Lighting Mood"
          >
            {goldenHour ? <Sunset size={15} /> : <Sun size={15} />}
            <span>{goldenHour ? 'Golden Hour' : 'Sunlit Day'}</span>
          </button>

          <button
            type="button"
            className="hud-pill-btn hud-pill-accent"
            onClick={onOpenQuickContact}
          >
            <Mail size={15} />
            <span>Inquire</span>
          </button>
        </div>
      </header>

      {/* Active Camera Waypoint Banner & Prev/Next Stepper */}
      <div className="hud-zone-indicator">
        <button
          type="button"
          className="hud-step-btn"
          onClick={() => stepZone(-1)}
          aria-label="Previous Gallery Zone"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="hud-zone-meta">
          <span className="hud-zone-label">{currentWaypoint.label}</span>
          <span className="hud-zone-desc">{currentWaypoint.subtitle}</span>
        </div>
        <button
          type="button"
          className="hud-step-btn"
          onClick={() => stepZone(1)}
          aria-label="Next Gallery Zone"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Bottom Floating Camera Waypoint Dock */}
      <nav className="hud-dock" aria-label="3D Studio Camera Waypoints">
        {ZONE_ORDER.map((zoneId, index) => {
          const wp = CAMERA_WAYPOINTS[zoneId];
          const isActive = activeZone === zoneId;
          return (
            <button
              key={zoneId}
              type="button"
              className={`hud-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectZone(zoneId)}
            >
              <span className="hud-dock-key">{index + 1}</span>
              {getZoneIcon(zoneId)}
              <span className="hud-dock-text">{wp.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
