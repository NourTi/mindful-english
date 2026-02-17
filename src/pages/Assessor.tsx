import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLearnerProfile, clearLearnerProfile } from '@/lib/onboardingEngine';
import { getPathById } from '@/lib/seeLearningSystem';
import type { LearnerProfile } from '@/types/onboarding';

const Assessor = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const p = getLearnerProfile();
    if (!p) {
      navigate('/onboarding');
      return;
    }
    setProfile(p);
  }, [navigate]);

  const handleReset = () => {
    clearLearnerProfile();
    navigate('/onboarding');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const primaryPath = getPathById(profile.primaryPathId);
  const secondaryPath = getPathById(profile.secondaryPathId);

  const axes = [
    { label: 'Speaking Level', value: profile.speakingLevel, max: 5 },
    { label: 'Listening Level', value: profile.listeningLevel, max: 5 },
    { label: 'Social Anxiety', value: profile.socialAnxiety, max: 5 },
    { label: 'Self-Efficacy', value: profile.selfEfficacy, max: 5 },
    { label: 'Collocation Awareness', value: profile.collocationAwareness, max: 5 },
  ];

  // Generate explanation
  const getExplanation = () => {
    const parts: string[] = [];
    if (profile.socialAnxiety >= 4) {
      parts.push(`Because your social anxiety is high (${profile.socialAnxiety}/5)`);
    } else if (profile.socialAnxiety >= 2) {
      parts.push(`With moderate social anxiety (${profile.socialAnxiety}/5)`);
    } else {
      parts.push(`With low social anxiety (${profile.socialAnxiety}/5)`);
    }

    if (profile.speakingLevel <= 2) {
      parts.push(`and speaking level is low (${profile.speakingLevel}/5)`);
    } else if (profile.speakingLevel >= 4) {
      parts.push(`and strong speaking skills (${profile.speakingLevel}/5)`);
    } else {
      parts.push(`and intermediate speaking (${profile.speakingLevel}/5)`);
    }

    parts.push(`we start with ${primaryPath?.label || profile.primaryPathId}.`);

    if (profile.motivation) {
      parts.push(`Your motivation: ${profile.motivation}.`);
    }

    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-xl font-bold text-foreground">Learner Profile Assessor</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset Profile
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Radar-style breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Axis Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {axes.map(axis => {
                const pct = (axis.value / axis.max) * 100;
                return (
                  <div key={axis.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{axis.label}</span>
                      <span className="font-medium text-foreground">{axis.value}/{axis.max} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 space-y-1">
                <p className="text-sm text-muted-foreground">Motivation</p>
                <p className="font-medium text-foreground">{profile.motivation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Preferred Format</p>
                <p className="font-medium text-foreground">{profile.preferredFormat}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Labels & Paths */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Applied Labels & Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Labels:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.labels.length > 0 ? profile.labels.map(l => (
                    <span key={l} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {l.replace(/_/g, ' ')}
                    </span>
                  )) : (
                    <span className="text-sm text-muted-foreground">No specific labels matched</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Primary Path</p>
                  <p className="font-semibold text-foreground">{primaryPath?.label || profile.primaryPathId}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Secondary Path</p>
                  <p className="font-semibold text-foreground">{secondaryPath?.label || profile.secondaryPathId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Explanation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{getExplanation()}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* JSON Dump */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" /> Raw Profile (Research)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto text-foreground whitespace-pre-wrap">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Assessor;
