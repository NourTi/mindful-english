import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface OnboardingProgressProps {
  sections: string[];
  currentIndex: number;
}

const OnboardingProgress = ({ sections, currentIndex }: OnboardingProgressProps) => {
  const progress = ((currentIndex + 1) / sections.length) * 100;
  
  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" indicatorVariant="cognitive" />
      
      <div className="flex justify-between items-center">
        {sections.map((section, index) => (
          <motion.div
            key={section}
            className="flex flex-col items-center gap-2"
            animate={{
              opacity: index <= currentIndex ? 1 : 0.4,
              scale: index === currentIndex ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentIndex
                  ? 'bg-primary'
                  : index === currentIndex
                  ? 'bg-primary ring-4 ring-primary/30'
                  : 'bg-muted'
              }`}
            />
            <span
              className={`text-xs hidden sm:block ${
                index === currentIndex
                  ? 'text-primary font-medium'
                  : index < currentIndex
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {section}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingProgress;
