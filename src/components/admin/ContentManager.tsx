import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface LessonContent {
  id: string;
  lesson_id: string;
  title: string;
  content: string;
  content_type: string;
  learning_style: string;
  display_order: number;
  is_active: boolean;
}

export const ContentManager = () => {
  const [contents, setContents] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);

  const [newContent, setNewContent] = useState({
    lesson_id: '',
    title: '',
    content: '',
    content_type: 'text',
    learning_style: 'visual',
    display_order: 0
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('lesson_content')
      .select('*')
      .order('lesson_id')
      .order('display_order');

    if (error) {
      toast.error('Failed to load content');
      console.error(error);
    } else {
      setContents(data || []);
    }
    setLoading(false);
  };

  const createContent = async () => {
    if (!newContent.lesson_id || !newContent.title || !newContent.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { data, error } = await supabase
      .from('lesson_content')
      .insert([newContent])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create content');
      console.error(error);
    } else {
      setContents([...contents, data]);
      setNewContent({
        lesson_id: '',
        title: '',
        content: '',
        content_type: 'text',
        learning_style: 'visual',
        display_order: 0
      });
      toast.success('Content created!');
    }
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase
      .from('lesson_content')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete content');
    } else {
      setContents(contents.filter(c => c.id !== id));
      toast.success('Content deleted');
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('lesson_content')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update content');
    } else {
      setContents(contents.map(c => 
        c.id === id ? { ...c, is_active: !currentState } : c
      ));
      toast.success(`Content ${!currentState ? 'activated' : 'deactivated'}`);
    }
  };

  // Group contents by lesson_id
  const groupedContents = contents.reduce((acc, content) => {
    if (!acc[content.lesson_id]) {
      acc[content.lesson_id] = [];
    }
    acc[content.lesson_id].push(content);
    return acc;
  }, {} as Record<string, LessonContent[]>);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Lesson ID (e.g., lesson-1)"
              value={newContent.lesson_id}
              onChange={(e) => setNewContent({ ...newContent, lesson_id: e.target.value })}
            />
            <Select
              value={newContent.learning_style}
              onValueChange={(value) => setNewContent({ ...newContent, learning_style: value })}
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
            <Select
              value={newContent.content_type}
              onValueChange={(value) => setNewContent({ ...newContent, content_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image_url">Image URL</SelectItem>
                <SelectItem value="audio_url">Audio URL</SelectItem>
                <SelectItem value="video_url">Video URL</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Content Title"
            value={newContent.title}
            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
          />

          <Textarea
            placeholder="Content (text, URL, or interactive instructions)"
            value={newContent.content}
            onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
            rows={4}
          />

          <div className="flex gap-4 items-center">
            <Input
              type="number"
              placeholder="Display Order"
              value={newContent.display_order}
              onChange={(e) => setNewContent({ ...newContent, display_order: parseInt(e.target.value) || 0 })}
              className="w-32"
            />
            <Button onClick={createContent} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contents List grouped by Lesson */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Lesson Contents</h3>
        {Object.entries(groupedContents).map(([lessonId, lessonContents]) => (
          <Card key={lessonId}>
            <CardHeader>
              <CardTitle className="text-lg">{lessonId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lessonContents.map((content) => (
                <div
                  key={content.id}
                  className={`p-4 rounded-lg border ${!content.is_active ? 'opacity-50 bg-muted' : 'bg-card'}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary capitalize">
                          {content.learning_style}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {content.content_type}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-muted">
                          Order: {content.display_order}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{content.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{content.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(content.id, content.is_active)}
                        title={content.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {content.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteContent(content.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {Object.keys(groupedContents).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No content created yet. Add your first lesson content above.
          </div>
        )}
      </div>
    </div>
  );
};
