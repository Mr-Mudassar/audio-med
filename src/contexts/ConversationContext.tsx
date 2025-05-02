
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ConversationStep = 'greeting' | 'ask-name' | 'ask-dob' | 'symptom-check' | 'medication' | 'appointment' | 'appointment-type' | 'summary';

interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

interface MedicationRecommendation {
  name: string;
  dosage: string;
  frequency: string;
  precautions: string[];
  detectedCondition?: string;
}

interface Appointment {
  date: Date | null;
  time: string;
  doctor: string;
  type: 'virtual' | 'in-person';
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  medicalHistory: string[];
  currentMedications: string[];
  firstName: string;
  dateOfBirth: string;
}

interface ConversationContextType {
  currentStep: ConversationStep;
  setCurrentStep: (step: ConversationStep) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  lastMessage: string;
  setLastMessage: (message: string) => void;
  symptoms: Symptom[];
  addSymptom: (symptom: Symptom) => void;
  removeSymptom: (name: string) => void;
  medicationRecommendations: MedicationRecommendation[];
  setMedicationRecommendations: (recommendations: MedicationRecommendation[]) => void;
  appointment: Appointment;
  setAppointment: (appointment: Appointment) => void;
  patientInfo: PatientInfo;
  setPatientInfo: (info: PatientInfo) => void;
  resetConversation: () => void;
}

const defaultPatientInfo: PatientInfo = {
  name: '',
  age: 0,
  gender: '',
  medicalHistory: [],
  currentMedications: [],
  firstName: '',
  dateOfBirth: ''
};

const defaultAppointment: Appointment = {
  date: null,
  time: '',
  doctor: '',
  type: 'virtual'
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [medicationRecommendations, setMedicationRecommendations] = useState<MedicationRecommendation[]>([]);
  const [appointment, setAppointment] = useState<Appointment>(defaultAppointment);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(defaultPatientInfo);

  const addSymptom = (symptom: Symptom) => {
    setSymptoms(prev => [...prev, symptom]);
  };

  const removeSymptom = (name: string) => {
    setSymptoms(prev => prev.filter(s => s.name !== name));
  };

  const resetConversation = () => {
    setCurrentStep('greeting');
    setTranscript('');
    setLastMessage('');
    setSymptoms([]);
    setMedicationRecommendations([]);
    setAppointment(defaultAppointment);
    setPatientInfo(defaultPatientInfo);
  };

  return (
    <ConversationContext.Provider
      value={{
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
        removeSymptom,
        medicationRecommendations,
        setMedicationRecommendations,
        appointment,
        setAppointment,
        patientInfo,
        setPatientInfo,
        resetConversation
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
