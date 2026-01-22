import { motion } from 'framer-motion';

interface CyberGridProps {
  className?: string;
  variant?: 'floor' | 'wall' | 'ambient';
}

const CyberGrid = ({ className = '', variant = 'floor' }: CyberGridProps) => {
  if (variant === 'wall') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Vertical grid lines */}
        <svg className="w-full h-full opacity-20">
          <defs>
            <linearGradient id="gridGradientV" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {[...Array(20)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${5 + i * 5}%`}
              y1="0"
              x2={`${5 + i * 5}%`}
              y2="100%"
              stroke="url(#gridGradientV)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.05 }}
            />
          ))}
          
          {[...Array(10)].map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={`${10 + i * 10}%`}
              x2="100%"
              y2={`${10 + i * 10}%`}
              stroke="url(#gridGradientV)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 + i * 0.05 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === 'ambient') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Glowing orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          style={{ left: '10%', top: '20%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-accent/5 blur-3xl"
          style={{ right: '15%', bottom: '30%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    );
  }

  // Default: floor perspective grid
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50vh]"
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center top',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            transform: 'rotateX(75deg)',
            transformOrigin: 'center top',
          }}
        >
          {/* Grid */}
          <svg className="w-full h-full opacity-30">
            <defs>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Vertical lines */}
            {[...Array(40)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={`${i * 2.5}%`}
                y1="0"
                x2={`${i * 2.5}%`}
                y2="100%"
                stroke="url(#gridGradient)"
                strokeWidth="1"
              />
            ))}
            
            {/* Horizontal lines */}
            {[...Array(20)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={`${i * 5}%`}
                x2="100%"
                y2={`${i * 5}%`}
                stroke="url(#gridGradient)"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Moving scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* Horizon glow */}
      <motion.div
        className="absolute bottom-[25vh] left-0 right-0 h-32 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent blur-xl"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
};

export default CyberGrid;
