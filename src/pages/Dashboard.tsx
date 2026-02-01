import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Play, Flame, Trophy, Brain, Heart, 
  Eye, Headphones, Hand, Clock, Sparkles, 
  TrendingUp, Target, BarChart3, Settings, LogOut, RotateCcw, Home, LayoutDashboard, Users, MessageCircle, GraduationCap, Compass, Route, Hammer, MapPin
} from 'lucide-react';
import Scene3D from '@/components/Scene3D';
import SEELogo from '@/components/SEELogo';
import { Button } from '@/components/ui/button';
import { LearningEnvironments } from '@/components/LearningEnvironments';
import { EnvironmentGrid } from '@/components/EnvironmentGrid';
import { GrowthBar } from '@/components/GrowthBar';
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
    setProfile(calculateProfile());
  }, [calculateProfile]);

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

  const navItems = [
    { label: 'Immergo', path: '/immergo', icon: Compass },
    { label: 'Paths', path: '/paths', icon: Route },
    { label: 'Lessons', path: '/lessons', icon: BookOpen },
    { label: 'Builder', path: '/community-builder', icon: Hammer },
    { label: 'Community', path: '/community', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Scene Background */}
      <Suspense fallback={null}>
        <Scene3D variant="dashboard" className="pointer-events-none opacity-50" />
      </Suspense>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background pointer-events-none" />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <SEELogo size={40} showText animated={false} theme="auto" />
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Growth Bar - Hidden on mobile */}
            <div className="hidden lg:block">
              <GrowthBar currentXP={totalXP} />
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold">{streak}</span>
            </div>
            
            {/* XP - shown on mobile only since GrowthBar has it on desktop */}
            <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
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
                <DropdownMenuItem onClick={() => navigate('/messages')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin CMS
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  useAssessmentStore.getState().reset();
                  navigate('/assessment');
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

        {/* Navigation - Mobile */}
        <nav className="md:hidden flex items-center justify-around border-t border-border py-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className="flex-col gap-1 h-auto py-2"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Assessment Prompt Banner - show if user hasn't completed assessment */}
        {!userName && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Personalize your experience</h3>
                <p className="text-sm text-muted-foreground">
                  Take a quick assessment to customize lessons for your learning style.
                </p>
              </div>
              <Button onClick={() => navigate('/assessment')} className="shrink-0">
                Take Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {getGreeting()}{userName ? `, ${userName}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground">
            {userName ? (
              <>
                Ready to continue your learning journey? Your brain learns best with{' '}
                <span className={`font-semibold ${style.color}`}>{profile.learningStyle}</span> content.
              </>
            ) : (
              'Welcome to SEE! Start your personalized English learning journey.'
            )}
          </p>
        </motion.div>

        {/* Hero: Learning Environments Card Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">Choose Your Learning Environment</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/scenario')}>
              View All Scenarios
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">
            Select an immersive environment that matches your personality and learning style
          </p>
          <LearningEnvironments />
        </motion.div>

        {/* SEE Challenges by Environment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">SEE Challenges</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/paths')}>
              View Paths
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">
            Practice English in real-world environments with guided challenges
          </p>
          <EnvironmentGrid />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
              transition={{ delay: 0.3 }}
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
                    transition={{ delay: 0.4 + index * 0.1 }}
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
