import React, { useState, useEffect } from 'react';
import { Activity, Users, Pill, Heart, Menu, X, Building2, User } from 'lucide-react';
import { PatientTriage } from './components/PatientTriage';
import { DoctorPortal } from './components/DoctorPortal';
import { PharmacyDashboard } from './components/PharmacyDashboard';
import { ProactiveCare } from './components/ProactiveCare';
import { HealthSchemes } from './components/HealthSchemes';
import { VoiceSymptomChecker } from './components/VoiceSymptomChecker';
import { PatientDashboard } from './components/PatientDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { LanguageSelector } from './components/LanguageSelector';
import { Patient } from './types';
import { offlineStorage } from './services/offlineStorage';
import { voiceService } from './services/voiceService';

type ActiveView = 'triage' | 'doctor' | 'pharmacy' | 'care' | 'schemes' | 'voice' | 'patient' | 'hospital';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('triage');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'pa'>('en');
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // Load stored patients on app start
    const storedPatients = offlineStorage.getStoredPatients();
    setPatients(storedPatients);

    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Monitor online/offline status
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    voiceService.setLanguage(currentLanguage);
  }, [currentLanguage]);

  const handlePatientTriaged = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    setCurrentPatient(patient);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => 
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  };

  const navigationItems = [
    { id: 'triage' as ActiveView, label: 'Patient Triage', icon: Activity, color: 'text-blue-600' },
    { id: 'voice' as ActiveView, label: 'Voice Checker', icon: Activity, color: 'text-purple-600' },
    { id: 'doctor' as ActiveView, label: 'Doctor Portal', icon: Users, color: 'text-green-600' },
    { id: 'pharmacy' as ActiveView, label: 'Pharmacy', icon: Pill, color: 'text-purple-600' },
    { id: 'care' as ActiveView, label: 'Proactive Care', icon: Heart, color: 'text-red-600' },
    { id: 'schemes' as ActiveView, label: 'Health Schemes', icon: Heart, color: 'text-orange-600' },
    { id: 'patient' as ActiveView, label: 'Patient Dashboard', icon: User, color: 'text-indigo-600' },
    { id: 'hospital' as ActiveView, label: 'Hospital Dashboard', icon: Building2, color: 'text-cyan-600' },
  ];

  const getNavigationLabel = (item: any) => {
    if (currentLanguage === 'pa') {
      switch (item.id) {
        case 'triage': return 'ਮਰੀਜ਼ ਟ੍ਰਾਈਏਜ';
        case 'voice': return 'ਆਵਾਜ਼ ਜਾਂਚਕਰਤਾ';
        case 'doctor': return 'ਡਾਕਟਰ ਪੋਰਟਲ';
        case 'pharmacy': return 'ਫਾਰਮੇਸੀ';
        case 'care': return 'ਸਰਗਰਮ ਦੇਖਭਾਲ';
        case 'schemes': return 'ਸਿਹਤ ਯੋਜਨਾਵਾਂ';
        case 'patient': return 'ਮਰੀਜ਼ ਡੈਸ਼ਬੋਰਡ';
        case 'hospital': return 'ਹਸਪਤਾਲ ਡੈਸ਼ਬੋਰਡ';
        default: return item.label;
      }
    }
    return item.label;
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'triage':
        return <PatientTriage onPatientTriaged={handlePatientTriaged} />;
      case 'voice':
        return <VoiceSymptomChecker language={currentLanguage} onResult={(result) => console.log(result)} />;
      case 'doctor':
        return <DoctorPortal patients={patients} onUpdatePatient={handleUpdatePatient} />;
      case 'pharmacy':
        return <PharmacyDashboard />;
      case 'care':
        return <ProactiveCare patients={patients} />;
      case 'schemes':
        return <HealthSchemes language={currentLanguage} />;
      case 'patient':
        return <PatientDashboard language={currentLanguage} currentPatient={currentPatient} />;
      case 'hospital':
        return <HospitalDashboard language={currentLanguage} patients={patients} />;
      default:
        return <PatientTriage onPatientTriaged={handlePatientTriaged} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline Indicator */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium">
          {currentLanguage === 'pa' 
            ? 'ਔਫਲਾਈਨ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ - ਕਨੈਕਸ਼ਨ ਬਹਾਲ ਹੋਣ ਤੇ ਡੇਟਾ ਸਿੰਕ ਹੋਵੇਗਾ'
            : 'Working offline - Data will sync when connection is restored'
          }
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentLanguage === 'pa' 
                    ? 'ਹਸਪਤਾਲ ਪ੍ਰਬੰਧਨ ਸਿਸਟਮ'
                    : 'Hospital Management System'
                  }
                </h1>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'pa' 
                    ? 'ਪੰਜਾਬ ਸਰਕਾਰ ਸਿਹਤ ਵਿਭਾਗ'
                    : 'Punjab Government Health Department'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector 
                currentLanguage={currentLanguage} 
                onLanguageChange={setCurrentLanguage} 
              />

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        activeView === item.id
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${activeView === item.id ? item.color : ''}`} />
                      {getNavigationLabel(item)}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeView === item.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${activeView === item.id ? item.color : ''}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-8">
        {renderActiveView()}
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 border border-gray-200">
          <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-green-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isOffline 
              ? (currentLanguage === 'pa' ? 'ਔਫਲਾਈਨ ਮੋਡ' : 'Offline Mode')
              : (currentLanguage === 'pa' ? 'ਔਨਲਾਈਨ' : 'Online')
            } | {patients.length} {currentLanguage === 'pa' ? 'ਮਰੀਜ਼' : 'patients'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;