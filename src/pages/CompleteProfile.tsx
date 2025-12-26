import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Calendar, MapPin, Phone, MessageCircle, Heart, Check, ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import NeuralNetwork3D from '@/components/NeuralNetwork3D';

interface LocationState {
  isVolunteer?: boolean;
}

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get volunteer selection from navigation state
  const locationState = location.state as LocationState | null;
  const initialVolunteer = locationState?.isVolunteer ?? false;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    address: '',
    phone_number: '',
    whatsapp_number: '',
    marital_status: '',
    is_volunteer: initialVolunteer,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address,
          phone_number: formData.phone_number,
          whatsapp_number: formData.whatsapp_number,
          marital_status: formData.marital_status,
          is_volunteer: formData.is_volunteer,
          profile_completed: true,
          name: `${formData.first_name} ${formData.last_name}`.trim(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile completed!',
        description: 'Welcome to SEE. Let\'s start your learning journey.',
      });

      navigate('/assessment');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
        <NeuralNetwork3D className="pointer-events-none opacity-40" />
      </Suspense>

      {/* Overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, hsl(234 40% 6% / 0.5) 50%, hsl(234 40% 6% / 0.9) 100%)'
      }} />

      {/* Header */}
      <motion.div 
        className="mb-8 text-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[hsl(195,80%,95%)] mb-2">
          Complete Your <span className="text-[hsl(187,90%,50%)] text-glow-cyan">Profile</span>
        </h1>
        <p className="text-[hsl(195,40%,60%)]">
          Help us personalize your learning experience
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="glass-card-cyber">
          <CardHeader>
            <CardTitle className="text-xl text-[hsl(195,80%,95%)]">Personal Information</CardTitle>
            <CardDescription className="text-[hsl(195,40%,60%)]">
              This information helps us create a better learning path for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-[hsl(195,60%,85%)]">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                    <Input
                      id="first_name"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-[hsl(195,60%,85%)]">Last Name</Label>
                  <Input
                    id="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)]"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-[hsl(195,60%,85%)]">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] focus:border-[hsl(187,90%,50%)]"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[hsl(195,60%,85%)]">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                  <Input
                    id="address"
                    placeholder="123 Main St, City, Country"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)]"
                  />
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-[hsl(195,60%,85%)]">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                    <Input
                      id="phone_number"
                      placeholder="+1 234 567 8900"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number" className="text-[hsl(195,60%,85%)]">WhatsApp Number</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(195,30%,50%)]" />
                    <Input
                      id="whatsapp_number"
                      placeholder="+1 234 567 8900"
                      value={formData.whatsapp_number}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      className="pl-10 bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] placeholder:text-[hsl(195,20%,40%)] focus:border-[hsl(187,90%,50%)]"
                    />
                  </div>
                </div>
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <Label htmlFor="marital_status" className="text-[hsl(195,60%,85%)]">Marital Status</Label>
                <Select
                  value={formData.marital_status}
                  onValueChange={(value) => handleInputChange('marital_status', value)}
                >
                  <SelectTrigger className="bg-[hsl(234,30%,12%)] border-[hsl(234,25%,20%)] text-[hsl(195,80%,95%)] focus:border-[hsl(187,90%,50%)]">
                    <Heart className="w-4 h-4 mr-2 text-[hsl(195,30%,50%)]" />
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(234,35%,12%)] border-[hsl(234,25%,20%)]">
                    <SelectItem value="single" className="text-[hsl(195,80%,95%)]">Single</SelectItem>
                    <SelectItem value="married" className="text-[hsl(195,80%,95%)]">Married</SelectItem>
                    <SelectItem value="divorced" className="text-[hsl(195,80%,95%)]">Divorced</SelectItem>
                    <SelectItem value="widowed" className="text-[hsl(195,80%,95%)]">Widowed</SelectItem>
                    <SelectItem value="prefer_not_to_say" className="text-[hsl(195,80%,95%)]">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Volunteer Checkbox */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-[hsl(38,92%,55%)/10] border border-[hsl(38,92%,55%)/30]">
                <Checkbox
                  id="is_volunteer"
                  checked={formData.is_volunteer}
                  onCheckedChange={(checked) => handleInputChange('is_volunteer', checked as boolean)}
                  className="mt-1 border-[hsl(38,92%,55%)] data-[state=checked]:bg-[hsl(38,92%,55%)] data-[state=checked]:border-[hsl(38,92%,55%)]"
                />
                <div className="space-y-1">
                  <Label htmlFor="is_volunteer" className="text-[hsl(38,92%,55%)] font-semibold cursor-pointer">
                    I want to join the SEE Volunteer Program
                  </Label>
                  <p className="text-sm text-[hsl(195,40%,60%)]">
                    Help others learn English while developing your teaching and leadership skills
                  </p>
                </div>
              </div>

              {/* Submit Button */}
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
                    <Brain className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Complete Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Skip Option */}
              <button
                type="button"
                onClick={() => navigate('/assessment')}
                className="w-full text-center text-sm text-[hsl(195,40%,60%)] hover:text-[hsl(187,90%,50%)] transition-colors"
              >
                Skip for now
              </button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
