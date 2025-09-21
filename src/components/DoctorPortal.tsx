import React, { useState, useEffect } from 'react';
import { User, Clock, Video, FileText, AlertTriangle } from 'lucide-react';
import { Patient, Prescription, Medication } from '../types';
import { offlineStorage } from '../services/offlineStorage';

interface DoctorPortalProps {
  patients: Patient[];
  onUpdatePatient: (patient: Patient) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ patients, onUpdatePatient }) => {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    instructions: '',
    medications: [] as Medication[]
  });

  // Sort patients by priority and triage score
  const sortedPatients = [...patients].sort((a, b) => {
    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.triageScore - a.triageScore;
  });

  const startConsultation = (patient: Patient) => {
    const updatedPatient = { ...patient, status: 'In Consultation' as const };
    setCurrentPatient(updatedPatient);
    onUpdatePatient(updatedPatient);
  };

  const endConsultation = () => {
    if (currentPatient) {
      const updatedPatient = { ...currentPatient, status: 'Completed' as const };
      onUpdatePatient(updatedPatient);
      setCurrentPatient(null);
      setShowPrescriptionForm(false);
    }
  };

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 1
    };
    setPrescriptionData({
      ...prescriptionData,
      medications: [...prescriptionData.medications, newMedication]
    });
  };

  const updateMedication = (index: number, field: string, value: string | number) => {
    const updatedMedications = prescriptionData.medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setPrescriptionData({
      ...prescriptionData,
      medications: updatedMedications
    });
  };

  const generatePrescription = async () => {
    if (!currentPatient) return;

    const prescription: Prescription = {
      id: Date.now().toString(),
      patientId: currentPatient.id,
      doctorId: 'dr-001', // In real app, get from auth context
      medications: prescriptionData.medications,
      diagnosis: prescriptionData.diagnosis,
      instructions: prescriptionData.instructions,
      dateIssued: new Date().toISOString(),
      isDigital: true,
      status: 'Active'
    };

    // Store prescription (offline-capable)
    await offlineStorage.storePrescription(prescription);
    
    // Reset form
    setPrescriptionData({
      diagnosis: '',
      instructions: '',
      medications: []
    });
    setShowPrescriptionForm(false);
    
    alert('Digital prescription generated successfully!');
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800 border-red-200',
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Portal</h1>
        <p className="text-gray-600">Manage patient queue and consultations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Queue */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Queue</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedPatients.filter(p => p.status !== 'Completed').map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentPatient?.id === patient.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(patient.priority)}`}>
                    {patient.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <p><strong>Age:</strong> {patient.age}</p>
                  <p><strong>Symptoms:</strong> {patient.currentSymptoms.join(', ')}</p>
                  <p><strong>Triage Score:</strong> {patient.triageScore}/10</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(patient.appointmentTime).toLocaleTimeString()}
                  </div>
                  {patient.status === 'Waiting' && (
                    <button
                      onClick={() => startConsultation(patient)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Consultation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Consultation</h2>
          
          {currentPatient ? (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentPatient.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Age:</strong> {currentPatient.age}</p>
                  <p><strong>Phone:</strong> {currentPatient.phone}</p>
                  <p><strong>Symptoms:</strong> {currentPatient.currentSymptoms.join(', ')}</p>
                  <p><strong>Medical History:</strong> {currentPatient.medicalHistory.join(', ')}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Digital Prescription
                </button>

                <button
                  onClick={endConsultation}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  End Consultation
                </button>
              </div>

              {/* Digital Prescription Form */}
              {showPrescriptionForm && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Digital Prescription</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis
                      </label>
                      <input
                        type="text"
                        value={prescriptionData.diagnosis}
                        onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions
                      </label>
                      <textarea
                        value={prescriptionData.instructions}
                        onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Medications
                        </label>
                        <button
                          onClick={addMedication}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Medication
                        </button>
                      </div>
                      
                      {prescriptionData.medications.map((med, index) => (
                        <div key={med.id} className="grid grid-cols-2 gap-2 mb-2 p-3 bg-gray-50 rounded">
                          <input
                            type="text"
                            placeholder="Medicine name"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={med.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Frequency"
                            value={med.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={med.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={generatePrescription}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Generate Prescription
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No patient currently in consultation</p>
              <p className="text-sm">Select a patient from the queue to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};