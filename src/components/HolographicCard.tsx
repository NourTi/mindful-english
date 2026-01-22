import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'amber' | 'purple' | 'green';
  interactive?: boolean;
}

const glowColors = {
  cyan: 'from-primary/20 via-primary/5 to-transparent border-primary/30 hover:border-primary/50',
  amber: 'from-accent/20 via-accent/5 to-transparent border-accent/30 hover:border-accent/50',
  purple: 'from-cognitive-visual/20 via-cognitive-visual/5 to-transparent border-cognitive-visual/30 hover:border-cognitive-visual/50',
  green: 'from-success/20 via-success/5 to-transparent border-success/30 hover:border-success/50',
};

const HolographicCard = ({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  interactive = true 
}: HolographicCardProps) => {
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, y: -5 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        bg-gradient-to-br ${glowColors[glowColor]}
        ${className}
      `}
    >
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      </div>
      
      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
    </motion.div>
  );
};

export default HolographicCard;
