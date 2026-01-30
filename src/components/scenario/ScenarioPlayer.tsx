import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, MapPin } from 'lucide-react';
import { useScenario } from '@/hooks/useScenario';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { ScenarioStep } from './ScenarioStep';
import { ScenarioComplete } from './ScenarioComplete';
import { Button } from '@/components/ui/button';

// Environment styling configurations
const environmentStyles: Record<string, {
  gradient: string;
  bgImage: string;
  accentColor: string;
  textColor: string;
}> = {
  'corporate-boardroom': {
    gradient: 'from-slate-900/90 via-blue-950/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop',
    accentColor: 'bg-blue-600',
    textColor: 'text-blue-100',
  },
  'international-airport': {
    gradient: 'from-sky-950/90 via-slate-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&auto=format&fit=crop',
    accentColor: 'bg-sky-500',
    textColor: 'text-sky-100',
  },
  'university-campus': {
    gradient: 'from-emerald-950/90 via-teal-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&auto=format&fit=crop',
    accentColor: 'bg-emerald-500',
    textColor: 'text-emerald-100',
  },
  'local-coffee-shop': {
    gradient: 'from-amber-950/90 via-orange-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&auto=format&fit=crop',
    accentColor: 'bg-amber-500',
    textColor: 'text-amber-100',
  },
  'medical-clinic': {
    gradient: 'from-teal-950/90 via-cyan-900/80 to-black/90',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&auto=format&fit=crop',
    accentColor: 'bg-teal-500',
    textColor: 'text-teal-100',
  },
};

const defaultStyle = {
  gradient: 'from-purple-950/90 via-slate-900/80 to-black/90',
  bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop',
  accentColor: 'bg-purple-600',
  textColor: 'text-purple-100',
};

interface ScenarioPlayerProps {
  environmentSlug: string;
}

export const ScenarioPlayer = ({ environmentSlug }: ScenarioPlayerProps) => {
  const navigate = useNavigate();
  const { scenario, loading, error, progress, selectChoice, advanceStep, resetProgress } = useScenario(environmentSlug);
  const { speakText, voiceEnabled, toggleVoice, isSpeaking, stopSpeaking } = useVoiceChat(environmentSlug);
  
  const style = environmentStyles[environmentSlug] || defaultStyle;

  // Speak opening context when scenario loads
  useEffect(() => {
    if (scenario && progress.currentStep === 0 && voiceEnabled) {
      const openingText = scenario.dialogue_data.opening_context;
      speakText(openingText);
    }
  }, [scenario, progress.currentStep]);

  // Speak NPC dialogue when step changes
  useEffect(() => {
    if (scenario && !progress.completed && voiceEnabled) {
      const currentDialogue = scenario.dialogue_data.steps[progress.currentStep];
      if (currentDialogue) {
        speakText(`${currentDialogue.npc_name} says: ${currentDialogue.npc_dialogue}`);
      }
    }
  }, [progress.currentStep, scenario, voiceEnabled]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <p className="text-lg mb-4">{error || 'Scenario not found'}</p>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const currentStep = scenario.dialogue_data.steps[progress.currentStep];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${style.bgImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${style.gradient}`} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                stopSpeaking();
                navigate('/dashboard');
              }}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${style.accentColor}/20`}>
                <MapPin className={`w-5 h-5 ${style.textColor}`} />
              </div>
              <div className="text-center">
                <span className={`font-display font-semibold ${style.textColor} text-sm`}>
                  {scenario.title}
                </span>
                <div className="flex items-center gap-1 text-xs text-white/50">
                  <Clock className="w-3 h-3" />
                  <span>{scenario.estimated_duration_minutes} min</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          <AnimatePresence mode="wait">
            {!progress.completed ? (
              <motion.div
                key={`step-${progress.currentStep}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Opening context (only on first step) */}
                {progress.currentStep === 0 && progress.totalAnswers === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <p className="text-white/60 text-sm italic leading-relaxed">
                      {scenario.dialogue_data.opening_context}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
                      <span className={`px-2 py-0.5 rounded-full ${style.accentColor}/20`}>
                        Mood: {scenario.neuro_emotional_state}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Current dialogue step */}
                {currentStep && (
                  <ScenarioStep
                    step={currentStep}
                    stepIndex={progress.currentStep}
                    totalSteps={scenario.dialogue_data.steps.length}
                    onChoiceSelect={selectChoice}
                    onAdvance={advanceStep}
                    accentColor={style.accentColor}
                    speakText={voiceEnabled ? speakText : undefined}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ScenarioComplete
                  dialogueData={scenario.dialogue_data}
                  progress={progress}
                  scenarioTitle={scenario.title}
                  onRestart={resetProgress}
                  onExit={() => navigate('/dashboard')}
                  accentColor={style.accentColor}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ScenarioPlayer;
