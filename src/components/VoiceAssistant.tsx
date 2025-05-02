import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mic, MicOff, Stethoscope, Pill } from 'lucide-react';
import { useConversation } from '@/contexts/ConversationContext';
import { speak, startListening, extractSymptoms, getMedicationRecommendations } from '@/utils/speechUtils';
import { useIsMobile } from '@/hooks/use-mobile';

// Voice settings for Scottish female voice with multiple fallback options
const VOICE_SETTINGS = {
  voice: 'Google UK English Female',
  voiceAccent: 'Scottish',
  voiceSettings: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.0,
    use_speaker_boost: true
  },
  preferredVoiceGender: 'female' as 'female'
};

// Updated alternate voice options to ensure female voices
const ALTERNATE_VOICE_NAMES = [
  'Microsoft Hazel - English (United Kingdom)',
  'English United Kingdom Female',
  'en-GB-Standard-Female',
  'en-GB Female',
  'Google UK English Female',
  'British English Female',
  'Samantha',
  'Victoria',
  'en-US-Standard-Female',
  'en-US Female',
  'Google US English Female'
];

const PROCESSING_DELAY = 1000;

export const VoiceAssistant = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    isListening, 
    setIsListening,
    isSpeaking,
    setIsSpeaking,
    transcript,
    setTranscript,
    lastMessage,
    setLastMessage,
    symptoms,
    addSymptom,
    medicationRecommendations,
    setMedicationRecommendations,
    patientInfo,
    setPatientInfo,
    appointment,
    setAppointment,
    resetConversation
  } = useConversation();
  
  const { toast } = useToast();
  const stopListeningRef = useRef<(() => void) | null>(null);
  const isMobile = useIsMobile();
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedInitialGreeting = useRef(false);
  const [voiceIndex, setVoiceIndex] = useState(0);
  
  // Get current voice settings with stronger gender preference
  const getCurrentVoiceSettings = () => {
    const settings = {...VOICE_SETTINGS};
    if (voiceIndex > 0 && voiceIndex <= ALTERNATE_VOICE_NAMES.length) {
      settings.voice = ALTERNATE_VOICE_NAMES[voiceIndex - 1];
    }
    return settings;
  };
  
  // Initial greeting with immediate retry on failure
  useEffect(() => {
    if (currentStep === 'greeting' && !hasStartedInitialGreeting.current) {
      hasStartedInitialGreeting.current = true;
      
      // Allow the component to fully mount before starting speech
      setTimeout(() => {
        const introduction = "Hello, I'm your medical assistant. Could you please tell me your first name?";
        handleSpeak(introduction).catch(() => {
          console.warn("Initial greeting failed, trying again with next voice");
          // If the first attempt fails, try the next voice immediately
          setVoiceIndex(prev => Math.min(prev + 1, ALTERNATE_VOICE_NAMES.length));
          setTimeout(() => handleSpeak(introduction), 500);
        });
        setLastMessage(introduction);
        setCurrentStep('ask-name');
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Stop listening if user silent for a while
  useEffect(() => {
    if (transcript && isListening) {
      const silenceTimeout = setTimeout(() => {
        if (isListening && stopListeningRef.current) {
          stopListeningRef.current();
          stopListeningRef.current = null;
          setIsListening(false);
          processTranscript();
        }
      }, 3000);
      
      return () => clearTimeout(silenceTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  // Process transcript when listening stops
  useEffect(() => {
    if (!isListening && transcript && !isSpeaking && !isProcessing) {
      const timeoutId = setTimeout(() => {
        processTranscript();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Clean up timeouts
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript, isSpeaking, isProcessing]);

  // Utility function to safely split text into sentences
  const splitIntoSentences = (text: string): string[] => {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  };

  const processTranscript = async () => {
    if (!transcript || isProcessing) return;
    
    setIsProcessing(true);
    
    const lowerTranscript = transcript.toLowerCase();
    console.log('Processing transcript:', lowerTranscript, 'Current step:', currentStep);
    
    // Generic responses
    if ((lowerTranscript.includes('hello') || lowerTranscript.includes('hi')) && currentStep === 'greeting') {
      await handleSpeak("Hello! Could you please tell me your first name?");
      setCurrentStep('ask-name');
      setTranscript('');
      setIsProcessing(false);
      return;
    }
    
    if (lowerTranscript.includes('thank you') || lowerTranscript.includes('thanks')) {
      await handleSpeak("You're welcome! Let's continue with your health assessment.");
      setTranscript('');
      setIsProcessing(false);
      return;
    }
    
    // Process based on conversation step
    switch (currentStep) {
      case 'greeting':
        await handleSpeak("Hello, I'm your medical assistant. Could you please tell me your first name?");
        setCurrentStep('ask-name');
        break;
        
      case 'ask-name':
        // Extract name from transcript
        let extractedName = "";
        if (lowerTranscript.includes('my name is')) {
          extractedName = transcript.split('my name is')[1].trim().split(' ')[0];
        } else {
          extractedName = transcript.trim().split(' ')[0];
        }
        
        extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
        
        // Update patientInfo state
        setPatientInfo({
          ...patientInfo,
          firstName: extractedName,
          name: extractedName
        });
        
        console.log(`Name collected: ${extractedName}, moving to ask-dob step`);
        
        await handleSpeak(`Thank you, ${extractedName}. Now, please tell me your date of birth.`);
        setCurrentStep('ask-dob');
        break;
        
      case 'ask-dob':
        const dateOfBirth = transcript.trim();
        
        setPatientInfo({
          ...patientInfo,
          dateOfBirth
        });
        
        console.log(`Date of birth collected: ${dateOfBirth}, moving to symptom-check step`);
        
        await handleSpeak(`Thank you for providing your date of birth. Now, ${patientInfo.firstName}, what medical issues are you experiencing? Please describe your symptoms.`);
        setCurrentStep('symptom-check');
        break;

      case 'symptom-check':
        const extractedSymptom = extractSymptoms(lowerTranscript);
        
        // Check for transition phrases
        if (lowerTranscript.includes('no') || 
            lowerTranscript.includes('that\'s all') || 
            lowerTranscript.includes('nothing else') ||
            lowerTranscript.includes('that is all') ||
            lowerTranscript.includes('no more')) {
          if (symptoms.length > 0) {
            console.log("User confirmed no more symptoms, moving to medication step");
            
            const recommendations = getMedicationRecommendations(symptoms.map(s => s.name));
            setMedicationRecommendations(recommendations);
            
            let response = `Thank you, ${patientInfo.firstName}. Based on the symptoms you've shared, `;
            
            const diseaseDetected = recommendations.some(med => 
              med.detectedCondition && ['flu', 'common cold', 'migraine', 'hypertension', 'diabetes'].includes(med.detectedCondition)
            );
            
            if (diseaseDetected && recommendations[0].detectedCondition) {
              response += "you may be experiencing " + recommendations[0].detectedCondition + ". ";
            }
            
            response += "I recommend the following: ";
            recommendations.forEach((med, index) => {
              if (index > 0) response += index === recommendations.length - 1 ? " and " : ", ";
              response += `${med.name}, ${med.dosage}, to be taken ${med.frequency}`;
            });
            
            response += ". Would you like to schedule an appointment with a doctor for further assessment?";
            
            await handleSpeak(response);
            setCurrentStep('appointment');
            setTranscript('');
            setIsProcessing(false);
            return;
          } else {
            await handleSpeak("Thank you. I haven't recorded any symptoms yet. Could you please describe what you're experiencing?");
          }
        }
        else if (extractedSymptom) {
          addSymptom(extractedSymptom);
          
          const isDisease = ['flu', 'common cold', 'migraine', 'hypertension', 'diabetes'].includes(extractedSymptom.name);
          
          let response = `Thank you. I see you're ${isDisease ? 'might be experiencing ' : 'experiencing '}${extractedSymptom.name}`;
          
          if (!isDisease) {
            response += ` with ${extractedSymptom.severity} severity for ${extractedSymptom.duration}`;
          }
          
          response += ". Are you having any other symptoms? If not, please say 'no' or 'that's all'.";
          
          await handleSpeak(response);
        } else {
          await handleSpeak("Thank you. I'm here to help with your medical concerns. Can you tell me about any symptoms you're experiencing? When you're done sharing symptoms, please say 'no' or 'that's all'.");
        }
        break;
        
      case 'appointment':
        console.log("Processing appointment response:", lowerTranscript);
        
        if (lowerTranscript.includes('yes') || 
            lowerTranscript.includes('schedule') || 
            lowerTranscript.includes('appointment')) {
          
          await handleSpeak(`Thank you, ${patientInfo.firstName}. I can help you schedule an appointment. For this demo, we'll just simulate the booking. In a full implementation, you would be able to select from available dates and doctors. Would you like a virtual or in-person appointment?`);
          setCurrentStep('appointment-type');
        } else if (lowerTranscript.includes('no') || lowerTranscript.includes('not now')) {
          await handleSpeak(`Thank you, ${patientInfo.firstName}. Let me summarize the information we've discussed today.`);
          setCurrentStep('summary');
        } else {
          await handleSpeak(`I'll take that as a yes. I can help you schedule an appointment. For this demo, we'll just simulate the booking. In a full implementation, you would be able to select from available dates and doctors. Would you like a virtual or in-person appointment?`);
          setCurrentStep('appointment-type');
        }
        break;
      
      case 'appointment-type':
        console.log("Processing appointment type:", lowerTranscript);
        
        if (lowerTranscript.includes('virtual')) {
          setAppointment({
            ...appointment,
            type: 'virtual'
          });
          
          await handleSpeak(`Thank you, ${patientInfo.firstName}. I've scheduled a virtual appointment for you. Let me summarize the information we've discussed today.`);
          setCurrentStep('summary');
        } else if (lowerTranscript.includes('person') || lowerTranscript.includes('in person') || lowerTranscript.includes('in-person')) {
          setAppointment({
            ...appointment,
            type: 'in-person'
          });
          
          await handleSpeak(`Thank you, ${patientInfo.firstName}. I've scheduled an in-person appointment for you. Let me summarize the information we've discussed today.`);
          setCurrentStep('summary');
        } else {
          setAppointment({
            ...appointment,
            type: 'virtual'
          });
          
          await handleSpeak(`I'll schedule a virtual appointment for you. Let me summarize the information we've discussed today.`);
          setCurrentStep('summary');
        }
        break;
        
      case 'summary':
        // Final summary with enhanced speaking logic
        let summaryResponse = `Thank you for using our medical advisor, ${patientInfo.firstName}. To summarize: `;
        summaryResponse += `You reported ${symptoms.length} symptom${symptoms.length !== 1 ? 's' : ''}. `;
        symptoms.forEach((s, i) => {
          summaryResponse += `${i > 0 ? 'And ' : ''}${s.name} with ${s.severity} severity for ${s.duration}. `;
        });
        
        if (medicationRecommendations.length > 0) {
          const possibleDisease = medicationRecommendations.find(med => 
            med.detectedCondition && ['flu', 'common cold', 'migraine', 'hypertension', 'diabetes'].includes(med.detectedCondition));
          
          if (possibleDisease && possibleDisease.detectedCondition) {
            summaryResponse += `Based on your symptoms, you may be experiencing ${possibleDisease.detectedCondition}. `;
          }
          
          summaryResponse += "I've recommended medications including ";
          medicationRecommendations.forEach((med, i) => {
            if (i > 0) summaryResponse += i === medicationRecommendations.length - 1 ? " and " : ", ";
            summaryResponse += med.name;
          });
          summaryResponse += ". ";
        }
        
        if (appointment.type) {
          summaryResponse += `A ${appointment.type} appointment has been scheduled. `;
        }
        
        summaryResponse += "The booking is scheduled and we have sent the confirmation on your phone number as well as on your email. Thank you for using our service. Is there anything else I can assist you with today?";
        
        console.log("Speaking summary: ", summaryResponse);
        
        await handleSpeak(summaryResponse);
        break;
    }
    
    // Clear transcript after processing
    setTranscript('');
    setIsProcessing(false);
  };

  const toggleListening = () => {
    // Don't allow toggle if processing or AI is speaking
    if (isProcessing || isSpeaking) return;
    
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
    } else {
      startSpeechRecognition();
    }
  };
  
  const startSpeechRecognition = () => {
    try {
      const stopListening = startListening({
        onStart: () => setIsListening(true),
        onResult: (text) => setTranscript(text),
        onEnd: () => {
          setIsListening(false);
          
          if (transcript) {
            setTimeout(() => {
              processTranscript();
            }, 100);
          }
        },
        onError: (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
          toast({
            title: 'Speech Recognition Error',
            description: 'There was an issue with the speech recognition. Please try again.',
            variant: 'destructive',
          });
        }
      });
      
      stopListeningRef.current = stopListening;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: 'Speech Recognition Unavailable',
        description: 'Your browser may not support speech recognition or you need to grant microphone permissions.',
        variant: 'destructive',
      });
    }
  };

  // Improved speak handler with better error handling
  const handleSpeak = async (message: string): Promise<void> => {
    // Update UI immediately
    setLastMessage(message);
    
    try {
      setIsSpeaking(true);
      console.log("Speaking:", message.substring(0, 30) + (message.length > 30 ? "..." : ""));
      
      const currentVoiceSettings = getCurrentVoiceSettings();
      
      return new Promise((resolve, reject) => {
        speak(
          message,
          () => {
            console.log("Speech started for:", message.substring(0, 15) + "...");
          },
          () => {
            console.log("Speech completed for:", message.substring(0, 15) + "...");
            setIsSpeaking(false);
            resolve();
          },
          currentVoiceSettings
        );
        
        // Safety timeout that's longer than the one in speak function
        const timeoutId = setTimeout(() => {
          console.log("handleSpeak safety timeout reached for:", message.substring(0, 15) + "...");
          setIsSpeaking(false);
          if (voiceIndex < ALTERNATE_VOICE_NAMES.length) {
            setVoiceIndex(voiceIndex + 1);
            console.log(`Switching to next voice: ${ALTERNATE_VOICE_NAMES[voiceIndex]}`);
          }
          reject(new Error("Speech synthesis timeout"));
        }, message.length * 80 + 8000);
        
        speakingTimeoutRef.current = timeoutId;
      });
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
      toast({
        title: 'Speech Error',
        description: 'There was an issue with speech synthesis. Please try again.',
        variant: 'destructive',
      });
      
      // Try next voice on error
      if (voiceIndex < ALTERNATE_VOICE_NAMES.length) {
        setVoiceIndex(voiceIndex + 1);
      }
      
      return Promise.reject(error);
    }
  };

  return (
    <Card className="p-4 md:p-6 shadow-lg bg-white rounded-xl">
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 relative">
          {isSpeaking ? (
            <div className="flex items-center justify-center h-full">
              <div className="voice-wave animate-wave1"></div>
              <div className="voice-wave animate-wave2"></div>
              <div className="voice-wave animate-wave3"></div>
              <div className="voice-wave animate-wave4"></div>
              <div className="voice-wave animate-wave5"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              {isListening ? (
                <>
                  <div className="absolute inset-0 bg-medical-400/30 rounded-full animate-pulse-ring"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mic size={isMobile ? 24 : 32} className="text-medical-600" />
                  </div>
                </>
              ) : (
                <Stethoscope size={isMobile ? 24 : 32} className="text-medical-500" />
              )}
            </div>
          )}
        </div>
        
        <div className="mb-3 md:mb-4 px-3 md:px-4 py-2 md:py-3 bg-medical-100 rounded-xl w-full max-w-md text-sm md:text-base">
          <p className="text-gray-700">{lastMessage}</p>
        </div>
        
        {transcript && (
          <div className="mb-3 md:mb-4 px-3 md:px-4 py-2 bg-gray-100 rounded-lg w-full max-w-md text-sm md:text-base">
            <p className="text-gray-600 italic">"{transcript}"</p>
          </div>
        )}
        
        <div className="mb-2 text-xs text-gray-500">
          <p>Current step: {currentStep}</p>
          {symptoms.length > 0 && <p>Symptoms detected: {symptoms.map(s => s.name).join(', ')}</p>}
          {isProcessing && <p>Processing your input...</p>}
        </div>
        
        <div className="flex gap-3 md:gap-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size={isMobile ? "default" : "lg"}
            className={`${isListening ? 'bg-red-500' : 'bg-medical-500'} text-white rounded-full px-4 md:px-6`}
            onClick={toggleListening}
            disabled={isSpeaking || isProcessing}
          >
            {isListening ? 
              <><MicOff className="mr-2" size={isMobile ? 16 : 18} /> {isMobile ? "Stop" : "Stop Listening"}</> : 
              <><Mic className="mr-2" size={isMobile ? 16 : 18} /> {isMobile ? "Start" : "Start Listening"}</>
            }
          </Button>
        </div>
        
        <div className="mt-3 md:mt-4 text-xs text-gray-500 italic flex items-center justify-center px-2 text-center">
          <Pill size={12} className="mr-1 flex-shrink-0" />
          <span>Try saying: "My name is John" or "I have a headache" or "No more symptoms"</span>
        </div>
      </div>
    </Card>
  );
};

export default VoiceAssistant;
