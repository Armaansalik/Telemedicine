import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { aiTriage } from '../services/aiTriage';
import { Patient, TriageResult } from '../types';

interface VoiceSymptomCheckerProps {
  language: 'en' | 'pa';
  onResult: (result: TriageResult) => void;
}

export const VoiceSymptomChecker: React.FC<VoiceSymptomCheckerProps> = ({
  language,
  onResult
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
    voiceService.setLanguage(language);
  }, [language]);

  const startListening = async () => {
    try {
      setIsListening(true);
      const result = await voiceService.startListening();
      setTranscript(result);
      setIsListening(false);
      
      // Process the voice input for symptom analysis
      await processVoiceInput(result);
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const processVoiceInput = async (input: string) => {
    // Create a mock patient for demonstration
    const mockPatient: Patient = {
      id: 'voice-patient',
      name: 'Voice Patient',
      email: 'voice@example.com',
      phone: '1234567890',
      age: 35,
      currentSymptoms: input.split(' ').filter(word => 
        ['fever', 'headache', 'cough', 'pain', 'nausea', 'dizziness'].includes(word.toLowerCase())
      ),
      medicalHistory: [],
      triageScore: 0,
      priority: 'Low',
      appointmentTime: new Date().toISOString(),
      status: 'Waiting',
      isOnline: true
    };

    const result = aiTriage.analyzePatient(mockPatient);
    onResult(result);

    // Provide voice feedback
    setIsSpeaking(true);
    await aiTriage.provideVoiceRecommendation(result, language);
    setIsSpeaking(false);
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  const speakInstructions = async () => {
    const instructions = language === 'pa' 
      ? 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ। ਮਾਈਕ ਬਟਨ ਦਬਾਓ ਅਤੇ ਬੋਲੋ।'
      : 'Please describe your symptoms. Press the microphone button and speak.';
    
    setIsSpeaking(true);
    await voiceService.speak(instructions, language);
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          {language === 'pa' 
            ? 'ਆਵਾਜ਼ ਦੀ ਪਛਾਣ ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।'
            : 'Voice recognition is not supported in this browser.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {language === 'pa' ? 'ਆਵਾਜ਼ ਲੱਛਣ ਜਾਂਚਕਰਤਾ' : 'Voice Symptom Checker'}
        </h3>
        <p className="text-gray-600">
          {language === 'pa' 
            ? 'ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਬੋਲੋ ਅਤੇ AI ਤੁਹਾਡਾ ਮੁਲਾਂਕਣ ਕਰੇਗਾ'
            : 'Speak about your symptoms and AI will assess your condition'
          }
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={speakInstructions}
          disabled={isSpeaking}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          {language === 'pa' ? 'ਹਦਾਇਤਾਂ ਸੁਣੋ' : 'Hear Instructions'}
        </button>

        {isSpeaking ? (
          <button
            onClick={stopSpeaking}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <VolumeX className="w-4 h-4 mr-2" />
            {language === 'pa' ? 'ਰੋਕੋ' : 'Stop'}
          </button>
        ) : isListening ? (
          <button
            onClick={stopListening}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 animate-pulse"
          >
            <MicOff className="w-4 h-4 mr-2" />
            {language === 'pa' ? 'ਸੁਣਨਾ ਬੰਦ ਕਰੋ' : 'Stop Listening'}
          </button>
        ) : (
          <button
            onClick={startListening}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Mic className="w-4 h-4 mr-2" />
            {language === 'pa' ? 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ' : 'Start Speaking'}
          </button>
        )}
      </div>

      {transcript && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">
            {language === 'pa' ? 'ਤੁਸੀਂ ਕਿਹਾ:' : 'You said:'}
          </h4>
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}

      <div className="text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isListening 
            ? 'bg-green-100 text-green-800' 
            : isSpeaking 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isListening 
            ? (language === 'pa' ? 'ਸੁਣ ਰਿਹਾ ਹੈ...' : 'Listening...') 
            : isSpeaking 
            ? (language === 'pa' ? 'ਬੋਲ ਰਿਹਾ ਹੈ...' : 'Speaking...')
            : (language === 'pa' ? 'ਤਿਆਰ' : 'Ready')
          }
        </div>
      </div>
    </div>
  );
};