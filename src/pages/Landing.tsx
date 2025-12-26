import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Sparkles, Users, Target, Zap, Heart, 
  BookOpen, Globe, ChevronRight, Star, Play, Check,
  MessageSquare, Award, ArrowRight, RotateCcw, Eye, HandHeart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Scene3D from '@/components/Scene3D';
import SEELogo from '@/components/SEELogo';

const features = [
  {
    icon: Brain,
    title: 'Adaptive Learning',
    description: 'AI-powered lessons that adapt to your unique cognitive profile and learning style.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Heart,
    title: 'Emotional Intelligence',
    description: 'We monitor your emotional state to optimize learning pace and reduce anxiety.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: Users,
    title: 'Community Partners',
    description: 'Connect with learning partners who match your style and goals.',
    color: 'text-cognitive-visual',
    bgColor: 'bg-cognitive-visual/10',
  },
  {
    icon: Target,
    title: 'Personalized Goals',
    description: 'Set and track meaningful goals tailored to your real-world needs.',
    color: 'text-cognitive-auditory',
    bgColor: 'bg-cognitive-auditory/10',
  },
];

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Working Professional',
    avatar: 'MS',
    content: 'SEE understood my learning style from day one. I went from struggling with basic phrases to confidently presenting in English at work.',
    rating: 5,
  },
  {
    name: 'Carlos Rodriguez',
    role: 'University Student',
    avatar: 'CR',
    content: 'The anxiety-aware approach changed everything. I used to freeze up, but now I actually enjoy learning and speaking English.',
    rating: 5,
  },
  {
    name: 'Ana Oliveira',
    role: 'Entrepreneur',
    avatar: 'AO',
    content: 'Finding a learning partner through the community feature accelerated my progress 10x. The connections are invaluable.',
    rating: 5,
  },
];

const stats = [
  { value: '50K+', label: 'Active Learners' },
  { value: '94%', label: 'Success Rate' },
  { value: '4.9', label: 'App Rating' },
  { value: '150+', label: 'Lessons' },
];

const walkthroughSteps = [
  {
    id: 1,
    title: 'Take a Quick Assessment',
    description: 'Answer a few questions about your learning preferences and goals. Our AI analyzes your cognitive profile.',
    icon: Brain,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    demo: 'assessment',
  },
  {
    id: 2,
    title: 'Get Your Personalized Path',
    description: 'Receive a custom learning journey designed for your unique brain. No one-size-fits-all here.',
    icon: Target,
    color: 'text-cognitive-visual',
    bgColor: 'bg-cognitive-visual/10',
    demo: 'path',
  },
  {
    id: 3,
    title: 'Learn at Your Pace',
    description: 'Engage with adaptive lessons that adjust in real-time based on your performance and emotional state.',
    icon: BookOpen,
    color: 'text-success',
    bgColor: 'bg-success/10',
    demo: 'lesson',
  },
  {
    id: 4,
    title: 'Practice with Partners',
    description: 'Connect with learning partners matched to your style. Practice real conversations in a safe space.',
    icon: Users,
    color: 'text-cognitive-auditory',
    bgColor: 'bg-cognitive-auditory/10',
    demo: 'community',
  },
  {
    id: 5,
    title: 'Celebrate Your Progress',
    description: 'Track achievements, earn rewards, and watch your confidence soar as you master English.',
    icon: Award,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    demo: 'achievement',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance walkthrough
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % walkthroughSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Scene3D variant="auth" className="pointer-events-none opacity-40" />
      </Suspense>

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <SEELogo size={44} showText animated theme="auto" />
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="gap-2">
              Get Started <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Psycholinguistic Learning Platform</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Learn English
                <span className="block bg-gradient-to-r from-primary via-cognitive-visual to-cognitive-auditory bg-clip-text text-transparent">
                  Your Brain's Way
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Experience personalized English learning powered by cognitive science. 
                We adapt to how <em>you</em> think, not the other way around.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 text-lg px-8">
                  <Play className="w-5 h-5" />
                  Start Learning Free
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  <BookOpen className="w-5 h-5" />
                  How It Works
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-border/50">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glowing orb background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-cognitive-visual/20 to-cognitive-auditory/30 rounded-full blur-3xl" />
                
                {/* Central logo */}
                <div className="relative flex items-center justify-center py-20">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.02, 0.98, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <SEELogo size={280} variant="stacked" animated theme="auto" />
                  </motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-10 right-10 p-4 rounded-2xl bg-card/80 backdrop-blur border border-border shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Brain className="w-8 h-8 text-primary" />
                </motion.div>
                
                <motion.div
                  className="absolute bottom-20 left-10 p-4 rounded-2xl bg-card/80 backdrop-blur border border-border shadow-xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Globe className="w-8 h-8 text-cognitive-visual" />
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 right-0 p-4 rounded-2xl bg-card/80 backdrop-blur border border-border shadow-xl"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <Zap className="w-8 h-8 text-warning" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section - The Convergence of Science and Soul */}
        <section id="about" className="py-32 relative overflow-hidden">
          {/* Neural network background effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Floating tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm tracking-wide">
              Decoding Barriers. Empowering Voices. Transforming Futures.
            </span>
          </motion.div>

          <div className="max-w-5xl mx-auto px-4 relative">
            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12"
            >
              <span className="text-foreground">The Convergence of</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-cognitive-visual to-cognitive-auditory bg-clip-text text-transparent">
                Science and Soul
              </span>
            </motion.h2>

            {/* Introduction paragraphs with scroll reveal */}
            <div className="space-y-8 text-lg md:text-xl leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-foreground font-medium"
              >
                At SEE, we believe that the failure to communicate is not a lack of intelligence—it is a failure of the system. Traditional education treats learners as data points, forcing them into rigid, standardized boxes that ignore the beautiful complexity of the human brain.{" "}
                <span className="text-primary font-bold">We exist to dismantle those boxes.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="py-8 px-6 md:px-10 rounded-2xl bg-gradient-to-r from-primary/10 via-cognitive-visual/10 to-cognitive-auditory/10 border border-primary/20"
              >
                <p className="text-2xl md:text-3xl font-display font-bold text-center text-foreground">
                  SEE is the world&apos;s first{" "}
                  <span className="bg-gradient-to-r from-primary to-cognitive-visual bg-clip-text text-transparent">
                    Neuro-Adaptive Learning Ecosystem
                  </span>
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground"
              >
                We do not simply teach English; we re-engineer the way it is acquired. By synthesizing{" "}
                <span className="text-foreground font-medium">Cognitive Science</span>,{" "}
                <span className="text-foreground font-medium">Artificial Intelligence</span>, and{" "}
                <span className="text-foreground font-medium">Immersive Virtual Reality</span>, we have built a platform that understands{" "}
                <em className="text-primary">how you learn</em> before it teaches you <em>what to learn</em>.
              </motion.p>
            </div>

            {/* Three Audience Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-cognitive-visual/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-cognitive-visual/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-cognitive-visual" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground">For Practitioners</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A pedagogical revolution grounded in Psycholinguistics and Neuro-Linguistic Programming (NLP), reducing anxiety and optimizing retention through personalized cognitive pathways.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground">For Investors</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A scalable, high-impact solution addressing a $60+ billion market gap, utilizing proprietary algorithms to democratize elite-level education.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-success/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground">For Policy Makers</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A bridge to workforce development and social equity, turning underserved communities into hubs of global opportunity.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Movement Statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-16 text-center"
            >
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                We are more than an EdTech startup. We are a movement to unlock the latent potential of millions, proving that when you align technology with the architecture of the human mind,{" "}
                <span className="text-foreground font-medium">learning is no longer a struggle—it is a transformation.</span>
              </p>
              
              <div className="inline-flex flex-col items-center gap-2 mt-8">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">Welcome to the Future of Fluency</span>
                <span className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-cognitive-visual to-success bg-clip-text text-transparent">
                  Welcome to SEE
                </span>
              </div>
            </motion.div>

            {/* Three Pillars Visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-20 pt-16 border-t border-border/50"
            >
              <h3 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-12">
                The Three Pillars of SEE
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                {/* Pillar 1: Science */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-cognitive-visual/30 to-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cognitive-visual to-primary flex items-center justify-center shadow-lg">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h4 className="font-display text-xl font-bold text-foreground mb-2">The Brain</h4>
                  <p className="text-sm text-muted-foreground">
                    Neuro-Linguistic Programming & Cognitive Science
                  </p>
                </motion.div>

                {/* Pillar 2: Technology */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-cognitive-auditory/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-cognitive-auditory flex items-center justify-center shadow-lg">
                      <Eye className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h4 className="font-display text-xl font-bold text-foreground mb-2">The Lens</h4>
                  <p className="text-sm text-muted-foreground">
                    AI & VR Immersive Technology
                  </p>
                </motion.div>

                {/* Pillar 3: Community */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-success/30 to-warning/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-success to-warning flex items-center justify-center shadow-lg">
                      <HandHeart className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h4 className="font-display text-xl font-bold text-foreground mb-2">The Hand</h4>
                  <p className="text-sm text-muted-foreground">
                    Global Community Empowerment
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Why SEE Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built on decades of psycholinguistic research, designed for real-world results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className={`w-7 h-7 ${feature.color}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Walkthrough Section */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
                <Play className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Interactive Demo</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                See How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Take a quick tour of your learning journey with SEE.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Steps Navigation */}
              <div className="space-y-4">
                {walkthroughSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => {
                        setActiveStep(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                        activeStep === index
                          ? 'bg-card border-primary shadow-lg'
                          : 'bg-card/50 border-border/50 hover:border-border hover:bg-card/80'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                          activeStep === index ? 'scale-110' : ''
                        }`}>
                          <step.icon className={`w-6 h-6 ${step.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">Step {step.id}</span>
                            {activeStep > index && (
                              <Check className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <h3 className={`font-semibold mb-1 transition-colors ${
                            activeStep === index ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                          }`}>
                            {step.title}
                          </h3>
                          <AnimatePresence mode="wait">
                            {activeStep === index && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-sm text-muted-foreground"
                              >
                                {step.description}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <ArrowRight className={`w-5 h-5 flex-shrink-0 transition-all ${
                          activeStep === index ? 'text-primary translate-x-1' : 'text-muted-foreground/30'
                        }`} />
                      </div>
                    </button>
                  </motion.div>
                ))}

                {/* Controls */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveStep(0);
                      setIsAutoPlaying(true);
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </Button>
                  <Progress 
                    value={((activeStep + 1) / walkthroughSteps.length) * 100} 
                    className="w-32 h-2"
                  />
                </div>
              </div>

              {/* Demo Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="sticky top-24"
              >
                <Card className="border-border/50 bg-card overflow-hidden shadow-2xl">
                  <div className="bg-muted/50 px-4 py-3 border-b border-border/50 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-warning/60" />
                      <div className="w-3 h-3 rounded-full bg-success/60" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">SEE Learning Platform</span>
                  </div>
                  
                  <CardContent className="p-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 min-h-[400px] flex flex-col"
                      >
                        {/* Assessment Demo */}
                        {walkthroughSteps[activeStep].demo === 'assessment' && (
                          <div className="space-y-6">
                            <div className="text-center mb-4">
                              <h4 className="font-semibold text-lg text-foreground mb-2">Learning Style Assessment</h4>
                              <p className="text-sm text-muted-foreground">How do you prefer to learn new concepts?</p>
                            </div>
                            <div className="space-y-3">
                              {['Visual diagrams & charts', 'Listening to explanations', 'Reading & writing notes', 'Hands-on practice'].map((option, i) => (
                                <motion.div
                                  key={option}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                    i === 0 ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      i === 0 ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}>
                                      {i === 0 && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <span className="text-sm">{option}</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className="h-2 bg-primary/20 rounded-full overflow-hidden origin-left"
                            >
                              <div className="h-full w-1/4 bg-primary rounded-full" />
                            </motion.div>
                          </div>
                        )}

                        {/* Learning Path Demo */}
                        {walkthroughSteps[activeStep].demo === 'path' && (
                          <div className="space-y-6">
                            <div className="text-center mb-4">
                              <h4 className="font-semibold text-lg text-foreground mb-2">Your Learning Path</h4>
                              <p className="text-sm text-muted-foreground">Personalized for visual learners</p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              {['Foundations', 'Vocabulary', 'Grammar', 'Conversation', 'Fluency'].map((level, i) => (
                                <motion.div
                                  key={level}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.15 }}
                                  className="flex items-center gap-4 w-full max-w-xs"
                                >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                    i === 0 ? 'bg-success text-success-foreground' :
                                    i === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {i < 1 ? <Check className="w-5 h-5" /> : i + 1}
                                  </div>
                                  <div className="flex-1">
                                    <span className={`text-sm font-medium ${i <= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {level}
                                    </span>
                                  </div>
                                  {i === 1 && (
                                    <span className="text-xs text-primary font-medium">Current</span>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Lesson Demo */}
                        {walkthroughSteps[activeStep].demo === 'lesson' && (
                          <div className="space-y-6">
                            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                              <div className="flex items-center gap-2 text-success mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">Adaptive Content</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Based on your visual learning style, we're showing you infographics and diagrams.
                              </p>
                            </div>
                            <Card className="border-border">
                              <CardContent className="p-4">
                                <div className="aspect-video bg-gradient-to-br from-primary/20 to-cognitive-visual/20 rounded-lg flex items-center justify-center mb-4">
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center"
                                  >
                                    <Play className="w-8 h-8 text-primary ml-1" />
                                  </motion.div>
                                </div>
                                <h5 className="font-medium mb-1">Interactive Vocabulary</h5>
                                <p className="text-xs text-muted-foreground">Tap words to see visual definitions</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Community Demo */}
                        {walkthroughSteps[activeStep].demo === 'community' && (
                          <div className="space-y-4">
                            <div className="text-center mb-2">
                              <h4 className="font-semibold text-lg text-foreground mb-1">Find Learning Partners</h4>
                              <p className="text-xs text-muted-foreground">Matched by learning style & level</p>
                            </div>
                            {[
                              { name: 'Ana M.', style: 'Visual', level: 3, match: 94 },
                              { name: 'Carlos R.', style: 'Visual', level: 3, match: 89 },
                              { name: 'Maria S.', style: 'Mixed', level: 4, match: 82 },
                            ].map((partner, i) => (
                              <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cognitive-visual flex items-center justify-center text-primary-foreground font-bold text-sm">
                                  {partner.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{partner.name}</div>
                                  <div className="text-xs text-muted-foreground">{partner.style} • Level {partner.level}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-success">{partner.match}%</div>
                                  <div className="text-xs text-muted-foreground">match</div>
                                </div>
                              </motion.div>
                            ))}
                            <Button className="w-full gap-2" size="sm">
                              <MessageSquare className="w-4 h-4" />
                              Start Practicing
                            </Button>
                          </div>
                        )}

                        {/* Achievement Demo */}
                        {walkthroughSteps[activeStep].demo === 'achievement' && (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', duration: 0.8 }}
                              className="w-24 h-24 rounded-full bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center mb-6 shadow-lg"
                            >
                              <Award className="w-12 h-12 text-warning-foreground" />
                            </motion.div>
                            <motion.h4
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="font-bold text-xl text-foreground mb-2"
                            >
                              First Milestone! 🎉
                            </motion.h4>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-muted-foreground mb-4"
                            >
                              You've completed 5 lessons!
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }}
                              className="flex items-center gap-6"
                            >
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">250</div>
                                <div className="text-xs text-muted-foreground">XP Earned</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-success">5</div>
                                <div className="text-xs text-muted-foreground">Day Streak</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-warning">3</div>
                                <div className="text-xs text-muted-foreground">Badges</div>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* CTA under demo */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-6"
                >
                  <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
                    Try It Yourself
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Stories of Transformation
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands who've discovered a new way to learn.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="h-full border-border/50 bg-gradient-to-b from-card to-card/50">
                    <CardContent className="p-6">
                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <p className="text-foreground mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      
                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cognitive-visual flex items-center justify-center text-primary-foreground font-bold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-24">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-cognitive-visual">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                </div>
                
                <CardContent className="relative p-12 text-center text-primary-foreground">
                  <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                    Ready to Transform Your Learning?
                  </h2>
                  <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                    Join SEE today and discover how learning can feel natural, engaging, and truly personalized to you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={() => navigate('/auth')}
                      className="text-lg px-8 bg-white text-primary hover:bg-white/90"
                    >
                      Start Your Journey
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                  <p className="text-sm text-primary-foreground/60 mt-6">
                    Free to start • No credit card required
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <SEELogo size={36} showText animated={false} theme="auto" />
              
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
              
              <p className="text-sm text-muted-foreground">
                © 2024 SEE. Students for Education Empowerment.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
