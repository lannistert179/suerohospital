import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/doctors': 'Doctors',
  '/admin/services': 'Services',
  '/admin/news': 'News',
  '/admin/audit': 'Audit Trail',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Get the current page label
  const currentLabel = routeLabels[pathname] || 'Page';
  const isHome = pathname === '/admin';

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link 
        to="/admin" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      
      {!isHome && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{currentLabel}</span>
        </>
      )}
    </nav>
  );
}
