import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type NewsItem = Tables<"news">;

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();
      
      if (!error && data) {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/#news">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={article.image_url || "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=600&fit=crop"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <article className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-8 md:p-12">
            <Link to="/#news" className="inline-flex items-center text-primary hover:underline mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary pl-4 italic">
                {article.excerpt}
              </p>
            )}
            
            <div className="prose prose-lg max-w-none text-foreground">
              {article.content?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>

        {/* Spacer */}
        <div className="py-16" />
      </main>
      <Footer />
    </div>
  );
};

export default NewsArticle;
