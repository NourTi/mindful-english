import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

interface LanguageFitnessRadarProps {
  processingSpeed: number; // 0-100
  vocabulary: number; // 0-100
  grammar: number; // 0-100
  listening: number; // 0-100
  speaking: number; // 0-100
  confidence: number; // 0-100
  className?: string;
}

export const LanguageFitnessRadar = ({
  processingSpeed,
  vocabulary,
  grammar,
  listening,
  speaking,
  confidence,
  className,
}: LanguageFitnessRadarProps) => {
  const data: RadarDataPoint[] = useMemo(() => [
    { subject: 'Processing Speed', value: processingSpeed, fullMark: 100 },
    { subject: 'Vocabulary', value: vocabulary, fullMark: 100 },
    { subject: 'Grammar', value: grammar, fullMark: 100 },
    { subject: 'Listening', value: listening, fullMark: 100 },
    { subject: 'Speaking', value: speaking, fullMark: 100 },
    { subject: 'Confidence', value: confidence, fullMark: 100 },
  ], [processingSpeed, vocabulary, grammar, listening, speaking, confidence]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: 11,
              fontFamily: 'Inter, sans-serif'
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Your Profile"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Compact version for dashboard cards
export const CompactRadar = ({
  data,
  size = 200,
}: {
  data: { label: string; value: number }[];
  size?: number;
}) => {
  const chartData = data.map(d => ({
    subject: d.label,
    value: d.value,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width={size} height={size}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
        />
        <Radar
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.4}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default LanguageFitnessRadar;