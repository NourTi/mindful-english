import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, ExternalLink, Star, Filter,
  BookOpen, Headphones, Eye, Pen, Sparkles, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEELogo from '@/components/SEELogo';
import {
  awesomeEnglishResources,
  resourceCategories,
  writingTips,
  aiLearningTips,
  type ResourceCategory,
  type ResourceLevel,
} from '@/data/awesomeEnglishResources';

const levelColors: Record<ResourceLevel, string> = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20',
  all: 'bg-primary/10 text-primary border-primary/20',
};

const Resources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<ResourceLevel | 'all'>('all');
  const [showTips, setShowTips] = useState(false);

  const filteredResources = useMemo(() => {
    return awesomeEnglishResources.filter(r => {
      const matchesSearch = !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || r.level === selectedLevel || r.level === 'all';
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const featured = awesomeEnglishResources.filter(r => r.isFeatured);

  const subcategories = useMemo(() => {
    const subs = new Set<string>();
    filteredResources.forEach(r => subs.add(r.subcategory));
    return Array.from(subs).sort();
  }, [filteredResources]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Resource Library</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredResources.length} curated resources for English learners
                </p>
              </div>
            </div>
            <SEELogo size={36} variant="icon" animated={false} theme="auto" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Featured Picks */}
        {selectedCategory === 'all' && !searchQuery && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-warning" />
              <h2 className="font-display text-xl font-bold">Top Picks</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="h-full hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{r.icon}</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{r.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Learning Tips */}
        {selectedCategory === 'all' && !searchQuery && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-2 mb-4 w-full text-left"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-bold">AI-Powered Learning Tips</h2>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showTips ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {aiLearningTips.map((tip, i) => (
                      <Card key={i} className="border-primary/20 bg-primary/5">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-primary mb-1">{tip.title}</h4>
                          <p className="text-xs text-muted-foreground">{tip.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card className="border-accent/20 bg-accent/5 mb-2">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm text-accent mb-2">✍️ Daily Writing Tips</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {writingTips.map((tip, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-accent">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="capitalize"
                >
                  {level === 'all' ? 'All Levels' : level}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {resourceCategories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-1"
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Resources Grid, grouped by subcategory */}
        <AnimatePresence mode="popLayout">
          {filteredResources.length > 0 ? (
            <div className="space-y-8">
              {subcategories.map(sub => {
                const items = filteredResources.filter(r => r.subcategory === sub);
                if (items.length === 0) return null;
                return (
                  <motion.div
                    key={sub}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="font-semibold text-lg text-foreground mb-3 border-b border-border pb-2">
                      {sub}
                      <span className="text-sm text-muted-foreground ml-2">({items.length})</span>
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Card className="h-full hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{resource.icon}</span>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${levelColors[resource.level]}`}>
                                    {resource.level}
                                  </Badge>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">
                                {resource.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {resource.description}
                              </p>
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attribution */}
        <div className="text-center py-8 text-xs text-muted-foreground border-t border-border">
          Resources curated from{' '}
          <a
            href="https://github.com/yvoronoy/awesome-english"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            awesome-english
          </a>{' '}
          (CC0 License) • Enriched for SEE learners
        </div>
      </main>
    </div>
  );
};

export default Resources;
