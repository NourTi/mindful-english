import { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface P5DemoAnimationProps {
  autoPlay?: boolean;
  onComplete?: () => void;
}

interface CageLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  jitterX1: number;
  jitterY1: number;
  jitterX2: number;
  jitterY2: number;
}

interface SmokeParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
}

interface FluidParticle {
  x: number;
  y: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  size: number;
  color: { r: number; g: number; b: number };
  targetX?: number;
  targetY?: number;
  rising?: boolean;
}

const PHASE_DURATION = 8000; // 8 seconds per phase
const TOTAL_DURATION = 30000; // 30 seconds total

const P5DemoAnimation = ({ autoPlay = false, onComplete }: P5DemoAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number>(0);

  const phaseLabels = [
    { title: "Trapped by Fear", subtitle: "The psychological cage" },
    { title: "Neuro-Adaptive Release", subtitle: "Dissolving constraints" },
    { title: "Fluid Acquisition", subtitle: "Learning without limits" },
    { title: "Unlock Your Potential", subtitle: "Rise to mastery" }
  ];

  const sketch = useCallback((p: p5) => {
    let cageLines: CageLine[] = [];
    let smokeParticles: SmokeParticle[] = [];
    let fluidParticles: FluidParticle[] = [];
    let backgroundColor = { r: 10, g: 10, b: 20 };
    let startTime = 0;
    let animationStarted = false;

    const initCageLines = () => {
      cageLines = [];
      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const cageRadius = Math.min(p.width, p.height) * 0.25;

      for (let i = 0; i < 50; i++) {
        const angle1 = p.random(p.TWO_PI);
        const angle2 = p.random(p.TWO_PI);
        const r1 = p.random(cageRadius * 0.3, cageRadius);
        const r2 = p.random(cageRadius * 0.3, cageRadius);

        cageLines.push({
          x1: centerX + Math.cos(angle1) * r1,
          y1: centerY + Math.sin(angle1) * r1,
          x2: centerX + Math.cos(angle2) * r2,
          y2: centerY + Math.sin(angle2) * r2,
          jitterX1: 0,
          jitterY1: 0,
          jitterX2: 0,
          jitterY2: 0
        });
      }
    };

    const initFluidParticles = () => {
      fluidParticles = [];
      for (let i = 0; i < 100; i++) {
        fluidParticles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          noiseOffsetX: p.random(1000),
          noiseOffsetY: p.random(1000),
          size: p.random(3, 8),
          color: p.random() > 0.5 
            ? { r: 0, g: 255, b: 255 } // Cyan
            : { r: 255, g: 255, b: 255 } // White
        });
      }
    };

    p.setup = () => {
      const canvas = p.createCanvas(
        containerRef.current?.clientWidth || 800,
        containerRef.current?.clientHeight || 600
      );
      canvas.parent(containerRef.current!);
      p.noStroke();
      initCageLines();
    };

    p.draw = () => {
      if (!animationStarted) {
        p.background(10, 10, 20);
        return;
      }

      const elapsed = p.millis() - startTime;
      const phase = Math.min(Math.floor(elapsed / PHASE_DURATION), 3);
      
      // Update React state for phase display
      if (phase !== currentPhase) {
        setCurrentPhase(phase);
      }

      // Check if animation is complete
      if (elapsed >= TOTAL_DURATION) {
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
        p.noLoop();
        return;
      }

      // Background transition
      if (phase >= 1) {
        const transitionProgress = Math.min((elapsed - PHASE_DURATION) / PHASE_DURATION, 1);
        backgroundColor = {
          r: p.lerp(10, 30, transitionProgress),
          g: p.lerp(10, 20, transitionProgress),
          b: p.lerp(20, 80, transitionProgress)
        };
      }

      p.background(backgroundColor.r, backgroundColor.g, backgroundColor.b);

      // Phase-specific rendering
      switch (phase) {
        case 0:
          drawPhase1Cage(elapsed);
          break;
        case 1:
          drawPhase2Dissolve(elapsed - PHASE_DURATION);
          break;
        case 2:
          drawPhase3Flow(elapsed - PHASE_DURATION * 2);
          break;
        case 3:
          drawPhase4Rise(elapsed - PHASE_DURATION * 3);
          break;
      }
    };

    const drawPhase1Cage = (elapsed: number) => {
      p.stroke(120, 120, 130);
      p.strokeWeight(1.5);

      // Draw jittering cage lines
      for (const line of cageLines) {
        line.jitterX1 = p.random(-2, 2);
        line.jitterY1 = p.random(-2, 2);
        line.jitterX2 = p.random(-2, 2);
        line.jitterY2 = p.random(-2, 2);

        p.line(
          line.x1 + line.jitterX1,
          line.y1 + line.jitterY1,
          line.x2 + line.jitterX2,
          line.y2 + line.jitterY2
        );
      }

      // Draw trapped shapes with anxiety vibration
      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const vibrate = p.random(-3, 3);

      // Cube (square representation)
      p.noFill();
      p.stroke(180, 80, 80, 200);
      p.strokeWeight(2);
      p.rectMode(p.CENTER);
      p.rect(centerX - 40 + vibrate, centerY + vibrate, 30, 30);

      // Pyramid (triangle)
      p.stroke(80, 180, 80, 200);
      p.triangle(
        centerX + 40 + vibrate, centerY - 15 + vibrate,
        centerX + 25 + vibrate, centerY + 15 + vibrate,
        centerX + 55 + vibrate, centerY + 15 + vibrate
      );

      // Sphere (circle)
      p.stroke(80, 80, 180, 200);
      p.circle(centerX + vibrate, centerY - 50 + vibrate, 25);
    };

    const drawPhase2Dissolve = (phaseElapsed: number) => {
      const progress = phaseElapsed / PHASE_DURATION;
      const alpha = p.map(progress, 0, 1, 255, 0);

      // Fading cage lines
      p.stroke(120, 120, 130, alpha);
      p.strokeWeight(p.map(progress, 0, 1, 1.5, 0.3));

      for (const line of cageLines) {
        line.jitterX1 = p.random(-3 - progress * 5, 3 + progress * 5);
        line.jitterY1 = p.random(-3 - progress * 5, 3 + progress * 5);
        line.jitterX2 = p.random(-3 - progress * 5, 3 + progress * 5);
        line.jitterY2 = p.random(-3 - progress * 5, 3 + progress * 5);

        p.line(
          line.x1 + line.jitterX1,
          line.y1 + line.jitterY1,
          line.x2 + line.jitterX2,
          line.y2 + line.jitterY2
        );
      }

      // Generate smoke particles
      if (p.frameCount % 3 === 0 && progress < 0.8) {
        for (let i = 0; i < 3; i++) {
          smokeParticles.push({
            x: p.width / 2 + p.random(-100, 100),
            y: p.height / 2 + p.random(-50, 50),
            size: p.random(5, 15),
            alpha: p.random(50, 100),
            speed: p.random(0.5, 2)
          });
        }
      }

      // Draw and update smoke
      p.noStroke();
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const smoke = smokeParticles[i];
        p.fill(100, 80, 150, smoke.alpha);
        p.circle(smoke.x, smoke.y, smoke.size);

        smoke.y -= smoke.speed;
        smoke.x += p.random(-0.5, 0.5);
        smoke.alpha -= 0.8;
        smoke.size += 0.1;

        if (smoke.alpha <= 0) {
          smokeParticles.splice(i, 1);
        }
      }

      // Indigo beam effect
      if (progress > 0.2) {
        const beamAlpha = p.map(progress, 0.2, 0.6, 0, 150);
        p.noStroke();
        for (let i = 0; i < 5; i++) {
          p.fill(100, 80, 200, beamAlpha / (i + 1));
          p.ellipse(
            p.width / 2,
            p.height / 2,
            100 + i * 40 + progress * 50,
            100 + i * 40 + progress * 50
          );
        }
      }
    };

    const drawPhase3Flow = (phaseElapsed: number) => {
      const progress = phaseElapsed / PHASE_DURATION;

      // Initialize particles if needed
      if (fluidParticles.length === 0) {
        initFluidParticles();
      }

      // Clear remaining smoke
      smokeParticles = [];

      p.noStroke();
      const noiseScale = 0.003;
      const noiseStrength = 4;

      for (const particle of fluidParticles) {
        // Perlin noise movement
        const noiseX = p.noise(particle.noiseOffsetX) * 2 - 1;
        const noiseY = p.noise(particle.noiseOffsetY) * 2 - 1;

        particle.x += noiseX * noiseStrength;
        particle.y += noiseY * noiseStrength;

        particle.noiseOffsetX += noiseScale * 10;
        particle.noiseOffsetY += noiseScale * 10;

        // Wrap around screen
        if (particle.x < 0) particle.x = p.width;
        if (particle.x > p.width) particle.x = 0;
        if (particle.y < 0) particle.y = p.height;
        if (particle.y > p.height) particle.y = 0;

        // Draw with glow effect
        const glowLayers = 3;
        for (let i = glowLayers; i >= 0; i--) {
          const alpha = i === 0 ? 255 : 50 / i;
          const size = particle.size + i * 4;
          p.fill(particle.color.r, particle.color.g, particle.color.b, alpha);
          p.circle(particle.x, particle.y, size);
        }

        // Trail effect
        p.fill(particle.color.r, particle.color.g, particle.color.b, 30);
        p.circle(particle.x - noiseX * 5, particle.y - noiseY * 5, particle.size * 0.7);
      }
    };

    const drawPhase4Rise = (phaseElapsed: number) => {
      const progress = phaseElapsed / PHASE_DURATION;
      const centerX = p.width / 2;
      const targetY = p.height * 0.3;

      p.noStroke();

      for (const particle of fluidParticles) {
        // Initialize target positions for convergence
        if (!particle.targetX) {
          particle.targetX = centerX + p.random(-20, 20);
          particle.targetY = targetY + p.random(-30, 30);
        }

        // Convergence phase (0-50% of phase 4)
        if (progress < 0.5) {
          const convergenceProgress = progress / 0.5;
          particle.x = p.lerp(particle.x, particle.targetX!, convergenceProgress * 0.05);
          particle.y = p.lerp(particle.y, particle.targetY!, convergenceProgress * 0.05);
        } else {
          // Rising phase (50-100% of phase 4)
          const riseProgress = (progress - 0.5) / 0.5;
          particle.y -= riseProgress * 3;
          particle.x += p.random(-0.5, 0.5);
        }

        // Transition to gold color
        particle.color = {
          r: p.lerp(particle.color.r, 255, progress * 0.05),
          g: p.lerp(particle.color.g, 200, progress * 0.05),
          b: p.lerp(particle.color.b, 50, progress * 0.05)
        };

        // Draw with enhanced glow
        const glowLayers = 4;
        for (let i = glowLayers; i >= 0; i--) {
          const alpha = i === 0 ? 255 : 80 / i;
          const size = particle.size + i * 6;
          p.fill(particle.color.r, particle.color.g, particle.color.b, alpha);
          p.circle(particle.x, particle.y, size);
        }
      }

      // Golden key glow at center when converged
      if (progress > 0.3) {
        const keyAlpha = p.map(progress, 0.3, 0.6, 0, 200);
        for (let i = 5; i >= 0; i--) {
          p.fill(255, 200, 50, keyAlpha / (i + 1));
          p.ellipse(centerX, targetY, 80 + i * 30, 80 + i * 30);
        }

        // Key shape outline
        if (progress > 0.5) {
          p.stroke(255, 220, 100, keyAlpha);
          p.strokeWeight(3);
          p.noFill();
          // Key head
          p.circle(centerX, targetY - 10, 40);
          // Key stem
          p.line(centerX, targetY + 10, centerX, targetY + 50);
          // Key teeth
          p.line(centerX, targetY + 35, centerX + 15, targetY + 35);
          p.line(centerX, targetY + 45, centerX + 10, targetY + 45);
        }
      }
    };

    // Expose start function
    (p as any).startAnimation = () => {
      animationStarted = true;
      startTime = p.millis();
      startTimeRef.current = Date.now();
      initCageLines();
      smokeParticles = [];
      fluidParticles = [];
      backgroundColor = { r: 10, g: 10, b: 20 };
      setCurrentPhase(0);
      setIsComplete(false);
      p.loop();
    };

    p.windowResized = () => {
      if (containerRef.current) {
        p.resizeCanvas(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
        initCageLines();
      }
    };
  }, [currentPhase, onComplete]);

  useEffect(() => {
    if (containerRef.current && !p5Instance.current) {
      p5Instance.current = new p5(sketch, containerRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [sketch]);

  useEffect(() => {
    if (isPlaying && p5Instance.current) {
      (p5Instance.current as any).startAnimation();
    }
  }, [isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
    setIsComplete(false);
  };

  const handleReplay = () => {
    setIsPlaying(true);
    setIsComplete(false);
    setCurrentPhase(0);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[hsl(234_40%_6%)] rounded-xl overflow-hidden">
      {/* P5.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Phase Label Overlay */}
      <AnimatePresence mode="wait">
        {isPlaying && (
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 left-0 right-0 text-center z-10 pointer-events-none"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide">
              {phaseLabels[currentPhase]?.title}
            </h2>
            <p className="text-sm text-white/60">
              {phaseLabels[currentPhase]?.subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Overlay */}
      <AnimatePresence>
        {!isPlaying && !isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 mx-auto shadow-lg shadow-primary/30"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
              <h3 className="text-xl font-semibold text-white">Watch Transformation</h3>
              <p className="text-sm text-white/60 mt-1">30-second journey</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(255, 200, 50, 0.3)",
                    "0 0 40px rgba(255, 200, 50, 0.5)",
                    "0 0 20px rgba(255, 200, 50, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-4 mx-auto"
              >
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <line x1="12" y1="12" x2="12" y2="20" />
                  <line x1="12" y1="16" x2="16" y2="16" />
                  <line x1="12" y1="18" x2="15" y2="18" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Potential Unlocked</h3>
              <p className="text-sm text-white/60 mb-4">Your transformation begins now</p>
              <Button onClick={handleReplay} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Watch Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
        {phaseLabels.map((phase, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
              currentPhase === index && isPlaying
                ? 'bg-primary/30 text-white border border-primary/50'
                : currentPhase > index && isPlaying
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-white/10 text-white/40 border border-white/10'
            }`}
            animate={currentPhase === index && isPlaying ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className={`w-2 h-2 rounded-full ${
              currentPhase === index && isPlaying
                ? 'bg-primary animate-pulse'
                : currentPhase > index && isPlaying
                ? 'bg-green-400'
                : 'bg-white/30'
            }`} />
            <span className="hidden sm:inline">{phase.title.split(' ').slice(0, 2).join(' ')}</span>
            <span className="sm:hidden">{index + 1}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default P5DemoAnimation;
