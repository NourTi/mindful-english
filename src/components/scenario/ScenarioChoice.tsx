import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import { UserOption } from '@/types/scenario';
import { cn } from '@/lib/utils';

interface ScenarioChoiceProps {
  option: UserOption;
  index: number;
  onSelect: () => void;
  disabled: boolean;
  selected: boolean;
  showResult: boolean;
  accentColor: string;
}

export const ScenarioChoice = ({
  option,
  index,
  onSelect,
  disabled,
  selected,
  showResult,
  accentColor,
}: ScenarioChoiceProps) => {
  const getResultStyles = () => {
    if (!showResult) return '';
    if (selected && option.is_correct) return 'border-green-500 bg-green-500/20';
    if (selected && !option.is_correct) return 'border-amber-500 bg-amber-500/20';
    if (!selected && option.is_correct) return 'border-green-500/50 bg-green-500/10';
    return 'opacity-50';
  };

  const labels = ['A', 'B', 'C'];

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-xl text-left transition-all duration-300',
        'border-2 backdrop-blur-sm',
        'hover:scale-[1.02] active:scale-[0.98]',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        showResult ? getResultStyles() : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm',
          showResult && selected && option.is_correct && 'bg-green-500 text-white',
          showResult && selected && !option.is_correct && 'bg-amber-500 text-white',
          !showResult && `${accentColor} text-white`
        )}>
          {showResult && selected ? (
            option.is_correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />
          ) : (
            labels[index]
          )}
        </div>
        <div className="flex-1">
          <p className="text-white/90 text-sm leading-relaxed">{option.text}</p>
          
          {showResult && selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={cn(
                'mt-3 p-3 rounded-lg text-sm',
                option.is_correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
              )}
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{option.feedback}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  );
};
