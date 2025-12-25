import { CheckCircle, Users, Award, Building, Facebook, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "10,000+", label: "Patients Served" },
  { icon: Award, value: "Level 1", label: "DOH Licensed" },
  { icon: Building, value: "24/7", label: "Availability" },
];

const features = [
  "DOH-licensed Level 1 General Hospital",
  "Private healthcare facility",
  "Complete diagnostic laboratory services",
  "24/7 Emergency care available",
  "Experienced medical professionals",
  "Accessible location in Baclig, Cabugao",
];

const hotlines = [
  { department: "OPD / Pharmacy", number: "0917-159-7308" },
  { department: "Emergency Room", number: "0917-813-9433" },
  { department: "Billing & Records", number: "0956-523-0750" },
  { department: "Laboratory, Radiology, Heart & Lung Station", number: "0966-083-4956" },
  { department: "Administrative Assistance", number: "0917-139-3826" },
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
              Suero General Hospital is a DOH-licensed Level 1 General Hospital 
              serving the community of Cabugao and the greater Ilocos Sur region. 
              Located in Baclig, Cabugao, we provide accessible and quality 
              healthcare to families throughout the province.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              As a private healthcare facility, we are committed to delivering 
              comprehensive medical services including General Medicine, Internal Medicine, 
              Pediatrics, OB-Gynecology, Surgery, and complete diagnostic laboratory 
              services including Clinical Chemistry, Hematology, and X-ray imaging.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="#appointment">Book Appointment</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a 
                  href="https://www.facebook.com/suero.hospital/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  Follow on Facebook
                </a>
              </Button>
            </div>
          </div>

          {/* Stats and image */}
          <div className="relative">
            <div className="bg-secondary rounded-2xl p-8">
              <div className="aspect-video bg-primary/5 rounded-xl mb-8 overflow-hidden">
                <div className="w-full h-full hero-gradient flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <Building className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="font-serif text-2xl font-bold">Suero General Hospital</p>
                    <p className="text-sm opacity-80">Baclig, Cabugao, Ilocos Sur</p>
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

        {/* SGH Hotline Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Contact Us
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              SGH Hotline
            </h3>
            <p className="text-muted-foreground mt-2">Reach us directly for your healthcare needs</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {hotlines.map((hotline) => (
              <a
                key={hotline.department}
                href={`tel:${hotline.number.replace(/-/g, "")}`}
                className="group bg-card border border-border rounded-xl p-5 text-center hover:border-primary hover:shadow-card transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-2 min-h-[40px] flex items-center justify-center">
                  {hotline.department}
                </h4>
                <p className="text-primary font-bold text-lg">{hotline.number}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
