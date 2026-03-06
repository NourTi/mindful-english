import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loadSeeChallenges } from '@/lib/seeData';
import type { Environment } from '@/lib/seeData';

const environmentConfig: Record<Environment, { label: string; icon: string; color: string }> = {
  airport: { label: 'Airport', icon: '✈️', color: 'from-blue-500/20 to-cyan-500/20' },
  cafe: { label: 'Café', icon: '☕', color: 'from-amber-500/20 to-orange-500/20' },
  meetup: { label: 'Meetup', icon: '🤝', color: 'from-purple-500/20 to-pink-500/20' },
  classroom: { label: 'Classroom', icon: '📚', color: 'from-green-500/20 to-emerald-500/20' },
  office: { label: 'Office', icon: '💼', color: 'from-slate-500/20 to-gray-500/20' },
  street: { label: 'Street', icon: '🚶', color: 'from-rose-500/20 to-red-500/20' },
  marketplace: { label: 'Marketplace', icon: '🛒', color: 'from-yellow-500/20 to-lime-500/20' },
  bank: { label: 'Bank', icon: '🏦', color: 'from-emerald-500/20 to-teal-500/20' },
};

export function EnvironmentGrid() {
  const navigate = useNavigate();
  const challenges = loadSeeChallenges();

  // Count challenges per environment
  const environmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    challenges.forEach(c => {
      counts[c.environment] = (counts[c.environment] || 0) + 1;
    });
    return counts;
  }, [challenges]);

  // Get unique environments that have challenges
  const environments = useMemo(() => {
    const allEnvs = Object.keys(environmentConfig) as Environment[];
    return allEnvs.map(env => ({
      id: env,
      ...environmentConfig[env],
      count: environmentCounts[env] || 0,
    }));
  }, [environmentCounts]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {environments.map((env, index) => (
        <motion.div
          key={env.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className={`cursor-pointer hover:border-primary/50 transition-all hover:scale-105 bg-gradient-to-br ${env.color}`}
            onClick={() => navigate(`/environment/${env.id}`)}
          >
            <CardContent className="p-4 text-center">
              <span className="text-3xl mb-2 block">{env.icon}</span>
              <h3 className="font-medium text-sm mb-1">{env.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {env.count} {env.count === 1 ? 'challenge' : 'challenges'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
