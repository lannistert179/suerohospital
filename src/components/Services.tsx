import { 
  Stethoscope, 
  Heart, 
  Baby, 
  Bone, 
  Eye, 
  Syringe,
  Activity,
  Pill
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
    title: "Cardiology",
    description: "Complete heart care including diagnostics, treatment, and cardiac rehabilitation services.",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized healthcare for infants, children, and adolescents with compassionate care.",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description: "Expert care for bone, joint, and muscle conditions including surgical and non-surgical treatments.",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Complete eye care services from routine exams to advanced surgical procedures.",
  },
  {
    icon: Syringe,
    title: "Laboratory",
    description: "State-of-the-art diagnostic laboratory with accurate and timely test results.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "In-house pharmacy with comprehensive medication services and professional consultation.",
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
            We offer a wide range of medical services to meet the healthcare needs of our community, 
            delivered by experienced professionals with compassion and expertise.
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
      </div>
    </section>
  );
};

export default Services;
