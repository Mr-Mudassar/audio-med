
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Home, Info, Phone } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-medical-700">MedAssist AI</h1>
            <p className="text-gray-600">Voice-based medical assistant</p>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h1 className="text-3xl font-bold mb-6 text-medical-700">About MedAssist AI</h1>
            <p className="text-lg text-gray-700 mb-4">
              MedAssist AI was founded in 2024 with a mission to transform healthcare delivery through artificial intelligence and voice recognition technology.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our team of healthcare professionals, AI specialists, and software engineers work together to create solutions that streamline medical processes, improve patient outcomes, and reduce administrative burden on healthcare providers.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We are committed to maintaining the highest standards of data security and clinical safety in all our products, with full compliance to NHS guidelines and GDPR regulations.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
              alt="Healthcare technology" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Vision</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            To create a healthcare ecosystem where AI seamlessly assists medical professionals, 
            empowering them to focus more on patient care while technology handles routine tasks, 
            ultimately leading to better health outcomes for all.
          </p>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow overflow-hidden text-center">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Info className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">Dr. Emma Johnson</h3>
                <p className="text-gray-600 mb-2">Chief Medical Officer</p>
                <p className="text-sm text-gray-600">
                  Former NHS consultant with 15 years of experience in digital health transformation.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden text-center">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Info className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">Raj Patel</h3>
                <p className="text-gray-600 mb-2">Chief Technology Officer</p>
                <p className="text-sm text-gray-600">
                  AI specialist with a background in developing healthcare technology solutions.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden text-center">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Info className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">Sarah Williams</h3>
                <p className="text-gray-600 mb-2">Head of User Experience</p>
                <p className="text-sm text-gray-600">
                  Specializes in creating accessible and intuitive healthcare interfaces for diverse users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-8 border-t">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MedAssist AI</h3>
              <p className="text-gray-600">Revolutionizing healthcare with voice-enabled AI technology.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-600 hover:underline">Home</Link></li>
                <li><Link to="/about" className="text-blue-600 hover:underline">About</Link></li>
                <li><Link to="/contact" className="text-blue-600 hover:underline">Contact</Link></li>
                <li><Link to="/demo" className="text-blue-600 hover:underline">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <address className="not-italic text-gray-600">
                <p>123 Medical Drive</p>
                <p>London, UK</p>
                <p>Email: info@medassist-ai.com</p>
                <p>Phone: +44 20 1234 5678</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} MedAssist AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
