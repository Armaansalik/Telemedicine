import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, User, Activity } from 'lucide-react';
import { Patient, TriageResult } from '../types';
import { aiTriage } from '../services/aiTriage';
import { offlineStorage } from '../services/offlineStorage';

interface PatientTriageProps {
  onPatientTriaged: (patient: Patient) => void;
  language?: 'en' | 'pa';
}

export const PatientTriage: React.FC<PatientTriageProps> = ({ 
  onPatientTriaged, 
  language = 'en' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    symptoms: '',
    medicalHistory: ''
  });
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isOffline, setIsOffline] = useState(offlineStorage.isOffline());

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(offlineStorage.isOffline());
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient: Patient = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      currentSymptoms: formData.symptoms.split(',').map(s => s.trim()),
      medicalHistory: formData.medicalHistory.split(',').map(s => s.trim()),
      triageScore: 0,
      priority: 'Low',
      appointmentTime: new Date().toISOString(),
      status: 'Waiting',
      isOnline: !isOffline
    };

    // AI Triage Analysis
    const result = aiTriage.analyzePatient(patient);
    patient.triageScore = result.score;
    patient.priority = result.priority;
    
    setTriageResult(result);
    
    // Store patient data (offline-capable)
    await offlineStorage.storePatient(patient);
    onPatientTriaged(patient);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      symptoms: '',
      medicalHistory: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {isOffline && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
          <span className="text-amber-800">
            {language === 'pa' 
              ? 'ਔਫਲਾਈਨ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ - ਕਨੈਕਸ਼ਨ ਬਹਾਲ ਹੋਣ ਤੇ ਡੇਟਾ ਸਿੰਕ ਹੋਵੇਗਾ'
              : 'Working offline - data will sync when connection is restored'
            }
          </span>
        </div>
      )}

      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'pa' ? 'AI-ਸੰਚਾਲਿਤ ਮਰੀਜ਼ ਟ੍ਰਾਈਏਜ' : 'AI-Powered Patient Triage'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'pa' ? 'ਮਰੀਜ਼ ਦਾ ਨਾਮ' : 'Patient Name'}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'pa' ? 'ਉਮਰ' : 'Age'}
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'pa' ? 'ਈਮੇਲ' : 'Email'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'pa' ? 'ਫੋਨ' : 'Phone'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'pa' ? 'ਮੌਜੂਦਾ ਲੱਛਣ (ਕਾਮੇ ਨਾਲ ਵੱਖ ਕੀਤੇ)' : 'Current Symptoms (comma-separated)'}
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'pa' ? 'ਜਿਵੇਂ, ਬੁਖਾਰ, ਸਿਰ ਦਰਦ, ਖੰਘ' : 'e.g., fever, headache, cough'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'pa' ? 'ਮੈਡੀਕਲ ਇਤਿਹਾਸ (ਕਾਮੇ ਨਾਲ ਵੱਖ ਕੀਤੇ)' : 'Medical History (comma-separated)'}
          </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'pa' ? 'ਜਿਵੇਂ, ਸ਼ੂਗਰ, ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ' : 'e.g., diabetes, hypertension'}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          <User className="w-4 h-4 mr-2" />
          {language === 'pa' ? 'ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਮਰੀਜ਼ ਰਜਿਸਟਰ ਕਰੋ' : 'Analyze & Register Patient'}
        </button>
      </form>

      {triageResult && (
        <div className={`mt-6 p-4 rounded-lg border-2 ${getPriorityColor(triageResult.priority)}`}>
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">
              {language === 'pa' ? 'ਟ੍ਰਾਈਏਜ ਨਤੀਜਾ' : 'Triage Result'}
            </h3>
          </div>
          <div className="space-y-2">
            <p><strong>{language === 'pa' ? 'ਤਰਜੀਹ:' : 'Priority:'}</strong> {triageResult.priority}</p>
            <p><strong>{language === 'pa' ? 'ਟ੍ਰਾਈਏਜ ਸਕੋਰ:' : 'Triage Score:'}</strong> {triageResult.score}/10</p>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span><strong>{language === 'pa' ? 'ਅਨੁਮਾਨਿਤ ਉਡੀਕ:' : 'Estimated Wait:'}</strong> {triageResult.estimatedWaitTime} {language === 'pa' ? 'ਮਿੰਟ' : 'minutes'}</span>
            </div>
            <p><strong>{language === 'pa' ? 'ਸਿਫਾਰਸ਼:' : 'Recommendation:'}</strong> {triageResult.recommendedAction}</p>
          </div>
        </div>
      )}
    </div>
  );
};