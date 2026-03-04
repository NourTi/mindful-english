import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Search, ArrowLeft, Brain, Clock, 
  Sparkles, Filter, ChevronDown, RotateCcw, 
  CheckCircle, AlertCircle, Star, Calendar,
  Mic, MicOff, Volume2, Loader2
} from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistanceToNow, differenceInHours, addHours } from 'date-fns';

interface VocabularyWord {
  id: string;
  word: string;
  context: string | null;
  mastery_level: number;
  last_reviewed_at: string;
  times_reviewed: number;
  created_at: string;
}

// Spaced repetition intervals (in hours)
const REVIEW_INTERVALS = [1, 4, 24, 72, 168, 336, 720]; // 1h, 4h, 1d, 3d, 1w, 2w, 1m

const masteryFilters = ['All', 'New', 'Learning', 'Reviewing', 'Mastered'];

const Vocabulary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMastery, setSelectedMastery] = useState('All');
  const [reviewingWord, setReviewingWord] = useState<VocabularyWord | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('vocabulary_learned')
        .select('*')
        .eq('user_id', user.id)
        .order('last_reviewed_at', { ascending: true });

      if (error) {
        toast.error('Failed to load vocabulary');
        console.error(error);
      } else {
        setWords(data || []);
      }
      setLoading(false);
    };

    fetchWords();
  }, [user]);

  const getMasteryLabel = (level: number) => {
    if (level === 0) return 'New';
    if (level <= 2) return 'Learning';
    if (level <= 5) return 'Reviewing';
    return 'Mastered';
  };

  const getMasteryColor = (level: number) => {
    if (level === 0) return 'bg-muted text-muted-foreground';
    if (level <= 2) return 'bg-warning/10 text-warning border-warning/20';
    if (level <= 5) return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-success/10 text-success border-success/20';
  };

  const getNextReviewTime = (word: VocabularyWord) => {
    const intervalIndex = Math.min(word.mastery_level, REVIEW_INTERVALS.length - 1);
    const intervalHours = REVIEW_INTERVALS[intervalIndex];
    const lastReview = new Date(word.last_reviewed_at);
    return addHours(lastReview, intervalHours);
  };

  const isDueForReview = (word: VocabularyWord) => {
    const nextReview = getNextReviewTime(word);
    return new Date() >= nextReview;
  };

  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (word.context?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      let matchesMastery = true;
      if (selectedMastery === 'New') matchesMastery = word.mastery_level === 0;
      else if (selectedMastery === 'Learning') matchesMastery = word.mastery_level > 0 && word.mastery_level <= 2;
      else if (selectedMastery === 'Reviewing') matchesMastery = word.mastery_level > 2 && word.mastery_level <= 5;
      else if (selectedMastery === 'Mastered') matchesMastery = word.mastery_level > 5;
      
      return matchesSearch && matchesMastery;
    });
  }, [words, searchQuery, selectedMastery]);

  const wordsDueForReview = useMemo(() => {
    return words.filter(isDueForReview);
  }, [words]);

  const stats = useMemo(() => ({
    total: words.length,
    mastered: words.filter(w => w.mastery_level > 5).length,
    learning: words.filter(w => w.mastery_level > 0 && w.mastery_level <= 5).length,
    dueForReview: wordsDueForReview.length
  }), [words, wordsDueForReview]);

  const handleReview = async (word: VocabularyWord, correct: boolean) => {
    if (!user) return;

    const newMastery = correct 
      ? Math.min(word.mastery_level + 1, REVIEW_INTERVALS.length)
      : Math.max(word.mastery_level - 1, 0);

    const { error } = await supabase
      .from('vocabulary_learned')
      .update({
        mastery_level: newMastery,
        times_reviewed: word.times_reviewed + 1,
        last_reviewed_at: new Date().toISOString()
      })
      .eq('id', word.id);

    if (error) {
      toast.error('Failed to update word');
    } else {
      setWords(prev => prev.map(w => 
        w.id === word.id 
          ? { ...w, mastery_level: newMastery, times_reviewed: w.times_reviewed + 1, last_reviewed_at: new Date().toISOString() }
          : w
      ));
      toast.success(correct ? 'Great job!' : 'Keep practicing!');
      setReviewingWord(null);
    }
  };

  const startReviewSession = () => {
    if (wordsDueForReview.length > 0) {
      setReviewingWord(wordsDueForReview[0]);
    } else {
      toast.info('No words due for review!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading vocabulary...</div>
      </div>
    );
  }

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
                <h1 className="font-display text-2xl font-bold text-foreground">Vocabulary</h1>
                <p className="text-sm text-muted-foreground">
                  {stats.total} words learned
                </p>
              </div>
            </div>
            {stats.dueForReview > 0 && (
              <Button onClick={startReviewSession} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Review ({stats.dueForReview})
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Words</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Star className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.mastered}</p>
                <p className="text-xs text-muted-foreground">Mastered</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Brain className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.learning}</p>
                <p className="text-xs text-muted-foreground">Learning</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.dueForReview}</p>
                <p className="text-xs text-muted-foreground">Due for Review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {selectedMastery}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mastery Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {masteryFilters.map((filter) => (
                <DropdownMenuCheckboxItem
                  key={filter}
                  checked={selectedMastery === filter}
                  onCheckedChange={() => setSelectedMastery(filter)}
                >
                  {filter}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {reviewingWord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md"
              >
                <Card className="border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6">
                      <Badge className={getMasteryColor(reviewingWord.mastery_level)}>
                        {getMasteryLabel(reviewingWord.mastery_level)}
                      </Badge>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4">{reviewingWord.word}</h2>
                    
                    {reviewingWord.context && (
                      <p className="text-muted-foreground mb-4 italic">
                        "{reviewingWord.context}"
                      </p>
                    )}

                    {/* Voice Assessment Section */}
                    <VoiceAssessment word={reviewingWord.word} />
                    
                    <p className="text-sm text-muted-foreground mb-6">
                      Do you remember this word?
                    </p>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => handleReview(reviewingWord, false)}
                      >
                        Not Yet
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handleReview(reviewingWord, true)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Got It!
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="mt-4"
                      onClick={() => setReviewingWord(null)}
                    >
                      Skip for now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Words List */}
        <AnimatePresence mode="popLayout">
          {filteredWords.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWords.map((word, index) => {
                const isDue = isDueForReview(word);
                const nextReview = getNextReviewTime(word);
                
                return (
                  <motion.div
                    key={word.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`group cursor-pointer h-full transition-all duration-300 ${
                        isDue ? 'border-warning/50 bg-warning/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => isDue && setReviewingWord(word)}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{word.word}</h3>
                          <Badge variant="outline" className={getMasteryColor(word.mastery_level)}>
                            {getMasteryLabel(word.mastery_level)}
                          </Badge>
                        </div>

                        {/* Context */}
                        {word.context && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 italic">
                            "{word.context}"
                          </p>
                        )}

                        {/* Mastery Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Mastery</span>
                            <span>{Math.round((word.mastery_level / REVIEW_INTERVALS.length) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(word.mastery_level / REVIEW_INTERVALS.length) * 100} 
                            size="sm"
                          />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            {word.times_reviewed} reviews
                          </span>
                          <span className="flex items-center gap-1">
                            {isDue ? (
                              <>
                                <AlertCircle className="w-3 h-3 text-warning" />
                                <span className="text-warning">Due now</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(nextReview, { addSuffix: true })}
                              </>
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : words.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No vocabulary yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete lessons to start building your vocabulary
              </p>
              <Button onClick={() => navigate('/lessons')}>
                Browse Lessons
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No words found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMastery('All');
                }}
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Vocabulary;