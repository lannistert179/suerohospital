import { Stethoscope, Award, GraduationCap } from "lucide-react";

const doctors = [
  {
    name: "Dr. Maria Santos",
    specialty: "Internal Medicine",
    credentials: "MD, FPCP",
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Jose Reyes",
    specialty: "General Surgery",
    credentials: "MD, FPCS",
    experience: "20+ years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Ana Cruz",
    specialty: "Pediatrics",
    credentials: "MD, FPPS",
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Ramon Garcia",
    specialty: "OB-Gynecology",
    credentials: "MD, FPOGS",
    experience: "18+ years",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Elena Villanueva",
    specialty: "Cardiology",
    credentials: "MD, FPCC",
    experience: "10+ years",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Miguel Fernandez",
    specialty: "Orthopedics",
    credentials: "MD, FPOA",
    experience: "14+ years",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
  },
];

const Doctors = () => {
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
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={doctor.image}
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
                <p className="text-primary font-medium mb-4">{doctor.credentials}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{doctor.experience}</span>
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
