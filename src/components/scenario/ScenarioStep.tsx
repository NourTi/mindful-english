import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, ArrowRight } from 'lucide-react';
import { DialogueStep } from '@/types/scenario';
import { ScenarioChoice } from './ScenarioChoice';
import { Button } from '@/components/ui/button';

interface ScenarioStepProps {
  step: DialogueStep;
  stepIndex: number;
  totalSteps: number;
  onChoiceSelect: (choiceIndex: number, emotionImpact: number, isCorrect: boolean) => void;
  onAdvance: () => void;
  accentColor: string;
  speakText?: (text: string) => void;
}

export const ScenarioStep = ({
  step,
  stepIndex,
  totalSteps,
  onChoiceSelect,
  onAdvance,
  accentColor,
  speakText,
}: ScenarioStepProps) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoiceSelect = (index: number) => {
    if (selectedChoice !== null) return;
    
    const option = step.user_options[index];
    setSelectedChoice(index);
    setShowResult(true);
    onChoiceSelect(index, option.emotion_impact, option.is_correct);
    
    // Speak feedback if voice is enabled
    if (speakText) {
      speakText(option.feedback);
    }
  };

  const handleContinue = () => {
    setSelectedChoice(null);
    setShowResult(false);
    onAdvance();
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < stepIndex ? 'w-8 bg-green-500' :
              i === stepIndex ? `w-12 ${accentColor}` :
              'w-8 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* NPC Dialogue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${accentColor} flex items-center justify-center flex-shrink-0`}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-sm mb-1 font-medium">{step.npc_name}</p>
            <p className="text-white text-base leading-relaxed">{step.npc_dialogue}</p>
          </div>
        </div>
      </motion.div>

      {/* User choices */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <User className="w-4 h-4" />
          <span>Choose your response:</span>
        </div>
        
        <AnimatePresence mode="wait">
          {step.user_options.map((option, index) => (
            <ScenarioChoice
              key={index}
              option={option}
              index={index}
              onSelect={() => handleChoiceSelect(index)}
              disabled={selectedChoice !== null}
              selected={selectedChoice === index}
              showResult={showResult}
              accentColor={accentColor}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center pt-4"
          >
            <Button
              onClick={handleContinue}
              className={`${accentColor} hover:opacity-90 text-white px-8`}
            >
              {stepIndex < totalSteps - 1 ? (
                <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Complete Scenario</>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
