// Offline storage and synchronization service
export class OfflineStorageService {
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.setupOnlineListeners();
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Store data locally when offline
  async storePatient(patient: any) {
    const patients = this.getStoredPatients();
    patients.push({ ...patient, pendingSync: !this.isOnline });
    localStorage.setItem('patients', JSON.stringify(patients));

    if (!this.isOnline) {
      this.addToPendingSync('patients', patient);
    }
  }

  async storePrescription(prescription: any) {
    const prescriptions = this.getStoredPrescriptions();
    prescriptions.push({ ...prescription, pendingSync: !this.isOnline });
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));

    if (!this.isOnline) {
      this.addToPendingSync('prescriptions', prescription);
    }
  }

  getStoredPatients(): any[] {
    return JSON.parse(localStorage.getItem('patients') || '[]');
  }

  getStoredPrescriptions(): any[] {
    return JSON.parse(localStorage.getItem('prescriptions') || '[]');
  }

  private addToPendingSync(type: string, data: any) {
    const pending = JSON.parse(localStorage.getItem(`pending${type}`) || '[]');
    pending.push(data);
    localStorage.setItem(`pending${type}`, JSON.stringify(pending));
  }

  async syncPendingData() {
    if (!this.isOnline) return;

    const pendingPatients = JSON.parse(localStorage.getItem('pendingPatients') || '[]');
    const pendingPrescriptions = JSON.parse(localStorage.getItem('pendingPrescriptions') || '[]');

    // Simulate API sync (replace with actual API calls)
    for (const patient of pendingPatients) {
      console.log('Syncing patient:', patient);
      // await this.apiService.syncPatient(patient);
    }

    for (const prescription of pendingPrescriptions) {
      console.log('Syncing prescription:', prescription);
      // await this.apiService.syncPrescription(prescription);
    }

    // Clear pending data after successful sync
    localStorage.removeItem('pendingPatients');
    localStorage.removeItem('pendingPrescriptions');
  }

  isOffline(): boolean {
    return !this.isOnline;
  }
}

export const offlineStorage = new OfflineStorageService();