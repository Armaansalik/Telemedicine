export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  medicalHistory: string[];
  currentSymptoms: string[];
  triageScore: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  appointmentTime: string;
  status: 'Waiting' | 'In Consultation' | 'Completed';
  isOnline: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  license: string;
  isAvailable: boolean;
  currentPatient: string | null;
  queue: Patient[];
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  diagnosis: string;
  instructions: string;
  dateIssued: string;
  isDigital: boolean;
  status: 'Active' | 'Filled' | 'Expired';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  stockLevel?: number;
}

export interface PharmacyStock {
  medicationId: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  demandPrediction: number;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface TriageResult {
  score: number;
  priority: Patient['priority'];
  recommendedAction: string;
  estimatedWaitTime: number;
  recommendedSchemes: HealthScheme[];
}

export interface HealthScheme {
  id: string;
  name: string;
  nameInPunjabi: string;
  description: string;
  descriptionInPunjabi: string;
  eligibility: string;
  eligibilityInPunjabi: string;
  benefits: string;
  benefitsInPunjabi: string;
  category: 'maternal' | 'child' | 'general' | 'insurance' | 'preventive';
}

export interface Hospital {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'CH' | 'PHC' | 'CHC';
  location: string;
}