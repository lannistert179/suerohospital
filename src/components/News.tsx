import { useEffect, useState } from "react";
import { Calendar, ArrowRight, Loader2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type NewsItem = Tables<"news">;

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(4);
      
      if (!error && data) {
        setNewsItems(data);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section id="news" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMMM d, yyyy");
  };

  return (
    <section id="news" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Latest Updates
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            News & Announcements
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay informed about our latest programs, health tips, and hospital updates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Featured Article */}
          <div className="md:row-span-2 group">
            <div className="bg-card rounded-2xl overflow-hidden shadow-card h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={newsItems[0].image_url || "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop"}
                  alt={newsItems[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <Newspaper className="w-3.5 h-3.5" />
                    News
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(newsItems[0].published_at)}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {newsItems[0].title}
                </h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  {newsItems[0].excerpt}
                </p>
                <Button variant="link" className="p-0 h-auto justify-start text-primary">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Other Articles */}
          {newsItems.slice(1).map((item) => (
            <div key={item.id} className="group">
              <div className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col sm:flex-row h-full hover:shadow-xl transition-shadow duration-300">
                <div className="relative sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 sm:hidden">
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                      <Newspaper className="w-3 h-3" />
                      News
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="hidden sm:inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium w-fit mb-2">
                    <Newspaper className="w-3 h-3" />
                    News
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {item.excerpt}
                  </p>
                  <Button variant="link" className="p-0 h-auto justify-start text-primary text-sm">
                    Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
