import { Patient, TriageResult, HealthScheme } from '../types';
import { healthSchemes } from '../data/healthSchemes';
import { voiceService } from './voiceService';

// AI-powered triage system
export class AITriageService {
  private symptomScores: Record<string, number> = {
    // Critical symptoms (score 8-10)
    'chest pain': 10,
    'difficulty breathing': 9,
    'severe bleeding': 10,
    'loss of consciousness': 10,
    'severe head injury': 9,
    'severe allergic reaction': 9,
    
    // High priority symptoms (score 6-7)
    'severe pain': 7,
    'high fever': 6,
    'broken bone': 6,
    'severe nausea': 6,
    
    // Medium priority symptoms (score 4-5)
    'moderate pain': 5,
    'fever': 4,
    'cough': 4,
    'headache': 4,
    
    // Low priority symptoms (score 1-3)
    'minor cut': 2,
    'common cold': 2,
    'routine checkup': 1,
    'vaccination': 1
  };

  private riskFactors: Record<string, number> = {
    'diabetes': 2,
    'heart disease': 3,
    'hypertension': 2,
    'asthma': 2,
    'elderly': 2,
    'immunocompromised': 3
  };

  analyzePatient(patient: Patient): TriageResult {
    let baseScore = 0;
    const recommendedSchemes: HealthScheme[] = [];
    
    // Calculate symptom score
    patient.currentSymptoms.forEach(symptom => {
      const score = this.symptomScores[symptom.toLowerCase()] || 3;
      baseScore += score;
    });

    // Add risk factor multipliers
    patient.medicalHistory.forEach(condition => {
      const riskMultiplier = this.riskFactors[condition.toLowerCase()] || 0;
      baseScore += riskMultiplier;
    });

    // Age factor
    if (patient.age > 65) baseScore += 2;
    if (patient.age < 2) baseScore += 3;

    // Determine priority and estimated wait time
    const priority = this.calculatePriority(baseScore);
    const estimatedWaitTime = this.calculateWaitTime(priority);
    const recommendedAction = this.getRecommendedAction(priority);
    
    // Recommend relevant health schemes
    this.recommendHealthSchemes(patient, recommendedSchemes);

    return {
      score: Math.min(baseScore, 10), // Cap at 10
      priority,
      recommendedAction,
      estimatedWaitTime,
      recommendedSchemes
    };
  }

  private recommendHealthSchemes(patient: Patient, schemes: HealthScheme[]) {
    // Recommend schemes based on patient profile
    if (patient.age < 18) {
      schemes.push(...healthSchemes.filter(s => s.category === 'child'));
    }
    
    // Check for maternal health schemes (this would be based on additional patient data)
    if (patient.currentSymptoms.some(s => 
      s.toLowerCase().includes('pregnancy') || 
      s.toLowerCase().includes('pregnant')
    )) {
      schemes.push(...healthSchemes.filter(s => s.category === 'maternal'));
    }
    
    // Recommend insurance schemes for all patients
    schemes.push(...healthSchemes.filter(s => s.category === 'insurance'));
  }

  async provideVoiceRecommendation(result: TriageResult, language: 'en' | 'pa' = 'en'): Promise<void> {
    let message = '';
    
    if (language === 'pa') {
      message = `ਤੁਹਾਡਾ ਟ੍ਰਾਈਏਜ ਸਕੋਰ ${result.score} ਹੈ। ਤੁਹਾਡੀ ਤਰਜੀਹ ${this.getPriorityInPunjabi(result.priority)} ਹੈ। ਅਨੁਮਾਨਿਤ ਉਡੀਕ ਦਾ ਸਮਾਂ ${result.estimatedWaitTime} ਮਿੰਟ ਹੈ।`;
    } else {
      message = `Your triage score is ${result.score}. Your priority is ${result.priority}. Estimated wait time is ${result.estimatedWaitTime} minutes.`;
    }
    
    await voiceService.speak(message, language);
  }

  private getPriorityInPunjabi(priority: string): string {
    switch (priority) {
      case 'Critical': return 'ਗੰਭੀਰ';
      case 'High': return 'ਉੱਚ';
      case 'Medium': return 'ਮੱਧਮ';
      case 'Low': return 'ਘੱਟ';
      default: return priority;
    }
  }

  private calculatePriority(score: number): Patient['priority'] {
    if (score >= 8) return 'Critical';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  }

  private calculateWaitTime(priority: Patient['priority']): number {
    switch (priority) {
      case 'Critical': return 0;
      case 'High': return 5;
      case 'Medium': return 15;
      case 'Low': return 30;
    }
  }

  private getRecommendedAction(priority: Patient['priority']): string {
    switch (priority) {
      case 'Critical': return 'Immediate medical attention required';
      case 'High': return 'Urgent care needed within 1 hour';
      case 'Medium': return 'Medical consultation recommended';
      case 'Low': return 'Routine consultation or self-care';
    }
  }
}

export const aiTriage = new AITriageService();