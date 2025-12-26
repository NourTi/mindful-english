import { motion, Easing } from 'framer-motion';

type LogoVariant = 'default' | 'icon' | 'horizontal' | 'stacked';
type LogoTheme = 'auto' | 'dark' | 'light';

interface SEELogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
  className?: string;
  variant?: LogoVariant;
  theme?: LogoTheme;
}

const SEELogo = ({ 
  size = 48, 
  showText = false, 
  animated = true, 
  className = '',
  variant = 'default',
  theme = 'auto'
}: SEELogoProps) => {
  const easeOut: Easing = [0.4, 0, 0.2, 1];
  const easeInOut: Easing = [0.4, 0, 0.2, 1];

  // Theme colors
  const isDark = theme === 'dark' || theme === 'auto';
  const isLight = theme === 'light';

  const colors = {
    gradient: {
      start: "hsl(186, 100%, 50%)",
      mid: "hsl(220, 100%, 60%)",
      end: "hsl(280, 100%, 65%)"
    },
    text: {
      primary: isLight ? "hsl(234, 40%, 15%)" : "hsl(195, 80%, 95%)",
      secondary: isLight ? "hsl(234, 30%, 40%)" : "hsl(195, 40%, 60%)"
    },
    glow: {
      start: "hsl(186, 100%, 70%)",
      mid: "hsl(220, 100%, 60%)",
      end: "hsl(280, 100%, 65%)"
    }
  };

  // Unique ID for gradients to avoid conflicts when multiple logos are rendered
  const gradientId = `synaptic-${Math.random().toString(36).substr(2, 9)}`;

  const renderIcon = (iconSize: number) => (
    <motion.div 
      className="relative"
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={animated ? { duration: 0.6, ease: easeOut } : undefined}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${gradientId}-main`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.gradient.start} />
            <stop offset="50%" stopColor={colors.gradient.mid} />
            <stop offset="100%" stopColor={colors.gradient.end} />
          </linearGradient>
          
          <filter id={`${gradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <radialGradient id={`${gradientId}-spark`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow.start} stopOpacity="1"/>
            <stop offset="50%" stopColor={colors.glow.mid} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={colors.glow.end} stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Animated glow */}
        {animated && (
          <motion.circle
            cx="24"
            cy="24"
            r="8"
            fill={`url(#${gradientId}-spark)`}
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

        {/* Three converging lines */}
        <motion.path
          d="M8 40 L24 24"
          stroke={`url(#${gradientId}-main)`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${gradientId}-glow)`}
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.8, delay: 0, ease: easeOut } : undefined}
        />

        <motion.path
          d="M24 4 L24 24"
          stroke={`url(#${gradientId}-main)`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${gradientId}-glow)`}
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.8, delay: 0.15, ease: easeOut } : undefined}
        />

        <motion.path
          d="M40 40 L24 24"
          stroke={`url(#${gradientId}-main)`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${gradientId}-glow)`}
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 0.8, delay: 0.3, ease: easeOut } : undefined}
        />

        {/* Central spark */}
        <circle
          cx="24"
          cy="24"
          r="4"
          fill={`url(#${gradientId}-main)`}
          filter={`url(#${gradientId}-glow)`}
        />

        {/* Inner bright core */}
        <circle
          cx="24"
          cy="24"
          r="2"
          fill={isLight ? "hsl(234, 40%, 15%)" : "white"}
          opacity="0.9"
        />

        {/* Accent sparks */}
        <circle cx="24" cy="16" r="1.5" fill={`url(#${gradientId}-main)`} opacity="0.7"/>
        <circle cx="18" cy="30" r="1.5" fill={`url(#${gradientId}-main)`} opacity="0.7"/>
        <circle cx="30" cy="30" r="1.5" fill={`url(#${gradientId}-main)`} opacity="0.7"/>
      </svg>
    </motion.div>
  );

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div className={className}>
        {renderIcon(size)}
      </div>
    );
  }

  // Horizontal layout
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {renderIcon(size)}
        <div className="flex items-center gap-2">
          <span 
            className="font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontSize: size * 0.6 }}
          >
            SEE
          </span>
          <span 
            className="hidden sm:inline-block"
            style={{ 
              fontSize: size * 0.25,
              color: colors.text.secondary
            }}
          >
            Students for Education Empowerment
          </span>
        </div>
      </div>
    );
  }

  // Stacked layout (logo on top, text below)
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
        {renderIcon(size)}
        <div className="text-center">
          <span 
            className="font-bold tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent block"
            style={{ fontSize: size * 0.5 }}
          >
            SEE
          </span>
          <span 
            className="block"
            style={{ 
              fontSize: size * 0.18,
              color: colors.text.secondary
            }}
          >
            Students for Education Empowerment
          </span>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {renderIcon(size)}

      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontSize: size * 0.5 }}
          >
            SEE
          </span>
          <span 
            style={{ 
              fontSize: size * 0.2,
              color: colors.text.secondary
            }}
          >
            Students for Education Empowerment
          </span>
        </div>
      )}
    </div>
  );
};

export default SEELogo;
