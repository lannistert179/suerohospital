import { 
  Stethoscope, 
  Heart, 
  Baby, 
  Scissors,
  TestTube,
  Microscope,
  Activity,
  Scan
} from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "Emergency Care",
    description: "24/7 emergency services with rapid response medical team ready to handle all critical situations.",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Comprehensive primary care services for diagnosis, treatment, and prevention of common illnesses.",
  },
  {
    icon: Heart,
    title: "Internal Medicine",
    description: "Specialized care for adult diseases including diagnosis and treatment of complex medical conditions.",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized healthcare for infants, children, and adolescents with compassionate care.",
  },
  {
    icon: Scissors,
    title: "Surgery",
    description: "General surgical services performed by experienced surgeons with modern equipment.",
  },
  {
    icon: TestTube,
    title: "Obstetrics & Gynecology",
    description: "Complete women's health services including prenatal care, delivery, and reproductive health.",
  },
  {
    icon: Microscope,
    title: "Laboratory Services",
    description: "Clinical Chemistry, Hematology, Clinical Microscopy, and comprehensive diagnostic testing.",
  },
  {
    icon: Scan,
    title: "Diagnostic Imaging",
    description: "X-ray, ECG, and other imaging services for accurate diagnosis and treatment planning.",
  },
];

const Services = () => {
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
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card p-6 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
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
