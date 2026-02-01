import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { loadSeeProgress } from '@/lib/seeData';

interface GrowthBarProps {
  currentXP: number;
  className?: string;
}

export function GrowthBar({ currentXP, className = '' }: GrowthBarProps) {
  const progressData = loadSeeProgress();

  const { currentLevel, nextLevel, progressPercent } = useMemo(() => {
    const levels = progressData.levels;
    
    // Find current level (highest level where requiredXP <= currentXP)
    let current = levels[0];
    let next = levels[1] || null;
    
    for (let i = 0; i < levels.length; i++) {
      if (currentXP >= levels[i].requiredXP) {
        current = levels[i];
        next = levels[i + 1] || null;
      } else {
        break;
      }
    }
    
    // Calculate progress to next level
    let percent = 100;
    if (next) {
      const xpIntoLevel = currentXP - current.requiredXP;
      const xpNeeded = next.requiredXP - current.requiredXP;
      percent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));
    }
    
    return {
      currentLevel: current,
      nextLevel: next,
      progressPercent: percent,
    };
  }, [currentXP, progressData]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TrendingUp className="w-4 h-4 text-primary" />
      <div className="flex-1 min-w-[120px]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-foreground">
            Level {currentLevel.level} – {currentLevel.label}
          </span>
          {nextLevel && (
            <span className="text-muted-foreground">
              {currentXP}/{nextLevel.requiredXP} XP
            </span>
          )}
        </div>
        <Progress 
          value={progressPercent} 
          size="sm" 
          className="h-2"
          indicatorVariant="cognitive"
        />
      </div>
    </div>
  );
}
