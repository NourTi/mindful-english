import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Users, Download, Search, Filter, RefreshCw, UserCheck, UserX, Mail, Phone, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  id: string;
  name: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  marital_status: string | null;
  is_volunteer: boolean | null;
  profile_completed: boolean | null;
  created_at: string;
  learning_style: string;
  current_level: number;
  total_xp: number;
}

export const UserManager = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVolunteer, setFilterVolunteer] = useState<string>('all');
  const [filterCompleted, setFilterCompleted] = useState<string>('all');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState<'all_users' | 'volunteers'>('all_users');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching profiles',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      (profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesVolunteer = 
      filterVolunteer === 'all' ||
      (filterVolunteer === 'yes' && profile.is_volunteer) ||
      (filterVolunteer === 'no' && !profile.is_volunteer);

    const matchesCompleted =
      filterCompleted === 'all' ||
      (filterCompleted === 'yes' && profile.profile_completed) ||
      (filterCompleted === 'no' && !profile.profile_completed);

    return matchesSearch && matchesVolunteer && matchesCompleted;
  });

  const volunteers = profiles.filter(p => p.is_volunteer);

  const handleExportRequest = (type: 'all_users' | 'volunteers') => {
    setExportType(type);
    setExportDialogOpen(true);
  };

  const handleConfirmedExport = async () => {
    setIsExporting(true);
    setExportDialogOpen(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('export-users', {
        body: { exportType: exportType }
      });

      if (error) throw error;

      if (data?.csv) {
        // Download the CSV
        const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${exportType}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);

        toast({
          title: 'Export successful',
          description: `Exported ${data.recordCount} records. This action has been logged for security compliance.`,
        });
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error.message || 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{profiles.length}</p>
              </div>
              <Users className="w-10 h-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volunteers</p>
                <p className="text-3xl font-bold text-success">{volunteers.length}</p>
              </div>
              <UserCheck className="w-10 h-10 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Profiles</p>
                <p className="text-3xl font-bold text-primary">
                  {profiles.filter(p => p.profile_completed).length}
                </p>
              </div>
              <UserCheck className="w-10 h-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incomplete</p>
                <p className="text-3xl font-bold text-warning">
                  {profiles.filter(p => !p.profile_completed).length}
                </p>
              </div>
              <UserX className="w-10 h-10 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportRequest('volunteers')}
                disabled={volunteers.length === 0 || isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Volunteers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportRequest('all_users')}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button variant="ghost" size="icon" onClick={fetchProfiles}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterVolunteer} onValueChange={setFilterVolunteer}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Volunteer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="yes">Volunteers</SelectItem>
                  <SelectItem value="no">Non-Volunteers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCompleted} onValueChange={setFilterCompleted}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Profile Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  <SelectItem value="yes">Completed</SelectItem>
                  <SelectItem value="no">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Learning</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {profile.first_name && profile.last_name 
                              ? `${profile.first_name} ${profile.last_name}`
                              : profile.name || 'Unnamed'}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {profile.email || 'No email'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {profile.phone_number && (
                            <p className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {profile.phone_number}
                            </p>
                          )}
                          {profile.whatsapp_number && (
                            <p className="text-muted-foreground">
                              WA: {profile.whatsapp_number}
                            </p>
                          )}
                          {profile.marital_status && (
                            <p className="text-muted-foreground capitalize">
                              {profile.marital_status.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {profile.is_volunteer && (
                            <Badge variant="default" className="w-fit bg-success text-success-foreground">
                              Volunteer
                            </Badge>
                          )}
                          {profile.profile_completed ? (
                            <Badge variant="outline" className="w-fit border-primary text-primary">
                              Complete
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-fit border-warning text-warning">
                              Incomplete
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p className="capitalize">{profile.learning_style}</p>
                          <p className="text-muted-foreground">
                            Level {profile.current_level} • {profile.total_xp} XP
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(profile.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredProfiles.length} of {profiles.length} users
          </p>
        </CardContent>
      </Card>

      {/* Export Confirmation Dialog */}
      <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-warning" />
              Confirm Data Export
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  You are about to export {exportType === 'volunteers' ? 'volunteer' : 'all user'} data.
                </p>
                <div className="bg-warning/10 border border-warning/20 rounded-md p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Security Notice</p>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li>• This export will be logged for compliance</li>
                      <li>• Phone numbers will be partially masked</li>
                      <li>• Handle exported data according to privacy policies</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated records: {exportType === 'volunteers' ? volunteers.length : profiles.length}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedExport}>
              <Download className="w-4 h-4 mr-2" />
              Confirm Export
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
