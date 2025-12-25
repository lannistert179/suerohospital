import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, History, User, FileText, Stethoscope, Newspaper, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

export default function AuditTrail() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
  };

  const getActionLabel = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const getEntityLabel = (entityType: string) => {
    return entityType.charAt(0).toUpperCase() + entityType.slice(1);
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            Audit Trail
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all administrative actions and changes
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 100 administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => {
                  const EntityIcon = entityIcons[log.entity_type] || FileText;
                  
                  return (
                    <div 
                      key={log.id} 
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <EntityIcon className="h-5 w-5 text-primary" />
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
                <p>No audit logs found</p>
                <p className="text-sm mt-1">Actions will appear here as they occur</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
