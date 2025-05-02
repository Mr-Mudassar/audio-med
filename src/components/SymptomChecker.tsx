
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useConversation } from '@/contexts/ConversationContext';

const severityColors = {
  mild: 'bg-green-100 text-green-800 border-green-200',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  severe: 'bg-red-100 text-red-800 border-red-200'
};

export const SymptomChecker = () => {
  const { symptoms, removeSymptom } = useConversation();
  
  if (symptoms.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Symptom Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No symptoms recorded yet. Start speaking to the assistant to register your symptoms.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Symptom Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-700 mb-3">Based on your conversation, we've identified the following symptoms:</p>
          
          <div className="flex flex-col gap-3">
            {symptoms.map((symptom, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Badge variant="outline" className={`${severityColors[symptom.severity]} px-2 py-1`}>
                  {symptom.severity}
                </Badge>
                
                <div className="flex-1">
                  <p className="font-medium capitalize">{symptom.name}</p>
                  <p className="text-xs text-gray-600">Duration: {symptom.duration}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => removeSymptom(symptom.name)}
                >
                  <X size={16} />
                  <span className="sr-only">Remove symptom</span>
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 italic">
            Note: This is a demo application. In a real application, the symptom assessment would be more comprehensive and based on NICE guidelines.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomChecker;
