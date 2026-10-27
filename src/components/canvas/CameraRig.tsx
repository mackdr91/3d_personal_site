import { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import type CameraControlsImpl from 'camera-controls';
import { CAMERA_WAYPOINTS } from '../../data/portfolioData';
import { ZoneId } from '../../types/portfolio';

interface CameraRigProps {
  activeZone: ZoneId;
  customTarget: {
    position: [number, number, number];
    target: [number, number, number];
  } | null;
}

export function CameraRig({ activeZone, customTarget }: CameraRigProps) {
  const controlsRef = useRef<CameraControlsImpl>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (customTarget) {
      const [px, py, pz] = customTarget.position;
      const [tx, ty, tz] = customTarget.target;
      void controls.setLookAt(px, py, pz, tx, ty, tz, true);
      return;
    }

    const wp = CAMERA_WAYPOINTS[activeZone] || CAMERA_WAYPOINTS.overview;
    const [px, py, pz] = wp.position;
    const [tx, ty, tz] = wp.target;
    void controls.setLookAt(px, py, pz, tx, ty, tz, true);
  }, [activeZone, customTarget]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.55}
      draggingSmoothTime={0.18}
      minDistance={1.5}
      maxDistance={14.5}
      minPolarAngle={Math.PI * 0.14}
      maxPolarAngle={Math.PI * 0.52}
    />
  );
}
