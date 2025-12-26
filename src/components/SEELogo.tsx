import { motion, Easing } from 'framer-motion';

interface SEELogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const SEELogo = ({ size = 48, showText = false, animated = true, className = '' }: SEELogoProps) => {
  const easeOut: Easing = [0.4, 0, 0.2, 1];
  const easeInOut: Easing = [0.4, 0, 0.2, 1];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <motion.div 
        className="relative"
        initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={animated ? { duration: 0.6, ease: easeOut } : undefined}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Main gradient - Cyan to Purple */}
            <linearGradient id="synapticGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(186, 100%, 50%)" />
              <stop offset="50%" stopColor="hsl(220, 100%, 60%)" />
              <stop offset="100%" stopColor="hsl(280, 100%, 65%)" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="synapticGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Center spark glow */}
            <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(186, 100%, 70%)" stopOpacity="1"/>
              <stop offset="50%" stopColor="hsl(220, 100%, 60%)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="hsl(280, 100%, 65%)" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Animated glow behind the spark */}
          {animated && (
            <motion.circle
              cx="24"
              cy="24"
              r="8"
              fill="url(#sparkGlow)"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: easeInOut
              }}
            />
          )}

          {/* Three converging lines representing S-E-E */}
          {/* Line 1: Student - Bottom Left */}
          <motion.path
            d="M8 40 L24 24"
            stroke="url(#synapticGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#synapticGlow)"
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
            transition={animated ? { duration: 0.8, delay: 0, ease: easeOut } : undefined}
          />

          {/* Line 2: Education - Top */}
          <motion.path
            d="M24 4 L24 24"
            stroke="url(#synapticGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#synapticGlow)"
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
            transition={animated ? { duration: 0.8, delay: 0.15, ease: easeOut } : undefined}
          />

          {/* Line 3: Empowerment - Bottom Right */}
          <motion.path
            d="M40 40 L24 24"
            stroke="url(#synapticGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#synapticGlow)"
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
            transition={animated ? { duration: 0.8, delay: 0.3, ease: easeOut } : undefined}
          />

          {/* Central spark - the "Aha!" moment */}
          <circle
            cx="24"
            cy="24"
            r="4"
            fill="url(#synapticGradient)"
            filter="url(#synapticGlow)"
          />

          {/* Inner bright core */}
          <circle
            cx="24"
            cy="24"
            r="2"
            fill="white"
            opacity="0.9"
          />

          {/* Small accent sparks radiating out */}
          <circle cx="24" cy="16" r="1.5" fill="url(#synapticGradient)" opacity="0.7"/>
          <circle cx="18" cy="30" r="1.5" fill="url(#synapticGradient)" opacity="0.7"/>
          <circle cx="30" cy="30" r="1.5" fill="url(#synapticGradient)" opacity="0.7"/>
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontSize: size * 0.5 }}
          >
            SEE
          </span>
          <span 
            className="text-muted-foreground tracking-wide"
            style={{ fontSize: size * 0.2 }}
          >
            Students for Education Empowerment
          </span>
        </div>
      )}
    </div>
  );
};

export default SEELogo;
