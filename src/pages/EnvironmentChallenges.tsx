import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Zap, Users, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loadSeeChallenges } from '@/lib/seeData';
import type { SeeChallenge, Difficulty, PsyProfile } from '@/lib/seeData';

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-success/20 text-success border-success/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

const psyProfileLabels: Record<PsyProfile, string> = {
  mild_anxiety: 'Mild Anxiety',
  introvert: 'Introvert',
  extrovert: 'Extrovert',
  perfectionist: 'Perfectionist',
};

const environmentLabels: Record<string, { label: string; icon: string }> = {
  airport: { label: 'Airport', icon: '✈️' },
  cafe: { label: 'Café', icon: '☕' },
  meetup: { label: 'Meetup', icon: '🤝' },
  classroom: { label: 'Classroom', icon: '📚' },
  office: { label: 'Office', icon: '💼' },
  street: { label: 'Street', icon: '🚶' },
};

export default function EnvironmentChallenges() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const allChallenges = loadSeeChallenges();
  
  const filteredChallenges = useMemo(() => {
    return allChallenges.filter(c => c.environment === id);
  }, [allChallenges, id]);

  const envInfo = environmentLabels[id || ''] || { label: id || 'Unknown', icon: '📍' };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{envInfo.icon}</span>
            <div>
              <h1 className="font-display text-xl font-bold">{envInfo.label} Challenges</h1>
              <p className="text-sm text-muted-foreground">
                {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No challenges yet</h2>
            <p className="text-muted-foreground">
              Challenges for this environment are coming soon!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallenges.map((challenge, index) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                index={index}
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ChallengeCard({ 
  challenge, 
  index,
  onClick 
}: { 
  challenge: SeeChallenge; 
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg">{challenge.label}</h3>
            <Badge 
              variant="outline" 
              className={difficultyColors[challenge.difficulty]}
            >
              {challenge.difficulty}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.psyProfile.map(profile => (
              <Badge 
                key={profile} 
                variant="secondary" 
                className="text-xs flex items-center gap-1"
              >
                <Brain className="w-3 h-3" />
                {psyProfileLabels[profile] || profile}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {challenge.steps.length} steps
              </span>
              <span className="flex items-center gap-1 text-accent">
                <Zap className="w-4 h-4" />
                +{challenge.xpReward} XP
              </span>
            </div>
            <span className="text-xs">
              Skills: {challenge.skills.join(', ')}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
