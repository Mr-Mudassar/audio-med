
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConversation } from '@/contexts/ConversationContext';
import { Pill } from 'lucide-react';

export const MedicationRecommendation = () => {
  const { medicationRecommendations, currentStep, patientInfo } = useConversation();
  
  if (medicationRecommendations.length === 0 || 
      currentStep === 'greeting' || 
      currentStep === 'ask-name' || 
      currentStep === 'ask-dob' || 
      currentStep === 'symptom-check') {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5 text-medical-600" />
            Medication Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {patientInfo.firstName ? 
              `After checking your symptoms, ${patientInfo.firstName}, we'll provide medication recommendations here.` :
              "After checking your symptoms, we'll provide medication recommendations here."}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group medications by condition if multiple conditions are detected
  const groupedByCondition: Record<string, any[]> = {};
  
  medicationRecommendations.forEach(medication => {
    const condition = medication.detectedCondition || 'Unknown';
    if (!groupedByCondition[condition]) {
      groupedByCondition[condition] = [];
    }
    groupedByCondition[condition].push(medication);
  });
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="mr-2 h-5 w-5 text-medical-600" />
          {patientInfo.firstName ? 
            `${patientInfo.firstName}'s Medication Recommendations` :
            "Medication Recommendations"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedByCondition).map(([condition, medications]) => (
            <div key={condition} className="mb-4">
              {condition !== 'Unknown' && (
                <h4 className="text-medical-700 font-medium mb-2 text-lg">
                  For {condition.charAt(0).toUpperCase() + condition.slice(1)}:
                </h4>
              )}
              
              <div className="space-y-3">
                {medications.map((medication, index) => (
                  <div key={index} className="p-3 bg-medical-100 rounded-lg">
                    <h3 className="font-medium text-lg text-medical-700">{medication.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                      <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                    </div>
                    
                    {medication.precautions && medication.precautions.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-amber-700">Important precautions:</p>
                        <ul className="mt-1 list-disc list-inside text-sm text-gray-700 space-y-1">
                          {medication.precautions.map((precaution, i) => (
                            <li key={i}>{precaution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-xs text-gray-500 italic">
            Note: These recommendations are simulated for demo purposes only. Always consult with a healthcare professional before taking any medication.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationRecommendation;
