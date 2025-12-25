import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Phone, Mail, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const departments = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "ENT",
  "Obstetrics & Gynecology",
  "Ophthalmology",
  "Neurology",
  "Dental",
];

const timeSlots = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

const Appointment = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [department, setDepartment] = useState<string>();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !department || !formData.fullName || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    setIsSubmitted(true);
    toast({
      title: "Appointment Requested!",
      description: `Your appointment for ${format(date, "MMMM d, yyyy")} at ${time} has been submitted.`,
    });
  };

  const resetForm = () => {
    setDate(undefined);
    setTime(undefined);
    setDepartment(undefined);
    setFormData({ fullName: "", phone: "", email: "", notes: "" });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section id="appointment" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <div className="bg-card rounded-2xl p-12 shadow-lg">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Appointment Request Submitted!
              </h3>
              <p className="text-muted-foreground mb-6">
                Thank you, {formData.fullName}! Your appointment request for{" "}
                <span className="font-semibold text-primary">
                  {date && format(date, "MMMM d, yyyy")} at {time}
                </span>{" "}
                in {department} has been received. Our staff will contact you shortly to confirm.
              </p>
              <Button onClick={resetForm} variant="outline" size="lg">
                Book Another Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Book Online
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Schedule Your <span className="text-gradient">Appointment</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Book your consultation with our expert medical professionals. Select your preferred date, 
            time, and department for a seamless healthcare experience.
          </p>
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg p-8 md:p-10 animate-fade-up delay-100">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Date, Time, Department */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Appointment Details
                </h3>
                
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date < new Date() || date.getDay() === 0
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Slot */}
                <div className="space-y-2">
                  <Label htmlFor="time">Select Time *</Label>
                  <Select onValueChange={setTime} value={time}>
                    <SelectTrigger className="h-12">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Select Department *</Label>
                  <Select onValueChange={setDepartment} value={department}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column - Patient Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Patient Information
                </h3>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email (optional)"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific concerns or requirements..."
                      className="pl-10 min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-border">
              <Button type="submit" size="lg" className="w-full md:w-auto md:px-12">
                Request Appointment
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                * Required fields. Our team will contact you to confirm your appointment.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointment;
