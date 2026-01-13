import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Brain, Zap, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { BackgroundPaths } from '@/components/ui/background-paths';
import SEELogo from '@/components/SEELogo';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'learn' | 'volunteer' | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      const nameResult = nameSchema.safeParse(name);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate('/dashboard');
      }
    } else {
      const { error } = await signUp(email, password, name);
      if (!error) {
        navigate('/complete-profile', { state: { isVolunteer: selectedPath === 'volunteer' } });
      }
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    if (signInWithGoogle) {
      await signInWithGoogle();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <BackgroundPaths title="">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Logo & Hero */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <SEELogo size={64} showText animated />
          </div>
          
          <motion.h2 
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-primary">Rewire Your Brain.</span>{' '}
            <span className="text-secondary">Master English.</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Neuro-adaptive learning powered by cognitive science
          </motion.p>
        </motion.div>

        {/* Main Content - Two paths or Auth form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full"
        >
          {/* Path Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Learn Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => {
                setSelectedPath('learn');
                setIsLogin(false);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <Card className={`h-full cursor-pointer group transition-all duration-300 relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 ${
                selectedPath === 'learn' 
                  ? 'ring-2 ring-primary shadow-glow' 
                  : 'hover:border-primary/30'
              }`}>
                {selectedPath === 'learn' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                )}
                {selectedPath === 'learn' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                )}
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div 
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg transition-all duration-300 ${
                      selectedPath === 'learn' ? 'shadow-glow scale-110' : 'group-hover:shadow-soft'
                    }`}
                    animate={selectedPath === 'learn' ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </motion.div>
                  <h3 className={`font-display text-2xl font-bold mb-2 transition-colors duration-300 ${
                    selectedPath === 'learn' ? 'text-primary' : 'text-foreground'
                  }`}>I Want to Learn</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Personalized English learning adapted to your cognitive style
                  </p>
                  <div className={`flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 text-primary`}>
                    <Zap className="w-4 h-4" />
                    <span>{selectedPath === 'learn' ? 'Selected!' : 'Start your journey'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Volunteer Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => {
                setSelectedPath('volunteer');
                setIsLogin(false);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <Card className={`h-full cursor-pointer group transition-all duration-300 relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 ${
                selectedPath === 'volunteer' 
                  ? 'ring-2 ring-secondary shadow-[0_0_40px_hsl(var(--secondary)/0.4)]' 
                  : 'hover:border-secondary/30'
              }`}>
                {selectedPath === 'volunteer' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-secondary-foreground" />
                  </motion.div>
                )}
                {selectedPath === 'volunteer' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none" />
                )}
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div 
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg transition-all duration-300 ${
                      selectedPath === 'volunteer' ? 'shadow-[0_0_40px_hsl(var(--secondary)/0.6)] scale-110' : 'group-hover:shadow-soft'
                    }`}
                    animate={selectedPath === 'volunteer' ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Globe className="w-8 h-8 text-secondary-foreground" />
                  </motion.div>
                  <h3 className={`font-display text-2xl font-bold mb-2 transition-colors duration-300 ${
                    selectedPath === 'volunteer' ? 'text-secondary' : 'text-foreground'
                  }`}>I Want to Volunteer</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Join our global community of educators making a difference
                  </p>
                  <div className={`flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 text-secondary`}>
                    <Sparkles className="w-4 h-4" />
                    <span>{selectedPath === 'volunteer' ? 'Selected!' : 'Make an impact'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Auth Form */}
          <div ref={formRef}>
            <Card className="max-w-md mx-auto bg-card/90 backdrop-blur-md border-border/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-display text-foreground">
                  {isLogin ? 'Welcome Back' : selectedPath === 'volunteer' ? 'Join as Volunteer' : 'Start Your Journey'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {isLogin 
                    ? 'Sign in to continue your learning' 
                    : 'Create your neuro-adaptive learning profile'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Google Sign In */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mb-4"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="name">Your Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero"
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : 'Already have an account? Sign in'
                    }
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Adaptive Learning
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" /> Personalized Content
          </span>
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Global Community
          </span>
        </motion.div>
      </div>
    </BackgroundPaths>
  );
};

export default Auth;
