import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Play, Flame, Trophy, Brain, Heart, 
  Eye, Headphones, Hand, Clock, Sparkles, 
  TrendingUp, Target, BarChart3, Settings, LogOut, RotateCcw, Home, LayoutDashboard, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { LearningStyle } from '@/types/learning';
import { useAdmin } from '@/hooks/useAdmin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const styleConfig: Record<LearningStyle, { icon: React.ReactNode; color: string; bgColor: string }> = {
  visual: { icon: <Eye className="w-5 h-5" />, color: 'text-cognitive-visual', bgColor: 'bg-cognitive-visual/10' },
  auditory: { icon: <Headphones className="w-5 h-5" />, color: 'text-cognitive-auditory', bgColor: 'bg-cognitive-auditory/10' },
  reading: { icon: <BookOpen className="w-5 h-5" />, color: 'text-cognitive-reading', bgColor: 'bg-cognitive-reading/10' },
  kinesthetic: { icon: <Hand className="w-5 h-5" />, color: 'text-cognitive-kinesthetic', bgColor: 'bg-cognitive-kinesthetic/10' },
};

const lessons = [
  { id: 'greetings-intro', title: 'Greetings & Introductions', category: 'Speaking', duration: '5 min', progress: 100, xp: 50 },
  { id: 'restaurant-basics', title: 'At the Restaurant', category: 'Vocabulary', duration: '7 min', progress: 75, xp: 75 },
  { id: 'making-plans', title: 'Making Plans', category: 'Grammar', duration: '6 min', progress: 30, xp: 60 },
  { id: 'shopping-convo', title: 'Shopping Conversation', category: 'Speaking', duration: '8 min', progress: 0, xp: 80 },
  { id: 'describing-people', title: 'Describing People', category: 'Vocabulary', duration: '5 min', progress: 0, xp: 50 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { calculateProfile, userName } = useAssessmentStore();
  const { isAdmin } = useAdmin();
  const [profile, setProfile] = useState(calculateProfile());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!userName) {
      navigate('/');
      return;
    }
    setProfile(calculateProfile());
  }, [calculateProfile, userName, navigate]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const style = styleConfig[profile.learningStyle];
  const streak = 7;
  const totalXP = 1250;
  const level = 5;
  const nextLevelXP = 1500;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="font-display text-xl font-semibold text-foreground">SEE</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold">{streak}</span>
            </div>
            
            {/* XP */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">{totalXP} XP</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/community')}>
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin CMS
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  useAssessmentStore.getState().reset();
                  navigate('/');
                }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Assessment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  useAssessmentStore.getState().reset();
                  navigate('/');
                }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey? Your brain learns best with{' '}
            <span className={`font-semibold ${style.color}`}>{profile.learningStyle}</span> content.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-glow p-6 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-foreground/80 text-sm font-medium mb-1">Continue Learning</p>
                      <h2 className="text-2xl font-display font-bold mb-2">At the Restaurant</h2>
                      <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> 7 min left
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" /> 75% complete
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="glass" 
                      size="lg" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={() => navigate('/lesson/restaurant-basics')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  </div>
                  <Progress 
                    value={75} 
                    size="sm" 
                    className="mt-4 bg-white/20" 
                    indicatorVariant="default"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Recommended Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">Recommended for You</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {lessons.slice(0, 4).map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card variant="cognitive" className="group cursor-pointer border-border hover:border-primary/50" onClick={() => navigate(`/lesson/${lesson.id}`)}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${style.bgColor}`}>
                            {style.icon}
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {lesson.category}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lesson.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> +{lesson.xp} XP
                          </span>
                        </div>
                        {lesson.progress > 0 && (
                          <Progress value={lesson.progress} size="sm" className="mt-3" indicatorVariant="cognitive" />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Emotional Check-in */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="glass" className="border-secondary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-secondary">
                      <Heart className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">How are you feeling today?</h3>
                      <p className="text-sm text-muted-foreground">
                        A quick check-in helps us adjust your learning experience.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {['😊', '😐', '😔'].map((emoji, i) => (
                        <button
                          key={i}
                          className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors text-xl"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="elevated">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Level {level}
                  </CardTitle>
                  <CardDescription>{nextLevelXP - totalXP} XP to next level</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={(totalXP / nextLevelXP) * 100} 
                    size="lg" 
                    indicatorVariant="cognitive"
                    animated
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{totalXP} XP</span>
                    <span>{nextLevelXP} XP</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cognitive Profile Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${style.bgColor} ${style.color}`}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Learning Style</p>
                      <p className="font-semibold capitalize">{profile.learningStyle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10 text-success">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vocabulary</p>
                      <p className="font-semibold capitalize">{profile.vocabularyLevel.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Target className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Focus Time</p>
                      <p className="font-semibold">{profile.preferredChunkDuration} min chunks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Target className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Weekly Goal</p>
                      <p className="text-sm text-muted-foreground">5 of 7 days completed</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className={`flex-1 h-2 rounded-full ${
                          day <= 5 ? 'bg-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
