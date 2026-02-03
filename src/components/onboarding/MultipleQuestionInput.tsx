import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultipleQuestion } from '@/types/onboarding';

interface MultipleQuestionInputProps {
  question: MultipleQuestion;
  value: string;
  onChange: (value: string) => void;
}

const MultipleQuestionInput = ({ question, value, onChange }: MultipleQuestionInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Label className="text-lg font-medium text-foreground">
        {question.question}
      </Label>
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <label
              htmlFor={`${question.id}-${index}`}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                value === option
                  ? 'border-primary bg-primary/10 shadow-soft'
                  : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card'
              }`}
            >
              <RadioGroupItem
                value={option}
                id={`${question.id}-${index}`}
                className="shrink-0"
              />
              <span className={`text-sm ${value === option ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {option}
              </span>
            </label>
          </motion.div>
        ))}
      </RadioGroup>
    </motion.div>
  );
};

export default MultipleQuestionInput;
