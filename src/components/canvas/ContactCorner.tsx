import { useState } from 'react';
import { Text, useCursor } from '@react-three/drei';
import { CONTACT_PROFILE } from '../../data/portfolioData';
import { ActiveModalPayload } from '../../types/portfolio';

interface ContactCornerProps {
  onOpenModal: (payload: ActiveModalPayload) => void;
  onFocusCamera: (position: [number, number, number], target: [number, number, number]) => void;
}

export function ContactCorner({ onOpenModal, onFocusCamera }: ContactCornerProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handleTriggerContact = () => {
    onFocusCamera([3.2, 2.25, 3.0], [5.4, 1.45, 5.6]);
    onOpenModal({ type: 'contact' });
  };

  return (
    <group
      position={[5.4, 0, 5.6]}
      rotation={[0, -Math.PI * 0.78, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        handleTriggerContact();
      }}
    >
      {/* Architect's Walnut Drafting & Guestbook Desk */}
      <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 1.25]} />
        <meshStandardMaterial color="#5C3D28" roughness={0.48} />
      </mesh>
      {/* Desk Legs */}
      {[
        [-1.1, 0.4, -0.5],
        [1.1, 0.4, -0.5],
        [-1.1, 0.4, 0.5],
        [1.1, 0.4, 0.5],
      ].map(([lx, ly, lz], i) => (
        <mesh key={`leg-${i}`} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.8, 12]} />
          <meshStandardMaterial color="#18181B" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Brass Banker / Architect Desk Lamp */}
      <group position={[-0.85, 0.87, -0.25]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.08, 20]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.55, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.12, 0.58, 0]} rotation={[0, 0, -0.4]} castShadow>
          <coneGeometry args={[0.22, 0.25, 20, 1, true]} />
          <meshStandardMaterial
            color="#15803D"
            roughness={0.25}
            emissive="#4ADE80"
            emissiveIntensity={hovered ? 0.6 : 0.25}
          />
        </mesh>
      </group>

      {/* Open Studio Guestbook / Contact Card on Desk */}
      <group position={[0.1, 0.89, 0.05]} rotation={[0, 0.12, 0]}>
        {/* Book Cover Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.035, 0.72]} />
          <meshStandardMaterial color="#4A2E1B" roughness={0.65} />
        </mesh>
        {/* Book Left Page */}
        <mesh position={[-0.24, 0.022, 0]} receiveShadow>
          <boxGeometry args={[0.48, 0.015, 0.64]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.8} />
        </mesh>
        {/* Book Right Page */}
        <mesh position={[0.24, 0.022, 0]} receiveShadow>
          <boxGeometry args={[0.48, 0.015, 0.64]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.8} />
        </mesh>
        {/* Book Spine Center Crease */}
        <mesh position={[0, 0.024, 0]}>
          <boxGeometry args={[0.02, 0.016, 0.64]} />
          <meshStandardMaterial color="#D1C7BD" roughness={0.6} />
        </mesh>

        {/* Left Page Title */}
        <Text
          position={[-0.24, 0.032, -0.16]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.042}
          maxWidth={0.42}
          lineHeight={1.3}
          color="#18181B"
          anchorX="center"
          anchorY="middle"
        >
          {'STUDIO\nGUESTBOOK'}
        </Text>

        {/* Left Page Note */}
        <Text
          position={[-0.24, 0.032, 0.08]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.03}
          maxWidth={0.4}
          lineHeight={1.4}
          color="#57534E"
          anchorX="center"
          anchorY="middle"
        >
          {'Leave a note or commission inquiry.'}
        </Text>

        {/* Right Page Header */}
        <Text
          position={[0.24, 0.032, -0.16]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.042}
          maxWidth={0.42}
          lineHeight={1.3}
          color="#D97706"
          anchorX="center"
          anchorY="middle"
        >
          {'DIRECT\nDISPATCH'}
        </Text>

        {/* Right Page Action Hint */}
        <Text
          position={[0.24, 0.032, 0.08]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.032}
          maxWidth={0.4}
          lineHeight={1.4}
          color={hovered ? '#D97706' : '#78716C'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? 'CLICK TO OPEN DISPATCH FORM' : 'Click book to sign & send message'}
        </Text>
      </group>

      {/* Floating Architectural Signboard behind the Desk */}
      <group position={[0, 2.05, -0.65]}>
        <mesh castShadow>
          <boxGeometry args={[2.6, 1.25, 0.08]} />
          <meshStandardMaterial
            color={hovered ? '#D97706' : '#18181B'}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.46, 1.12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>

        <Text
          position={[0, 0.32, 0.06]}
          fontSize={0.14}
          letterSpacing={0.08}
          color="#FBBF24"
          anchorX="center"
          anchorY="middle"
        >
          IV · ARTIST DESK & CONTACT
        </Text>

        <Text
          position={[0, 0.05, 0.06]}
          fontSize={0.105}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
        >
          {CONTACT_PROFILE.email}
        </Text>

        <Text
          position={[0, -0.18, 0.06]}
          fontSize={0.082}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          {`GitHub @${CONTACT_PROFILE.githubUsername}  ·  LinkedIn  ·  ArtStation`}
        </Text>

        <Text
          position={[0, -0.4, 0.06]}
          fontSize={0.08}
          color={hovered ? '#34D399' : '#E2E8F0'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? '→ CLICK TO OPEN STUDIO DISPATCH & LINKS' : 'CLICK DESK TO SEND A MESSAGE'}
        </Text>
      </group>
    </group>
  );
}
