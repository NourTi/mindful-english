import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScaleQuestion } from '@/types/onboarding';

interface ScaleQuestionInputProps {
  question: ScaleQuestion;
  value: number;
  onChange: (value: number) => void;
}

const ScaleQuestionInput = ({ question, value, onChange }: ScaleQuestionInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label className="text-lg font-medium text-foreground">
          {question.question}
        </Label>
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}
      </div>
      
      <div className="pt-4 pb-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={question.min}
          max={question.max}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between mt-3 text-sm text-muted-foreground">
          <span>{question.min}</span>
          <span className="text-primary font-semibold text-lg">{value}</span>
          <span>{question.max}</span>
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-muted-foreground/70">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ScaleQuestionInput;
