import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Home as HomeIcon, Info, UserRound, Phone } from "lucide-react";

const Home = () => {
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
                    <HomeIcon className="h-4 w-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-medical-700">AI-Powered Healthcare Assistant</h1>
            <p className="text-xl text-gray-600 mb-8">
              Revolutionizing patient care with voice-enabled AI technology that seamlessly integrates with NHS systems.
            </p>
            <div className="flex gap-4">
              <Link to="/demo">
                <Button size="lg">Try Demo</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Digital healthcare"
              className="w-full h-auto"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
              <CardDescription>NICE Guidelines Compliant</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our AI-powered symptom checker prioritizes cases based on urgency, ensuring efficient patient triage before GP consultations.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Automation</CardTitle>
              <CardDescription>Reduce No-Shows</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Streamlined online booking with automated SMS/email reminders to optimize practice efficiency and patient attendance.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NHS Integration</CardTitle>
              <CardDescription>EMIS & SystmOne Compatible</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Seamless data synchronization with NHS systems, fully compliant with GDPR and NHS Information Governance standards.</p>
            </CardContent>
          </Card>
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

export default Home;
