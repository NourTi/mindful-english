import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Sparkles, Users, Target, Zap, Heart, 
  BookOpen, Globe, ChevronRight, Star, Play, Check,
  MessageSquare, Award, ArrowRight, Eye, Cpu,
  Headphones, Wifi, Shield, Layers, Activity,
  Send, Mail, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEELogo from '@/components/SEELogo';
import NeuralNetwork3D from '@/components/NeuralNetwork3D';
import CyberGrid from '@/components/CyberGrid';
import DataStream from '@/components/DataStream';
import HolographicCard from '@/components/HolographicCard';
import VRMockup from '@/components/VRMockup';
import GlitchText from '@/components/GlitchText';
import AIBrainVisualizer from '@/components/AIBrainVisualizer';
import VRScenePreview from '@/components/VRScenePreview';
import DemoVideoModal from '@/components/DemoVideoModal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { isOnboardingComplete } from '@/lib/onboardingEngine';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Brain,
    title: 'Neural Adaptation',
    description: 'AI algorithms that evolve with your brain patterns, creating a unique learning pathway.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    glowColor: 'cyan' as const,
  },
  {
    icon: Eye,
    title: 'Immersive VR',
    description: 'Step into virtual worlds where language becomes an experiential adventure.',
    color: 'text-cognitive-visual',
    bgColor: 'bg-cognitive-visual/10',
    glowColor: 'purple' as const,
  },
  {
    icon: Activity,
    title: 'Real-time Biometrics',
    description: 'Monitor cognitive load and emotional state to optimize learning flow.',
    color: 'text-success',
    bgColor: 'bg-success/10',
    glowColor: 'green' as const,
  },
  {
    icon: Layers,
    title: 'Multi-Modal Learning',
    description: 'Engage all senses with synchronized visual, auditory, and kinesthetic content.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    glowColor: 'amber' as const,
  },
];

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Neuroscience Researcher',
    avatar: 'SC',
    content: 'The neural adaptation system is years ahead of anything I\'ve seen in EdTech. It\'s like having a brain-computer interface for learning.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'VR Developer',
    avatar: 'MR',
    content: 'Finally, someone got VR learning right. The immersion level is incredible - I forget I\'m even in a lesson.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'AI Ethics Lead',
    avatar: 'AP',
    content: 'Thoughtful AI implementation that respects user autonomy while delivering personalized experiences.',
    rating: 5,
  },
];

const stats = [
  { value: '50K+', label: 'Neural Profiles', icon: Brain },
  { value: '99.2%', label: 'Sync Rate', icon: Wifi },
  { value: '4.9', label: 'User Rating', icon: Star },
  { value: '∞', label: 'Possibilities', icon: Sparkles },
];

const techStack = [
  { icon: Cpu, label: 'Neural Networks', description: 'Deep learning models for pattern recognition' },
  { icon: Eye, label: 'Computer Vision', description: 'Real-time gaze tracking & attention mapping' },
  { icon: Headphones, label: 'Spatial Audio', description: '3D soundscapes for immersive learning' },
  { icon: Shield, label: 'Privacy-First', description: 'End-to-end encrypted cognitive data' },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // No longer auto-redirect - let Landing be the proper landing page

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden cyber-scanline">
      {/* Ambient backgrounds */}
      <CyberGrid variant="ambient" />
      <DataStream count={20} className="opacity-20" />
      
      {/* Floating cursor glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <SEELogo size={44} showText animated theme="auto" />
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Technology', 'Experience', 'Community', 'Research'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="gap-2 neon-border bg-primary/10 hover:bg-primary/20 text-primary">
              <Zap className="w-4 h-4" />
              Initialize
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
          <CyberGrid variant="floor" />
          
          <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-success"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-mono text-primary">NEURAL_LINK_v2.0</span>
                  <span className="text-xs text-muted-foreground">// BETA ACCESS</span>
                </motion.div>
                
                {/* Main headline */}
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-foreground">The Future of</span>
                  <br />
                  <GlitchText as="span" className="gradient-text-cyber text-glow-cyan" glitchIntensity="low">
                    Language Learning
                  </GlitchText>
                  <br />
                  <span className="text-foreground">is Here</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Experience <span className="text-primary">cognitive enhancement</span> through 
                  AI-powered neural adaptation and <span className="text-accent">immersive VR</span> environments. 
                  Your brain, amplified.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')} 
                    className="gap-2 text-lg px-8 glow-cyan bg-primary hover:bg-primary/90"
                  >
                    <Play className="w-5 h-5" />
                    Begin Neural Sync
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 text-lg px-8 border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                    onClick={() => setIsDemoOpen(true)}
                  >
                    <Eye className="w-5 h-5" />
                    Watch Demo
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center group"
                    >
                      <stat.icon className="w-4 h-4 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Hero Visual - VR Interface Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <VRMockup variant="interface" />
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-8 -left-8 p-4 rounded-2xl glass-card-cyber neon-border"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Cognitive Load</div>
                      <div className="text-sm font-mono text-success">OPTIMAL</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -right-4 p-4 rounded-2xl glass-card-cyber neon-border"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-accent" />
                    <div>
                      <div className="text-xs text-muted-foreground">Learning Rate</div>
                      <div className="text-sm font-mono text-primary">+147%</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="text-sm font-mono text-primary mb-4 block">// CORE_TECHNOLOGY</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-foreground">Powered by</span>
                <br />
                <span className="gradient-text">Advanced Neural Architecture</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Four pillars of innovation working in harmony to unlock your cognitive potential.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Features list */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HolographicCard
                      glowColor={feature.glowColor}
                      className={`p-6 cursor-pointer transition-all duration-300 ${
                        activeFeature === index ? 'scale-[1.02]' : 'opacity-70 hover:opacity-100'
                      }`}
                      interactive={false}
                    >
                      <button
                        onClick={() => setActiveFeature(index)}
                        className="w-full text-left flex items-start gap-4"
                      >
                        <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className={`w-7 h-7 ${feature.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground mb-1">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                        {activeFeature === index && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"
                          />
                        )}
                      </button>
                    </HolographicCard>
                  </motion.div>
                ))}
              </div>

              {/* AI Brain Visualizer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[500px]"
              >
                <AIBrainVisualizer isActive={true} />
              </motion.div>
            </div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur text-center group hover:border-primary/30 transition-all"
                >
                  <tech.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-1">{tech.label}</h4>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Experience Section - VR Demo */}
        <section id="experience" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <NeuralNetwork3D className="opacity-30" />
            </Suspense>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-mono text-accent mb-4 block">// IMMERSIVE_EXPERIENCE</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-foreground">Step Into</span>
                <br />
                <span className="gradient-text-accent text-glow-amber">Virtual Reality</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Language learning transcends screens. Experience full cognitive immersion in our VR environments.
              </p>
            </motion.div>

            {/* Interactive 3D VR Scene Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <Suspense fallback={
                <div className="w-full h-[500px] rounded-2xl bg-card/50 animate-pulse flex items-center justify-center">
                  <div className="text-muted-foreground">Loading 3D Scene...</div>
                </div>
              }>
                <VRScenePreview />
              </Suspense>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <VRMockup variant="headset" className="mx-auto" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {[
                  { title: 'Contextual Scenarios', desc: 'Practice ordering coffee in Paris or negotiating in Tokyo - all from your living room.', icon: Globe },
                  { title: 'Emotional Recognition', desc: 'AI monitors your stress levels and adjusts difficulty in real-time for optimal learning.', icon: Heart },
                  { title: 'Muscle Memory Training', desc: 'Kinesthetic feedback helps pronunciation become second nature.', icon: Zap },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}

                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="gap-2 mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Headphones className="w-5 h-5" />
                  Request VR Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community/Testimonials Section */}
        <section id="community" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-mono text-success mb-4 block">// COMMUNITY_FEEDBACK</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">Pioneers of the</span>
                <br />
                <span className="gradient-text">Neural Revolution</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hear from researchers, developers, and early adopters shaping the future.
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
                  <HolographicCard 
                    glowColor={['cyan', 'purple', 'amber'][index] as 'cyan' | 'purple' | 'amber'}
                    className="p-6 h-full"
                  >
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-foreground mb-6 leading-relaxed text-sm">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </HolographicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <CyberGrid variant="wall" className="opacity-20" />
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <HolographicCard glowColor="cyan" className="p-12 text-center" interactive={false}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-primary/30 flex items-center justify-center"
                >
                  <Brain className="w-10 h-10 text-primary" />
                </motion.div>
                
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-foreground">Ready to</span>
                  <br />
                  <span className="gradient-text text-glow-cyan">Upgrade Your Mind?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join the next evolution of human learning. Your cognitive transformation begins now.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')}
                    className="text-lg px-8 glow-cyan bg-primary hover:bg-primary/90"
                  >
                    Initialize Neural Link
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6 font-mono">
                  FREE_ACCESS // NO_CREDIT_CARD // INSTANT_ACTIVATION
                </p>
              </HolographicCard>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="research" className="py-24 bg-gradient-to-b from-background to-card/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <HolographicCard glowColor="cyan" className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">Research Updates</h3>
                      <p className="text-sm text-muted-foreground">Weekly cognitive insights</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Get early access to breakthroughs in neural learning, AI developments, and exclusive beta features.
                  </p>
                  
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input 
                        type="email" 
                        placeholder="neural@link.dev"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all font-mono text-sm"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full neon-border bg-primary/10 hover:bg-primary/20 text-primary">
                      Subscribe
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </HolographicCard>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <HolographicCard glowColor="amber" className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">Get in Touch</h3>
                      <p className="text-sm text-muted-foreground">Research & partnerships</p>
                    </div>
                  </div>
                  
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all text-sm"
                      required
                    />
                    <input 
                      type="email" 
                      placeholder="Email address"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all text-sm"
                      required
                    />
                    <textarea 
                      placeholder="Your message..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all resize-none text-sm"
                      required
                    />
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </HolographicCard>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <SEELogo size={32} showText={false} animated theme="auto" />
              <span className="font-mono text-sm text-muted-foreground">
                SEE_NEURAL_v2.0 // © 2024
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Research', 'API'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <DemoVideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};

export default Landing;
