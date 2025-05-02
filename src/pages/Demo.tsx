
import { ConversationProvider } from '@/contexts/ConversationContext';
import VoiceAssistant from '@/components/VoiceAssistant';
import SymptomChecker from '@/components/SymptomChecker';
import MedicationRecommendation from '@/components/MedicationRecommendation';
import AppointmentBooking from '@/components/AppointmentBooking';
import PatientForm from '@/components/PatientForm';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
import { Home, Info, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Demo = () => {
  const isMobile = useIsMobile();
  
  return (
    <ConversationProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container py-2 md:py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-medical-700">MedAdvise AI</h1>
              <p className="text-xs md:text-sm text-gray-600">Voice-based medical assistant POC</p>
            </div>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <Button variant="ghost" size={isMobile ? "sm" : "default"} className="flex items-center gap-1 md:gap-2 hover:bg-blue-50">
                      <Home className="h-3 w-3 md:h-4 md:w-4" />
                      {!isMobile && "Home"}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <Button variant="ghost" size={isMobile ? "sm" : "default"} className="flex items-center gap-1 md:gap-2 hover:bg-blue-50">
                      <Info className="h-3 w-3 md:h-4 md:w-4" />
                      {!isMobile && "About"}
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact">
                    <Button variant="ghost" size={isMobile ? "sm" : "default"} className="flex items-center gap-1 md:gap-2 hover:bg-blue-50">
                      <Phone className="h-3 w-3 md:h-4 md:w-4" />
                      {!isMobile && "Contact"}
                    </Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </header>

        <main className="container py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10">
            <div className="flex flex-col gap-5 md:gap-10">
              <div className="transform transition-all hover:scale-[1.01]">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-medical-700 flex items-center">
                  <span className="bg-medical-100 p-1.5 md:p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-medical-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Voice Assistant
                </h2>
                <VoiceAssistant />
              </div>

              <div className="transform transition-all hover:scale-[1.01]">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-medical-700 flex items-center">
                  <span className="bg-medical-100 p-1.5 md:p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-medical-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Symptom Checker
                </h2>
                <SymptomChecker />
              </div>
            </div>

            <div className="flex flex-col gap-5 md:gap-10">
              <div className="transform transition-all hover:scale-[1.01]">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-medical-700 flex items-center">
                  <span className="bg-medical-100 p-1.5 md:p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-medical-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Medication Recommendations
                </h2>
                <MedicationRecommendation />
              </div>

              <div className="transform transition-all hover:scale-[1.01]">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-medical-700 flex items-center">
                  <span className="bg-medical-100 p-1.5 md:p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-medical-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Appointment Booking
                </h2>
                <AppointmentBooking />
              </div>

              <div className="transform transition-all hover:scale-[1.01]">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-medical-700 flex items-center">
                  <span className="bg-medical-100 p-1.5 md:p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-medical-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Patient Information
                </h2>
                <PatientForm />
              </div>
            </div>
          </div>

        </main>

        <footer className="bg-white py-4 md:py-6 border-t">
          <div className="container">
            <div className="text-center text-gray-500 text-xs md:text-sm">
              <p>MedAdvise AI - Proof of Concept Demo - Not for actual medical use</p>
              <p className="mt-1 md:mt-2">© {new Date().getFullYear()} All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </ConversationProvider>
  );
};

export default Demo;
