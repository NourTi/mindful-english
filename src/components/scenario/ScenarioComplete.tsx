import { motion } from 'framer-motion';
import { Trophy, Star, Brain, RefreshCw, Home, BookOpen } from 'lucide-react';
import { DialogueData, ScenarioProgress } from '@/types/scenario';
import { Button } from '@/components/ui/button';
import Confetti from '@/components/Confetti';

interface ScenarioCompleteProps {
  dialogueData: DialogueData;
  progress: ScenarioProgress;
  scenarioTitle: string;
  onRestart: () => void;
  onExit: () => void;
  accentColor: string;
}

export const ScenarioComplete = ({
  dialogueData,
  progress,
  scenarioTitle,
  onRestart,
  onExit,
  accentColor,
}: ScenarioCompleteProps) => {
  const accuracy = Math.round((progress.correctAnswers / progress.totalAnswers) * 100);
  const isPerfect = accuracy === 100;
  const isGood = accuracy >= 66;

  return (
    <div className="space-y-8 text-center">
      {isPerfect && <Confetti isActive={true} />}
      
      {/* Trophy animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="flex justify-center"
      >
        <div className={`w-24 h-24 rounded-full ${accentColor} flex items-center justify-center`}>
          <Trophy className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {isPerfect ? 'Perfect Score!' : isGood ? 'Well Done!' : 'Good Effort!'}
        </h2>
        <p className="text-white/70">{dialogueData.success_message}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{accuracy}%</p>
          <p className="text-xs text-white/50">Accuracy</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{progress.correctAnswers}/{progress.totalAnswers}</p>
          <p className="text-xs text-white/50">Correct</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Trophy className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">+{Math.max(0, progress.emotionScore * 10)}</p>
          <p className="text-xs text-white/50">XP Earned</p>
        </div>
      </motion.div>

      {/* Vocabulary learned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-white/70" />
          <p className="text-sm font-medium text-white/70">Vocabulary Practiced</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {dialogueData.vocabulary_focus.map((word, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${accentColor}/20 text-white border border-white/10`}
            >
              {word}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
      >
        <Button
          variant="outline"
          onClick={onRestart}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button
          onClick={onExit}
          className={`${accentColor} hover:opacity-90 text-white`}
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};
