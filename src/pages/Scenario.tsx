import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, Briefcase, Plane, Home, GraduationCap, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getRandomMessage } from '@/lib/psycholinguistics';

interface ScenarioMessage {
  id: number;
  sender: 'system' | 'user';
  text: string;
}

interface ScenarioQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  feedback: {
    correct: string;
    incorrect: string[];
  };
}

const scenarios: Record<string, { title: string; icon: React.ReactNode; questions: ScenarioQuestion[] }> = {
  workplace: {
    title: 'Office Meeting',
    icon: <Briefcase className="w-6 h-6" />,
    questions: [
      {
        prompt: "Your manager asks: 'Can you send me the quarterly report by Friday?'",
        options: [
          "Yes, I will have it ready.",
          "Maybe I can do it.",
          "What report?"
        ],
        correctIndex: 0,
        feedback: {
          correct: "Perfect! Clear and professional response.",
          incorrect: [
            "Good try. In a professional context, it's better to give a clear commitment. Try: 'Yes, I will have it ready.'",
            "This response might seem unprepared. In business, try: 'Yes, I will have it ready by Friday.'"
          ]
        }
      },
      {
        prompt: "A colleague says: 'I'm having trouble with the new software. Could you help me?'",
        options: [
          "I don't know that software.",
          "Of course! Let me show you how it works.",
          "Ask someone else."
        ],
        correctIndex: 1,
        feedback: {
          correct: "Excellent! Helpful and collaborative tone.",
          incorrect: [
            "It's okay to not know everything, but you could offer alternatives. Try: 'I'm still learning it too, but let's figure it out together.'",
            "This might come across as unhelpful. In a team environment, consider: 'Of course! Let me show you.'"
          ]
        }
      },
      {
        prompt: "Your boss introduces you to a new client: 'This is our new partner from Japan.'",
        options: [
          "Hi.",
          "Nice to meet you. I look forward to working together.",
          "Yeah, whatever."
        ],
        correctIndex: 1,
        feedback: {
          correct: "Great! Professional and welcoming.",
          incorrect: [
            "A bit too casual for a business introduction. Try: 'Nice to meet you. I look forward to working together.'",
            "This is too casual and could be seen as disrespectful. Try: 'Nice to meet you. I look forward to working together.'"
          ]
        }
      }
    ]
  },
  travel: {
    title: 'At the Airport',
    icon: <Plane className="w-6 h-6" />,
    questions: [
      {
        prompt: "The gate agent says: 'May I see your passport and boarding pass, please?'",
        options: [
          "Here you go.",
          "Why do you need it?",
          "I don't have one."
        ],
        correctIndex: 0,
        feedback: {
          correct: "Perfect! Polite and straightforward.",
          incorrect: [
            "It's a standard procedure at airports. A simple 'Here you go' works well.",
            "If you don't have your documents, you might say: 'I'm sorry, let me look for them.'"
          ]
        }
      },
      {
        prompt: "You're at customs and the officer asks: 'What is the purpose of your visit?'",
        options: [
          "None of your business.",
          "I'm here for vacation.",
          "I don't know."
        ],
        correctIndex: 1,
        feedback: {
          correct: "Excellent! Clear and appropriate response.",
          incorrect: [
            "This could cause problems at customs. Simply say: 'I'm here for vacation' or 'Business.'",
            "It's best to have a clear answer. Try: 'I'm here for vacation' or 'I'm visiting family.'"
          ]
        }
      },
      {
        prompt: "At the hotel, the receptionist asks: 'Would you like a room with a view?'",
        options: [
          "Yes, please. That would be nice.",
          "What's a view?",
          "Give me whatever."
        ],
        correctIndex: 0,
        feedback: {
          correct: "Great! Polite and appreciative.",
          incorrect: [
            "A 'view' means you can see something nice from your window. You could say: 'Yes, please!'",
            "This is a bit dismissive. You could say: 'Yes, please. That would be lovely.'"
          ]
        }
      }
    ]
  },
  daily_life: {
    title: 'At the Grocery Store',
    icon: <Home className="w-6 h-6" />,
    questions: [
      {
        prompt: "The cashier asks: 'Would you like a bag for your groceries?'",
        options: [
          "Yes, please.",
          "What's a bag?",
          "No, I'll carry everything in my hands."
        ],
        correctIndex: 0,
        feedback: {
          correct: "Perfect! Simple and polite.",
          incorrect: [
            "A 'bag' is what you carry your items in. You could say: 'Yes, please.'",
            "That might be impractical! Consider: 'Yes, please' for convenience."
          ]
        }
      },
      {
        prompt: "A neighbor waves and says: 'Beautiful day, isn't it?'",
        options: [
          "Yes, it really is! Great weather for a walk.",
          "I don't care about weather.",
          "Leave me alone."
        ],
        correctIndex: 0,
        feedback: {
          correct: "Excellent! Friendly and engaging.",
          incorrect: [
            "This is small talk - a way to be friendly. Try: 'Yes, it really is!'",
            "This might seem unfriendly. Small talk is a way to connect. Try: 'Yes, lovely weather!'"
          ]
        }
      },
      {
        prompt: "At a coffee shop, the barista asks: 'What size would you like?'",
        options: [
          "Medium, please.",
          "I don't know sizes.",
          "The biggest one, fill it up!"
        ],
        correctIndex: 0,
        feedback: {
          correct: "Great! Clear and standard response.",
          incorrect: [
            "Sizes are usually small, medium, or large. You could say: 'Medium, please.'",
            "While enthusiastic, 'Large, please' is more standard. But your energy is great!"
          ]
        }
      }
    ]
  },
  academic: {
    title: 'In the Classroom',
    icon: <GraduationCap className="w-6 h-6" />,
    questions: [
      {
        prompt: "The professor says: 'Does anyone have questions about the assignment?'",
        options: [
          "Could you clarify the deadline?",
          "This is boring.",
          "I don't care."
        ],
        correctIndex: 0,
        feedback: {
          correct: "Perfect! Engaged and specific question.",
          incorrect: [
            "It's good to stay engaged. Try asking: 'Could you clarify the deadline?'",
            "Academic success requires engagement. Try: 'Could you explain the requirements?'"
          ]
        }
      },
      {
        prompt: "A classmate asks: 'Would you like to study together for the exam?'",
        options: [
          "No, I study alone.",
          "Sure! When and where should we meet?",
          "Exams are pointless."
        ],
        correctIndex: 1,
        feedback: {
          correct: "Excellent! Open and collaborative.",
          incorrect: [
            "Studying alone is fine, but collaborating can help. You could say: 'Maybe, when are you thinking?'",
            "Exams are part of education. Group study can make them easier. Try: 'Sure! Let's study together.'"
          ]
        }
      },
      {
        prompt: "The teaching assistant says: 'Your essay draft needs some revisions.'",
        options: [
          "Thank you for the feedback. What should I focus on?",
          "My essay is perfect.",
          "I'm quitting school."
        ],
        correctIndex: 0,
        feedback: {
          correct: "Great! Receptive to constructive feedback.",
          incorrect: [
            "Being open to feedback helps you improve. Try: 'Thank you. What should I focus on?'",
            "Feedback is part of learning. Stay positive: 'Thank you. How can I improve?'"
          ]
        }
      }
    ]
  }
};

const Scenario = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, incrementErrorStreak, resetErrorStreak, addXP } = useProfile();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [messages, setMessages] = useState<ScenarioMessage[]>([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const context = profile?.semantic_context || 'daily_life';
  const scenario = scenarios[context];
  const currentQuestion = scenario?.questions[currentQuestionIndex];

  // Initialize first message
  useEffect(() => {
    if (scenario && messages.length === 0) {
      setMessages([{ id: 1, sender: 'system', text: currentQuestion.prompt }]);
    }
  }, [scenario, currentQuestion, messages.length]);

  const handleSelect = async (index: number) => {
    if (showFeedback || !currentQuestion) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    const isCorrect = index === currentQuestion.correctIndex;
    
    // Add user's response to chat
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'user',
      text: currentQuestion.options[index]
    }]);

    // Add feedback
    setTimeout(() => {
      const feedbackText = isCorrect 
        ? currentQuestion.feedback.correct 
        : currentQuestion.feedback.incorrect[index > currentQuestion.correctIndex ? index - 1 : index] || currentQuestion.feedback.incorrect[0];
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'system',
        text: feedbackText
      }]);

      if (isCorrect) {
        setScore(s => s + 1);
        resetErrorStreak();
        addXP(25);
      } else {
        incrementErrorStreak();
      }
    }, 500);
  };

  const handleNext = () => {
    if (currentQuestionIndex < scenario.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      
      // Add next question to chat
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'system',
          text: scenario.questions[currentQuestionIndex + 1].prompt
        }]);
      }, 300);
    } else {
      setCompleted(true);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading scenario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {scenario.icon}
            </div>
            <span className="font-semibold">{scenario.title}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {scenario.questions.length}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="p-4 rounded-full bg-success/20 mb-6">
              <CheckCircle className="w-16 h-16 text-success" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-2">Scenario Complete!</h2>
            <p className="text-muted-foreground mb-4">
              You scored {score} out of {scenario.questions.length}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-md">
              {score === scenario.questions.length 
                ? "Perfect score! You're mastering contextual English communication."
                : "Great practice! Each conversation helps build your confidence."}
            </p>
            <div className="flex gap-3">
              <Button variant="hero" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setShowFeedback(false);
                setMessages([{ id: 1, sender: 'system', text: scenario.questions[0].prompt }]);
                setCompleted(false);
                setScore(0);
              }}>
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Messages */}
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-muted rounded-bl-sm'
                    }`}>
                      {msg.sender === 'system' && (
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          <span>Conversation Partner</span>
                        </div>
                      )}
                      <p className="text-sm md:text-base">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Response Options */}
            {currentQuestion && !showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  Choose your response:
                </p>
                {currentQuestion.options.map((option, index) => (
                  <Card
                    key={index}
                    variant="cognitive"
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedOption === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelect(index)}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm md:text-base">{option}</p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Next Button */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-6"
              >
                <Button variant="hero" onClick={handleNext}>
                  {currentQuestionIndex < scenario.questions.length - 1 ? 'Continue' : 'See Results'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Scenario;
