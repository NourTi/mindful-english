import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Send, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { loadSeeCommunityPrompts } from '@/lib/seeData';
import type { SeeCommunityPrompt, Environment, StepKind } from '@/lib/seeData';

const environments: { value: Environment; label: string; icon: string }[] = [
  { value: 'airport', label: 'Airport', icon: '✈️' },
  { value: 'cafe', label: 'Café', icon: '☕' },
  { value: 'meetup', label: 'Meetup', icon: '🤝' },
  { value: 'classroom', label: 'Classroom', icon: '📚' },
  { value: 'office', label: 'Office', icon: '💼' },
  { value: 'street', label: 'Street', icon: '🚶' },
];

const stepKinds: { value: StepKind; label: string }[] = [
  { value: 'psyground', label: 'Grounding' },
  { value: 'dialogue', label: 'Dialogue' },
  { value: 'reflection', label: 'Reflection' },
];

interface ScenarioStep {
  kind: StepKind;
  text: string;
}

interface NewScenario {
  title: string;
  environment: Environment | '';
  steps: ScenarioStep[];
}

export default function CommunityBuilder() {
  const navigate = useNavigate();
  const templates = loadSeeCommunityPrompts();
  
  const [selectedTemplate, setSelectedTemplate] = useState<SeeCommunityPrompt | null>(null);
  const [scenario, setScenario] = useState<NewScenario>({
    title: '',
    environment: '',
    steps: [
      { kind: 'psyground', text: '' },
      { kind: 'dialogue', text: '' },
      { kind: 'reflection', text: '' },
    ],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTemplateSelect = (template: SeeCommunityPrompt) => {
    setSelectedTemplate(template);
    setScenario({
      title: '',
      environment: '',
      steps: [
        { kind: 'psyground', text: '' },
        { kind: 'dialogue', text: '' },
        { kind: 'reflection', text: '' },
      ],
    });
    setIsSubmitted(false);
  };

  const updateStep = (index: number, field: keyof ScenarioStep, value: string) => {
    setScenario(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  };

  const addStep = () => {
    setScenario(prev => ({
      ...prev,
      steps: [...prev.steps, { kind: 'dialogue', text: '' }],
    }));
  };

  const removeStep = (index: number) => {
    if (scenario.steps.length <= 1) return;
    setScenario(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!scenario.title.trim()) {
      toast({ title: 'Please enter a title', variant: 'destructive' });
      return;
    }
    if (!scenario.environment) {
      toast({ title: 'Please select an environment', variant: 'destructive' });
      return;
    }
    if (scenario.steps.some(s => !s.text.trim())) {
      toast({ title: 'Please fill in all steps', variant: 'destructive' });
      return;
    }

    // Log to console for now
    console.log('Created Scenario:', {
      ...scenario,
      templateId: selectedTemplate?.id,
      createdAt: new Date().toISOString(),
    });

    setIsSubmitted(true);
    toast({
      title: 'Scenario created!',
      description: 'Your scenario has been logged to the console. Database connection coming soon!',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">Community Builder</h1>
            <p className="text-sm text-muted-foreground">
              Design scenarios to help fellow learners
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!selectedTemplate ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-primary/50 transition-colors h-full"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Lightbulb className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Scenario Created!</h2>
            <p className="text-muted-foreground mb-6">
              Your scenario has been saved. Thank you for contributing!
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Create Another
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Template Info */}
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">{selectedTemplate.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTemplate.prompt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Scenario Title</label>
                <Input
                  placeholder="e.g., Ordering at a Busy Coffee Shop"
                  value={scenario.title}
                  onChange={(e) => setScenario(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Environment</label>
                <Select
                  value={scenario.environment}
                  onValueChange={(value: Environment) => 
                    setScenario(prev => ({ ...prev, environment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map(env => (
                      <SelectItem key={env.value} value={env.value}>
                        <span className="flex items-center gap-2">
                          <span>{env.icon}</span>
                          <span>{env.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Steps</label>
                  <Button variant="ghost" size="sm" onClick={addStep}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Step
                  </Button>
                </div>
                <div className="space-y-4">
                  {scenario.steps.map((step, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-3">
                          <Select
                            value={step.kind}
                            onValueChange={(value: StepKind) => updateStep(index, 'kind', value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {stepKinds.map(kind => (
                                <SelectItem key={kind.value} value={kind.value}>
                                  {kind.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Textarea
                            placeholder={
                              step.kind === 'psyground' 
                                ? 'Describe a grounding exercise...'
                                : step.kind === 'dialogue'
                                ? 'Describe the interaction...'
                                : 'Ask a reflection question...'
                            }
                            value={step.text}
                            onChange={(e) => updateStep(index, 'text', e.target.value)}
                            rows={2}
                          />
                        </div>
                        {scenario.steps.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeStep(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Back to Templates
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  Create Scenario
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
