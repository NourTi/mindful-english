import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Brain, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import NeuralNetwork3D from '@/components/NeuralNetwork3D';

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
        navigate('/complete-profile');
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
      <div className="min-h-screen bg-[hsl(234,40%,6%)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-12 h-12 text-[hsl(187,90%,50%)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(234,40%,6%)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <NeuralNetwork3D className="pointer-events-auto" />
      </Suspense>

      {/* Radial gradient overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, hsl(234 40% 6% / 0.3) 50%, hsl(234 40% 6% / 0.8) 100%)'
      }} />

      {/* Logo & Hero */}
      <motion.div 
        className="mb-8 text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(187,90%,50%)] to-[hsl(187,95%,65%)] flex items-center justify-center text-[hsl(234,40%,6%)] font-bold text-3xl shadow-lg glow-cyan">
            S
          </div>
          <div className="text-left">
            <h1 className="font-display text-4xl font-bold text-[hsl(195,80%,95%)] text-glow-cyan">SEE</h1>
            <p className="text-sm text-[hsl(195,60%,70%)]">Students for Education Empowerment</p>
          </div>
        </div>
        
        <motion.h2 
          className="font-display text-4xl md:text-5xl font-bold text-[hsl(195,80%,95%)] mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-glow-cyan">Rewire Your Brain.</span>{' '}
          <span className="text-[hsl(38,92%,55%)] text-glow-amber">Master English.</span>
        </motion.h2>
        <motion.p 
          className="text-[hsl(195,40%,60%)] max-w-md mx-auto"
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
        className="w-full max-w-4xl relative z-10"
      >
        {/* Path Selection Cards - Show when not authenticated */}
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
            <Card className={`glass-card-cyber h-full cursor-pointer group transition-all ${selectedPath === 'learn' ? 'ring-2 ring-[hsl(187,90%,50%)] shadow-[0_0_30px_hsl(187,90%,50%/0.3)]' : ''}`}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(187,90%,50%)] to-[hsl(187,95%,65%)] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_hsl(187,90%,50%/0.4)] transition-shadow">
                  <Brain className="w-8 h-8 text-[hsl(234,40%,6%)]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[hsl(195,80%,95%)] mb-2">I Want to Learn</h3>
                <p className="text-[hsl(195,40%,60%)] text-sm mb-4">
                  Personalized English learning adapted to your cognitive style
                </p>
                <div className="flex items-center justify-center gap-2 text-[hsl(187,90%,50%)] text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  <span>Start your journey</span>
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
            <Card className={`glass-card-cyber h-full cursor-pointer group transition-all ${selectedPath === 'volunteer' ? 'ring-2 ring-[hsl(38,92%,55%)] shadow-[0_0_30px_hsl(38,92%,55%/0.3)]' : ''}`}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(38,92%,55%)] to-[hsl(38,95%,70%)] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_hsl(38,92%,55%/0.4)] transition-shadow">
                  <Globe className="w-8 h-8 text-[hsl(234,40%,6%)]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[hsl(195,80%,95%)] mb-2">I Want to Volunteer</h3>
                <p className="text-[hsl(195,40%,60%)] text-sm mb-4">
                  Join our global community of educators making a difference
                </p>
                <div className="flex items-center justify-center gap-2 text-[hsl(38,92%,55%)] text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Make an impact</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Auth Form */}
        <div ref={formRef}>
          <Card className="glass-card-cyber max-w-md mx-auto">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-display text-[hsl(195,80%,95%)]">
                {isLogin ? 'Welcome Back' : selectedPath === 'volunteer' ? 'Join as Volunteer' : 'Start Your Journey'}
              </CardTitle>
              <CardDescription className="text-[hsl(195,40%,60%)]">
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
              className="w-full mb-4 bg-[hsl(234,30%,15%)] border-[hsl(234,25%,25%)] text-[hsl(195,80%,95%)] hover:bg-[hsl(234,30%,20%)] hover:border-[hsl(187,90%,50%)/50]"
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
                <span className="w-full border-t border-[hsl(234,25%,25%)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[hsl(234,35%,10%)] px-2 text-[hsl(195,30%,50%)]">
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
                    <Label htmlFor="name" className="text-[hsl(195,60%,85%)]">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)] focus:ring-[hsl(187,90%,50%)/30]"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(195,60%,85%)]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)] focus:ring-[hsl(187,90%,50%)/30]"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[hsl(195,60%,85%)]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)] focus:ring-[hsl(187,90%,50%)/30]"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[hsl(187,90%,50%)] to-[hsl(187,95%,60%)] text-[hsl(234,40%,6%)] font-semibold hover:from-[hsl(187,90%,55%)] hover:to-[hsl(187,95%,65%)] shadow-lg hover:shadow-[0_0_30px_hsl(187,90%,50%/0.4)]" 
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
                className="text-sm text-[hsl(195,40%,60%)] hover:text-[hsl(187,90%,50%)] transition-colors"
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
        className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[hsl(195,40%,60%)] relative z-10"
      >
        <span className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[hsl(187,90%,50%)]" /> Adaptive Learning
        </span>
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[hsl(38,92%,55%)]" /> Personalized Content
        </span>
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[hsl(187,90%,50%)]" /> Global Community
        </span>
      </motion.div>
    </div>
  );
};

export default Auth;
