import { useEffect, useState } from "react";
import { Stethoscope, Award, GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Doctor = Tables<"doctors">;

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (!error && data) {
        setDoctors(data);
      }
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <section id="doctors" className="py-20 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return null;
  }

  return (
    <section id="doctors" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Medical Team
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Doctors
          </h2>
          <p className="text-muted-foreground text-lg">
            Our team of experienced and dedicated medical professionals is committed 
            to providing exceptional healthcare to every patient.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={doctor.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"}
                  alt={`${doctor.name} - ${doctor.specialty}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {doctor.specialty}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                  {doctor.name}
                </h3>
                {doctor.bio && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{doctor.bio}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{doctor.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>Board Certified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
