import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getLessons, SeeLesson } from "@/lib/seeLearningSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plane, Building2, GraduationCap, Coffee, Stethoscope, MapPin } from "lucide-react";

const environmentIcons: Record<string, React.ReactNode> = {
  airport: <Plane className="h-5 w-5" />,
  corporate: <Building2 className="h-5 w-5" />,
  university: <GraduationCap className="h-5 w-5" />,
  cafe: <Coffee className="h-5 w-5" />,
  medical: <Stethoscope className="h-5 w-5" />,
};

const difficultyColors: Record<string, string> = {
  easy: "bg-success/20 text-success border-success/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  hard: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function SituationPicker() {
  const navigate = useNavigate();
  const lessons = getLessons();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Group lessons by environment
  const groupedLessons = useMemo(() => {
    const groups: Record<string, SeeLesson[]> = {};
    
    lessons.forEach(lesson => {
      const env = lesson.environment;
      if (!groups[env]) {
        groups[env] = [];
      }
      groups[env].push(lesson);
    });

    return groups;
  }, [lessons]);

  // Get unique environments
  const environments = Object.keys(groupedLessons);

  // Filter by difficulty
  const filteredGroups = useMemo(() => {
    if (selectedDifficulty === "all") return groupedLessons;
    
    const filtered: Record<string, SeeLesson[]> = {};
    Object.entries(groupedLessons).forEach(([env, envLessons]) => {
      const matching = envLessons.filter(l => l.difficulty === selectedDifficulty);
      if (matching.length > 0) {
        filtered[env] = matching;
      }
    });
    return filtered;
  }, [groupedLessons, selectedDifficulty]);

  const handleSelectLesson = (lessonId: string) => {
    navigate(`/chat/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-display font-semibold">Situation Picker</h1>
            <p className="text-sm text-muted-foreground">Choose a scenario to practice</p>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Difficulty Filter */}
        <div className="mb-8">
          <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grouped Lessons */}
        <div className="space-y-10">
          {Object.entries(filteredGroups).map(([environment, envLessons]) => (
            <section key={environment}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {environmentIcons[environment] || <MapPin className="h-5 w-5" />}
                </div>
                <h2 className="text-2xl font-display font-semibold capitalize">
                  {environment}
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {envLessons.length} {envLessons.length === 1 ? 'lesson' : 'lessons'}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {envLessons.map(lesson => (
                  <Card 
                    key={lesson.id}
                    variant="elevated"
                    className="cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => handleSelectLesson(lesson.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg leading-tight">
                          {lesson.title}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={difficultyColors[lesson.difficulty]}
                        >
                          {lesson.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Modules preview */}
                      <div className="space-y-2 mb-4">
                        {(lesson.modules || []).slice(0, 2).map(mod => (
                          <div key={mod.id} className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{mod.title}:</span>{" "}
                            {(mod.content || mod.instructions || '').slice(0, 60)}...
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {(lesson.tags || []).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(lesson.psyProfileTarget || lesson.psyTargets || []).map(psy => (
                          <Badge key={psy} variant="outline" className="text-xs bg-accent/30">
                            {psy}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full mt-4" 
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLesson(lesson.id);
                        }}
                      >
                        Start Conversation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {Object.keys(filteredGroups).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No lessons found for the selected difficulty.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
