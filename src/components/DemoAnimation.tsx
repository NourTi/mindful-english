import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Particle background component
const ParticleField = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Wireframe cage component
const WireframeCage = ({ dissolving }: { dissolving: boolean }) => {
  const lines = [
    // Horizontal lines
    { x1: 20, y1: 30, x2: 80, y2: 30 },
    { x1: 20, y1: 50, x2: 80, y2: 50 },
    { x1: 20, y1: 70, x2: 80, y2: 70 },
    // Vertical lines
    { x1: 30, y1: 20, x2: 30, y2: 80 },
    { x1: 50, y1: 20, x2: 50, y2: 80 },
    { x1: 70, y1: 20, x2: 70, y2: 80 },
    // Diagonal tangles
    { x1: 25, y1: 25, x2: 75, y2: 45 },
    { x1: 75, y1: 25, x2: 25, y2: 55 },
    { x1: 35, y1: 65, x2: 65, y2: 35 },
    { x1: 20, y1: 60, x2: 80, y2: 40 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
      <title>Wireframe Cage</title>
      {lines.map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="hsl(234 20% 40%)"
          strokeWidth="0.5"
          initial={{ pathLength: 1, opacity: 0.6 }}
          animate={dissolving ? {
            opacity: 0,
            strokeWidth: 0,
            filter: "blur(4px)",
          } : {
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={dissolving ? {
            duration: 2,
            delay: i * 0.15,
            ease: "easeOut",
          } : {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </svg>
  );
};

// Geometric shapes component
const GeometricShapes = ({ phase }: { phase: number }) => {
  const isTrapped = phase === 1;
  const isMorphing = phase === 3;
  const isAscending = phase === 4;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Cube */}
      <motion.div
        className="absolute"
        style={{ left: '30%', top: '40%' }}
        animate={isTrapped ? {
          x: [-2, 2, -2],
          y: [-1, 1, -1],
          rotate: [-2, 2, -2],
        } : isMorphing ? {
          x: [0, 100, -50, 80],
          y: [0, -80, 60, -40],
          scale: [1, 0.8, 1.2, 0.9],
          rotate: [0, 180, 360, 540],
        } : isAscending ? {
          y: -200,
          x: 70,
          opacity: 0,
          scale: 0.5,
        } : {}}
        transition={isTrapped ? {
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        } : isMorphing ? {
          duration: 5,
          ease: "easeInOut",
        } : {
          duration: 3,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="w-12 h-12"
          style={{
            background: isTrapped 
              ? 'linear-gradient(135deg, hsl(234 30% 25%), hsl(234 30% 15%))'
              : isMorphing
              ? 'linear-gradient(135deg, hsl(262 65% 58%), hsl(187 90% 50%))'
              : 'linear-gradient(135deg, hsl(38 92% 55%), hsl(38 95% 65%))',
            boxShadow: isMorphing 
              ? '0 0 30px hsl(262 65% 58% / 0.6)' 
              : isAscending 
              ? '0 0 40px hsl(38 92% 55% / 0.8)'
              : 'none',
          }}
          animate={isMorphing ? {
            borderRadius: ['10%', '50%', '30%', '50%'],
          } : {
            borderRadius: '10%',
          }}
          transition={{ duration: 2, repeat: isMorphing ? Infinity : 0 }}
        />
      </motion.div>

      {/* Pyramid (triangle) */}
      <motion.div
        className="absolute"
        style={{ left: '50%', top: '35%' }}
        animate={isTrapped ? {
          x: [1, -1, 1],
          y: [-2, 2, -2],
          rotate: [1, -1, 1],
        } : isMorphing ? {
          x: [-80, 60, 0, -100],
          y: [20, -60, 80, 0],
          scale: [1, 1.3, 0.7, 1.1],
          rotate: [0, -180, -360, -540],
        } : isAscending ? {
          y: -180,
          x: 0,
          opacity: 0,
          scale: 0.5,
        } : {}}
        transition={isTrapped ? {
          duration: 0.25,
          repeat: Infinity,
          ease: "easeInOut",
        } : isMorphing ? {
          duration: 5,
          delay: 0.2,
          ease: "easeInOut",
        } : {
          duration: 3,
          delay: 0.3,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="w-0 h-0"
          style={{
            borderLeft: '24px solid transparent',
            borderRight: '24px solid transparent',
            borderBottom: isTrapped 
              ? '42px solid hsl(234 30% 20%)'
              : isMorphing
              ? '42px solid hsl(187 90% 50%)'
              : '42px solid hsl(38 92% 55%)',
            filter: isMorphing 
              ? 'drop-shadow(0 0 20px hsl(187 90% 50% / 0.6))' 
              : 'none',
          }}
          animate={isMorphing ? {
            borderRadius: ['0%', '50%'],
            scale: [1, 1.2, 0.9, 1.1],
          } : {}}
          transition={{ duration: 1.5, repeat: isMorphing ? Infinity : 0 }}
        />
      </motion.div>

      {/* Sphere */}
      <motion.div
        className="absolute"
        style={{ left: '65%', top: '50%' }}
        animate={isTrapped ? {
          x: [-1, 2, -1],
          y: [2, -1, 2],
          scale: [1, 0.98, 1],
        } : isMorphing ? {
          x: [50, -100, 80, -30],
          y: [-40, 50, -80, 30],
          scale: [1, 0.6, 1.4, 0.8],
          rotate: [0, 270, 540, 720],
        } : isAscending ? {
          y: -160,
          x: -50,
          opacity: 0,
          scale: 0.5,
        } : {}}
        transition={isTrapped ? {
          duration: 0.35,
          repeat: Infinity,
          ease: "easeInOut",
        } : isMorphing ? {
          duration: 5,
          delay: 0.4,
          ease: "easeInOut",
        } : {
          duration: 3,
          delay: 0.5,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full"
          style={{
            background: isTrapped 
              ? 'radial-gradient(circle at 30% 30%, hsl(234 30% 30%), hsl(234 30% 12%))'
              : isMorphing
              ? 'radial-gradient(circle at 30% 30%, hsl(239 84% 67%), hsl(262 65% 45%))'
              : 'radial-gradient(circle at 30% 30%, hsl(38 95% 65%), hsl(38 85% 45%))',
            boxShadow: isMorphing 
              ? '0 0 25px hsl(239 84% 67% / 0.6)' 
              : 'none',
          }}
          animate={isMorphing ? {
            borderRadius: ['50%', '30%', '50%', '40%'],
          } : {}}
          transition={{ duration: 2.5, repeat: isMorphing ? Infinity : 0 }}
        />
      </motion.div>
    </div>
  );
};

// Indigo light beam
const IndigoBeam = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-full"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(239 84% 67% / 0.3), hsl(239 90% 75% / 0.5), hsl(239 84% 67% / 0.3), transparent)',
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Light rays */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
              background: `linear-gradient(90deg, transparent, hsl(239 90% 75% / ${0.3 + i * 0.1}), transparent)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

// Golden key component
const GoldenKey = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute left-1/2 top-1/3 -translate-x-1/2"
        initial={{ y: 100, opacity: 0, scale: 0.3 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Key glow */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(38 92% 55% / 0.4), transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Key shape */}
        <motion.svg
          width="80"
          height="120"
          viewBox="0 0 80 120"
          className="relative z-10"
          animate={{
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <title>Golden Key</title>
          <defs>
            <linearGradient id="keyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(38, 95%, 65%)" />
              <stop offset="50%" stopColor="hsl(38, 92%, 55%)" />
              <stop offset="100%" stopColor="hsl(38, 85%, 45%)" />
            </linearGradient>
            <filter id="keyGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Key head (circle with cutout) */}
          <circle
            cx="40"
            cy="30"
            r="25"
            fill="url(#keyGradient)"
            filter="url(#keyGlow)"
          />
          <circle
            cx="40"
            cy="30"
            r="12"
            fill="hsl(234, 40%, 8%)"
          />
          
          {/* Key shaft */}
          <rect
            x="35"
            y="50"
            width="10"
            height="50"
            rx="2"
            fill="url(#keyGradient)"
            filter="url(#keyGlow)"
          />
          
          {/* Key teeth */}
          <rect x="45" y="75" width="15" height="6" rx="1" fill="url(#keyGradient)" />
          <rect x="45" y="85" width="10" height="6" rx="1" fill="url(#keyGradient)" />
          <rect x="45" y="95" width="12" height="6" rx="1" fill="url(#keyGradient)" />
        </motion.svg>

        {/* Sparkles around key */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'hsl(38 95% 70%)',
              left: `${50 + Math.cos(i * Math.PI / 4) * 60}%`,
              top: `${50 + Math.sin(i * Math.PI / 4) * 60}%`,
              boxShadow: '0 0 10px hsl(38 95% 70%)',
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

// Rising golden particles
const RisingParticles = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: '-10%',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: `hsl(${38 + Math.random() * 10} ${85 + Math.random() * 10}% ${55 + Math.random() * 15}%)`,
              boxShadow: '0 0 10px hsl(38 92% 55% / 0.6)',
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: '-120vh',
              opacity: [0, 1, 1, 0],
              x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: i * 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
);

// Text overlay component
const TextOverlay = ({ text, visible }: { text: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute bottom-16 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-display font-bold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, hsl(195 80% 95%), hsl(187 90% 70%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px hsl(187 90% 50% / 0.4)',
          }}
        >
          {text}
        </motion.h2>
      </motion.div>
    )}
  </AnimatePresence>
);

// Fluid stream effect (for phase 4 transition)
const FluidStream = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-32"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '60%', opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full rounded-t-full"
          style={{
            background: 'linear-gradient(to top, hsl(262 65% 58% / 0.6), hsl(187 90% 50% / 0.4), hsl(38 92% 55% / 0.8))',
            filter: 'blur(8px)',
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

interface DemoAnimationProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

const DemoAnimation = ({ onComplete, autoPlay = true }: DemoAnimationProps) => {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const phases = [
    { id: 1, text: "Trapped by Fear.", duration: 7000 },
    { id: 2, text: "Neuro-Adaptive Release.", duration: 8000 },
    { id: 3, text: "Fluid Acquisition.", duration: 7000 },
    { id: 4, text: "Unlock Your Potential.", duration: 8000 },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    // Start animation
    setPhase(1);

    const timeouts: NodeJS.Timeout[] = [];
    let elapsed = 0;

    phases.forEach((p, index) => {
      elapsed += index === 0 ? 0 : phases[index - 1].duration;
      timeouts.push(
        setTimeout(() => {
          setPhase(p.id);
        }, elapsed)
      );
    });

    // Complete callback
    const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
    timeouts.push(
      setTimeout(() => {
        onComplete?.();
      }, totalDuration)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [isPlaying, onComplete]);

  const handleReplay = () => {
    setPhase(0);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  const currentPhaseData = phases.find(p => p.id === phase);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-[hsl(234_40%_6%)]">
      {/* Particle background */}
      <ParticleField />

      {/* Phase 1: Cage and trapped shapes */}
      <AnimatePresence>
        {(phase === 1 || phase === 2) && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <WireframeCage dissolving={phase === 2} />
            <GeometricShapes phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Indigo beam */}
      <IndigoBeam active={phase === 2} />

      {/* Phase 3: Morphing shapes */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GeometricShapes phase={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: Ascending and key formation */}
      <AnimatePresence>
        {phase === 4 && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GeometricShapes phase={4} />
            <FluidStream active={phase === 4} />
            <RisingParticles active={phase === 4} />
            <GoldenKey visible={phase === 4} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text overlay */}
      <TextOverlay 
        text={currentPhaseData?.text || ""} 
        visible={phase > 0} 
      />

      {/* Replay button */}
      <motion.button
        className="absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          background: 'hsl(234 30% 15% / 0.8)',
          color: 'hsl(195 80% 90%)',
          border: '1px solid hsl(187 90% 50% / 0.3)',
        }}
        onClick={handleReplay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Replay
      </motion.button>

      {/* Phase indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {phases.map((p) => (
          <motion.div
            key={p.id}
            className="w-2 h-2 rounded-full"
            style={{
              background: phase >= p.id 
                ? 'hsl(187 90% 50%)' 
                : 'hsl(234 20% 30%)',
            }}
            animate={phase === p.id ? {
              scale: [1, 1.3, 1],
            } : {}}
            transition={{ duration: 1, repeat: phase === p.id ? Infinity : 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default DemoAnimation;
