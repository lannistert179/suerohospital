import { Calendar, ArrowRight, Heart, Syringe, Baby, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Free Blood Pressure Screening This January",
    excerpt: "Join us for our monthly community health program offering free blood pressure and blood sugar screenings.",
    date: "January 15, 2025",
    category: "Event",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Flu Vaccination Now Available",
    excerpt: "Protect yourself and your family this season. Walk-in vaccinations available daily at our outpatient department.",
    date: "January 10, 2025",
    category: "Health Tip",
    icon: Syringe,
    image: "https://images.unsplash.com/photo-1632053001332-2f9fc2898c24?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "New Pediatric Wing Opening Soon",
    excerpt: "We're expanding our services with a dedicated pediatric wing featuring child-friendly facilities and specialized care.",
    date: "January 5, 2025",
    category: "Announcement",
    icon: Baby,
    image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Heart Health Awareness Month",
    excerpt: "February is Heart Health Month. Learn about cardiovascular wellness and schedule your heart checkup today.",
    date: "January 1, 2025",
    category: "Health Tip",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&h=400&fit=crop",
  },
];

const News = () => {
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
                  src={newsItems[0].image}
                  alt={newsItems[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  {(() => {
                    const IconComponent = newsItems[0].icon;
                    return (
                      <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        <IconComponent className="w-3.5 h-3.5" />
                        {newsItems[0].category}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{newsItems[0].date}</span>
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
          {newsItems.slice(1).map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="group">
                <div className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col sm:flex-row h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="relative sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 sm:hidden">
                      <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                        <IconComponent className="w-3 h-3" />
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="hidden sm:inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium w-fit mb-2">
                      <IconComponent className="w-3 h-3" />
                      {item.category}
                    </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default News;
