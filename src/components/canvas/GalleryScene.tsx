import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import {
  ActiveModalPayload,
  GitHubRepoItem,
  ZoneId,
} from '../../types/portfolio';
import { CameraRig } from './CameraRig';
import { LoftArchitecture } from './LoftArchitecture';
import { DrawingsWall } from './DrawingsWall';
import { GithubWall } from './GithubWall';
import { ResumeWall } from './ResumeWall';
import { ContactCorner } from './ContactCorner';

interface GallerySceneProps {
  activeZone: ZoneId;
  customCameraTarget: {
    position: [number, number, number];
    target: [number, number, number];
  } | null;
  goldenHour: boolean;
  repos: GitHubRepoItem[];
  repoSource: 'live' | 'curated';
  githubUsername: string;
  onSelectZone: (zone: ZoneId) => void;
  onFocusCamera: (position: [number, number, number], target: [number, number, number]) => void;
  onOpenModal: (payload: ActiveModalPayload) => void;
}

export function GalleryScene({
  activeZone,
  customCameraTarget,
  goldenHour,
  repos,
  repoSource,
  githubUsername,
  onSelectZone,
  onFocusCamera,
  onOpenModal,
}: GallerySceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 5.4, 9.2], fov: 46, near: 0.1, far: 60 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[goldenHour ? '#1E1916' : '#E9E4DC']} />
      <fog attach="fog" args={[goldenHour ? '#2B221C' : '#E9E4DC', 16, 34]} />

      {/* Natural Skylight Ambient & Hemisphere Fill */}
      <ambientLight intensity={goldenHour ? 0.55 : 0.85} color={goldenHour ? '#FFD8A8' : '#FFFDF9'} />
      <hemisphereLight
        args={[goldenHour ? '#FFB366' : '#FFFFFF', '#8D6E63', goldenHour ? 0.65 : 0.75]}
      />

      {/* Primary Sunlit Loft Skylight Directional Light */}
      <directionalLight
        castShadow
        position={goldenHour ? [5.5, 9.5, 4.0] : [2.5, 11.0, 3.0]}
        intensity={goldenHour ? 2.1 : 1.75}
        color={goldenHour ? '#FF9E44' : '#FFF9EB'}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-bias={-0.0004}
      />

      {/* Gallery Wall Accent Point Lights */}
      <pointLight
        position={[0, 4.8, -5.8]}
        intensity={goldenHour ? 1.4 : 0.9}
        distance={10}
        color="#FFE4B5"
      />
      <pointLight
        position={[6.8, 4.6, 0]}
        intensity={goldenHour ? 1.2 : 0.85}
        distance={10}
        color="#E0F2FE"
      />
      <pointLight
        position={[-6.8, 4.6, 0]}
        intensity={goldenHour ? 1.3 : 0.85}
        distance={10}
        color="#FEF3C7"
      />

      <Suspense fallback={null}>
        <CameraRig activeZone={activeZone} customTarget={customCameraTarget} />

        <LoftArchitecture goldenHour={goldenHour} onSelectZone={onSelectZone} />

        <DrawingsWall onOpenModal={onOpenModal} onFocusCamera={onFocusCamera} />

        <GithubWall
          repos={repos}
          source={repoSource}
          username={githubUsername}
          onOpenModal={onOpenModal}
          onFocusCamera={onFocusCamera}
        />

        <ResumeWall onOpenModal={onOpenModal} onFocusCamera={onFocusCamera} />

        <ContactCorner onOpenModal={onOpenModal} onFocusCamera={onFocusCamera} />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.35}
          scale={22}
          blur={2.2}
          far={4.5}
        />
      </Suspense>
    </Canvas>
  );
}
