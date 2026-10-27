import { useMemo, useState } from 'react';
import { Text, useCursor } from '@react-three/drei';
import { DIGITAL_DRAWINGS } from '../../data/portfolioData';
import { ActiveModalPayload, DigitalDrawing } from '../../types/portfolio';
import { getOrCreateArtworkAsset } from '../../utils/proceduralArt';

interface DrawingsWallProps {
  onOpenModal: (payload: ActiveModalPayload) => void;
  onFocusCamera: (position: [number, number, number], target: [number, number, number]) => void;
}

interface FramedArtworkProps {
  drawing: DigitalDrawing;
  onSelect: (drawing: DigitalDrawing, dataUrl: string) => void;
}

function FramedArtwork({ drawing, onSelect }: FramedArtworkProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const { texture, dataUrl } = useMemo(() => getOrCreateArtworkAsset(drawing), [drawing]);
  const [w, h] = drawing.aspect;

  if (drawing.featuredOnEasel) {
    // Render Wooden Artist Easel + Canvas in the North-West Foreground
    return (
      <group
        position={drawing.position}
        rotation={[0, 0.38, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(drawing, dataUrl);
        }}
      >
        {/* Easel A-Frame Legs */}
        <mesh position={[-0.55, -0.35, -0.15]} rotation={[0.08, 0, -0.14]} castShadow>
          <boxGeometry args={[0.08, 2.7, 0.08]} />
          <meshStandardMaterial color="#7C5230" roughness={0.65} />
        </mesh>
        <mesh position={[0.55, -0.35, -0.15]} rotation={[0.08, 0, 0.14]} castShadow>
          <boxGeometry args={[0.08, 2.7, 0.08]} />
          <meshStandardMaterial color="#7C5230" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.38, -0.65]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 2.7, 0.08]} />
          <meshStandardMaterial color="#694426" roughness={0.7} />
        </mesh>
        {/* Easel Horizontal Shelf */}
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[1.8, 0.08, 0.18]} />
          <meshStandardMaterial color="#5E3A1E" roughness={0.6} />
        </mesh>

        {/* Framed Canvas resting on Easel */}
        <group position={[0, 0.18, 0.04]} rotation={[-0.08, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w + 0.16, h + 0.16, 0.09]} />
            <meshStandardMaterial
              color={hovered ? '#D97706' : '#231F1D'}
              metalness={0.35}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial map={texture} roughness={0.35} />
          </mesh>
        </group>

        {/* Easel Plaque */}
        <Text
          position={[0, -1.04, 0.14]}
          fontSize={0.09}
          color="#2B2623"
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? 'CLICK TO INSPECT EASEL STUDY' : `EASEL STUDY · ${drawing.title.toUpperCase()}`}
        </Text>
      </group>
    );
  }

  return (
    <group
      position={drawing.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(drawing, dataUrl);
      }}
    >
      {/* Track Spotlight Fixture above frame */}
      <mesh position={[0, h / 2 + 0.55, 0.45]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.24, 16]} />
        <meshStandardMaterial color="#1E1E22" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Outer Gallery Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w + 0.28, h + 0.28, 0.12]} />
        <meshStandardMaterial
          color={hovered ? '#C98A2C' : '#1E1B18'}
          roughness={0.38}
          metalness={hovered ? 0.55 : 0.2}
        />
      </mesh>

      {/* Archival Cream Mat Board */}
      <mesh position={[0, 0, 0.052]}>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.03]} />
        <meshStandardMaterial color="#FAF7F2" roughness={0.85} />
      </mesh>

      {/* Digital Illustration Canvas Surface */}
      <mesh position={[0, 0, 0.072]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.32}
          metalness={0.04}
          emissive={hovered ? '#ffffff' : '#000000'}
          emissiveMap={hovered ? texture : null}
          emissiveIntensity={hovered ? 0.18 : 0}
        />
      </mesh>

      {/* Museum Wall Label Plaque below frame */}
      <group position={[0, -h / 2 - 0.36, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[1.85, 0.36, 0.03]} />
          <meshStandardMaterial color={hovered ? '#1F2937' : '#FFFFFF'} roughness={0.6} />
        </mesh>
        <Text
          position={[0, 0.05, 0.022]}
          fontSize={0.095}
          color={hovered ? '#FBBF24' : '#18181B'}
          anchorX="center"
          anchorY="middle"
        >
          {drawing.title}
        </Text>
        <Text
          position={[0, -0.08, 0.022]}
          fontSize={0.068}
          color={hovered ? '#E5E7EB' : '#6B7280'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? 'Click to Open High-Res Lightbox' : `${drawing.medium} · ${drawing.year}`}
        </Text>
      </group>
    </group>
  );
}

export function DrawingsWall({ onOpenModal, onFocusCamera }: DrawingsWallProps) {
  const handleSelectDrawing = (drawing: DigitalDrawing, dataUrl: string) => {
    const [x, y, z] = drawing.position;
    if (drawing.featuredOnEasel) {
      onFocusCamera([-1.6, 2.1, -1.8], [x, y + 0.1, z]);
    } else {
      onFocusCamera([x, y, z + 4.8], [x, y, z]);
    }
    onOpenModal({ type: 'drawing', item: drawing, generatedDataUrl: dataUrl });
  };

  return (
    <group>
      {DIGITAL_DRAWINGS.map((drawing) => (
        <FramedArtwork key={drawing.id} drawing={drawing} onSelect={handleSelectDrawing} />
      ))}
    </group>
  );
}
