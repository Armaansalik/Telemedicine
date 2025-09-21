import React, { useState, useEffect } from 'react';
import { Activity, Users, Calendar, TrendingUp, Phone, Mail, MapPin } from 'lucide-react';
import { Patient, Doctor } from '../types';
import { hospitals } from '../data/hospitals';
import { offlineStorage } from '../services/offlineStorage';

interface HospitalDashboardProps {
  language: 'en' | 'pa';
  patients: Patient[];
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ 
  language, 
  patients 
}) => {
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    waitingPatients: 0,
    criticalPatients: 0,
    completedToday: 0
  });

  useEffect(() => {
    // Calculate statistics
    const totalPatients = patients.length;
    const waitingPatients = patients.filter(p => p.status === 'Waiting').length;
    const criticalPatients = patients.filter(p => p.priority === 'Critical').length;
    const completedToday = patients.filter(p => 
      p.status === 'Completed' && 
      new Date(p.appointmentTime).toDateString() === new Date().toDateString()
    ).length;

    setStats({
      totalPatients,
      waitingPatients,
      criticalPatients,
      completedToday
    });
  }, [patients]);

  const getHospitalTypeColor = (type: string) => {
    switch (type) {
      case 'CH': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PHC': return 'bg-green-100 text-green-800 border-green-200';
      case 'CHC': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityStats = () => {
    const critical = patients.filter(p => p.priority === 'Critical').length;
    const high = patients.filter(p => p.priority === 'High').length;
    const medium = patients.filter(p => p.priority === 'Medium').length;
    const low = patients.filter(p => p.priority === 'Low').length;
    
    return { critical, high, medium, low };
  };

  const priorityStats = getPriorityStats();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {language === 'pa' ? 'ਹਸਪਤਾਲ ਡੈਸ਼ਬੋਰਡ' : 'Hospital Dashboard'}
            </h1>
            <p className="text-green-100">
              {language === 'pa' 
                ? 'ਪੰਜਾਬ ਸਰਕਾਰ ਸਿਹਤ ਵਿਭਾਗ'
                : 'Punjab Government Health Department'
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{selectedHospital.name}</p>
            <p className="text-green-100">{selectedHospital.location}</p>
          </div>
        </div>
      </div>

      {/* Hospital Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'pa' ? 'ਹਸਪਤਾਲ ਚੁਣੋ' : 'Select Hospital'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.slice(0, 6).map((hospital) => (
            <div
              key={hospital.id}
              onClick={() => setSelectedHospital(hospital)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedHospital.id === hospital.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getHospitalTypeColor(hospital.type)}`}>
                  {hospital.type}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hospital.location}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {hospital.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                {language === 'pa' ? 'ਕੁੱਲ ਮਰੀਜ਼' : 'Total Patients'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                {language === 'pa' ? 'ਉਡੀਕ ਵਿੱਚ' : 'Waiting'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.waitingPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                {language === 'pa' ? 'ਗੰਭੀਰ ਮਰੀਜ਼' : 'Critical Patients'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.criticalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                {language === 'pa' ? 'ਅੱਜ ਪੂਰੇ ਹੋਏ' : 'Completed Today'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {language === 'pa' ? 'ਤਰਜੀਹ ਵੰਡ' : 'Priority Distribution'}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-gray-700">
                  {language === 'pa' ? 'ਗੰਭੀਰ' : 'Critical'}
                </span>
              </div>
              <span className="font-semibold">{priorityStats.critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                <span className="text-gray-700">
                  {language === 'pa' ? 'ਉੱਚ' : 'High'}
                </span>
              </div>
              <span className="font-semibold">{priorityStats.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-gray-700">
                  {language === 'pa' ? 'ਮੱਧਮ' : 'Medium'}
                </span>
              </div>
              <span className="font-semibold">{priorityStats.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-gray-700">
                  {language === 'pa' ? 'ਘੱਟ' : 'Low'}
                </span>
              </div>
              <span className="font-semibold">{priorityStats.low}</span>
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {language === 'pa' ? 'ਹਾਲ ਹੀ ਦੇ ਮਰੀਜ਼' : 'Recent Patients'}
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'pa' ? 'ਉਮਰ:' : 'Age:'} {patient.age}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    patient.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    patient.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {patient.priority}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(patient.appointmentTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'pa' ? 'ਸੰਪਰਕ ਜਾਣਕਾਰੀ' : 'Contact Information'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Phone className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">
                {language === 'pa' ? 'ਫੋਨ' : 'Phone'}
              </p>
              <p className="font-medium">{selectedHospital.phone}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">
                {language === 'pa' ? 'ਈਮੇਲ' : 'Email'}
              </p>
              <p className="font-medium">{selectedHospital.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">
                {language === 'pa' ? 'ਸਥਾਨ' : 'Location'}
              </p>
              <p className="font-medium">{selectedHospital.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};