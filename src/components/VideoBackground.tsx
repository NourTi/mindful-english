/**
 * VideoBackground — fullscreen looping video backdrop with a dark overlay.
 * Used in Immergo chat sessions and lessons to set the environmental mood.
 */

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  src: string;
  /** Overlay opacity 0–1 (default 0.65) */
  overlayOpacity?: number;
  className?: string;
}

export default function VideoBackground({
  src,
  overlayOpacity = 0.65,
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure autoplay with muted (browser requirement)
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.video
        ref={videoRef}
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay so text remains readable */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      />
    </div>
  );
}
