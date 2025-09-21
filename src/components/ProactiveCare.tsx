import React, { useState, useEffect } from 'react';
import { Bell, Heart, Calendar, User } from 'lucide-react';
import { Patient } from '../types';

interface CareReminder {
  id: string;
  patientId: string;
  patientName: string;
  type: 'checkup' | 'medication' | 'lab' | 'follow-up';
  message: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface ProactiveCareProps {
  patients: Patient[];
}

export const ProactiveCare: React.FC<ProactiveCareProps> = ({ patients }) => {
  const [reminders, setReminders] = useState<CareReminder[]>([]);

  useEffect(() => {
    // Generate proactive care reminders based on patient data
    const generateReminders = () => {
      const newReminders: CareReminder[] = [];
      
      patients.forEach((patient) => {
        // Check for chronic conditions requiring regular monitoring
        if (patient.medicalHistory.some(condition => 
          condition.toLowerCase().includes('diabetes') || 
          condition.toLowerCase().includes('diabetic')
        )) {
          newReminders.push({
            id: `${patient.id}-diabetes-checkup`,
            patientId: patient.id,
            patientName: patient.name,
            type: 'checkup',
            message: 'Monthly diabetes monitoring due - check blood sugar levels, HbA1c',
            dueDate: getNextMonthDate(),
            priority: 'high'
          });
        }

        if (patient.medicalHistory.some(condition => 
          condition.toLowerCase().includes('hypertension') || 
          condition.toLowerCase().includes('blood pressure')
        )) {
          newReminders.push({
            id: `${patient.id}-bp-checkup`,
            patientId: patient.id,
            patientName: patient.name,
            type: 'checkup',
            message: 'Blood pressure monitoring due - schedule routine check-up',
            dueDate: getDateInDays(14),
            priority: 'medium'
          });
        }

        if (patient.medicalHistory.some(condition => 
          condition.toLowerCase().includes('heart') || 
          condition.toLowerCase().includes('cardiac')
        )) {
          newReminders.push({
            id: `${patient.id}-heart-checkup`,
            patientId: patient.id,
            patientName: patient.name,
            type: 'checkup',
            message: 'Cardiac follow-up due - ECG and consultation recommended',
            dueDate: getDateInDays(21),
            priority: 'high'
          });
        }

        // Age-based preventive care
        if (patient.age > 50) {
          newReminders.push({
            id: `${patient.id}-preventive-checkup`,
            patientId: patient.id,
            patientName: patient.name,
            type: 'checkup',
            message: 'Annual preventive health screening due',
            dueDate: getDateInDays(30),
            priority: 'low'
          });
        }
      });

      setReminders(newReminders);
    };

    generateReminders();
  }, [patients]);

  const getNextMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  const getDateInDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Calendar className="w-5 h-5" />;
      case 'medication': return <Heart className="w-5 h-5" />;
      case 'lab': return <Bell className="w-5 h-5" />;
      case 'follow-up': return <User className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const sendReminder = (reminder: CareReminder) => {
    // In a real application, this would send SMS/email/push notification
    alert(`Reminder sent to ${reminder.patientName}: ${reminder.message}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Heart className="w-6 h-6 text-red-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Proactive Care Management</h1>
        </div>
        <p className="text-gray-600">AI-powered care reminders for chronic and preventive care</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-600 mr-2" />
            <div>
              <p className="text-gray-600 text-sm">Total Reminders</p>
              <p className="text-xl font-bold text-gray-900">{reminders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-xl font-bold text-gray-900">
                {reminders.filter(r => r.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Medium Priority</p>
              <p className="text-xl font-bold text-gray-900">
                {reminders.filter(r => r.priority === 'medium').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-green-600 mr-2" />
            <div>
              <p className="text-gray-600 text-sm">Chronic Patients</p>
              <p className="text-xl font-bold text-gray-900">
                {patients.filter(p => 
                  p.medicalHistory.some(h => 
                    h.toLowerCase().includes('diabetes') || 
                    h.toLowerCase().includes('hypertension') ||
                    h.toLowerCase().includes('heart')
                  )
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Care Reminders</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <div key={reminder.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getPriorityColor(reminder.priority)}`}>
                      {getTypeIcon(reminder.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {reminder.patientName}
                      </h3>
                      <p className="text-gray-600 mt-1">{reminder.message}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => sendReminder(reminder)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Send Reminder
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reminders yet</h3>
              <p className="text-gray-600">Proactive care reminders will appear here based on patient data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};