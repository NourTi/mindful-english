import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Route, Play, Brain, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loadSeePaths, loadSeeChallenges } from '@/lib/seeData';
import type { SeePath, SeeChallenge, PsyProfile, Difficulty } from '@/lib/seeData';

const psyProfileLabels: Record<PsyProfile, string> = {
  mild_anxiety: 'Mild Anxiety',
  introvert: 'Introvert',
  extrovert: 'Extrovert',
  perfectionist: 'Perfectionist',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  hard: 'bg-destructive/20 text-destructive',
};

export default function Paths() {
  const navigate = useNavigate();
  const paths = loadSeePaths();
  const allChallenges = loadSeeChallenges();

  // Create a lookup map for challenges by ID
  const challengeMap = useMemo(() => {
    const map = new Map<string, SeeChallenge>();
    allChallenges.forEach(c => map.set(c.id, c));
    return map;
  }, [allChallenges]);

  const handleStartPath = (path: SeePath) => {
    if (path.sequence.length > 0) {
      const firstChallengeId = path.sequence[0];
      navigate(`/challenge/${firstChallengeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Route className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold">Learning Paths</h1>
              <p className="text-sm text-muted-foreground">
                Structured journeys for your growth
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {paths.length === 0 ? (
          <div className="text-center py-16">
            <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No paths yet</h2>
            <p className="text-muted-foreground">
              Learning paths are coming soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paths.map((path, index) => (
              <PathCard
                key={path.id}
                path={path}
                challenges={path.sequence
                  .map(id => challengeMap.get(id))
                  .filter((c): c is SeeChallenge => c !== undefined)
                }
                index={index}
                onStart={() => handleStartPath(path)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PathCard({
  path,
  challenges,
  index,
  onStart,
}: {
  path: SeePath;
  challenges: SeeChallenge[];
  index: number;
  onStart: () => void;
}) {
  const totalXP = challenges.reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                {path.label}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {path.psyProfile.map(profile => (
                  <Badge key={profile} variant="secondary" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    {psyProfileLabels[profile] || profile}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-accent">
                <Zap className="w-4 h-4" />
                <span className="font-semibold">{totalXP} XP</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {challenges.length} challenges
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Challenge sequence */}
          <div className="space-y-3 mb-6">
            {challenges.map((challenge, i) => (
              <div 
                key={challenge.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <span className="font-medium">{challenge.label}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${difficultyColors[challenge.difficulty]}`}
                    >
                      {challenge.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={onStart}>
            <Play className="w-4 h-4 mr-2" />
            Start This Path
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
