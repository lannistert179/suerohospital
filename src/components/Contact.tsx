import { Phone, MapPin, Clock, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Contact Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-lg">
            Have questions or need to schedule an appointment? Reach out to us 
            through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <a
                  href="tel:09178139433"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">0917 813 9433</p>
                    <p className="text-muted-foreground">(077) 728-5295</p>
                    <p className="text-sm text-primary">Tap to call</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">
                      Baclig, Cabugao<br />
                      Ilocos Sur, Philippines
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Hours</p>
                    <p className="text-muted-foreground">Open 24 Hours</p>
                    <p className="text-sm text-primary">7 Days a Week</p>
                  </div>
                </div>

                <a
                  href="mailto:suerogenhosp@yahoo.com"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">suerogenhosp@yahoo.com</p>
                  </div>
                </a>
              </div>

              {/* Map */}
              <div className="mt-8 aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=120.4400%2C17.8100%2C120.4600%2C17.8300&amp;layer=mapnik&amp;marker=17.8200%2C120.4500"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Suero General Hospital Location - Baclig, Cabugao, Ilocos Sur"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Juan Dela Cruz"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="juan@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="0917 123 4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
