import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface DataStreamProps {
  className?: string;
  count?: number;
  direction?: 'vertical' | 'horizontal';
}

const DataStream = ({ className = '', count = 15, direction = 'vertical' }: DataStreamProps) => {
  const streams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: Math.random() * 100,
      speed: 3 + Math.random() * 5,
      delay: Math.random() * 3,
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () => 
        String.fromCharCode(0x30A0 + Math.random() * 96) // Katakana-like characters
      ),
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, [count]);

  if (direction === 'horizontal') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {streams.map((stream) => (
          <motion.div
            key={stream.id}
            className="absolute flex whitespace-nowrap text-xs font-mono text-primary"
            style={{
              top: `${stream.position}%`,
              opacity: stream.opacity,
            }}
            animate={{ x: ['-100%', '100vw'] }}
            transition={{
              duration: stream.speed * 2,
              repeat: Infinity,
              delay: stream.delay,
              ease: 'linear',
            }}
          >
            {stream.chars.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block w-4 text-center"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute flex flex-col text-xs font-mono text-primary"
          style={{
            left: `${stream.position}%`,
            opacity: stream.opacity,
          }}
          animate={{ y: ['-50%', '100vh'] }}
          transition={{
            duration: stream.speed,
            repeat: Infinity,
            delay: stream.delay,
            ease: 'linear',
          }}
        >
          {stream.chars.map((char, i) => (
            <motion.span
              key={i}
              className="leading-tight"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default DataStream;
