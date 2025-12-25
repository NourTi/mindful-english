import { useState, useEffect } from 'react';
import { Flag, Check, X, Eye, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentReport {
  id: string;
  reporter_id: string;
  request_id: string;
  reason: string;
  status: string;
  created_at: string;
  partner_requests?: {
    id: string;
    title: string;
    description: string;
    user_id: string;
    profiles?: {
      name: string;
    };
  };
  reporter?: {
    name: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { 
    label: 'Pending', 
    color: 'bg-warning/10 text-warning border-warning/30',
    icon: <Clock className="w-3 h-3" />
  },
  reviewed: { 
    label: 'Reviewed', 
    color: 'bg-primary/10 text-primary border-primary/30',
    icon: <Eye className="w-3 h-3" />
  },
  resolved: { 
    label: 'Resolved', 
    color: 'bg-success/10 text-success border-success/30',
    icon: <CheckCircle className="w-3 h-3" />
  },
  dismissed: { 
    label: 'Dismissed', 
    color: 'bg-muted text-muted-foreground border-muted',
    icon: <X className="w-3 h-3" />
  },
};

export const ReportsManager = () => {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('content_reports')
        .select(`
          *,
          partner_requests:request_id (
            id,
            title,
            description,
            user_id,
            profiles:user_id (name)
          ),
          reporter:reporter_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('content_reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      toast.success(`Report marked as ${newStatus}`);
      fetchReports();
      setDetailsDialogOpen(false);
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    } finally {
      setActionLoading(false);
    }
  };

  const hidePartnerRequest = async (requestId: string, reportId: string) => {
    setActionLoading(true);
    try {
      // Deactivate the partner request
      const { error: requestError } = await supabase
        .from('partner_requests')
        .update({ is_active: false })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Mark report as resolved
      const { error: reportError } = await supabase
        .from('content_reports')
        .update({ status: 'resolved' })
        .eq('id', reportId);

      if (reportError) throw reportError;

      toast.success('Content removed and report resolved');
      fetchReports();
      setDetailsDialogOpen(false);
    } catch (error) {
      console.error('Error hiding content:', error);
      toast.error('Failed to remove content');
    } finally {
      setActionLoading(false);
    }
  };

  const openDetails = (report: ContentReport) => {
    setSelectedReport(report);
    setDetailsDialogOpen(true);
  };

  const filteredReports = reports.filter((report) => {
    if (filterStatus === 'all') return true;
    return report.status === filterStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-destructive" />
                Content Reports
                {pendingCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingCount} pending
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Review and manage reported community content
              </CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'all' 
                  ? 'No content has been reported yet.'
                  : `No ${filterStatus} reports.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported Content</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => {
                    const status = statusConfig[report.status] || statusConfig.pending;
                    return (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            {status.icon}
                            <span className="ml-1">{status.label}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="font-medium truncate">
                            {report.partner_requests?.title || 'Unknown'}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {report.reason}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {report.reporter?.name || 'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(report.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDetails(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Review Report
            </DialogTitle>
            <DialogDescription>
              Take action on this reported content
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Current Status:</span>
                <Badge 
                  variant="outline" 
                  className={statusConfig[selectedReport.status]?.color}
                >
                  {statusConfig[selectedReport.status]?.icon}
                  <span className="ml-1">
                    {statusConfig[selectedReport.status]?.label}
                  </span>
                </Badge>
              </div>

              {/* Reported Content */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Reported Content:</span>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedReport.partner_requests?.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedReport.partner_requests?.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Posted by: {selectedReport.partner_requests?.profiles?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Report Reason */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Report Reason:</span>
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="text-sm">{selectedReport.reason}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reported by: {selectedReport.reporter?.name || 'Unknown'} on{' '}
                    {formatDate(selectedReport.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => updateReportStatus(selectedReport!.id, 'dismissed')}
              disabled={actionLoading}
            >
              <X className="w-4 h-4 mr-1" />
              Dismiss
            </Button>
            <Button
              variant="secondary"
              onClick={() => updateReportStatus(selectedReport!.id, 'reviewed')}
              disabled={actionLoading}
            >
              <Eye className="w-4 h-4 mr-1" />
              Mark Reviewed
            </Button>
            <Button
              variant="destructive"
              onClick={() => hidePartnerRequest(
                selectedReport!.partner_requests!.id, 
                selectedReport!.id
              )}
              disabled={actionLoading || !selectedReport?.partner_requests}
            >
              <Flag className="w-4 h-4 mr-1" />
              Remove Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
