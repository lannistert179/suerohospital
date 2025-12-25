import { CheckCircle, Users, Award, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "10,000+", label: "Patients Served" },
  { icon: Award, value: "15+", label: "Years of Service" },
  { icon: Building, value: "24/7", label: "Availability" },
];

const features = [
  "Modern medical equipment and facilities",
  "Experienced and compassionate medical staff",
  "Affordable healthcare services",
  "Comprehensive diagnostic services",
  "Emergency response team available 24/7",
  "Convenient location on MacArthur Highway",
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              About Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Trusted Healthcare Partner in Ilocos Sur
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Suero General Hospital has been serving the community of Cabugao and 
              the greater Ilocos Sur region for over a decade. Located along the 
              historic MacArthur Highway in San Antonio, we provide accessible 
              healthcare to families throughout the province.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our commitment to excellence in patient care, combined with our 
              state-of-the-art facilities and dedicated medical professionals, 
              makes us a trusted healthcare partner for the community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg">
              Learn More About Us
            </Button>
          </div>

          {/* Stats and image */}
          <div className="relative">
            <div className="bg-secondary rounded-2xl p-8">
              <div className="aspect-video bg-primary/5 rounded-xl mb-8 overflow-hidden">
                <div className="w-full h-full hero-gradient flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <Building className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="font-serif text-2xl font-bold">Suero General Hospital</p>
                    <p className="text-sm opacity-80">Cabugao, Ilocos Sur</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-card rounded-lg shadow-card">
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
