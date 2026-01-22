import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Eye, Wifi, Sparkles } from 'lucide-react';

interface AIBrainVisualizerProps {
  className?: string;
  isActive?: boolean;
}

const AIBrainVisualizer = ({ className = '', isActive = true }: AIBrainVisualizerProps) => {
  const nodes = [
    { id: 1, x: 50, y: 20, icon: Brain, label: 'Neural Core' },
    { id: 2, x: 20, y: 45, icon: Eye, label: 'Vision' },
    { id: 3, x: 80, y: 45, icon: Wifi, label: 'Language' },
    { id: 4, x: 30, y: 75, icon: Cpu, label: 'Processing' },
    { id: 5, x: 70, y: 75, icon: Zap, label: 'Learning' },
    { id: 6, x: 50, y: 95, icon: Sparkles, label: 'Output' },
  ];

  const connections = [
    [1, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 6],
  ];

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/5 blur-3xl"
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          opacity: isActive ? [0.3, 0.5, 0.3] : 0.1,
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>

        {connections.map(([from, to], i) => {
          const fromNode = nodes.find(n => n.id === from)!;
          const toNode = nodes.find(n => n.id === to)!;
          
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              strokeOpacity={isActive ? 0.4 : 0.1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          );
        })}

        {/* Animated pulses along connections */}
        {isActive && connections.map(([from, to], i) => {
          const fromNode = nodes.find(n => n.id === from)!;
          const toNode = nodes.find(n => n.id === to)!;
          
          return (
            <motion.circle
              key={`pulse-${from}-${to}`}
              r="4"
              fill="hsl(var(--primary))"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{
                cx: [`${fromNode.x}%`, `${toNode.x}%`],
                cy: [`${fromNode.y}%`, `${toNode.y}%`],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                repeatDelay: 2,
              }}
            />
          );
        })}

        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute -inset-3 rounded-full border border-primary/30"
            animate={isActive ? {
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            } : undefined}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
          
          {/* Main node */}
          <motion.div
            className={`
              relative w-14 h-14 rounded-full 
              bg-gradient-to-br from-card via-card to-muted
              border border-primary/40 
              flex items-center justify-center
              shadow-lg cursor-pointer
              transition-all duration-300
              group-hover:border-primary group-hover:shadow-primary/20
            `}
            whileHover={{ scale: 1.1 }}
            animate={isActive && node.id === 1 ? {
              boxShadow: [
                '0 0 20px hsl(var(--primary) / 0.3)',
                '0 0 40px hsl(var(--primary) / 0.5)',
                '0 0 20px hsl(var(--primary) / 0.3)',
              ],
            } : undefined}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <node.icon className="w-6 h-6 text-primary" />
          </motion.div>

          {/* Label */}
          <motion.div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
              {node.label}
            </span>
          </motion.div>
        </motion.div>
      ))}

      {/* Central status indicator */}
      <motion.div
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="px-4 py-2 rounded-full bg-card/80 backdrop-blur border border-primary/30"
          animate={isActive ? {
            borderColor: ['hsl(var(--primary) / 0.3)', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.3)'],
          } : undefined}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-success' : 'bg-muted'}`}
              animate={isActive ? { scale: [1, 1.2, 1] } : undefined}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-mono text-primary">
              {isActive ? 'PROCESSING' : 'STANDBY'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AIBrainVisualizer;
