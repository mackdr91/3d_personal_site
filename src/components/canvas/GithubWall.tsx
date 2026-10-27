import { useState } from 'react';
import { Text, useCursor } from '@react-three/drei';
import { ActiveModalPayload, GitHubRepoItem } from '../../types/portfolio';

interface GithubWallProps {
  repos: GitHubRepoItem[];
  source: 'live' | 'curated';
  username: string;
  onOpenModal: (payload: ActiveModalPayload) => void;
  onFocusCamera: (position: [number, number, number], target: [number, number, number]) => void;
}

interface RepoFrameProps {
  repo: GitHubRepoItem;
  position: [number, number, number];
  onSelect: (repo: GitHubRepoItem, pos: [number, number, number]) => void;
}

function RepoDisplayFrame({ repo, position, onSelect }: RepoFrameProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const cardWidth = 2.65;
  const cardHeight = 1.65;

  return (
    <group
      position={position}
      rotation={[0, -Math.PI / 2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(repo, position);
      }}
    >
      {/* Brushed Aluminum & Obsidian Exhibition Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cardWidth + 0.14, cardHeight + 0.14, 0.1]} />
        <meshStandardMaterial
          color={hovered ? repo.languageColor : '#181A20'}
          metalness={0.65}
          roughness={0.28}
        />
      </mesh>

      {/* Dark Slate Code Panel Surface */}
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial color={hovered ? '#111827' : '#161F30'} roughness={0.4} />
      </mesh>

      {/* Language Color Accent Bar on Left Edge */}
      <mesh position={[-cardWidth / 2 + 0.06, 0, 0.062]}>
        <planeGeometry args={[0.08, cardHeight - 0.16]} />
        <meshBasicMaterial color={repo.languageColor} />
      </mesh>

      {/* Repository Title */}
      <Text
        position={[-cardWidth / 2 + 0.22, 0.52, 0.07]}
        fontSize={0.145}
        maxWidth={cardWidth - 0.4}
        color="#F9FAFB"
        anchorX="left"
        anchorY="middle"
      >
        {repo.name}
      </Text>

      {/* Language & Stars Pill */}
      <Text
        position={[-cardWidth / 2 + 0.22, 0.28, 0.07]}
        fontSize={0.095}
        color={repo.languageColor}
        anchorX="left"
        anchorY="middle"
      >
        {`● ${repo.language.toUpperCase()}   ★ ${repo.stars}   ⑂ ${repo.forks}`}
      </Text>

      {/* Repository Description */}
      <Text
        position={[-cardWidth / 2 + 0.22, -0.08, 0.07]}
        fontSize={0.088}
        maxWidth={cardWidth - 0.38}
        lineHeight={1.35}
        color="#CBD5E1"
        anchorX="left"
        anchorY="middle"
      >
        {repo.description.length > 115 ? `${repo.description.slice(0, 112)}...` : repo.description}
      </Text>

      {/* Bottom Interactive Prompt */}
      <Text
        position={[-cardWidth / 2 + 0.22, -0.58, 0.07]}
        fontSize={0.08}
        color={hovered ? '#FBBF24' : '#94A3B8'}
        anchorX="left"
        anchorY="middle"
      >
        {hovered ? '→ CLICK TO INSPECT REPOSITORY & ARCHITECTURE' : `UPDATED ${repo.updatedAt}`}
      </Text>
    </group>
  );
}

export function GithubWall({
  repos,
  source,
  username,
  onOpenModal,
  onFocusCamera,
}: GithubWallProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);

  const pageSize = 6;
  const totalPages = Math.ceil(repos.length / pageSize) || 1;
  const currentBatch = repos.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // 2 rows x 3 columns along the East Wall (x = 8.84) elevated slightly to give breathing room
  const slots: [number, number, number][] = [
    [8.84, 4.05, -3.4],
    [8.84, 4.05, 0],
    [8.84, 4.05, 3.4],
    [8.84, 2.15, -3.4],
    [8.84, 2.15, 0],
    [8.84, 2.15, 3.4],
  ];

  const handleSelectRepo = (repo: GitHubRepoItem, pos: [number, number, number]) => {
    const [x, y, z] = pos;
    onFocusCamera([x - 3.6, y, z], [x, y, z]);
    onOpenModal({ type: 'project', item: repo });
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((p) => (p + 1) % totalPages);
  };

  return (
    <group>
      {/* Sub-header plaque showing GitHub sync status */}
      <Text
        position={[8.85, 5.05, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.13}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
      >
        {source === 'live'
          ? `LIVE SYNCED FROM GITHUB.COM/${username.toUpperCase()} · ${repos.length} REPOSITORIES LOADED`
          : `CURATED ENGINEERING EXHIBITION (@${username}) · CLICK ANY DISPLAY TO INSPECT`}
      </Text>

      {/* 3D Exhibition Pager Controls with comfortable margin and refined proportions */}
      {totalPages > 1 && (
        <group position={[8.84, 0.62, 0]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Previous Page Button */}
          <group
            position={[-1.75, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setPrevHovered(true);
            }}
            onPointerOut={() => setPrevHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPage();
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[1.05, 0.32, 0.05]} />
              <meshStandardMaterial
                color={prevHovered ? '#D97706' : '#1E293B'}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[0, 0, 0.035]}
              fontSize={0.105}
              color={prevHovered ? '#111827' : '#FFFFFF'}
              anchorX="center"
              anchorY="middle"
            >
              ◀ PREV
            </Text>
          </group>

          {/* Page Indicator Plaque */}
          <group position={[0, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.85, 0.32, 0.04]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} />
            </mesh>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.098}
              color="#FBBF24"
              anchorX="center"
              anchorY="middle"
            >
              {`EXHIBIT ${currentPage + 1} OF ${totalPages} (${repos.length} REPOS)`}
            </Text>
          </group>

          {/* Next Page Button */}
          <group
            position={[1.75, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setNextHovered(true);
            }}
            onPointerOut={() => setNextHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              handleNextPage();
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[1.05, 0.32, 0.05]} />
              <meshStandardMaterial
                color={nextHovered ? '#D97706' : '#1E293B'}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[0, 0, 0.035]}
              fontSize={0.105}
              color={nextHovered ? '#111827' : '#FFFFFF'}
              anchorX="center"
              anchorY="middle"
            >
              NEXT ▶
            </Text>
          </group>
        </group>
      )}

      {currentBatch.map((repo, idx) => (
        <RepoDisplayFrame
          key={`${repo.id}-${currentPage}`}
          repo={repo}
          position={slots[idx] || [8.84, 2.5, 0]}
          onSelect={handleSelectRepo}
        />
      ))}
    </group>
  );
}
