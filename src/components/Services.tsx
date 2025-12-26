import { useEffect, useState } from "react";
import { 
  Stethoscope, 
  Heart, 
  Baby, 
  Scissors,
  TestTube,
  Microscope,
  Activity,
  Scan,
  Loader2,
  LucideIcon,
  Droplet,
  HeartPulse,
  Ambulance,
  Pill
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Stethoscope,
  Heart,
  Baby,
  Scissors,
  TestTube,
  Microscope,
  Scan,
  Droplet,
  HeartPulse,
  Ambulance,
  Pill,
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-muted-foreground text-lg">
            As a DOH-licensed Level 1 General Hospital, we offer a wide range of medical services 
            to meet the healthcare needs of our community in Ilocos Sur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon ? iconMap[service.icon] : Stethoscope;
            return (
              <div
                key={service.id}
                className="group bg-card p-6 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  {IconComponent && (
                    <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  )}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Services Banner */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
          <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
            Additional Specialties Available
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our hospital network provides access to specialists in Cardiology, Dermatology, ENT, 
            Ophthalmology, Orthopedics, Neurology, and many more through our partner physicians.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
