import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  glitchIntensity?: 'low' | 'medium' | 'high';
}

const GlitchText = ({ 
  children, 
  className = '', 
  as: Component = 'span',
  glitchIntensity = 'low' 
}: GlitchTextProps) => {
  const intensityConfig = {
    low: { frequency: 5, duration: 0.1 },
    medium: { frequency: 3, duration: 0.15 },
    high: { frequency: 2, duration: 0.2 },
  };

  const config = intensityConfig[glitchIntensity];

  return (
    <motion.div className={`relative inline-block ${className}`}>
      <Component className="relative z-10">{children}</Component>
      
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 text-primary/80 z-0"
        style={{ clipPath: 'inset(10% 0 85% 0)' }}
        animate={{
          x: [-2, 2, -2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          repeatDelay: config.frequency,
        }}
      >
        <Component aria-hidden="true">{children}</Component>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-accent/80 z-0"
        style={{ clipPath: 'inset(80% 0 5% 0)' }}
        animate={{
          x: [2, -2, 2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          repeatDelay: config.frequency + 0.5,
        }}
      >
        <Component aria-hidden="true">{children}</Component>
      </motion.div>
    </motion.div>
  );
};

export default GlitchText;
