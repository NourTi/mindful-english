import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// Particle background component
const ParticleField = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'hsl(187 90% 50% / 0.3)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
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

// Phase 1: Trapped shapes in cage
const TrappedShapes = ({ isDissolving }: { isDissolving: boolean }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Wireframe cage */}
      <svg className="absolute w-64 h-64" viewBox="0 0 200 200">
        <title>Wireframe Cage</title>
        {/* Cage lines - dissolve when indigo light hits */}
        {[
          { x1: 40, y1: 40, x2: 160, y2: 40 },
          { x1: 40, y1: 100, x2: 160, y2: 100 },
          { x1: 40, y1: 160, x2: 160, y2: 160 },
          { x1: 40, y1: 40, x2: 40, y2: 160 },
          { x1: 100, y1: 40, x2: 100, y2: 160 },
          { x1: 160, y1: 40, x2: 160, y2: 160 },
          { x1: 40, y1: 40, x2: 160, y2: 160 },
          { x1: 160, y1: 40, x2: 40, y2: 160 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(234 20% 35%)"
            strokeWidth="2"
            initial={{ opacity: 0.7, pathLength: 1 }}
            animate={isDissolving ? {
              opacity: 0,
              strokeWidth: 0,
            } : {
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={isDissolving ? {
              duration: 1.5,
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

      {/* Trapped geometric shapes - vibrating anxiously */}
      {/* Cube */}
      <motion.div
        className="absolute w-10 h-10"
        style={{
          left: 'calc(50% - 50px)',
          top: 'calc(50% - 20px)',
          background: 'linear-gradient(135deg, hsl(234 25% 25%), hsl(234 25% 15%))',
          borderRadius: '4px',
        }}
        animate={isDissolving ? { opacity: 0, scale: 0.5 } : {
          x: [-2, 2, -2],
          y: [-1, 1, -1],
          rotate: [-2, 2, -2],
        }}
        transition={isDissolving ? { duration: 1 } : {
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Pyramid */}
      <motion.div
        className="absolute"
        style={{
          left: 'calc(50% - 10px)',
          top: 'calc(50% - 30px)',
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '26px solid hsl(234 25% 20%)',
        }}
        animate={isDissolving ? { opacity: 0, scale: 0.5 } : {
          x: [1, -1, 1],
          y: [-2, 2, -2],
        }}
        transition={isDissolving ? { duration: 1, delay: 0.1 } : {
          duration: 0.25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sphere */}
      <motion.div
        className="absolute w-8 h-8 rounded-full"
        style={{
          left: 'calc(50% + 30px)',
          top: 'calc(50% + 10px)',
          background: 'radial-gradient(circle at 30% 30%, hsl(234 25% 30%), hsl(234 25% 12%))',
        }}
        animate={isDissolving ? { opacity: 0, scale: 0.5 } : {
          x: [-1, 2, -1],
          y: [2, -1, 2],
          scale: [1, 0.98, 1],
        }}
        transition={isDissolving ? { duration: 1, delay: 0.2 } : {
          duration: 0.35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Phase 2: Indigo light beam
const IndigoBeam = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-24 pointer-events-none"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(239 84% 67% / 0.4) 30%, hsl(239 90% 75% / 0.6) 50%, hsl(239 84% 67% / 0.4) 70%, transparent 100%)',
            filter: 'blur(15px)',
          }}
        />
        {/* Light streaks */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
              background: `linear-gradient(90deg, transparent, hsl(239 90% 75% / ${0.4 + i * 0.1}), transparent)`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

// Phase 3: Fluid morphing shapes
const FluidShapes = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Fluid blob 1 - Cyan */}
      <motion.div
        className="absolute w-14 h-14"
        style={{
          background: 'linear-gradient(135deg, hsl(187 90% 50%), hsl(187 95% 65%))',
          boxShadow: '0 0 40px hsl(187 90% 50% / 0.6)',
        }}
        animate={{
          x: [0, 80, -60, 100, -40, 0],
          y: [0, -60, 40, -80, 60, 0],
          scale: [1, 0.8, 1.3, 0.7, 1.1, 1],
          borderRadius: ['20%', '50%', '30%', '50%', '40%', '20%'],
          rotate: [0, 180, 360, 540, 720, 900],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      />

      {/* Fluid blob 2 - Purple */}
      <motion.div
        className="absolute w-12 h-12"
        style={{
          background: 'linear-gradient(135deg, hsl(262 65% 58%), hsl(262 70% 68%))',
          boxShadow: '0 0 35px hsl(262 65% 58% / 0.5)',
        }}
        animate={{
          x: [-60, 40, -80, 60, -20, -60],
          y: [20, -50, 80, -40, 30, 20],
          scale: [1, 1.2, 0.7, 1.1, 0.9, 1],
          borderRadius: ['50%', '30%', '50%', '20%', '50%', '50%'],
          rotate: [0, -120, -240, -360, -480, -600],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          delay: 0.2,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      />

      {/* Fluid blob 3 - Indigo */}
      <motion.div
        className="absolute w-10 h-10"
        style={{
          background: 'linear-gradient(135deg, hsl(239 84% 67%), hsl(239 90% 77%))',
          boxShadow: '0 0 30px hsl(239 84% 67% / 0.5)',
        }}
        animate={{
          x: [40, -70, 90, -50, 30, 40],
          y: [-40, 60, -70, 50, -30, -40],
          scale: [0.9, 1.3, 0.6, 1.2, 0.8, 0.9],
          borderRadius: ['30%', '50%', '40%', '50%', '25%', '30%'],
          rotate: [0, 90, 180, 270, 360, 450],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          delay: 0.4,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      />
    </div>
  );
};

// Phase 4: Ascending stream and golden key
const AscendingKey = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Rising golden particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${30 + Math.random() * 40}%`,
            bottom: '10%',
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            background: `hsl(${38 + Math.random() * 10} ${85 + Math.random() * 10}% ${55 + Math.random() * 15}%)`,
            boxShadow: '0 0 12px hsl(38 92% 55% / 0.7)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -400,
            opacity: [0, 1, 1, 0],
            x: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 3,
            delay: i * 0.12,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Fluid stream */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-20"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '50%', opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full rounded-t-full"
          style={{
            background: 'linear-gradient(to top, hsl(262 65% 58% / 0.5), hsl(187 90% 50% / 0.3), hsl(38 92% 55% / 0.7))',
            filter: 'blur(6px)',
          }}
        />
      </motion.div>

      {/* Golden Key */}
      <motion.div
        className="absolute"
        style={{ top: '25%' }}
        initial={{ y: 100, opacity: 0, scale: 0.3 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 1, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Key glow */}
        <motion.div
          className="absolute -inset-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(38 92% 55% / 0.5), transparent 70%)',
            filter: 'blur(15px)',
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

        {/* Key SVG */}
        <motion.svg
          width="70"
          height="100"
          viewBox="0 0 70 100"
          className="relative z-10"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <title>Golden Key</title>
          <defs>
            <linearGradient id="keyGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(38, 95%, 65%)" />
              <stop offset="50%" stopColor="hsl(38, 92%, 55%)" />
              <stop offset="100%" stopColor="hsl(38, 85%, 45%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Key head */}
          <circle cx="35" cy="25" r="20" fill="url(#keyGold)" filter="url(#glow)" />
          <circle cx="35" cy="25" r="10" fill="hsl(234 40% 8%)" />
          {/* Key shaft */}
          <rect x="30" y="42" width="10" height="42" rx="2" fill="url(#keyGold)" filter="url(#glow)" />
          {/* Key teeth */}
          <rect x="40" y="62" width="12" height="5" rx="1" fill="url(#keyGold)" />
          <rect x="40" y="72" width="8" height="5" rx="1" fill="url(#keyGold)" />
          <rect x="40" y="82" width="10" height="5" rx="1" fill="url(#keyGold)" />
        </motion.svg>

        {/* Sparkles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'hsl(38 95% 70%)',
              left: `${35 + Math.cos(i * Math.PI / 4) * 50}px`,
              top: `${50 + Math.sin(i * Math.PI / 4) * 50}px`,
              boxShadow: '0 0 8px hsl(38 95% 70%)',
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Text overlay
const PhaseText = ({ text }: { text: string }) => (
  <motion.div
    className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
  >
    <h2
      className="text-xl md:text-2xl lg:text-3xl font-display font-bold tracking-wide"
      style={{
        background: 'linear-gradient(135deg, hsl(195 80% 95%), hsl(187 90% 70%))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 30px hsl(187 90% 50% / 0.3)',
      }}
    >
      {text}
    </h2>
  </motion.div>
);

interface DemoAnimationProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

const DemoAnimation = ({ onComplete, autoPlay = true }: DemoAnimationProps) => {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const phases = [
    { id: 1, text: "Trapped by Fear.", duration: 7000 },
    { id: 2, text: "Neuro-Adaptive Release.", duration: 8000 },
    { id: 3, text: "Fluid Acquisition.", duration: 7000 },
    { id: 4, text: "Unlock Your Potential.", duration: 8000 },
  ];

  const startAnimation = useCallback(() => {
    setPhase(1);
    setIsPlaying(true);

    // Phase transitions
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setPhase(2), 7000));
    timers.push(setTimeout(() => setPhase(3), 15000));
    timers.push(setTimeout(() => setPhase(4), 22000));
    timers.push(setTimeout(() => {
      setIsPlaying(false);
      onComplete?.();
    }, 30000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    if (autoPlay) {
      const cleanup = startAnimation();
      return cleanup;
    }
  }, [autoPlay, startAnimation]);

  const handleReplay = () => {
    setPhase(0);
    setIsPlaying(false);
    setTimeout(() => {
      startAnimation();
    }, 100);
  };

  const handlePhaseClick = (phaseId: number) => {
    setPhase(phaseId);
  };

  const currentPhaseData = phases.find(p => p.id === phase);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden bg-[hsl(234_40%_6%)]">
      {/* Particle background */}
      <ParticleField />

      {/* Phase 1: Trapped shapes */}
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="phase1"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TrappedShapes isDissolving={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Indigo beam dissolving cage */}
      <AnimatePresence mode="wait">
        {phase === 2 && (
          <motion.div
            key="phase2"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TrappedShapes isDissolving={true} />
            <IndigoBeam active={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: Fluid morphing */}
      <AnimatePresence mode="wait">
        {phase === 3 && (
          <motion.div
            key="phase3"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FluidShapes />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: Ascending key */}
      <AnimatePresence mode="wait">
        {phase === 4 && (
          <motion.div
            key="phase4"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AscendingKey />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase text */}
      <AnimatePresence mode="wait">
        {currentPhaseData && (
          <PhaseText key={phase} text={currentPhaseData.text} />
        )}
      </AnimatePresence>

      {/* Replay button */}
      <motion.button
        type="button"
        className="absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer z-20"
        style={{
          background: 'hsl(234 30% 15% / 0.9)',
          color: 'hsl(195 80% 90%)',
          border: '1px solid hsl(187 90% 50% / 0.3)',
        }}
        onClick={handleReplay}
        whileHover={{ scale: 1.05, borderColor: 'hsl(187 90% 50% / 0.6)' }}
        whileTap={{ scale: 0.95 }}
      >
        Replay
      </motion.button>

      {/* Phase indicators - clickable */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {phases.map((p) => (
          <motion.button
            type="button"
            key={p.id}
            className="w-3 h-3 rounded-full cursor-pointer"
            style={{
              background: phase >= p.id 
                ? 'hsl(187 90% 50%)' 
                : 'hsl(234 20% 30%)',
              boxShadow: phase === p.id ? '0 0 10px hsl(187 90% 50% / 0.6)' : 'none',
            }}
            onClick={() => handlePhaseClick(p.id)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            animate={phase === p.id ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ duration: 1, repeat: phase === p.id ? Infinity : 0 }}
          />
        ))}
      </div>

      {/* Start overlay if not playing */}
      <AnimatePresence>
        {phase === 0 && !isPlaying && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-[hsl(234_40%_6%/0.9)] z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="flex flex-col items-center gap-4 cursor-pointer"
              onClick={startAnimation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(239 84% 67% / 0.3), hsl(187 90% 50% / 0.3))',
                  border: '2px solid hsl(187 90% 50% / 0.5)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px hsl(187 90% 50% / 0.3)',
                    '0 0 40px hsl(187 90% 50% / 0.5)',
                    '0 0 20px hsl(187 90% 50% / 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="hsl(187 90% 50%)">
                  <title>Play</title>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
              <span className="text-lg font-medium" style={{ color: 'hsl(195 80% 90%)' }}>
                Watch Transformation
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoAnimation;
