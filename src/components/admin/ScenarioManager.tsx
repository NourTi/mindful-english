import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit2, Save, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Scenario {
  id: string;
  title: string;
  context_type: string;
  description: string | null;
  is_active: boolean;
}

interface Dialogue {
  id: string;
  scenario_id: string;
  speaker: string;
  message: string;
  display_order: number;
}

interface Choice {
  id: string;
  dialogue_id: string;
  choice_text: string;
  is_correct: boolean;
  feedback: string;
}

export const ScenarioManager = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [choices, setChoices] = useState<Record<string, Choice[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [newScenario, setNewScenario] = useState({ title: '', context_type: 'daily_life', description: '' });
  const [newDialogue, setNewDialogue] = useState({ speaker: '', message: '' });
  const [newChoice, setNewChoice] = useState({ choice_text: '', is_correct: false, feedback: '' });
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load scenarios');
      console.error(error);
    } else {
      setScenarios(data || []);
    }
    setLoading(false);
  };

  const fetchDialogues = async (scenarioId: string) => {
    const { data, error } = await supabase
      .from('scenario_dialogues')
      .select('*')
      .eq('scenario_id', scenarioId)
      .order('display_order');

    if (error) {
      toast.error('Failed to load dialogues');
    } else {
      setDialogues(data || []);
      // Fetch choices for each dialogue
      for (const dialogue of data || []) {
        fetchChoices(dialogue.id);
      }
    }
  };

  const fetchChoices = async (dialogueId: string) => {
    const { data, error } = await supabase
      .from('scenario_choices')
      .select('*')
      .eq('dialogue_id', dialogueId);

    if (!error && data) {
      setChoices(prev => ({ ...prev, [dialogueId]: data }));
    }
  };

  const createScenario = async () => {
    if (!newScenario.title) {
      toast.error('Please enter a title');
      return;
    }

    const { data, error } = await supabase
      .from('scenarios')
      .insert([newScenario])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create scenario');
      console.error(error);
    } else {
      setScenarios([data, ...scenarios]);
      setNewScenario({ title: '', context_type: 'daily_life', description: '' });
      toast.success('Scenario created!');
    }
  };

  const deleteScenario = async (id: string) => {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete scenario');
    } else {
      setScenarios(scenarios.filter(s => s.id !== id));
      if (selectedScenario?.id === id) {
        setSelectedScenario(null);
        setDialogues([]);
      }
      toast.success('Scenario deleted');
    }
  };

  const selectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    fetchDialogues(scenario.id);
  };

  const createDialogue = async () => {
    if (!selectedScenario || !newDialogue.speaker || !newDialogue.message) {
      toast.error('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase
      .from('scenario_dialogues')
      .insert([{
        scenario_id: selectedScenario.id,
        speaker: newDialogue.speaker,
        message: newDialogue.message,
        display_order: dialogues.length
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create dialogue');
    } else {
      setDialogues([...dialogues, data]);
      setNewDialogue({ speaker: '', message: '' });
      toast.success('Dialogue added!');
    }
  };

  const deleteDialogue = async (id: string) => {
    const { error } = await supabase
      .from('scenario_dialogues')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete dialogue');
    } else {
      setDialogues(dialogues.filter(d => d.id !== id));
      toast.success('Dialogue deleted');
    }
  };

  const createChoice = async (dialogueId: string) => {
    if (!newChoice.choice_text || !newChoice.feedback) {
      toast.error('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase
      .from('scenario_choices')
      .insert([{
        dialogue_id: dialogueId,
        ...newChoice
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create choice');
    } else {
      setChoices(prev => ({
        ...prev,
        [dialogueId]: [...(prev[dialogueId] || []), data]
      }));
      setNewChoice({ choice_text: '', is_correct: false, feedback: '' });
      setActiveDialogueId(null);
      toast.success('Choice added!');
    }
  };

  const deleteChoice = async (dialogueId: string, choiceId: string) => {
    const { error } = await supabase
      .from('scenario_choices')
      .delete()
      .eq('id', choiceId);

    if (error) {
      toast.error('Failed to delete choice');
    } else {
      setChoices(prev => ({
        ...prev,
        [dialogueId]: prev[dialogueId]?.filter(c => c.id !== choiceId) || []
      }));
      toast.success('Choice deleted');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Scenarios List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Scenario Title"
              value={newScenario.title}
              onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
            />
            <Select
              value={newScenario.context_type}
              onValueChange={(value) => setNewScenario({ ...newScenario, context_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workplace">Workplace</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="daily_life">Daily Life</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Description (optional)"
              value={newScenario.description}
              onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
            />
            <Button onClick={createScenario} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Scenario
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Existing Scenarios</h3>
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-colors ${
                selectedScenario?.id === scenario.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => selectScenario(scenario)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{scenario.title}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{scenario.context_type.replace('_', ' ')}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteScenario(scenario.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialogues & Choices */}
      <div className="space-y-4">
        {selectedScenario ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Dialogues for: {selectedScenario.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Speaker (e.g., Boss, Customer)"
                    value={newDialogue.speaker}
                    onChange={(e) => setNewDialogue({ ...newDialogue, speaker: e.target.value })}
                  />
                  <Input
                    placeholder="Message"
                    value={newDialogue.message}
                    onChange={(e) => setNewDialogue({ ...newDialogue, message: e.target.value })}
                  />
                  <Button onClick={createDialogue}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {dialogues.map((dialogue) => (
              <Card key={dialogue.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-primary">{dialogue.speaker}:</span>
                      <p className="text-muted-foreground">{dialogue.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDialogue(dialogue.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Choices for this dialogue */}
                  <div className="pl-4 border-l-2 border-muted space-y-2">
                    <p className="text-sm font-medium">Answer Choices:</p>
                    {choices[dialogue.id]?.map((choice) => (
                      <div
                        key={choice.id}
                        className={`p-2 rounded text-sm flex justify-between items-center ${
                          choice.is_correct ? 'bg-green-100 dark:bg-green-900/20' : 'bg-muted'
                        }`}
                      >
                        <div>
                          <span>{choice.choice_text}</span>
                          {choice.is_correct && <span className="ml-2 text-green-600">✓ Correct</span>}
                          <p className="text-xs text-muted-foreground mt-1">Feedback: {choice.feedback}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteChoice(dialogue.id, choice.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}

                    {activeDialogueId === dialogue.id ? (
                      <div className="space-y-2 p-2 bg-muted/50 rounded">
                        <Input
                          placeholder="Choice text"
                          value={newChoice.choice_text}
                          onChange={(e) => setNewChoice({ ...newChoice, choice_text: e.target.value })}
                        />
                        <Input
                          placeholder="Feedback message"
                          value={newChoice.feedback}
                          onChange={(e) => setNewChoice({ ...newChoice, feedback: e.target.value })}
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={newChoice.is_correct}
                              onChange={(e) => setNewChoice({ ...newChoice, is_correct: e.target.checked })}
                            />
                            Correct Answer
                          </label>
                          <Button size="sm" onClick={() => createChoice(dialogue.id)}>
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setActiveDialogueId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveDialogueId(dialogue.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Choice
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Select a scenario to manage its dialogues
          </div>
        )}
      </div>
    </div>
  );
};
