import { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ZoneId } from '../../types/portfolio';

interface LoftArchitectureProps {
  goldenHour: boolean;
  onSelectZone: (zone: ZoneId) => void;
}

export function LoftArchitecture({ goldenHour, onSelectZone }: LoftArchitectureProps) {
  // Procedural warm oak hardwood plank texture
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#C89F74';
    ctx.fillRect(0, 0, 512, 512);

    const tones = ['#B88B5E', '#CDA57A', '#C19468', '#AE7F52'];
    const rows = 8;
    const rowH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const offset = (r % 2) * 128;
      for (let c = -1; c < 4; c++) {
        const x = c * 170 + offset;
        ctx.fillStyle = tones[(r + c + 4) % tones.length];
        ctx.fillRect(x, y, 168, rowH - 2);

        // Subtle wood grain lines
        ctx.strokeStyle = 'rgba(70, 42, 18, 0.12)';
        ctx.lineWidth = 1;
        for (let g = 6; g < rowH - 4; g += 10) {
          ctx.beginPath();
          ctx.moveTo(x + 4, y + g);
          ctx.lineTo(x + 162, y + g + ((r % 2 === 0 ? 1 : -1) * 2));
          ctx.stroke();
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const wallColor = goldenHour ? '#F3ECE1' : '#F8F6F1';
  const wainscotingColor = goldenHour ? '#E5DCD0' : '#EBE7DF';

  return (
    <group>
      {/* Hardwood Studio Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial map={floorTexture} roughness={0.62} metalness={0.05} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 0.12, -7.94]} receiveShadow>
        <boxGeometry args={[18, 0.24, 0.12]} />
        <meshStandardMaterial color="#2C2520" roughness={0.5} />
      </mesh>
      <mesh position={[-8.94, 0.12, 0]} receiveShadow>
        <boxGeometry args={[0.12, 0.24, 16]} />
        <meshStandardMaterial color="#2C2520" roughness={0.5} />
      </mesh>
      <mesh position={[8.94, 0.12, 0]} receiveShadow>
        <boxGeometry args={[0.12, 0.24, 16]} />
        <meshStandardMaterial color="#2C2520" roughness={0.5} />
      </mesh>

      {/* North Wall (Digital Drawings Gallery) */}
      <mesh position={[0, 3.25, -8]} receiveShadow>
        <boxGeometry args={[18, 6.5, 0.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} />
      </mesh>
      {/* Lower Gallery Dado Rail on North Wall */}
      <mesh position={[0, 0.85, -7.89]} receiveShadow>
        <boxGeometry args={[17.8, 0.06, 0.06]} />
        <meshStandardMaterial color={wainscotingColor} roughness={0.7} />
      </mesh>

      {/* East Wall (GitHub Coding Projects Lab) */}
      <mesh position={[9, 3.25, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6.5, 16]} />
        <meshStandardMaterial color={wallColor} roughness={0.86} />
      </mesh>

      {/* West Wall (Resume Art on the Wall) */}
      <mesh position={[-9, 3.25, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6.5, 16]} />
        <meshStandardMaterial color={wallColor} roughness={0.86} />
      </mesh>

      {/* Architectural Loft Ceiling Beams & Skylight Frame */}
      {[-6, -2, 2, 6].map((zPos) => (
        <mesh key={`beam-${zPos}`} position={[0, 6.35, zPos]} castShadow receiveShadow>
          <boxGeometry args={[18, 0.28, 0.28]} />
          <meshStandardMaterial color="#362E28" roughness={0.6} />
        </mesh>
      ))}

      {/* Overhead Track Lighting Rails */}
      <mesh position={[0, 5.95, -5.8]}>
        <boxGeometry args={[12, 0.05, 0.05]} />
        <meshStandardMaterial color="#1B1B1E" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[6.8, 5.95, 0]}>
        <boxGeometry args={[0.05, 0.05, 11]} />
        <meshStandardMaterial color="#1B1B1E" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-6.8, 5.95, 0]}>
        <boxGeometry args={[0.05, 0.05, 11]} />
        <meshStandardMaterial color="#1B1B1E" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Sunlit Skylight Window Pane Overhead */}
      <mesh position={[0, 6.48, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 7]} />
        <meshBasicMaterial
          color={goldenHour ? '#FFD29D' : '#FFFDF8'}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* Sunbeam Floor Light Patch */}
      <mesh position={[0.3, 0.012, -0.6]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <planeGeometry args={[7.4, 4.8]} />
        <meshBasicMaterial
          color={goldenHour ? '#FFAE52' : '#FFF6E0'}
          transparent
          opacity={goldenHour ? 0.18 : 0.12}
        />
      </mesh>

      {/* Center Atelier Woven Rug */}
      <mesh position={[0, 0.018, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.4, 4.4]} />
        <meshStandardMaterial color="#E6DFD3" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.022, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.8, 3.8]} />
        <meshStandardMaterial color="#27323F" roughness={0.92} />
      </mesh>

      {/* Center Museum Viewing Bench & Kinetic Brass Sculpture */}
      <group
        position={[0, 0, -0.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectZone('overview');
        }}
      >
        {/* Bench Seat */}
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.12, 0.85]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.55} />
        </mesh>
        {/* Bench Legs */}
        <mesh position={[-1.0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.44, 0.75]} />
          <meshStandardMaterial color="#1F1F24" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[1.0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.44, 0.75]} />
          <meshStandardMaterial color="#1F1F24" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Small Art Catalog Book on Bench */}
        <mesh position={[0.65, 0.54, 0.05]} rotation={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.42, 0.04, 0.32]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
      </group>

      {/* Sculptural Pedestal near North-West Corner */}
      <group position={[-6.8, 0, -5.8]}>
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.48, 1.3, 32]} />
          <meshStandardMaterial color="#EDE8DF" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.65, 0]} rotation={[0.4, 0.6, 0.2]} castShadow>
          <torusKnotGeometry args={[0.26, 0.075, 96, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Studio Monstera / Olive Tree Planters */}
      {[
        [7.2, 0, -6.2],
        [-7.2, 0, 5.2],
      ].map(([px, py, pz], idx) => (
        <group key={`planter-${idx}`} position={[px, py, pz]}>
          {/* Terracotta Planter Pot */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.32, 0.84, 24]} />
            <meshStandardMaterial color="#C86D51" roughness={0.75} />
          </mesh>
          {/* Trunk */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, 1.1, 12]} />
            <meshStandardMaterial color="#5C4033" roughness={0.85} />
          </mesh>
          {/* Foliage Clusters */}
          <mesh position={[0, 1.75, 0]} castShadow>
            <dodecahedronGeometry args={[0.52, 1]} />
            <meshStandardMaterial color="#3A6B4C" roughness={0.65} />
          </mesh>
          <mesh position={[0.28, 1.52, 0.2]} castShadow>
            <dodecahedronGeometry args={[0.38, 1]} />
            <meshStandardMaterial color="#4B7F5E" roughness={0.65} />
          </mesh>
          <mesh position={[-0.25, 1.48, -0.18]} castShadow>
            <dodecahedronGeometry args={[0.36, 1]} />
            <meshStandardMaterial color="#2D573C" roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Subtle Architectural Zone Headers on the 3 Main Walls */}
      <Text
        position={[0, 5.55, -7.86]}
        fontSize={0.34}
        letterSpacing={0.14}
        color="#2B2623"
        anchorX="center"
        anchorY="middle"
      >
        I · DIGITAL DRAWINGS ATELIER
      </Text>

      <Text
        position={[8.86, 5.55, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.34}
        letterSpacing={0.14}
        color="#2B2623"
        anchorX="center"
        anchorY="middle"
      >
        II · GITHUB SYSTEMS & CODE EXHIBITION
      </Text>

      <Text
        position={[-8.86, 5.55, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.34}
        letterSpacing={0.14}
        color="#2B2623"
        anchorX="center"
        anchorY="middle"
      >
        III · CURRICULUM VITAE — ART ON THE WALL
      </Text>
    </group>
  );
}
