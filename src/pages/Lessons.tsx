import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Sparkles, Filter, Search, 
  Play, CheckCircle, Circle, ChevronDown, Eye, 
  Headphones, Hand, ArrowLeft, Bookmark
} from 'lucide-react';
import SEELogo from '@/components/SEELogo';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { sampleLessons } from '@/data/sampleLessons';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { LearningStyle } from '@/types/learning';

// Extended lessons with category and progress data
const lessonsData = [
  { 
    ...sampleLessons.find(l => l.id === 'greetings-intro')!,
    category: 'Speaking',
    progress: 100,
    xp: 50 
  },
  { 
    ...sampleLessons.find(l => l.id === 'restaurant-basics')!,
    category: 'Vocabulary',
    progress: 75,
    xp: 75 
  },
  { 
    id: 'making-plans',
    title: 'Making Plans',
    description: 'Learn how to make appointments and schedule activities.',
    difficulty: 'beginner' as const,
    estimatedMinutes: 6,
    category: 'Grammar',
    progress: 30,
    xp: 60,
    contentVariants: sampleLessons[0].contentVariants,
    semanticAnchors: [],
    assessmentQuestions: []
  },
  { 
    id: 'shopping-convo',
    title: 'Shopping Conversation',
    description: 'Master vocabulary for shopping and transactions.',
    difficulty: 'intermediate' as const,
    estimatedMinutes: 8,
    category: 'Speaking',
    progress: 0,
    xp: 80,
    contentVariants: sampleLessons[0].contentVariants,
    semanticAnchors: [],
    assessmentQuestions: []
  },
  { 
    id: 'describing-people',
    title: 'Describing People',
    description: 'Learn adjectives and phrases to describe appearance and personality.',
    difficulty: 'beginner' as const,
    estimatedMinutes: 5,
    category: 'Vocabulary',
    progress: 0,
    xp: 50,
    contentVariants: sampleLessons[0].contentVariants,
    semanticAnchors: [],
    assessmentQuestions: []
  },
  { 
    id: 'giving-directions',
    title: 'Giving Directions',
    description: 'Learn to give and understand directions in English.',
    difficulty: 'intermediate' as const,
    estimatedMinutes: 7,
    category: 'Speaking',
    progress: 0,
    xp: 70,
    contentVariants: sampleLessons[0].contentVariants,
    semanticAnchors: [],
    assessmentQuestions: []
  },
  { 
    id: 'past-tense',
    title: 'Past Tense Basics',
    description: 'Master regular and irregular past tense verbs.',
    difficulty: 'intermediate' as const,
    estimatedMinutes: 10,
    category: 'Grammar',
    progress: 0,
    xp: 100,
    contentVariants: sampleLessons[0].contentVariants,
    semanticAnchors: [],
    assessmentQuestions: []
  },
  { 
    id: 'business-english',
    title: 'Business English Basics',
    description: 'Essential vocabulary for the workplace.',
    difficulty: 'advanced' as const,
    estimatedMinutes: 12,
    category: 'Vocabulary',
    progress: 0,
    xp: 120,
    contentVariants: sampleLessons[0].contentVariants,
    semanticAnchors: [],
    assessmentQuestions: []
  },
];

const categories = ['All', 'Speaking', 'Vocabulary', 'Grammar'];
const progressFilters = ['All', 'Not Started', 'In Progress', 'Completed', 'Bookmarked'];
const difficultyFilters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const styleConfig: Record<LearningStyle, { icon: React.ReactNode; color: string; bgColor: string }> = {
  visual: { icon: <Eye className="w-5 h-5" />, color: 'text-cognitive-visual', bgColor: 'bg-cognitive-visual/10' },
  auditory: { icon: <Headphones className="w-5 h-5" />, color: 'text-cognitive-auditory', bgColor: 'bg-cognitive-auditory/10' },
  reading: { icon: <BookOpen className="w-5 h-5" />, color: 'text-cognitive-reading', bgColor: 'bg-cognitive-reading/10' },
  kinesthetic: { icon: <Hand className="w-5 h-5" />, color: 'text-cognitive-kinesthetic', bgColor: 'bg-cognitive-kinesthetic/10' },
};

const Lessons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { calculateProfile } = useAssessmentStore();
  const profile = calculateProfile();
  const style = styleConfig[profile.learningStyle];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProgress, setSelectedProgress] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());

  // Fetch bookmarked lessons
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('bookmarked_lessons')
        .select('lesson_id')
        .eq('user_id', user.id);
      
      if (!error && data) {
        setBookmarkedLessons(new Set(data.map(b => b.lesson_id)));
      }
    };
    
    fetchBookmarks();
  }, [user]);

  const toggleBookmark = async (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to bookmark lessons');
      return;
    }
    
    const isBookmarked = bookmarkedLessons.has(lessonId);
    
    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarked_lessons')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);
      
      if (!error) {
        setBookmarkedLessons(prev => {
          const next = new Set(prev);
          next.delete(lessonId);
          return next;
        });
        toast.success('Bookmark removed');
      }
    } else {
      const { error } = await supabase
        .from('bookmarked_lessons')
        .insert({ user_id: user.id, lesson_id: lessonId });
      
      if (!error) {
        setBookmarkedLessons(prev => new Set([...prev, lessonId]));
        toast.success('Lesson bookmarked');
      }
    }
  };

  const filteredLessons = useMemo(() => {
    return lessonsData.filter(lesson => {
      // Search filter
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
      
      // Progress filter
      let matchesProgress = true;
      if (selectedProgress === 'Not Started') matchesProgress = lesson.progress === 0;
      else if (selectedProgress === 'In Progress') matchesProgress = lesson.progress > 0 && lesson.progress < 100;
      else if (selectedProgress === 'Completed') matchesProgress = lesson.progress === 100;
      else if (selectedProgress === 'Bookmarked') matchesProgress = bookmarkedLessons.has(lesson.id);
      
      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'All' || 
        lesson.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesProgress && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedProgress, selectedDifficulty, bookmarkedLessons]);

  const getProgressIcon = (progress: number) => {
    if (progress === 100) return <CheckCircle className="w-4 h-4 text-success" />;
    if (progress > 0) return <Play className="w-4 h-4 text-primary" />;
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const getProgressLabel = (progress: number) => {
    if (progress === 100) return 'Completed';
    if (progress > 0) return `${progress}% complete`;
    return 'Not started';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success border-success/20';
      case 'intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedProgress !== 'All',
    selectedDifficulty !== 'All'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Lessons</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredLessons.length} lessons available
                </p>
              </div>
            </div>
            <SEELogo size={36} variant="icon" animated={false} theme="auto" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Category
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Progress Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Progress
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Progress</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {progressFilters.map((filter) => (
                  <DropdownMenuCheckboxItem
                    key={filter}
                    checked={selectedProgress === filter}
                    onCheckedChange={() => setSelectedProgress(filter)}
                  >
                    {filter}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Difficulty
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {difficultyFilters.map((filter) => (
                  <DropdownMenuCheckboxItem
                    key={filter}
                    checked={selectedDifficulty === filter}
                    onCheckedChange={() => setSelectedDifficulty(filter)}
                  >
                    {filter}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {selectedProgress !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {selectedProgress}
                <button onClick={() => setSelectedProgress('All')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {selectedDifficulty !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('All')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedProgress('All');
                setSelectedDifficulty('All');
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Lessons Grid */}
        <AnimatePresence mode="popLayout">
          {filteredLessons.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    variant="cognitive" 
                    className="group cursor-pointer h-full border-border hover:border-primary/50 transition-all duration-300"
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                  >
                    <CardContent className="p-5 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${style.bgColor}`}>
                          {style.icon}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleBookmark(e, lesson.id)}
                            className={`p-1.5 rounded-full transition-colors ${
                              bookmarkedLessons.has(lesson.id) 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                            }`}
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${bookmarkedLessons.has(lesson.id) ? 'fill-current' : ''}`} 
                            />
                          </button>
                          <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Category Badge */}
                      <Badge variant="secondary" className="w-fit mb-3">
                        {lesson.category}
                      </Badge>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.estimatedMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> +{lesson.xp} XP
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {getProgressIcon(lesson.progress)}
                            {getProgressLabel(lesson.progress)}
                          </span>
                        </div>
                        {lesson.progress > 0 && (
                          <Progress 
                            value={lesson.progress} 
                            size="sm" 
                            indicatorVariant={lesson.progress === 100 ? 'default' : 'cognitive'} 
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No lessons found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedProgress('All');
                  setSelectedDifficulty('All');
                }}
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Lessons;
