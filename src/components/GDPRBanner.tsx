import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasGDPRConsent, setGDPRConsent, clearAllSEEData } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';

const GDPRBanner = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [hasDecided, setHasDecided] = useState(true);

  useEffect(() => {
    // Check if user has already made a decision
    try {
      const consent = localStorage.getItem('see-gdpr-consent');
      if (consent === null) {
        setHasDecided(false);
        setIsVisible(true);
      }
    } catch {
      // localStorage not available, don't show banner
    }
  }, []);

  const handleAccept = () => {
    setGDPRConsent(true);
    setHasDecided(true);
    setIsVisible(false);
  };

  const handleDelete = () => {
    clearAllSEEData();
    setGDPRConsent(false);
    setHasDecided(true);
    setIsVisible(false);
    // Reload to reset app state
    window.location.reload();
  };

  if (hasDecided || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-card border-b border-border shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">
                {user ? (
                  <>
                    <span className="font-semibold">Logged in:</span> Your learning profile and progress are stored securely on our servers. We also use <span className="font-semibold">localStorage</span> on your device for session preferences.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Guest mode:</span> Your learning profile and progress are saved only in <span className="font-semibold">localStorage</span> on your device. No data is sent to external servers. Sign in to sync your data across devices.
                  </>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                Delete Data
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GDPRBanner;
