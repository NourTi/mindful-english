import { motion } from 'framer-motion';
import { BookOpen, Activity, Heart, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionStats, LearningSession } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';

const SessionAnalytics = () => {
  const stats = getSessionStats();

  const statCards = [
    {
      label: 'Sessions Started',
      value: stats.totalSessions,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Lessons Completed',
      value: stats.completedLessons,
      icon: BookOpen,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Psy Support Used',
      value: stats.psySupportUsed,
      icon: Heart,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Avg Score',
      value: stats.averageScore > 0 ? `${Math.round(stats.averageScore)}%` : 'N/A',
      icon: TrendingUp,
      color: 'text-cognitive-visual',
      bgColor: 'bg-cognitive-visual/10'
    }
  ];

  const getSessionTypeLabel = (type: LearningSession['type']) => {
    switch (type) {
      case 'lesson': return 'Lesson';
      case 'scenario': return 'Scenario';
      case 'chat': return 'Chat Practice';
      case 'assessment': return 'Assessment';
      default: return type;
    }
  };

  const getSessionTypeColor = (type: LearningSession['type']) => {
    switch (type) {
      case 'lesson': return 'bg-primary/10 text-primary';
      case 'scenario': return 'bg-success/10 text-success';
      case 'chat': return 'bg-accent/10 text-accent';
      case 'assessment': return 'bg-cognitive-visual/10 text-cognitive-visual';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No sessions yet. Start learning to see your activity here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSessionTypeColor(session.type)}`}>
                      {getSessionTypeLabel(session.type)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.lessonId ? session.lessonId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : getSessionTypeLabel(session.type)}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {session.psySupportUsed && (
                      <Heart className="w-4 h-4 text-accent" />
                    )}
                    {session.completedAt ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">
                        In Progress
                      </span>
                    )}
                    {session.score !== undefined && (
                      <span className="text-sm font-semibold text-foreground">
                        {session.score}%
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SessionAnalytics;
