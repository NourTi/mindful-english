import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  immergoMissions, 
  supportedLanguages, 
  type ImmergoMission, 
  type LearningMode 
} from '@/data/immergoMissions';
import { cn } from '@/lib/utils';
import immergoDemoVideo from '@/assets/immergo-demo.mp4';

const ImmergoMissions = () => {
  const navigate = useNavigate();
  
  // Use defaults — no localStorage persistence
  const [nativeLang, setNativeLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [mode, setMode] = useState<LearningMode>('teacher');

  const startMission = (mission: ImmergoMission) => {
    sessionStorage.setItem('immergo_session', JSON.stringify({
      mission,
      nativeLang,
      targetLang,
      mode,
    }));
    navigate('/immergo-chat');
  };

  const getDifficultyColor = (difficulty: ImmergoMission['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'bg-primary/20 text-primary';
      case 'Medium': return 'bg-amber-500/20 text-amber-400';
      case 'Hard': return 'bg-orange-500/20 text-orange-400';
      case 'Expert': return 'bg-destructive/20 text-destructive';
    }
  };

  const getLangDisplay = (code: string) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
          <h1 className="font-display font-bold text-lg">Immergo</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Language & Mode Selection HUD */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                I speak
              </label>
              <div className="relative">
                <select
                  value={nativeLang}
                  onChange={(e) => setNativeLang(e.target.value)}
                  className="w-full p-3 pr-10 rounded-lg border border-border bg-background/50 font-medium appearance-none cursor-pointer hover:bg-background transition-colors"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-primary">
                I want to learn
              </label>
              <div className="relative">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full p-3 pr-10 rounded-lg border border-primary/50 bg-background/50 font-medium appearance-none cursor-pointer hover:bg-background transition-colors"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Experience Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('teacher')}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                  mode === 'teacher' 
                    ? "border-primary bg-primary/10 shadow-md" 
                    : "border-border/50 bg-background/30 hover:bg-background/50"
                )}
              >
                <span className="text-2xl">🧑‍🏫</span>
                <div>
                  <div className={cn("font-semibold", mode === 'teacher' && "text-primary")}>
                    Teacher Mode
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Guidance, tips & corrections
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode('immersive')}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                  mode === 'immersive' 
                    ? "border-primary bg-primary/10 shadow-md" 
                    : "border-border/50 bg-background/30 hover:bg-background/50"
                )}
              >
                <span className="text-2xl">🎭</span>
                <div>
                  <div className={cn("font-semibold", mode === 'immersive' && "text-primary")}>
                    Immersive Mode
                  </div>
                  <div className="text-xs text-muted-foreground">
                    No breaks in character
                  </div>
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Demo Video Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/30"
        >
          <video
            src={immergoDemoVideo}
            className="w-full aspect-video object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Interactive Demo
              </span>
            </div>
            <h3 className="text-xl font-bold">Step Into Real Conversations</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Practice with AI characters in immersive scenarios
            </p>
          </div>
        </motion.div>

        {/* Mission Selection */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold">Choose Your Quest</h2>
            <p className="text-muted-foreground">
              Select a scenario to practice {getLangDisplay(targetLang)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {immergoMissions.map((mission) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mission.id * 0.05 }}
              >
                <Card
                  onClick={() => startMission(mission)}
                  className="p-5 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{mission.icon}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-bold uppercase",
                      getDifficultyColor(mission.difficulty)
                    )}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mission.desc}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium">Role:</span> {mission.target_role}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImmergoMissions;
