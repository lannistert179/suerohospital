import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Newspaper, Stethoscope, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { data: doctorsCount } = useQuery({
    queryKey: ['admin-doctors-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: servicesCount } = useQuery({
    queryKey: ['admin-services-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: newsCount } = useQuery({
    queryKey: ['admin-news-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const stats = [
    {
      title: 'Total Doctors',
      value: doctorsCount ?? 0,
      icon: Users,
      description: 'Active medical staff',
    },
    {
      title: 'Services',
      value: servicesCount ?? 0,
      icon: Stethoscope,
      description: 'Medical services offered',
    },
    {
      title: 'News Articles',
      value: newsCount ?? 0,
      icon: Newspaper,
      description: 'Published announcements',
    },
    {
      title: 'System Status',
      value: 'Active',
      icon: Activity,
      description: 'All systems operational',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the hospital content management system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/admin/doctors"
                className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Doctors</p>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove doctor profiles</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/services"
                className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Services</p>
                    <p className="text-sm text-muted-foreground">Update hospital services information</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/news"
                className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage News</p>
                    <p className="text-sm text-muted-foreground">Create and publish announcements</p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system status and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Database Status</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
