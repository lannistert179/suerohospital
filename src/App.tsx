import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import DoctorsAdmin from "./pages/admin/DoctorsAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import NewsAdmin from "./pages/admin/NewsAdmin";
import NewsArticle from "./pages/NewsArticle";
import AuditTrail from "./pages/admin/AuditTrail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/doctors" element={<DoctorsAdmin />} />
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/news" element={<NewsAdmin />} />
            <Route path="/admin/audit" element={<AuditTrail />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
