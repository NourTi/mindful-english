import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Shield, Lock, Eye, AlertTriangle, FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface ExportLog {
  id: string;
  admin_user_id: string;
  export_type: string;
  record_count: number;
  fields_exported: string[];
  created_at: string;
}

export const ExportLogViewer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<ExportLog[]>([]);

  const handleViewLogs = () => {
    setShowAuthDialog(true);
    setPassword('');
  };

  const handleAuthenticate = async () => {
    if (!password || password.length < 6) {
      toast({
        title: 'Password required',
        description: 'Please enter your password to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('view-export-logs', {
        body: { password }
      });

      if (error) throw error;

      if (data?.logs) {
        setLogs(data.logs);
        setIsAuthenticated(true);
        setShowAuthDialog(false);
        toast({
          title: 'Access granted',
          description: 'This access has been logged for security compliance.',
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Authentication failed',
        description: error.message || 'Invalid password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    setLogs([]);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-warning" />
              Data Export Audit Log
            </CardTitle>
            <CardDescription>
              View history of data exports performed by administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 text-center space-y-4">
              <Lock className="w-12 h-12 mx-auto text-warning" />
              <div>
                <h3 className="font-semibold text-lg">Protected Content</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This section contains sensitive audit data. Re-authentication is required for access.
                </p>
              </div>
              <div className="bg-background/50 rounded-md p-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">Security Notice</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Your access will be logged</li>
                      <li>• Password verification is required</li>
                      <li>• Session expires when you navigate away</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button onClick={handleViewLogs} className="gap-2">
                <Eye className="w-4 h-4" />
                View Export Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Re-authentication Required
              </DialogTitle>
              <DialogDescription>
                Please enter your password to access the export audit logs. This action will be logged.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAuthenticate} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Authenticate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Data Export Audit Log
            </CardTitle>
            <CardDescription>
              {logs.length} export{logs.length !== 1 ? 's' : ''} recorded
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleLock} className="gap-2">
            <Lock className="w-4 h-4" />
            Lock
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No export logs found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Export Type</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Fields Exported</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.export_type === 'volunteers' ? 'default' : 'secondary'}>
                        {log.export_type === 'volunteers' ? 'Volunteers' : 'All Users'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{log.record_count}</span>
                      <span className="text-muted-foreground"> records</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {log.fields_exported?.slice(0, 3).map((field, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                        {log.fields_exported?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{log.fields_exported.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
