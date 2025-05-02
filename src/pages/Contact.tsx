
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Home, Info, Phone, MapPin, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define form schema with validation rules
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const { toast } = useToast();
  
  // Initialize form with React Hook Form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll respond shortly.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-medical-700">MedAssist AI</h1>
            <p className="text-gray-600">Voice-based medical assistant</p>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50">
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50">
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact">
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50">
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
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-medical-700">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about MedAssist AI? Our team is here to help. Reach out using the form below or through our direct contact details.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <Card className="shadow-md border border-blue-50">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
                alt="Our office" 
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-blue-50">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-medical-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Office Address</h3>
                  <address className="not-italic text-gray-600">
                    123 Medical Drive<br />
                    London, W1 1AA<br />
                    United Kingdom
                  </address>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-6 w-6 text-medical-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-gray-600">General Inquiries: info@medassist-ai.com</p>
                  <p className="text-gray-600">Support: support@medassist-ai.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-6 w-6 text-medical-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-gray-600">Main: +44 20 1234 5678</p>
                  <p className="text-gray-600">Support: +44 20 8765 4321</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-medical-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Office Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                  <p className="text-gray-600">Saturday & Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-8 border-t">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-medical-700">MedAssist AI</h3>
              <p className="text-gray-600">Revolutionizing healthcare with voice-enabled AI technology.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-medical-700">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-medical-600 hover:underline">Home</Link></li>
                <li><Link to="/about" className="text-medical-600 hover:underline">About</Link></li>
                <li><Link to="/contact" className="text-medical-600 hover:underline">Contact</Link></li>
                <li><Link to="/demo" className="text-medical-600 hover:underline">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-medical-700">Contact</h3>
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

export default Contact;
