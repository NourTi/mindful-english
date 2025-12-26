import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, Briefcase, UtensilsCrossed, ShoppingBag, 
  Users, Stethoscope, GraduationCap, Home, MapPin,
  Lock, CheckCircle, Star, Crown, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PathNode {
  id: string;
  title: string;
  description: string;
  icon: 'airport' | 'business' | 'restaurant' | 'shopping' | 'social' | 'medical' | 'academic' | 'home' | 'travel';
  status: 'complete' | 'current' | 'locked';
  xp: number;
  progress?: number;
}

const iconMap = {
  airport: Plane,
  business: Briefcase,
  restaurant: UtensilsCrossed,
  shopping: ShoppingBag,
  social: Users,
  medical: Stethoscope,
  academic: GraduationCap,
  home: Home,
  travel: MapPin,
};

interface LearningPathProps {
  nodes: PathNode[];
  onNodeClick?: (node: PathNode) => void;
}

export const LearningPath = ({ nodes, onNodeClick }: LearningPathProps) => {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleNodeClick = (node: PathNode) => {
    if (node.status === 'locked') return;
    if (onNodeClick) {
      onNodeClick(node);
    } else {
      navigate(`/scenario?id=${node.id}`);
    }
  };

  return (
    <div className="relative py-8 px-4">
      {/* Path Background */}
      <div className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-gradient-path rounded-full" />
      
      {/* Path Connector Line */}
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-24 pointer-events-none"
        preserveAspectRatio="none"
      >
        <path
          d="M12 0 Q48 80, 12 160 Q-24 240, 12 320 Q48 400, 12 480 Q-24 560, 12 640 Q48 720, 12 800 Q-24 880, 12 960"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-30"
        />
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--success))" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--muted))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Nodes */}
      <div className="relative space-y-12">
        {nodes.map((node, index) => {
          const Icon = iconMap[node.icon];
          const isEven = index % 2 === 0;
          const isHovered = hoveredNode === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative flex items-center gap-4",
                isEven ? "flex-row" : "flex-row-reverse"
              )}
            >
              {/* Node Circle */}
              <motion.button
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                disabled={node.status === 'locked'}
                className={cn(
                  "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                  "mx-auto",
                  node.status === 'complete' && "bg-success text-success-foreground shadow-lg",
                  node.status === 'current' && "bg-primary text-primary-foreground shadow-node animate-glow",
                  node.status === 'locked' && "bg-muted text-muted-foreground cursor-not-allowed",
                )}
                whileHover={node.status !== 'locked' ? { scale: 1.1 } : {}}
                whileTap={node.status !== 'locked' ? { scale: 0.95 } : {}}
              >
                {node.status === 'locked' ? (
                  <Lock className="w-8 h-8" />
                ) : node.status === 'complete' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <Icon className="w-8 h-8" />
                )}

                {/* Stars for completed */}
                {node.status === 'complete' && (
                  <div className="absolute -top-2 -right-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-md"
                    >
                      <Star className="w-4 h-4 text-accent-foreground fill-current" />
                    </motion.div>
                  </div>
                )}

                {/* Crown for current */}
                {node.status === 'current' && (
                  <motion.div
                    className="absolute -top-6"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Crown className="w-6 h-6 text-accent" />
                  </motion.div>
                )}
              </motion.button>

              {/* Node Info Card */}
              <motion.div
                className={cn(
                  "absolute w-48 p-4 bg-card rounded-xl shadow-card border border-border transition-all duration-300",
                  isEven ? "left-[calc(50%+60px)]" : "right-[calc(50%+60px)]",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn(
                    "w-4 h-4",
                    node.status === 'complete' && "text-success",
                    node.status === 'current' && "text-primary",
                    node.status === 'locked' && "text-muted-foreground"
                  )} />
                  <h4 className="font-display font-bold text-sm">{node.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{node.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span className="font-semibold">{node.xp} XP</span>
                </div>
                {node.progress !== undefined && node.progress > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${node.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Sample data generator
export const generateSamplePath = (): PathNode[] => [
  {
    id: 'greetings',
    title: 'Greetings & Introductions',
    description: 'Master the basics of meeting new people.',
    icon: 'social',
    status: 'complete',
    xp: 50,
    progress: 100,
  },
  {
    id: 'restaurant',
    title: 'At the Restaurant',
    description: 'Order food and interact with waiters.',
    icon: 'restaurant',
    status: 'complete',
    xp: 75,
    progress: 100,
  },
  {
    id: 'shopping',
    title: 'Shopping Adventure',
    description: 'Navigate stores and make purchases.',
    icon: 'shopping',
    status: 'current',
    xp: 80,
    progress: 45,
  },
  {
    id: 'airport',
    title: 'At the Airport',
    description: 'Check-in, security, and boarding.',
    icon: 'airport',
    status: 'locked',
    xp: 100,
  },
  {
    id: 'business',
    title: 'Job Interview',
    description: 'Ace your next job interview.',
    icon: 'business',
    status: 'locked',
    xp: 120,
  },
  {
    id: 'medical',
    title: 'Doctor Visit',
    description: 'Describe symptoms and understand prescriptions.',
    icon: 'medical',
    status: 'locked',
    xp: 100,
  },
  {
    id: 'academic',
    title: 'Academic Discussion',
    description: 'Participate in class discussions and presentations.',
    icon: 'academic',
    status: 'locked',
    xp: 150,
  },
];

export default LearningPath;