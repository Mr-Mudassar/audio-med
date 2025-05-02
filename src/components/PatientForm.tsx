
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useConversation } from '@/contexts/ConversationContext';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define basic form schema 
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number()
    .int({ message: "Age must be a whole number." })
    .positive({ message: "Age must be positive." })
    .min(1, { message: "Age must be at least 1." })
    .max(120, { message: "Age must be less than 120." }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender.",
  }),
});

export const PatientForm = () => {
  const { patientInfo, setPatientInfo } = useConversation();
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedication, setCurrentMedication] = useState('');
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patientInfo.name,
      age: patientInfo.age || undefined,
      gender: (patientInfo.gender as "male" | "female" | "other") || undefined,
    },
  });
  
  const handleAddMedicalHistory = () => {
    if (medicalHistory.trim()) {
      setPatientInfo({
        ...patientInfo,
        medicalHistory: [...patientInfo.medicalHistory, medicalHistory.trim()]
      });
      setMedicalHistory('');
    }
  };
  
  const handleAddCurrentMedication = () => {
    if (currentMedication.trim()) {
      setPatientInfo({
        ...patientInfo,
        currentMedications: [...patientInfo.currentMedications, currentMedication.trim()]
      });
      setCurrentMedication('');
    }
  };
  
  const handleRemoveMedicalHistory = (index: number) => {
    setPatientInfo({
      ...patientInfo,
      medicalHistory: patientInfo.medicalHistory.filter((_, i) => i !== index)
    });
  };
  
  const handleRemoveCurrentMedication = (index: number) => {
    setPatientInfo({
      ...patientInfo,
      currentMedications: patientInfo.currentMedications.filter((_, i) => i !== index)
    });
  };

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setPatientInfo({
      ...patientInfo,
      name: values.name,
      age: values.age,
      gender: values.gender
    });
    
    toast({
      title: "Information Saved",
      description: "Your patient information has been updated.",
    });
  }
  
  return (
    <Card className="shadow-md border border-blue-50">
      <CardHeader className="bg-gradient-to-r from-medical-100 to-blue-50 border-b border-blue-100">
        <CardTitle className="text-medical-700">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your age" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-5">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          value="male"
                          checked={field.value === "male"}
                          onChange={() => field.onChange("male")}
                          className="rounded-full text-medical-600 focus:ring-medical-500"
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          value="female"
                          checked={field.value === "female"}
                          onChange={() => field.onChange("female")}
                          className="rounded-full text-medical-600 focus:ring-medical-500"
                        />
                        <span>Female</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          value="other"
                          checked={field.value === "other"}
                          onChange={() => field.onChange("other")}
                          className="rounded-full text-medical-600 focus:ring-medical-500"
                        />
                        <span>Other</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <Label htmlFor="medical-history">Medical History</Label>
              <div className="flex gap-2">
                <Input
                  id="medical-history"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="E.g., diabetes, hypertension, asthma"
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={handleAddMedicalHistory} 
                  className="bg-medical-500 hover:bg-medical-600 text-white"
                  disabled={!medicalHistory.trim()}
                >
                  Add
                </Button>
              </div>
              
              {patientInfo.medicalHistory.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {patientInfo.medicalHistory.map((item, index) => (
                    <div key={index} className="bg-blue-50 px-3 py-1.5 rounded-full flex items-center border border-blue-100">
                      <span className="text-sm text-medical-700">{item}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                        onClick={() => handleRemoveMedicalHistory(index)}
                        aria-label={`Remove ${item}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="current-medications">Current Medications</Label>
              <div className="flex gap-2">
                <Input
                  id="current-medications"
                  value={currentMedication}
                  onChange={(e) => setCurrentMedication(e.target.value)}
                  placeholder="E.g., paracetamol, insulin, vitamins"
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={handleAddCurrentMedication}
                  className="bg-medical-500 hover:bg-medical-600 text-white"
                  disabled={!currentMedication.trim()}
                >
                  Add
                </Button>
              </div>
              
              {patientInfo.currentMedications.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {patientInfo.currentMedications.map((item, index) => (
                    <div key={index} className="bg-blue-50 px-3 py-1.5 rounded-full flex items-center border border-blue-100">
                      <span className="text-sm text-medical-700">{item}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                        onClick={() => handleRemoveCurrentMedication(index)}
                        aria-label={`Remove ${item}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full bg-medical-600 hover:bg-medical-700 text-white mt-5">
              <Check className="mr-2 h-4 w-4" /> Save Information
            </Button>
            
            <div className="mt-4 text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg">
              Note: This information is for demo purposes and isn't stored or transmitted anywhere.
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;
