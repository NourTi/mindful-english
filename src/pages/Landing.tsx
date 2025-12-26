import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Sparkles, Users, Target, Zap, Heart, 
  BookOpen, Globe, ChevronRight, Star, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const Landing = () => {
  const navigate = useNavigate();

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
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#cta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</a>
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
