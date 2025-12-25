import { motion } from 'framer-motion';
import { Briefcase, Plane, Home, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessmentStore } from '@/stores/assessmentStore';

const contexts = [
  { 
    id: 'workplace', 
    label: 'Workplace', 
    icon: <Briefcase className="w-8 h-8" />,
    description: 'Business meetings, emails, and professional communication',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'travel', 
    label: 'Travel', 
    icon: <Plane className="w-8 h-8" />,
    description: 'Airports, hotels, restaurants, and navigation',
    color: 'from-emerald-500 to-emerald-600'
  },
  { 
    id: 'daily_life', 
    label: 'Daily Life', 
    icon: <Home className="w-8 h-8" />,
    description: 'Shopping, social interactions, and everyday tasks',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    id: 'academic', 
    label: 'Academic', 
    icon: <GraduationCap className="w-8 h-8" />,
    description: 'Studying, presentations, and academic discussions',
    color: 'from-purple-500 to-purple-600'
  },
] as const;

const SemanticContextStep = () => {
  const { semanticContext, setSemanticContext, setStep } = useAssessmentStore();

  const handleSelect = (context: typeof contexts[number]['id']) => {
    setSemanticContext(context);
  };

  const handleContinue = () => {
    setStep('complete');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Where will you use English?
        </motion.h2>
        <motion.p
          className="text-muted-foreground max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          This helps us create scenarios and vocabulary that are relevant to your life.
        </motion.p>
      </div>

      {/* Context Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {contexts.map((context, index) => (
          <motion.div
            key={context.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card 
              variant="cognitive"
              className={`cursor-pointer transition-all duration-300 ${
                semanticContext === context.id 
                  ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelect(context.id)}
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${context.color} text-white mb-4`}>
                  {context.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{context.label}</h3>
                <p className="text-sm text-muted-foreground">{context.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          variant="hero"
          size="xl"
          onClick={handleContinue}
          disabled={!semanticContext}
        >
          Complete Assessment
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SemanticContextStep;
