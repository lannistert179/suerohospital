import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, History, User, FileText, Stethoscope, Newspaper, Users, Search, Download, X, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const actionColors: Record<string, string> = {
  create: 'bg-green-500/10 text-green-600 border-green-500/20',
  update: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  delete: 'bg-red-500/10 text-red-600 border-red-500/20',
  publish: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  unpublish: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  activate: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  deactivate: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  login: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  logout: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
};

const entityIcons: Record<string, typeof FileText> = {
  doctor: Users,
  service: Stethoscope,
  news: Newspaper,
  user: User,
};

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'publish', label: 'Publish' },
  { value: 'unpublish', label: 'Unpublish' },
  { value: 'activate', label: 'Activate' },
  { value: 'deactivate', label: 'Deactivate' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
];

const entityOptions = [
  { value: 'all', label: 'All Entities' },
  { value: 'doctor', label: 'Doctors' },
  { value: 'service', label: 'Services' },
  { value: 'news', label: 'News' },
  { value: 'user', label: 'Users' },
];

export default function AuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const { toast } = useToast();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = searchQuery === '' || 
      log.entity_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter;
    
    return matchesSearch && matchesAction && matchesEntity;
  });

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
  };

  const formatDateCSV = (dateStr: string) => {
    return format(new Date(dateStr), 'yyyy-MM-dd HH:mm:ss');
  };

  const getActionLabel = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const getEntityLabel = (entityType: string) => {
    return entityType.charAt(0).toUpperCase() + entityType.slice(1);
  };

  const getActionIcon = (action: string) => {
    if (action === 'login') return LogIn;
    if (action === 'logout') return LogOut;
    return null;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActionFilter('all');
    setEntityFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || actionFilter !== 'all' || entityFilter !== 'all';

  const exportToCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) {
      toast({ variant: 'destructive', title: 'No data to export' });
      return;
    }

    const headers = ['Date', 'Action', 'Entity Type', 'Entity Name', 'User Email', 'Details'];
    const rows = filteredLogs.map((log) => [
      formatDateCSV(log.created_at),
      log.action,
      log.entity_type,
      log.entity_name || '',
      log.user_email || '',
      log.details ? JSON.stringify(log.details) : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export successful', description: `Exported ${filteredLogs.length} records` });
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              Audit Trail
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all administrative actions and changes
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  {entityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {hasActiveFilters && filteredLogs && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing {filteredLogs.length} of {logs?.length} records
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              {hasActiveFilters ? 'Filtered results' : 'Most recent administrative actions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log) => {
                  const EntityIcon = entityIcons[log.entity_type] || FileText;
                  const ActionIcon = getActionIcon(log.action);
                  
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {ActionIcon ? (
                          <ActionIcon className="h-5 w-5 text-primary" />
                        ) : (
                          <EntityIcon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={actionColors[log.action] || 'bg-muted'}
                          >
                            {getActionLabel(log.action)}
                          </Badge>
                          <Badge variant="secondary">
                            {getEntityLabel(log.entity_type)}
                          </Badge>
                        </div>
                        
                        <p className="mt-1 font-medium text-foreground">
                          {log.entity_name || 'Unknown item'}
                        </p>
                        
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span>by {log.user_email || 'Unknown user'}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(log.created_at)}</span>
                        </div>
                        
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{hasActiveFilters ? 'No matching logs found' : 'No audit logs found'}</p>
                <p className="text-sm mt-1">
                  {hasActiveFilters ? 'Try adjusting your filters' : 'Actions will appear here as they occur'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
