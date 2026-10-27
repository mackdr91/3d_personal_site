import * as THREE from 'three';
import { DigitalDrawing } from '../types/portfolio';

const textureCache = new Map<string, { texture: THREE.CanvasTexture; dataUrl: string }>();

/**
 * Generates a high-resolution procedural digital illustration texture & dataURL
 * for each artwork on the North Wall and Studio Easel.
 * If the user adds an external `imageUrl` in `portfolioData.ts`, the component
 * can load that image while keeping this generator as an instant artistic canvas.
 */
export function getOrCreateArtworkAsset(drawing: DigitalDrawing): {
  texture: THREE.CanvasTexture;
  dataUrl: string;
} {
  const cached = textureCache.get(drawing.id);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d')!;

  const [c1, c2, c3, c4] = drawing.palette;

  // Base atmospheric gradient
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGrad.addColorStop(0, c3);
  bgGrad.addColorStop(0.55, c1);
  bgGrad.addColorStop(1, c4);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle canvas weave grain
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#ffffff';
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += 6) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

  if (drawing.motif === 'solstice') {
    // Brutalist arches & glowing amber sun
    const sunGrad = ctx.createRadialGradient(512, 460, 20, 512, 460, 380);
    sunGrad.addColorStop(0, '#FFF8E7');
    sunGrad.addColorStop(0.35, c2);
    sunGrad.addColorStop(0.75, c1);
    sunGrad.addColorStop(1, 'rgba(29, 53, 87, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(512, 460, 380, 0, Math.PI * 2);
    ctx.fill();

    // Horizon reflections
    ctx.fillStyle = c3;
    ctx.fillRect(0, 820, 1024, 460);

    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = i % 2 === 0 ? c2 : c4;
      ctx.globalAlpha = 0.65 - i * 0.03;
      const w = 360 - i * 14;
      ctx.fillRect(512 - w / 2, 835 + i * 22, w, 10);
    }
    ctx.globalAlpha = 1;

    // Architectural arch silhouette
    ctx.fillStyle = '#121F33';
    ctx.fillRect(90, 120, 140, 920);
    ctx.fillRect(794, 120, 140, 920);
    ctx.beginPath();
    ctx.arc(512, 390, 282, Math.PI, 0, false);
    ctx.lineWidth = 85;
    ctx.strokeStyle = '#121F33';
    ctx.stroke();
  } else if (drawing.motif === 'cyber-botanical') {
    // Sunken glass conservatory & brass astrolabe rings
    ctx.strokeStyle = c2;
    ctx.lineWidth = 4;
    for (let r = 120; r <= 420; r += 75) {
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(512, 540, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Diagonal meridian lines
    ctx.beginPath();
    ctx.moveTo(140, 180);
    ctx.lineTo(884, 900);
    ctx.moveTo(884, 180);
    ctx.lineTo(140, 900);
    ctx.stroke();

    // Organic botanical leaves in glowing teal & gold
    const drawLeaf = (cx: number, cy: number, angle: number, scale: number, color: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(60, -90, 140, -90, 210, 0);
      ctx.bezierCurveTo(140, 90, 60, 90, 0, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.82;
      ctx.fill();
      ctx.strokeStyle = '#FFF3D1';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      drawLeaf(512, 620, a, 1.15, i % 2 === 0 ? c1 : c4);
      drawLeaf(512, 460, a + 0.25, 0.8, i % 3 === 0 ? c2 : c1);
    }
    ctx.globalAlpha = 1;
  } else if (drawing.motif === 'architectural-dream') {
    // Isometric blocks & dusk geometry
    const colors = [c1, c2, c3, c4];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const x = 150 + col * 175 + (row % 2) * 65;
        const y = 210 + row * 165;
        const h = 110 + ((row * 3 + col * 7) % 120);

        ctx.fillStyle = colors[(row + col) % colors.length];
        ctx.globalAlpha = 0.88;
        ctx.fillRect(x, y - h / 2, 115, h);

        ctx.strokeStyle = '#F1FAEE';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y - h / 2, 115, h);

        // Lit windows
        ctx.fillStyle = '#FFE8A3';
        for (let wy = y - h / 2 + 18; wy < y + h / 2 - 20; wy += 28) {
          ctx.fillRect(x + 22, wy, 18, 14);
          ctx.fillRect(x + 62, wy, 18, 14);
        }
      }
    }
    ctx.globalAlpha = 1;
  } else {
    // Nocturne in Cobalt & Gold Leaf
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(0, 0, 1024, 1280);

    // Swirling impasto tide waves
    for (let w = 0; w < 14; w++) {
      ctx.beginPath();
      const baseY = 320 + w * 65;
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= 1024; x += 64) {
        const yOffset = Math.sin(x * 0.008 + w * 0.7) * 55;
        ctx.lineTo(x, baseY + yOffset);
      }
      ctx.strokeStyle = w % 3 === 0 ? c2 : w % 2 === 0 ? c4 : '#1D3557';
      ctx.lineWidth = w % 3 === 0 ? 8 : 18;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
    }

    // Gold leaf crescent & stars
    ctx.globalAlpha = 1;
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.arc(680, 290, 95, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0B132B';
    ctx.beginPath();
    ctx.arc(715, 270, 82, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gallery mat border & artist signature
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 24;
  ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.font = 'italic 600 28px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`R3IL1RE · ${drawing.year}`, 78, canvas.height - 72);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const dataUrl = canvas.toDataURL('image/png');
  const result = { texture, dataUrl };
  textureCache.set(drawing.id, result);
  return result;
}
