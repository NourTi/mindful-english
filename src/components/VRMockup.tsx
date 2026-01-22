import { motion } from 'framer-motion';
import { Headphones, Wifi, Battery, Eye, Cpu, Zap } from 'lucide-react';

interface VRMockupProps {
  variant?: 'headset' | 'interface' | 'hologram';
  className?: string;
}

const VRMockup = ({ variant = 'headset', className = '' }: VRMockupProps) => {
  if (variant === 'interface') {
    return (
      <div className={`relative ${className}`}>
        {/* Futuristic UI Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-background via-card to-background"
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-card/80 backdrop-blur border-b border-primary/20 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-success"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-mono text-primary">NEURAL_LINK_ACTIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4 text-primary" />
              <Battery className="w-4 h-4 text-success" />
              <span className="text-xs font-mono text-muted-foreground">98%</span>
            </div>
          </div>

          {/* Main content area */}
          <div className="absolute top-12 bottom-12 left-4 right-4 flex gap-4">
            {/* Left panel - Stats */}
            <motion.div 
              className="w-1/3 rounded-xl border border-primary/20 bg-card/50 backdrop-blur p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xs font-mono text-primary mb-3 flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                COGNITIVE_METRICS
              </div>
              
              {/* Animated bars */}
              {['Focus', 'Memory', 'Speed', 'Accuracy'].map((label, i) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-primary font-mono">{75 + i * 5}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${75 + i * 5}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Center - Main view */}
            <motion.div 
              className="flex-1 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 backdrop-blur relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Central focus point */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 rounded-full border-2 border-primary/40"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-24 h-24 rounded-full border border-accent/40"
                  animate={{ scale: [1.1, 1, 1.1], rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Eye className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Floating data points */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary"
                  style={{
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${20 + Math.floor(i / 3) * 50}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>

            {/* Right panel - Activity */}
            <motion.div 
              className="w-1/4 rounded-xl border border-primary/20 bg-card/50 backdrop-blur p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-xs font-mono text-accent mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                LIVE_FEED
              </div>
              
              {['Vocab +12', 'Grammar ✓', 'Speaking...', 'XP +50'].map((item, i) => (
                <motion.div
                  key={i}
                  className="text-xs py-2 border-b border-border/50 text-muted-foreground"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                >
                  <span className="text-primary mr-2">›</span>
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom status bar */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-card/80 backdrop-blur border-t border-primary/20 flex items-center justify-center gap-8 px-4">
            <span className="text-xs font-mono text-muted-foreground">SESSION: 00:32:15</span>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs font-mono text-success">SYNC: OPTIMAL</span>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs font-mono text-primary">MODE: IMMERSIVE</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (variant === 'hologram') {
    return (
      <div className={`relative ${className}`}>
        <motion.div
          className="relative w-64 h-64"
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {/* Holographic rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-primary/30 rounded-full"
              style={{
                transform: `rotateX(${60 + i * 20}deg) rotateY(${i * 30}deg)`,
              }}
              animate={{
                rotateZ: [0, 360],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
          
          {/* Central glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/20 blur-xl"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </div>
    );
  }

  // Default: Headset
  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* VR Headset silhouette */}
        <div className="relative w-80 h-48">
          {/* Main body */}
          <motion.div
            className="absolute inset-x-0 top-8 bottom-0 rounded-3xl bg-gradient-to-br from-muted via-card to-muted border border-primary/20 overflow-hidden"
            animate={{ boxShadow: ['0 0 20px hsl(var(--primary) / 0.2)', '0 0 40px hsl(var(--primary) / 0.4)', '0 0 20px hsl(var(--primary) / 0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Visor */}
            <div className="absolute inset-x-8 top-4 bottom-8 rounded-2xl bg-gradient-to-br from-primary/20 via-background to-accent/20 border border-primary/30 overflow-hidden">
              {/* Reflection */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Display content */}
              <div className="absolute inset-2 flex items-center justify-center">
                <motion.div
                  className="text-xs font-mono text-primary/60"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  NEURAL_SYNC_ACTIVE
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Headband */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-6 rounded-full bg-gradient-to-r from-muted via-card to-muted border border-primary/20"
            style={{ transformOrigin: 'center bottom' }}
          />

          {/* Side accents */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 rounded-l-lg bg-gradient-to-b from-primary/20 to-accent/20 border-l border-t border-b border-primary/30" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-16 rounded-r-lg bg-gradient-to-b from-primary/20 to-accent/20 border-r border-t border-b border-primary/30" />
          
          {/* Status LEDs */}
          <motion.div
            className="absolute left-8 bottom-4 w-2 h-2 rounded-full bg-success"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-8 bottom-4 w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Audio indicator */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Headphones className="w-4 h-4 text-primary/60" />
          <span className="text-xs font-mono text-muted-foreground">SPATIAL_AUDIO</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VRMockup;
