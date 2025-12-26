import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  pieceCount?: number;
}

const colors = [
  'hsl(239, 84%, 67%)', // Primary indigo
  'hsl(38, 92%, 50%)',  // Accent amber
  'hsl(142, 70%, 45%)', // Success green
  'hsl(262, 65%, 58%)', // Visual purple
  'hsl(199, 80%, 50%)', // Auditory blue
  'hsl(0, 72%, 51%)',   // Red
  'hsl(25, 85%, 55%)',  // Orange
];

export const Confetti = ({ isActive, duration = 3000, pieceCount = 50 }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 6,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, duration, pieceCount]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute top-0"
              style={{
                left: `${piece.x}%`,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
              initial={{
                y: -20,
                rotate: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: piece.rotation + 720,
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: "easeOut",
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Celebration burst effect for node completion
export const CelebrationBurst = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent/50 to-success/50 blur-xl" />
    </motion.div>
  );
};

export default Confetti;