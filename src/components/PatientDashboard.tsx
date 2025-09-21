import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, Heart, Phone, MapPin, Clock } from 'lucide-react';
import { Patient, Prescription } from '../types';
import { offlineStorage } from '../services/offlineStorage';
import { healthSchemes } from '../data/healthSchemes';

interface PatientDashboardProps {
  language: 'en' | 'pa';
  currentPatient: Patient | null;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  language, 
  currentPatient 
}) => {
  const [appointments, setAppointments] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'schemes'>('overview');

  useEffect(() => {
    // Load patient data
    const storedPatients = offlineStorage.getStoredPatients();
    const storedPrescriptions = offlineStorage.getStoredPrescriptions();
    
    if (currentPatient) {
      setAppointments(storedPatients.filter(p => p.email === currentPatient.email));
      setPrescriptions(storedPrescriptions.filter(p => p.patientId === currentPatient.id));
    }
  }, [currentPatient]);

  const tabs = [
    { 
      id: 'overview', 
      name: language === 'pa' ? 'ਸੰਖੇਪ' : 'Overview', 
      icon: User 
    },
    { 
      id: 'appointments', 
      name: language === 'pa' ? 'ਮੁਲਾਕਾਤਾਂ' : 'Appointments', 
      icon: Calendar 
    },
    { 
      id: 'prescriptions', 
      name: language === 'pa' ? 'ਨੁਸਖੇ' : 'Prescriptions', 
      icon: FileText 
    },
    { 
      id: 'schemes', 
      name: language === 'pa' ? 'ਯੋਜਨਾਵਾਂ' : 'Schemes', 
      icon: Heart 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Consultation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!currentPatient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'pa' ? 'ਕੋਈ ਮਰੀਜ਼ ਚੁਣਿਆ ਨਹੀਂ' : 'No Patient Selected'}
          </h2>
          <p className="text-gray-600">
            {language === 'pa' 
              ? 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ'
              : 'Please register patient information first'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentPatient.name}</h1>
            <p className="text-blue-100">
              {language === 'pa' ? 'ਮਰੀਜ਼ ਡੈਸ਼ਬੋਰਡ' : 'Patient Dashboard'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
                selectedTab === tab.id
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'pa' ? 'ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ' : 'Patient Information'}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'pa' ? 'ਨਾਮ' : 'Name'}
                  </p>
                  <p className="font-medium">{currentPatient.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'pa' ? 'ਉਮਰ' : 'Age'}
                  </p>
                  <p className="font-medium">{currentPatient.age} {language === 'pa' ? 'ਸਾਲ' : 'years'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'pa' ? 'ਫੋਨ' : 'Phone'}
                  </p>
                  <p className="font-medium">{currentPatient.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'pa' ? 'ਮੌਜੂਦਾ ਸਥਿਤੀ' : 'Current Status'}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'pa' ? 'ਤਰਜੀਹ' : 'Priority'}
                </p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(currentPatient.priority)}`}>
                  {currentPatient.priority}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'pa' ? 'ਸਥਿਤੀ' : 'Status'}
                </p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(currentPatient.status)}`}>
                  {currentPatient.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'pa' ? 'ਟ੍ਰਾਈਏਜ ਸਕੋਰ' : 'Triage Score'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{currentPatient.triageScore}/10</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'pa' ? 'ਮੌਜੂਦਾ ਲੱਛਣ' : 'Current Symptoms'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentPatient.currentSymptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'pa' ? 'ਮੈਡੀਕਲ ਇਤਿਹਾਸ' : 'Medical History'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentPatient.medicalHistory.length > 0 ? (
                currentPatient.medicalHistory.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {condition}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  {language === 'pa' ? 'ਕੋਈ ਪਿਛਲਾ ਇਤਿਹਾਸ ਨਹੀਂ' : 'No previous history'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'appointments' && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'pa' ? 'ਮੁਲਾਕਾਤਾਂ ਦਾ ਇਤਿਹਾਸ' : 'Appointment History'}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="font-medium">
                      {new Date(appointment.appointmentTime).toLocaleString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  {language === 'pa' ? 'ਲੱਛਣ:' : 'Symptoms:'} {appointment.currentSymptoms.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'prescriptions' && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'pa' ? 'ਡਿਜੀਟਲ ਨੁਸਖੇ' : 'Digital Prescriptions'}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <div key={prescription.id} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'pa' ? 'ਨੁਸਖਾ' : 'Prescription'} #{prescription.id.slice(-6)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(prescription.dateIssued).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>{language === 'pa' ? 'ਤਸ਼ਖੀਸ:' : 'Diagnosis:'}</strong> {prescription.diagnosis}
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {language === 'pa' ? 'ਦਵਾਈਆਂ:' : 'Medications:'}
                    </p>
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-600">
                          {med.dosage} - {med.frequency} - {med.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  {language === 'pa' ? 'ਕੋਈ ਨੁਸਖਾ ਨਹੀਂ ਮਿਲਿਆ' : 'No prescriptions found'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'schemes' && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'pa' ? 'ਯੋਗ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ' : 'Eligible Government Schemes'}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthSchemes.slice(0, 4).map((scheme) => (
                <div key={scheme.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'pa' ? scheme.nameInPunjabi : scheme.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'pa' ? scheme.descriptionInPunjabi : scheme.description}
                  </p>
                  <p className="text-xs text-blue-600">
                    {language === 'pa' ? 'ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਲਈ ਸੰਪਰਕ ਕਰੋ' : 'Contact for more information'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};