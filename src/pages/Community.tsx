import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, Flag, ArrowLeft, Search, Filter,
  Eye, Headphones, BookOpen, Hand, MessageCircle, X, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PartnerRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  level: number;
  learning_style: string;
  context: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

const styleIcons: Record<string, React.ReactNode> = {
  visual: <Eye className="w-4 h-4" />,
  auditory: <Headphones className="w-4 h-4" />,
  reading: <BookOpen className="w-4 h-4" />,
  kinesthetic: <Hand className="w-4 h-4" />,
};

const styleColors: Record<string, string> = {
  visual: 'bg-cognitive-visual/10 text-cognitive-visual border-cognitive-visual/30',
  auditory: 'bg-cognitive-auditory/10 text-cognitive-auditory border-cognitive-auditory/30',
  reading: 'bg-cognitive-reading/10 text-cognitive-reading border-cognitive-reading/30',
  kinesthetic: 'bg-cognitive-kinesthetic/10 text-cognitive-kinesthetic border-cognitive-kinesthetic/30',
};

const contextLabels: Record<string, string> = {
  daily_life: 'Daily Life',
  workplace: 'Workplace',
  travel: 'Travel',
  academic: 'Academic',
};

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  
  // New request form state
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    level: 1,
    learning_style: 'visual',
    context: 'daily_life',
  });
  const [submitting, setSubmitting] = useState(false);

  // Report dialog state
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingRequest, setReportingRequest] = useState<PartnerRequest | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_requests')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load partner requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!user) {
      toast.error('Please log in to create a request');
      return;
    }

    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('partner_requests').insert({
        user_id: user.id,
        title: newRequest.title.trim(),
        description: newRequest.description.trim(),
        level: newRequest.level,
        learning_style: newRequest.learning_style,
        context: newRequest.context,
      });

      if (error) throw error;

      toast.success('Partner request posted!');
      setShowNewRequestDialog(false);
      setNewRequest({
        title: '',
        description: '',
        level: 1,
        learning_style: 'visual',
        context: 'daily_life',
      });
      fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!user || !reportingRequest) return;

    if (!reportReason.trim()) {
      toast.error('Please provide a reason for the report');
      return;
    }

    try {
      const { error } = await supabase.from('content_reports').insert({
        reporter_id: user.id,
        request_id: reportingRequest.id,
        reason: reportReason.trim(),
      });

      if (error) throw error;

      toast.success('Report submitted. Thank you for helping keep our community safe.');
      setReportDialogOpen(false);
      setReportingRequest(null);
      setReportReason('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    }
  };

  const openReportDialog = (request: PartnerRequest) => {
    setReportingRequest(request);
    setReportDialogOpen(true);
  };

  const handleConnect = async (request: PartnerRequest) => {
    if (!user) {
      toast.error('Please log in to connect with partners');
      navigate('/auth');
      return;
    }

    if (request.user_id === user.id) {
      toast.error("You can't connect with your own request");
      return;
    }

    setConnecting(request.id);
    try {
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_one.eq.${user.id},participant_two.eq.${request.user_id}),and(participant_one.eq.${request.user_id},participant_two.eq.${user.id})`
        )
        .single();

      if (existingConversation) {
        // Navigate to existing conversation
        navigate(`/messages?conversation=${existingConversation.id}`);
        return;
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          participant_one: user.id,
          participant_two: request.user_id,
          partner_request_id: request.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Send initial message
      await supabase.from('messages').insert({
        conversation_id: newConversation.id,
        sender_id: user.id,
        content: `Hi! I saw your post "${request.title}" and would love to practice together!`,
      });

      toast.success('Connected! Starting conversation...');
      navigate(`/messages?conversation=${newConversation.id}`);
    } catch (error) {
      console.error('Error connecting:', error);
      toast.error('Failed to connect. Please try again.');
    } finally {
      setConnecting(null);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || request.level === parseInt(filterLevel);
    const matchesStyle = filterStyle === 'all' || request.learning_style === filterStyle;
    return matchesSearch && matchesLevel && matchesStyle;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="font-display text-xl font-semibold">Community</span>
            </div>
          </div>

          <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Find Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Find a Learning Partner</DialogTitle>
                <DialogDescription>
                  Post a request to find someone to practice with.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Looking for conversation partner"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you're looking for..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Your Level</Label>
                    <Select
                      value={newRequest.level.toString()}
                      onValueChange={(value) => setNewRequest({ ...newRequest, level: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            Level {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Learning Style</Label>
                    <Select
                      value={newRequest.learning_style}
                      onValueChange={(value) => setNewRequest({ ...newRequest, learning_style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual</SelectItem>
                        <SelectItem value="auditory">Auditory</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Context</Label>
                  <Select
                    value={newRequest.context}
                    onValueChange={(value) => setNewRequest({ ...newRequest, context: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily_life">Daily Life</SelectItem>
                      <SelectItem value="workplace">Workplace</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRequest} disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search partner requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[120px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {[1, 2, 3, 4, 5].map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStyle} onValueChange={setFilterStyle}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="auditory">Auditory</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No partner requests yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to post a request and find a learning partner!
              </p>
              <Button onClick={() => setShowNewRequestDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Post First Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:border-primary/50 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">{request.title}</h3>
                            <Badge variant="outline" className="shrink-0">
                              Level {request.level}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {request.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={styleColors[request.learning_style]}
                            >
                              {styleIcons[request.learning_style]}
                              <span className="ml-1 capitalize">{request.learning_style}</span>
                            </Badge>
                            <Badge variant="secondary">
                              {contextLabels[request.context] || request.context}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {request.profiles?.name && `by ${request.profiles.name} • `}
                              {formatDate(request.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleConnect(request)}
                            disabled={connecting === request.id || request.user_id === user?.id}
                          >
                            {connecting === request.id ? (
                              <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-1" />
                            ) : (
                              <MessageCircle className="w-4 h-4 mr-1" />
                            )}
                            {request.user_id === user?.id ? 'Your Post' : 'Connect'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => openReportDialog(request)}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Flag className="w-5 h-5" />
              Report Content
            </DialogTitle>
            <DialogDescription>
              Help us keep the community safe by reporting inappropriate content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {reportingRequest && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">{reportingRequest.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {reportingRequest.description}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for report</Label>
              <Textarea
                id="reason"
                placeholder="Please describe why you're reporting this content..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReport}>
              <Send className="w-4 h-4 mr-2" />
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
