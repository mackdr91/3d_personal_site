import { useState } from 'react';
import { Text, useCursor } from '@react-three/drei';
import { RESUME_MILESTONES, SKILL_CLUSTERS } from '../../data/portfolioData';
import { ActiveModalPayload, ResumeMilestone } from '../../types/portfolio';

interface ResumeWallProps {
  onOpenModal: (payload: ActiveModalPayload) => void;
  onFocusCamera: (position: [number, number, number], target: [number, number, number]) => void;
}

interface MilestoneFrameProps {
  milestone: ResumeMilestone;
  position: [number, number, number];
  onSelect: (milestone: ResumeMilestone, pos: [number, number, number]) => void;
}

function MilestoneArtPrint({ milestone, position, onSelect }: MilestoneFrameProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const width = 2.75;
  const height = 2.45;

  return (
    <group
      position={position}
      rotation={[0, Math.PI / 2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(milestone, position);
      }}
    >
      {/* Museum Warm Walnut / Brass Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width + 0.18, height + 0.18, 0.1]} />
        <meshStandardMaterial
          color={hovered ? milestone.accentColor : '#3E2C22'}
          roughness={0.42}
          metalness={hovered ? 0.45 : 0.15}
        />
      </mesh>

      {/* Archival Cotton Paper Print */}
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#FCFBF7" roughness={0.85} />
      </mesh>

      {/* Top Accent Geometric Header Bar */}
      <mesh position={[0, height / 2 - 0.22, 0.062]}>
        <planeGeometry args={[width - 0.28, 0.24]} />
        <meshBasicMaterial color={milestone.accentColor} />
      </mesh>

      <Text
        position={[-width / 2 + 0.24, height / 2 - 0.22, 0.07]}
        fontSize={0.092}
        color="#FFFFFF"
        anchorX="left"
        anchorY="middle"
      >
        {`${milestone.period}  ·  ${milestone.location.toUpperCase()}`}
      </Text>

      {/* Role Title (Anchored to top) */}
      <Text
        position={[-width / 2 + 0.24, height / 2 - 0.44, 0.07]}
        fontSize={0.125}
        maxWidth={width - 0.48}
        color="#18181B"
        anchorX="left"
        anchorY="top"
      >
        {milestone.role}
      </Text>

      {/* Organization (Anchored to top, safely below role title) */}
      <Text
        position={[-width / 2 + 0.24, height / 2 - 0.88, 0.07]}
        fontSize={0.108}
        maxWidth={width - 0.48}
        color={milestone.accentColor}
        anchorX="left"
        anchorY="top"
      >
        {milestone.organization}
      </Text>

      {/* Typographic Curated Bullet Highlights (Anchored to top, cleanly under organization) */}
      <Text
        position={[-width / 2 + 0.24, height / 2 - 1.16, 0.07]}
        fontSize={0.076}
        maxWidth={width - 0.48}
        lineHeight={1.48}
        color="#3F3F46"
        anchorX="left"
        anchorY="top"
      >
        {milestone.highlights.map((h) => `• ${h}`).join('\n\n')}
      </Text>

      {/* Footer Inspection Prompt */}
      <Text
        position={[0, -height / 2 + 0.18, 0.07]}
        fontSize={0.074}
        color={hovered ? milestone.accentColor : '#71717A'}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? 'CLICK TO READ FULL CURATORIAL CV & PRINTABLE RESUME' : 'EXHIBITION PLATE · CLICK TO ZOOM'}
      </Text>
    </group>
  );
}

export function ResumeWall({ onOpenModal, onFocusCamera }: ResumeWallProps) {
  const [plaqueHovered, setPlaqueHovered] = useState(false);
  useCursor(plaqueHovered);

  const [currentBatch, setCurrentBatch] = useState(0);
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);

  const pageSize = 3;
  const totalBatches = Math.ceil(RESUME_MILESTONES.length / pageSize);
  const displayedMilestones = RESUME_MILESTONES.slice(
    currentBatch * pageSize,
    (currentBatch + 1) * pageSize
  );

  const slots: [number, number, number][] = [
    [-8.84, 3.4, 3.4],
    [-8.84, 3.4, 0],
    [-8.84, 3.4, -3.4],
  ];

  const handleSelectMilestone = (
    milestone: ResumeMilestone,
    pos: [number, number, number]
  ) => {
    const [x, y, z] = pos;
    onFocusCamera([x + 3.6, y, z], [x, y, z]);
    onOpenModal({ type: 'resume', milestone });
  };

  const skillSlots: [number, number, number][] = [
    [-8.84, 1.45, 4.4],
    [-8.84, 1.45, 2.2],
    [-8.84, 1.45, 0],
    [-8.84, 1.45, -2.2],
    [-8.84, 1.45, -4.4],
  ];

  return (
    <group>
      {/* Top Curatorial Subtitle */}
      <Text
        position={[-8.85, 5.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.115}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
      >
        RETROSPECTIVE EXHIBITION · 10+ YEARS IT LEADERSHIP, SYSTEMS & CYBERSECURITY
      </Text>

      {/* 3D Resume Timeline Batch Switcher - positioned comfortably between subtitle and prints */}
      {totalBatches > 1 && (
        <group position={[-8.84, 4.95, 0]} rotation={[0, Math.PI / 2, 0]}>
          <group
            position={[-1.75, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setPrevHovered(true);
            }}
            onPointerOut={() => setPrevHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentBatch((b) => (b - 1 + totalBatches) % totalBatches);
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[1.05, 0.28, 0.05]} />
              <meshStandardMaterial
                color={prevHovered ? '#D97706' : '#1E293B'}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[0, 0, 0.035]}
              fontSize={0.095}
              color={prevHovered ? '#111827' : '#FFFFFF'}
              anchorX="center"
              anchorY="middle"
            >
              ◀ EARLIER
            </Text>
          </group>

          <group position={[0, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.85, 0.28, 0.04]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} />
            </mesh>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.09}
              color="#FBBF24"
              anchorX="center"
              anchorY="middle"
            >
              {`TIMELINE ${currentBatch + 1} OF ${totalBatches}`}
            </Text>
          </group>

          <group
            position={[1.75, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setNextHovered(true);
            }}
            onPointerOut={() => setNextHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentBatch((b) => (b + 1) % totalBatches);
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[1.05, 0.28, 0.05]} />
              <meshStandardMaterial
                color={nextHovered ? '#D97706' : '#1E293B'}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[0, 0, 0.035]}
              fontSize={0.095}
              color={nextHovered ? '#111827' : '#FFFFFF'}
              anchorX="center"
              anchorY="middle"
            >
              MORE RECENT ▶
            </Text>
          </group>
        </group>
      )}

      {/* Framed Typographic Resume Prints for Current Batch */}
      {displayedMilestones.map((milestone, idx) => (
        <MilestoneArtPrint
          key={milestone.id}
          milestone={milestone}
          position={slots[idx] || [-8.84, 3.45, 0]}
          onSelect={handleSelectMilestone}
        />
      ))}

      {/* Lower Architectural Brass & Slate Skill & Certification Plaques */}
      {SKILL_CLUSTERS.map((cluster, idx) => {
        const slot = skillSlots[idx] || [-8.84, 1.25, 0];
        return (
          <group
            key={cluster.category}
            position={[slot[0], 1.25, slot[2]]}
            rotation={[0, Math.PI / 2, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setPlaqueHovered(true);
            }}
            onPointerOut={() => setPlaqueHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onFocusCamera([-5.2, 2.1, slot[2]], [-8.84, 2.1, slot[2]]);
              onOpenModal({ type: 'resume' });
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[2.0, 1.15, 0.07]} />
              <meshStandardMaterial
                color={plaqueHovered ? '#292524' : '#1C1917'}
                metalness={0.5}
                roughness={0.35}
              />
            </mesh>
            <Text
              position={[0, 0.36, 0.045]}
              fontSize={0.098}
              color="#F59E0B"
              anchorX="center"
              anchorY="middle"
            >
              {cluster.category.toUpperCase()}
            </Text>
            <Text
              position={[0, -0.12, 0.045]}
              fontSize={0.076}
              maxWidth={1.82}
              lineHeight={1.5}
              color="#E7E5E4"
              anchorX="center"
              anchorY="middle"
            >
              {cluster.items.join('  ·  ')}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
