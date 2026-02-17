/**
 * SmplAvatar3D — React Three Fiber component that displays a
 * SMPLpix-generated neural avatar video on a plane in the VR scene.
 *
 * Falls back to the existing procedural NPCAvatar when SMPLpix is unavailable.
 */

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { NPCEmotion } from '@/lib/npcEngine';
import {
  requestAvatar,
  requestAvatarIfEmotionChanged,
  isSmplpixAvailable,
  type AvatarResult,
} from '@/lib/smplpixClient';

interface SmplAvatar3DProps {
  characterId: string;
  lessonId: string;
  emotion: NPCEmotion;
  turnCount: number;
  /** Called when SMPLpix is unavailable so the parent can render fallback */
  onFallback?: () => void;
}

export default function SmplAvatar3D({
  characterId,
  lessonId,
  emotion,
  turnCount,
  onFallback,
}: SmplAvatar3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ── Initial load ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSmplpixAvailable()) {
      setIsLoading(false);
      onFallback?.();
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    requestAvatar(characterId, lessonId, emotion).then((result) => {
      if (cancelled) return;
      if (result) {
        setVideoUrl(result.videoUrl);
      } else {
        onFallback?.();
      }
      setIsLoading(false);
    });

    return () => { cancelled = true; };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId, lessonId]);

  // ── Emotion-driven updates (throttled) ──────────────────────────────
  useEffect(() => {
    if (!isSmplpixAvailable() || turnCount < 1) return;

    let cancelled = false;
    requestAvatarIfEmotionChanged(characterId, lessonId, emotion, turnCount).then(
      (result) => {
        if (cancelled || !result) return;
        setVideoUrl(result.videoUrl);
      }
    );

    return () => { cancelled = true; };
  }, [characterId, lessonId, emotion, turnCount]);

  // ── Video element & texture ─────────────────────────────────────────
  const videoTexture = useMemo(() => {
    if (!videoUrl) return null;

    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true; // audio comes from TTS, not the avatar video
    video.playsInline = true;
    video.play().catch(() => {});
    videoRef.current = video;

    return new THREE.VideoTexture(video);
  }, [videoUrl]);

  // Clean up video element
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current = null;
      }
    };
  }, []);

  // Subtle idle animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = 1.0 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02;
    }
  });

  // ── If no video, render nothing (parent shows fallback) ─────────────
  if (!videoTexture || isLoading) {
    return null;
  }

  // ── Render a billboard plane with the video texture ─────────────────
  return (
    <mesh ref={meshRef} position={[0, 1.0, 0]}>
      <planeGeometry args={[1.8, 2.4]} />
      <meshBasicMaterial map={videoTexture} side={THREE.DoubleSide} transparent />
    </mesh>
  );
}
