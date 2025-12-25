import { Button } from "@/components/ui/button";
import { Clock, Shield, Phone } from "lucide-react";
import heroImage from "@/assets/hospital-hero.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Suero General Hospital building exterior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-up">
            <Clock className="w-4 h-4" />
            <span>Open 24 Hours - Emergency Services Available</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up delay-100">
            <span className="block">Our Quest:</span>
            <span className="text-gradient">Your health</span>
            <span className="text-gradient">at its best.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up delay-200 leading-relaxed">
            Suero General Hospital provides comprehensive healthcare services to the community of Cabugao, Ilocos Sur.
            With our dedicated medical professionals and modern facilities, we're committed to delivering exceptional
            patient care around the clock.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up delay-300">
            <Button variant="hero" size="xl">
              Book Appointment
            </Button>
            <Button variant="heroOutline" size="xl">
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up delay-400">
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Licensed</p>
                <p className="text-sm text-muted-foreground">DOH Accredited</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">24/7 Care</p>
                <p className="text-sm text-muted-foreground">Always Open</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Emergency</p>
                <p className="text-sm text-muted-foreground">Rapid Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
