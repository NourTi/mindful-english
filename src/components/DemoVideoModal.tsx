import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import P5DemoAnimation from '@/components/P5DemoAnimation';
import seeIntroVideo from '@/assets/see-intro.mp4';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  posterImage?: string;
  showAnimation?: boolean;
}

const DemoVideoModal = ({ 
  isOpen, 
  onClose, 
  videoUrl = seeIntroVideo,
  posterImage = '/placeholder.svg',
  showAnimation = true
}: DemoVideoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAnimationView, setShowAnimationView] = useState(showAnimation);
  const [animationKey, setAnimationKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Demo timeline items to show product features
  const demoFeatures = [
    { time: '0:00', title: 'Welcome & Overview', description: 'Introduction to SEE platform' },
    { time: '0:02', title: 'Immersive Environments', description: 'Airport, café, hospital & more' },
    { time: '0:04', title: 'AI-Powered Learning', description: 'Real-time adaptive scenarios' },
    { time: '0:06', title: 'Cultural Immersion', description: 'Authentic real-world contexts' },
    { time: '0:08', title: 'Your Journey Begins', description: 'Start learning with SEE' },
  ];

  const handlePlayDemo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex flex-col bg-background rounded-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <h3 className="font-mono text-sm text-muted-foreground">
                {showAnimationView ? 'SEE_TRANSFORMATION.anim' : 'SEE_DEMO_v2.0.mp4'}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Video Player Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Main Video / Animation Area */}
              <div className="flex-1 relative bg-[hsl(234_40%_6%)] flex items-center justify-center overflow-hidden">
                {showAnimationView ? (
                  /* P5.js Psychological Transformation Animation */
                  <div className="w-full h-full">
                    <P5DemoAnimation 
                      key={animationKey}
                      autoPlay={false}
                      onComplete={() => {
                        // Animation completed
                      }}
                    />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={posterImage}
                    className="w-full h-full object-contain"
                    controls={false}
                    muted={isMuted}
                    loop
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
                      }
                    }}
                    onEnded={() => setIsPlaying(false)}
                    onClick={handlePlayDemo}
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Animated placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                    
                    {/* Neural network animation background */}
                    <div className="absolute inset-0 overflow-hidden">
                      <svg className="w-full h-full opacity-20" viewBox="0 0 800 600">
                        <title>Neural Network Background</title>
                        {/* Animated nodes */}
                        {[...Array(15)].map((_, i) => (
                          <motion.circle
                            key={i}
                            cx={100 + (i % 5) * 150}
                            cy={100 + Math.floor(i / 5) * 150}
                            r="8"
                            fill="currentColor"
                            className="text-primary"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                        {/* Connecting lines */}
                        {[...Array(10)].map((_, i) => (
                          <motion.line
                            key={`line-${i}`}
                            x1={100 + (i % 5) * 150}
                            y1={100 + Math.floor(i / 5) * 150}
                            x2={100 + ((i + 1) % 5) * 150}
                            y2={100 + Math.floor((i + 1) / 5) * 150}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/30"
                            animate={{
                              opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </svg>
                    </div>

                    {/* Center content */}
                    <div className="relative z-10 text-center px-8">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors"
                        onClick={handlePlayDemo}
                      >
                        {isPlaying ? (
                          <Pause className="w-10 h-10 text-primary" />
                        ) : (
                          <Play className="w-10 h-10 text-primary ml-1" />
                        )}
                      </motion.div>
                      
                      <h4 className="text-2xl font-bold text-foreground mb-2">
                        {isPlaying ? 'Demo Playing...' : 'Watch Product Demo'}
                      </h4>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {isPlaying 
                          ? 'Experience the future of language learning'
                          : 'Click play to see how SEE transforms language learning with AI and VR technology'
                        }
                      </p>

                      {/* Simulated progress during "playback" */}
                      {isPlaying && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 space-y-4"
                        >
                          {demoFeatures.map((feature, i) => {
                            const featureProgress = (i / demoFeatures.length) * 100;
                            const isActive = progress >= featureProgress && progress < featureProgress + 20;
                            const isPast = progress > featureProgress + 20;
                            
                            return (
                              <motion.div
                                key={feature.time}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ 
                                  opacity: isActive || isPast ? 1 : 0.3,
                                  x: 0,
                                  scale: isActive ? 1.05 : 1
                                }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-3 text-left ${isActive ? 'text-primary' : ''}`}
                              >
                                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : isPast ? 'bg-success' : 'bg-muted'}`} />
                                <span className="font-mono text-xs text-muted-foreground">{feature.time}</span>
                                <span className="text-sm font-medium">{feature.title}</span>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Video/Animation controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {/* Progress bar - only for video mode */}
                  {!showAnimationView && (
                    <div className="relative h-1 bg-muted/30 rounded-full mb-4 cursor-pointer group">
                      <motion.div
                        className="absolute h-full bg-primary rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {showAnimationView ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setAnimationKey(prev => prev + 1)}
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={handlePlayDemo}
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </Button>
                          <span className="text-sm text-white/80 font-mono">
                            {Math.floor(progress / 100 * 180 / 60)}:{String(Math.floor(progress / 100 * 180 % 60)).padStart(2, '0')} / 3:00
                          </span>
                        </>
                      )}
                      
                      {/* Toggle between Animation and Video mode */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 text-xs"
                        onClick={() => setShowAnimationView(!showAnimationView)}
                      >
                        {showAnimationView ? 'Switch to Video' : 'Watch Animation'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Settings className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Maximize2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Chapter list */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card/30 p-4 overflow-y-auto">
                <h4 className="font-semibold text-foreground mb-4">Demo Contents</h4>
                <div className="space-y-2">
                  {demoFeatures.map((feature, i) => {
                    const featureProgress = (i / demoFeatures.length) * 100;
                    const isActive = progress >= featureProgress && progress < featureProgress + 20;
                    
                    return (
                      <motion.button
                        key={feature.time}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          isActive 
                            ? 'bg-primary/20 border border-primary/30' 
                            : 'bg-card hover:bg-card/80 border border-transparent'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground">{feature.time}</span>
                          <div>
                            <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                              {feature.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <h5 className="font-semibold text-foreground mb-2">Ready to start?</h5>
                  <p className="text-xs text-muted-foreground mb-3">
                    Begin your neural learning journey today.
                  </p>
                  <Button className="w-full gap-2" onClick={onClose}>
                    <Play className="w-4 h-4" />
                    Get Started Free
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DemoVideoModal;
