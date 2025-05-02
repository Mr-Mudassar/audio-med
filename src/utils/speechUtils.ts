// Extend the original file with voice settings support
import { toast } from 'sonner';

interface SpeechRecognitionOptions {
  onStart: () => void;
  onResult: (text: string) => void;
  onEnd: () => void;
  onError: (error: Error) => void;
}

interface VoiceSettings {
  voice?: string;
  voiceSettings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  voiceAccent?: string;
  preferredVoiceGender?: 'male' | 'female';
}

// Speech recognition function to listen to user input
export const startListening = (options: SpeechRecognitionOptions) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error('Speech recognition not supported in this browser');
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  let finalTranscript = '';
  
  recognition.onstart = () => {
    console.info('Speech recognition started');
    finalTranscript = '';
    options.onStart();
  };
  
  recognition.onresult = (event) => {
    let interimTranscript = '';
    
    // Fix for TypeScript error - use event.results index
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    const fullTranscript = finalTranscript + interimTranscript;
    console.info('Transcript:', fullTranscript);
    options.onResult(fullTranscript);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    options.onError(new Error(event.error));
  };
  
  recognition.onend = () => {
    console.info('Speech recognition ended');
    options.onEnd();
  };
  
  recognition.start();
  
  return () => {
    recognition.stop();
  };
};

// Improved speech synthesis with better error handling and voice consistency
export const speak = (
  text: string, 
  onStart: () => void = () => {}, 
  onEnd: () => void = () => {},
  voiceSettings?: VoiceSettings
) => {
  console.info('Speech started with text:', text.substring(0, 50) + '...');
  
  // Get speech synthesis
  const synth = window.speechSynthesis;

  if (!synth) {
    console.error('Speech synthesis not supported');
    toast.error('Speech synthesis not supported in this browser');
    onEnd();
    return;
  }

  // Signal start at the beginning to update UI sooner
  onStart();
  
  try {
    // Cancel any ongoing speech to prevent conflicts
    if (synth.speaking) {
      synth.cancel();
      // Small delay to ensure cancel completes
      setTimeout(() => processSpeech(), 100);
    } else {
      processSpeech();
    }
  } catch (error) {
    console.error('Error in speech synthesis initialization:', error);
    onEnd();
  }

  function processSpeech() {
    try {
      // Force load voices synchronously before continuing
      let voices = synth.getVoices();
      
      // If voices are empty, try to wait for voiceschanged event
      if (voices.length === 0) {
        console.warn('No voices available yet, waiting for voiceschanged event');
        const voicesChangedHandler = () => {
          voices = synth.getVoices();
          if (voices.length > 0) {
            synth.removeEventListener('voiceschanged', voicesChangedHandler);
            continueWithVoices(voices);
          }
        };
        
        synth.addEventListener('voiceschanged', voicesChangedHandler);
        
        // Safety timeout in case the voiceschanged event never fires
        setTimeout(() => {
          synth.removeEventListener('voiceschanged', voicesChangedHandler);
          voices = synth.getVoices();
          if (voices.length === 0) {
            console.error('No voices available after waiting');
            onEnd();
          } else {
            continueWithVoices(voices);
          }
        }, 1000);
      } else {
        continueWithVoices(voices);
      }
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      onEnd();
    }
  }
  
  function continueWithVoices(voices: SpeechSynthesisVoice[]) {
    try {
      // Create utterance for the entire text
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set default voice properties
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      
      // Apply voice settings with improved female voice selection
      if (voiceSettings) {
        applyVoiceSettings(utterance, voices, voiceSettings);
      }
      
      // Debug voice selection
      if (utterance.voice) {
        console.info('Selected voice:', utterance.voice.name, '(Gender:', 
          isFemaleVoice(utterance.voice.name) ? 'female' : 'male', ')');
      } else {
        console.warn('No voice was selected, using browser default');
      }
      
      let hasEnded = false;
      
      utterance.onstart = () => {
        console.info('Speech synthesis started successfully');
      };
      
      utterance.onend = () => {
        if (!hasEnded) {
          hasEnded = true;
          onEnd();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        if (!hasEnded) {
          hasEnded = true;
          onEnd();
        }
      };
      
      // Safety timeout in case speech synthesis gets stuck
      const timeoutMs = Math.max(5000, text.length * 80);
      const timeoutId = setTimeout(() => {
        if (!hasEnded) {
          console.info(`Speech timeout reached after ${timeoutMs}ms`);
          synth.cancel();
          hasEnded = true;
          onEnd();
        }
      }, timeoutMs);
      
      // Speak immediately without delays
      synth.speak(utterance);
      
      // If the speech doesn't start within a reasonable time, trigger onEnd
      setTimeout(() => {
        if (!synth.speaking && !hasEnded) {
          console.warn('Speech failed to start, triggering end callback');
          hasEnded = true;
          onEnd();
        }
      }, 1000);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      onEnd();
    }
  }
};

// Helper function to detect female voices based on name patterns
function isFemaleVoice(voiceName: string): boolean {
  const femaleKeywords = [
    'female', 'woman', 'girl', 'fiona', 'alice', 'kathy', 'karen', 'victoria', 
    'sarah', 'samantha', 'moira', 'tessa', 'veena', 'serena', 'hazel', 'lisa',
    'amy', 'emily', 'hannah', 'zira', 'susan', 'mary', 'elizabeth', 'joana'
  ];
  
  const lowerName = voiceName.toLowerCase();
  return femaleKeywords.some(keyword => lowerName.includes(keyword));
}

function applyVoiceSettings(
  utterance: SpeechSynthesisUtterance, 
  voices: SpeechSynthesisVoice[],
  voiceSettings: VoiceSettings
) {
  // Map for common accents to their language codes
  const accentMap: {[key: string]: string} = {
    'Scottish': 'en-GB',
    'British': 'en-GB',
    'American': 'en-US',
    'Australian': 'en-AU',
    'Irish': 'en-IE',
    'Indian': 'en-IN'
  };
  
  // Always prioritize gender preference
  const wantsFemaleVoice = voiceSettings.preferredVoiceGender === 'female' || 
                          voiceSettings.voiceAccent === 'Scottish';
  
  // First, try to find the exact requested voice by name
  if (voiceSettings.voice && voices.length > 0) {
    // Try exact match
    let matchedVoice = voices.find(v => 
      v.name.toLowerCase() === voiceSettings.voice?.toLowerCase()
    );
    
    // If no exact match, try partial match
    if (!matchedVoice) {
      matchedVoice = voices.find(v => 
        v.name.toLowerCase().includes(voiceSettings.voice?.toLowerCase() || '')
      );
    }
    
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      console.info('Found exact voice match:', matchedVoice.name);
    }
  }
  
  // If not found by name or no name provided, try to find by accent and gender
  if (!utterance.voice && voices.length > 0) {
    // Determine accent language code
    const accentCode = voiceSettings.voiceAccent ? (accentMap[voiceSettings.voiceAccent] || 'en-GB') : 'en-GB';
    
    // Get voices matching the accent language code
    const accentVoices = voices.filter(v => v.lang.includes(accentCode));
    
    if (accentVoices.length > 0) {
      // Filter by gender if preferred gender is specified
      const genderVoices = accentVoices.filter(v => {
        if (wantsFemaleVoice) {
          return isFemaleVoice(v.name);
        }
        // If male is preferred, use voices that don't match female patterns
        if (voiceSettings.preferredVoiceGender === 'male') {
          return !isFemaleVoice(v.name);
        }
        // Default to any voice in the right accent
        return true;
      });
      
      if (genderVoices.length > 0) {
        utterance.voice = genderVoices[0];
        console.info('Found voice by accent and gender:', utterance.voice.name);
      } else {
        // Fallback to first voice in the right accent
        utterance.voice = accentVoices[0];
        console.info('Found voice by accent only:', utterance.voice.name);
      }
    }
  }
  
  // Additional fallback: try any English voice if nothing else matched
  if (!utterance.voice && voices.length > 0) {
    const englishVoices = voices.filter(v => v.lang.includes('en'));
    
    // Try to match gender preference first
    const genderFilteredVoices = wantsFemaleVoice
      ? englishVoices.filter(v => isFemaleVoice(v.name))
      : englishVoices.filter(v => !isFemaleVoice(v.name) || voiceSettings.preferredVoiceGender !== 'female');
      
    if (genderFilteredVoices.length > 0) {
      utterance.voice = genderFilteredVoices[0];
      console.info('Found English voice with preferred gender:', utterance.voice.name);
    } else if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
      console.info('Found any English voice:', utterance.voice.name);
    }
  }
  
  // Final fallback: just use the default voice
  if (!utterance.voice && voices.length > 0) {
    utterance.voice = voices[0];
    console.info('Using default voice as fallback:', utterance.voice.name);
  }
  
  // Specific adjustments for Scottish voice 
  if (voiceSettings.voiceAccent === 'Scottish') {
    utterance.pitch = 1.05;
    utterance.rate = 0.95;
  }
}

// Function to extract symptoms from text
export function extractSymptoms(text: string) {
  // Common symptoms we want to detect
  const symptoms = [
    { name: 'headache', severity: 'moderate', duration: 'recently' },
    { name: 'migraine', severity: 'severe', duration: 'recently' },
    { name: 'fever', severity: 'moderate', duration: 'recently' },
    { name: 'cough', severity: 'mild', duration: 'recently' },
    { name: 'sore throat', severity: 'moderate', duration: 'recently' },
    { name: 'runny nose', severity: 'mild', duration: 'recently' },
    { name: 'upset stomach', severity: 'moderate', duration: 'recently' },
    { name: 'nausea', severity: 'moderate', duration: 'recently' },
    { name: 'diarrhea', severity: 'moderate', duration: 'recently' },
    { name: 'constipation', severity: 'mild', duration: 'recently' },
    { name: 'back pain', severity: 'moderate', duration: 'recently' },
    { name: 'joint pain', severity: 'moderate', duration: 'recently' },
    { name: 'rash', severity: 'mild', duration: 'recently' },
    { name: 'itching', severity: 'mild', duration: 'recently' },
    { name: 'chest pain', severity: 'severe', duration: 'recently' },
    { name: 'shortness of breath', severity: 'moderate', duration: 'recently' },
    { name: 'dizziness', severity: 'moderate', duration: 'recently' },
    { name: 'fatigue', severity: 'moderate', duration: 'recently' },
    { name: 'flu', severity: 'moderate', duration: 'recently' },
    { name: 'common cold', severity: 'mild', duration: 'recently' },
    { name: 'hypertension', severity: 'moderate', duration: 'chronic' },
    { name: 'diabetes', severity: 'moderate', duration: 'chronic' }
  ];

  // First, check for explicit severity mentions
  let detectedSeverity: 'mild' | 'moderate' | 'severe' = 'moderate';
  if (text.includes('severe') || text.includes('really bad') || text.includes('very bad') || text.includes('terrible')) {
    detectedSeverity = 'severe';
  } else if (text.includes('mild') || text.includes('slight') || text.includes('little')) {
    detectedSeverity = 'mild';
  }
  
  // Check for duration mentions
  let detectedDuration = 'recently';
  if (text.includes('week') || text.includes('weeks')) {
    detectedDuration = text.includes('weeks') ? 'several weeks' : 'about a week';
  } else if (text.includes('day') || text.includes('days')) {
    detectedDuration = text.includes('days') ? 'a few days' : 'a day';
  } else if (text.includes('hour') || text.includes('hours')) {
    detectedDuration = text.includes('hours') ? 'a few hours' : 'an hour';
  } else if (text.includes('month') || text.includes('months') || text.includes('chronic') || text.includes('long time')) {
    detectedDuration = 'chronic';
  }
  
  // Try to find a symptom in the text
  for (const symptom of symptoms) {
    if (text.includes(symptom.name)) {
      return {
        name: symptom.name,
        severity: detectedSeverity,
        duration: detectedDuration
      };
    }
  }
  
  // No specific symptom detected
  return null;
}

// Function to get medication recommendations based on symptoms
export function getMedicationRecommendations(symptoms: string[]) {
  const medications = [];

  // Check for common medical conditions based on symptoms
  if (symptoms.includes('headache') || symptoms.includes('migraine')) {
    if (symptoms.includes('migraine')) {
      medications.push({
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'as needed, max 200mg per day',
        precautions: ['Do not use if you have heart problems', 'Avoid alcohol'],
        detectedCondition: 'migraine'
      });
    } else {
      medications.push({
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'every 6-8 hours as needed',
        precautions: ['Take with food', 'Do not exceed 1200mg in 24 hours'],
        detectedCondition: 'headache'
      });
    }
  }
  
  if (symptoms.includes('fever') || symptoms.includes('flu') || symptoms.includes('common cold')) {
    medications.push({
      name: 'Acetaminophen',
      dosage: '500mg',
      frequency: 'every 6 hours as needed',
      precautions: ['Do not exceed 4000mg in 24 hours', 'Avoid alcohol'],
      detectedCondition: symptoms.includes('flu') ? 'flu' : (symptoms.includes('common cold') ? 'common cold' : undefined)
    });
  }
  
  if (symptoms.includes('cough') || symptoms.includes('sore throat') || symptoms.includes('runny nose')) {
    medications.push({
      name: 'Dextromethorphan',
      dosage: '30mg',
      frequency: 'every 6-8 hours as needed',
      precautions: ['Do not use with MAO inhibitors'],
      detectedCondition: 'common cold'
    });
  }
  
  if (symptoms.includes('upset stomach') || symptoms.includes('nausea')) {
    medications.push({
      name: 'Bismuth Subsalicylate',
      dosage: '30ml or 2 tablets',
      frequency: 'every 30-60 minutes as needed',
      precautions: ['Do not exceed 8 doses in 24 hours', 'May cause darkening of tongue or stool'],
      detectedCondition: undefined
    });
  }
  
  if (symptoms.includes('diarrhea')) {
    medications.push({
      name: 'Loperamide',
      dosage: '2mg',
      frequency: 'after each loose stool, max 8mg per day',
      precautions: ['If symptoms persist for more than 2 days, consult a doctor'],
      detectedCondition: undefined
    });
  }
  
  if (symptoms.includes('constipation')) {
    medications.push({
      name: 'Docusate Sodium',
      dosage: '100mg',
      frequency: 'once daily',
      precautions: ['Drink plenty of water', 'Effects may take 1-3 days'],
      detectedCondition: undefined
    });
  }
  
  if (symptoms.includes('back pain') || symptoms.includes('joint pain')) {
    medications.push({
      name: 'Naproxen',
      dosage: '220mg',
      frequency: 'every 8-12 hours as needed',
      precautions: ['Take with food', 'Do not exceed 660mg in 24 hours'],
      detectedCondition: undefined
    });
  }
  
  if (symptoms.includes('rash') || symptoms.includes('itching')) {
    medications.push({
      name: 'Diphenhydramine',
      dosage: '25mg',
      frequency: 'every 4-6 hours as needed',
      precautions: ['May cause drowsiness', 'Avoid alcohol'],
      detectedCondition: undefined
    });
  }
  
  if (symptoms.includes('chest pain')) {
    medications.push({
      name: 'Aspirin',
      dosage: '325mg',
      frequency: 'chew one tablet immediately and call 911',
      precautions: ['This is for emergency use only', 'Seek immediate medical attention'],
      detectedCondition: 'possible cardiac event'
    });
  }
  
  if (symptoms.includes('hypertension') || symptoms.includes('high blood pressure')) {
    medications.push({
      name: 'Consult Doctor',
      dosage: 'N/A',
      frequency: 'N/A',
      precautions: ['Prescription required', 'Regular monitoring needed'],
      detectedCondition: 'hypertension'
    });
  }
  
  if (symptoms.includes('diabetes')) {
    medications.push({
      name: 'Consult Doctor',
      dosage: 'N/A',
      frequency: 'N/A',
      precautions: ['Prescription required', 'Regular monitoring needed'],
      detectedCondition: 'diabetes'
    });
  }
  
  // Default if no matched recommendations
  if (medications.length === 0) {
    medications.push({
      name: 'Consult a healthcare provider',
      dosage: 'N/A',
      frequency: 'As soon as possible',
      precautions: ['Self-diagnosis is not recommended for unidentified symptoms'],
      detectedCondition: undefined
    });
  }
  
  return medications;
}
