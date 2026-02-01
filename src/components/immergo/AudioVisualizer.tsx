import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  type: 'user' | 'ai';
  isActive: boolean;
  audioStream?: MediaStream;
  className?: string;
}

export const AudioVisualizer = ({ type, isActive, audioStream, className }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const resize = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  // Initialize audio analyzer when stream is provided
  useEffect(() => {
    if (!audioStream) {
      setIsInitialized(false);
      return;
    }

    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      
      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);
      
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      setIsInitialized(true);

      return () => {
        source.disconnect();
        audioContext.close();
        analyserRef.current = null;
        dataArrayRef.current = null;
        setIsInitialized(false);
      };
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
    }
  }, [audioStream]);

  // Draw visualization
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Get audio data
      let amplitudes: number[] = [];
      if (isActive && isInitialized && analyserRef.current && dataArrayRef.current) {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        // Sample frequencies for visualization
        for (let i = 0; i < 32; i++) {
          const idx = Math.floor((i / 32) * bufferLength);
          amplitudes.push(dataArray[idx] / 255);
        }
      } else if (isActive) {
        // Simulate active audio
        const time = Date.now() / 1000;
        for (let i = 0; i < 32; i++) {
          amplitudes.push(0.3 + 0.4 * Math.sin(time * 3 + i * 0.3) * Math.random());
        }
      } else {
        // Idle state
        const time = Date.now() / 2000;
        for (let i = 0; i < 32; i++) {
          amplitudes.push(0.05 + 0.02 * Math.sin(time + i * 0.2));
        }
      }

      // Draw bars
      const barCount = amplitudes.length;
      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      // Color based on type
      const primaryColor = type === 'user' 
        ? 'rgba(163, 177, 138, 0.9)' // Green accent
        : 'rgba(138, 163, 177, 0.9)'; // Blue accent
      
      const gradient = ctx.createLinearGradient(0, centerY - 50, 0, centerY + 50);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, primaryColor);

      ctx.fillStyle = gradient;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap) + gap / 2;
        const amplitude = amplitudes[i];
        const barHeight = Math.max(2, amplitude * height * 0.8);
        
        // Round rect
        const radius = barWidth / 2;
        const y = centerY - barHeight / 2;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resize, isActive, isInitialized, type]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative w-full h-full", className)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {/* Label */}
      <div className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-medium opacity-60",
        type === 'user' ? "text-primary" : "text-muted-foreground"
      )}>
        {type === 'user' ? 'You' : 'AI'}
      </div>
    </motion.div>
  );
};
