import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  lesson_id: string;
  question: string;
  correct_answer: string;
  options: string[];
  learning_style: string;
  difficulty: number;
  is_active: boolean;
}

export const QuizManager = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    lesson_id: '',
    question: '',
    correct_answer: '',
    options: ['', '', '', ''],
    learning_style: 'visual',
    difficulty: 1
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load questions');
      console.error(error);
    } else {
      // Parse options from JSONB
      const parsed = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? (q.options as string[]) : []
      }));
      setQuestions(parsed);
    }
    setLoading(false);
  };

  const createQuestion = async () => {
    if (!newQuestion.lesson_id || !newQuestion.question || !newQuestion.correct_answer) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validOptions = newQuestion.options.filter(o => o.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    const { data, error } = await supabase
      .from('quiz_questions')
      .insert([{
        ...newQuestion,
        options: validOptions
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create question');
      console.error(error);
    } else {
      setQuestions([{ ...data, options: validOptions }, ...questions]);
      setNewQuestion({
        lesson_id: '',
        question: '',
        correct_answer: '',
        options: ['', '', '', ''],
        learning_style: 'visual',
        difficulty: 1
      });
      toast.success('Question created!');
    }
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete question');
    } else {
      setQuestions(questions.filter(q => q.id !== id));
      toast.success('Question deleted');
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('quiz_questions')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update question');
    } else {
      setQuestions(questions.map(q => 
        q.id === id ? { ...q, is_active: !currentState } : q
      ));
      toast.success(`Question ${!currentState ? 'activated' : 'deactivated'}`);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Quiz Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Lesson ID (e.g., lesson-1)"
              value={newQuestion.lesson_id}
              onChange={(e) => setNewQuestion({ ...newQuestion, lesson_id: e.target.value })}
            />
            <Select
              value={newQuestion.learning_style}
              onValueChange={(value) => setNewQuestion({ ...newQuestion, learning_style: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Learning Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="auditory">Auditory</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Question text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            {newQuestion.options.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Correct Answer (must match one option exactly)"
              value={newQuestion.correct_answer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
            />
            <Select
              value={newQuestion.difficulty.toString()}
              onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Easy</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={createQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Question
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Existing Questions ({questions.length})</h3>
        {questions.map((question) => (
          <Card key={question.id} className={!question.is_active ? 'opacity-50' : ''}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {question.lesson_id}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground capitalize">
                      {question.learning_style}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-muted">
                      Difficulty: {question.difficulty}
                    </span>
                    {!question.is_active && (
                      <span className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="font-medium mb-2">{question.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`text-sm p-2 rounded ${
                          option === question.correct_answer
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'bg-muted'
                        }`}
                      >
                        {option}
                        {option === question.correct_answer && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(question.id, question.is_active)}
                  >
                    {question.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
