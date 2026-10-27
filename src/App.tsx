import { useCallback, useEffect, useState } from 'react';
import {
  CONTACT_PROFILE,
  CURATED_GITHUB_REPOS,
} from './data/portfolioData';
import { fetchGitHubRepos } from './services/githubService';
import {
  ActiveModalPayload,
  GitHubRepoItem,
  ZoneId,
} from './types/portfolio';
import { GalleryScene } from './components/canvas/GalleryScene';
import { NavigationHud } from './components/ui/NavigationHud';
import { DetailModal } from './components/ui/DetailModal';

const ZONE_KEYS: Record<string, ZoneId> = {
  '1': 'overview',
  '2': 'drawings',
  '3': 'projects',
  '4': 'resume',
  '5': 'contact',
};

const ZONE_SEQUENCE: ZoneId[] = ['overview', 'drawings', 'projects', 'resume', 'contact'];

export function App() {
  const [activeZone, setActiveZone] = useState<ZoneId>('overview');
  const [customCameraTarget, setCustomCameraTarget] = useState<{
    position: [number, number, number];
    target: [number, number, number];
  } | null>(null);
  const [goldenHour, setGoldenHour] = useState(false);

  const [githubUsername, setGithubUsername] = useState(CONTACT_PROFILE.githubUsername);
  const [repos, setRepos] = useState<GitHubRepoItem[]>(CURATED_GITHUB_REPOS);
  const [repoSource, setRepoSource] = useState<'live' | 'curated'>('curated');
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);

  const [modalPayload, setModalPayload] = useState<ActiveModalPayload>(null);

  const loadRepos = useCallback(async (username: string) => {
    setIsSyncingGithub(true);
    const result = await fetchGitHubRepos(username);
    setRepos(result.repos);
    setRepoSource(result.source);
    setIsSyncingGithub(false);
  }, []);

  useEffect(() => {
    void loadRepos(githubUsername);
  }, [githubUsername, loadRepos]);

  const handleSelectZone = useCallback((zone: ZoneId) => {
    setCustomCameraTarget(null);
    setActiveZone(zone);
  }, []);

  const handleFocusCamera = useCallback(
    (position: [number, number, number], target: [number, number, number]) => {
      setCustomCameraTarget({ position, target });
    },
    []
  );

  // Keyboard navigation (1-5 or Left/Right arrows when not typing in an input or open modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || modalPayload) return;

      if (ZONE_KEYS[e.key]) {
        handleSelectZone(ZONE_KEYS[e.key]);
      } else if (e.key === 'ArrowRight') {
        const next = (ZONE_SEQUENCE.indexOf(activeZone) + 1) % ZONE_SEQUENCE.length;
        handleSelectZone(ZONE_SEQUENCE[next]);
      } else if (e.key === 'ArrowLeft') {
        const prev =
          (ZONE_SEQUENCE.indexOf(activeZone) - 1 + ZONE_SEQUENCE.length) %
          ZONE_SEQUENCE.length;
        handleSelectZone(ZONE_SEQUENCE[prev]);
      } else if (e.key === 'Escape') {
        handleSelectZone('overview');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZone, handleSelectZone, modalPayload]);

  const handleCloseModal = useCallback(() => {
    setModalPayload(null);
    // When closing a modal, reset camera target to the current section's overview
    setCustomCameraTarget(null);
  }, []);

  return (
    <div className="atelier-viewport">
      <GalleryScene
        activeZone={activeZone}
        customCameraTarget={customCameraTarget}
        goldenHour={goldenHour}
        repos={repos}
        repoSource={repoSource}
        githubUsername={githubUsername}
        onSelectZone={handleSelectZone}
        onFocusCamera={handleFocusCamera}
        onOpenModal={setModalPayload}
      />

      <NavigationHud
        activeZone={activeZone}
        goldenHour={goldenHour}
        githubUsername={githubUsername}
        repoSource={repoSource}
        isSyncingGithub={isSyncingGithub}
        onSelectZone={handleSelectZone}
        onToggleGoldenHour={() => setGoldenHour((prev) => !prev)}
        onUpdateGithubUsername={(user) => setGithubUsername(user)}
        onOpenQuickContact={() => {
          handleSelectZone('contact');
          setModalPayload({ type: 'contact' });
        }}
      />

      <DetailModal
        payload={modalPayload}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
