
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, Check } from 'lucide-react';
import { useConversation } from '@/contexts/ConversationContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson' },
  { id: 2, name: 'Dr. Michael Chen' },
  { id: 3, name: 'Dr. Elizabeth Taylor' },
  { id: 4, name: 'Dr. Robert Williams' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export const AppointmentBooking = () => {
  const { appointment, setAppointment, currentStep, patientInfo } = useConversation();
  const [date, setDate] = useState<Date | undefined>(appointment.date || undefined);
  const [isBooked, setIsBooked] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    setAppointment({ ...appointment, date: date || null });
  };
  
  const handleTimeChange = (time: string) => {
    setAppointment({ ...appointment, time });
  };
  
  const handleDoctorChange = (doctor: string) => {
    setAppointment({ ...appointment, doctor });
  };
  
  const handleTypeChange = (type: 'virtual' | 'in-person') => {
    setAppointment({ ...appointment, type });
  };

  const handleBookAppointment = () => {
    // Process the booking
    setIsBooked(true);
    
    // Show toast notification
    toast({
      title: "Appointment Booked!",
      description: `Your ${appointment.type} appointment is confirmed for ${format(appointment.date as Date, 'PPP')} at ${appointment.time} with ${appointment.doctor}.`,
    });
  };
  
  if (currentStep === 'greeting' || currentStep === 'symptom-check' || currentStep === 'medication') {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Appointment Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs md:text-sm">
            After receiving medication recommendations, you can schedule an appointment here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (isBooked) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Appointment Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Scheduled!</h3>
            
            <p className="text-sm text-gray-600 mb-3">
              {patientInfo.firstName ? `Thank you, ${patientInfo.firstName}. ` : ''}
              We have scheduled your {appointment.type} appointment for:
            </p>
            
            <div className="bg-gray-50 px-4 py-3 rounded-md w-full mb-4">
              <p className="font-medium text-gray-800">
                {appointment.date ? format(appointment.date, 'PPP') : ''} at {appointment.time}
              </p>
              <p className="text-gray-700">with {appointment.doctor}</p>
            </div>
            
            <p className="text-sm text-gray-600">
              A confirmation has been sent to your phone number and email address.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">Appointment Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="appointment-type" className="text-sm md:text-base">Appointment Type</Label>
            <div className="flex gap-2">
              <Button 
                variant={appointment.type === 'virtual' ? 'default' : 'outline'} 
                size={isMobile ? "sm" : "default"}
                className={appointment.type === 'virtual' ? 'bg-medical-500' : ''}
                onClick={() => handleTypeChange('virtual')}
              >
                Virtual
              </Button>
              <Button 
                variant={appointment.type === 'in-person' ? 'default' : 'outline'}
                size={isMobile ? "sm" : "default"}
                className={appointment.type === 'in-person' ? 'bg-medical-500' : ''}
                onClick={() => handleTypeChange('in-person')}
              >
                In-Person
              </Button>
            </div>
          </div>
          
          <div className="space-y-1 md:space-y-2">
            <Label className="text-sm md:text-base">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="time" className="text-sm md:text-base">Select Time</Label>
            <Select value={appointment.time} onValueChange={handleTimeChange}>
              <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                <SelectValue placeholder="Select time">
                  {appointment.time ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {appointment.time}
                    </div>
                  ) : (
                    "Select time"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time} className={isMobile ? "text-sm" : ""}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="doctor" className="text-sm md:text-base">Select Doctor</Label>
            <Select value={appointment.doctor} onValueChange={handleDoctorChange}>
              <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {DOCTORS.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.name} className={isMobile ? "text-sm" : ""}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full mt-3 md:mt-4 bg-medical-600 hover:bg-medical-700"
            size={isMobile ? "sm" : "default"}
            disabled={!appointment.date || !appointment.time || !appointment.doctor}
            onClick={handleBookAppointment}
          >
            Confirm Appointment
          </Button>
          
          <div className="mt-2 text-[10px] md:text-xs text-gray-500 italic">
            Note: This is a demo booking system. In a real application, this would connect to an actual booking system.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
