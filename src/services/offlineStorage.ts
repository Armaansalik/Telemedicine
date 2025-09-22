// Enhanced offline storage and synchronization service
export class OfflineStorageService {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    this.setupOnlineListeners();
    this.setupServiceWorkerListener();
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showNotification('Connection restored', 'Data will be synchronized', 'success');
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showNotification('Working offline', 'Data will sync when connection is restored', 'warning');
    });
  }

  private setupServiceWorkerListener() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          this.showNotification('Sync Complete', event.data.data, 'success');
        }
      });
    }
  }

  // Enhanced patient storage with offline queue
  async storePatient(patient: any) {
    const patients = this.getStoredPatients();
    const patientWithMeta = {
      ...patient,
      storedAt: new Date().toISOString(),
      pendingSync: !this.isOnline,
      synced: this.isOnline
    };
    
    patients.push(patientWithMeta);
    localStorage.setItem('patients', JSON.stringify(patients));

    if (!this.isOnline) {
      this.addToPendingSync('patients', patientWithMeta);
      this.showNotification('Patient Registered Offline', 'Data will sync when online', 'info');
    } else {
      // Simulate API call in real implementation
      console.log('Syncing patient immediately:', patient.name);
    }

    return patientWithMeta;
  }

  // Enhanced prescription storage
  async storePrescription(prescription: any) {
    const prescriptions = this.getStoredPrescriptions();
    const prescriptionWithMeta = {
      ...prescription,
      storedAt: new Date().toISOString(),
      pendingSync: !this.isOnline,
      synced: this.isOnline
    };
    
    prescriptions.push(prescriptionWithMeta);
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));

    if (!this.isOnline) {
      this.addToPendingSync('prescriptions', prescriptionWithMeta);
      this.showNotification('Prescription Saved Offline', 'Will sync when online', 'info');
    }

    return prescriptionWithMeta;
  }

  // Store appointments
  async storeAppointment(appointment: any) {
    const appointments = this.getStoredAppointments();
    const appointmentWithMeta = {
      ...appointment,
      storedAt: new Date().toISOString(),
      pendingSync: !this.isOnline,
      synced: this.isOnline
    };
    
    appointments.push(appointmentWithMeta);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    if (!this.isOnline) {
      this.addToPendingSync('appointments', appointmentWithMeta);
    }

    return appointmentWithMeta;
  }

  // Store pharmacy data
  async storePharmacyData(data: any) {
    const pharmacyData = {
      ...data,
      storedAt: new Date().toISOString(),
      pendingSync: !this.isOnline
    };
    
    localStorage.setItem('pharmacyData', JSON.stringify(pharmacyData));
    
    if (!this.isOnline) {
      this.addToPendingSync('pharmacy', pharmacyData);
    }

    return pharmacyData;
  }

  // Get stored data methods
  getStoredPatients(): any[] {
    return JSON.parse(localStorage.getItem('patients') || '[]');
  }

  getStoredPrescriptions(): any[] {
    return JSON.parse(localStorage.getItem('prescriptions') || '[]');
  }

  getStoredAppointments(): any[] {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  }

  getStoredPharmacyData(): any {
    return JSON.parse(localStorage.getItem('pharmacyData') || '{}');
  }

  // Get pending sync data
  getPendingSyncData(): any {
    return {
      patients: JSON.parse(localStorage.getItem('pendingPatients') || '[]'),
      prescriptions: JSON.parse(localStorage.getItem('pendingPrescriptions') || '[]'),
      appointments: JSON.parse(localStorage.getItem('pendingAppointments') || '[]'),
      pharmacy: JSON.parse(localStorage.getItem('pendingPharmacy') || '[]')
    };
  }

  private addToPendingSync(type: string, data: any) {
    const pending = JSON.parse(localStorage.getItem(`pending${type.charAt(0).toUpperCase() + type.slice(1)}`) || '[]');
    pending.push(data);
    localStorage.setItem(`pending${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(pending));
  }

  async syncPendingData() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    
    try {
      // Register background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('patient-data-sync');
        await registration.sync.register('prescription-sync');
        await registration.sync.register('appointment-sync');
      } else {
        // Fallback: sync immediately
        await this.syncDataDirectly();
      }
    } catch (error) {
      console.error('Sync failed:', error);
      this.showNotification('Sync Failed', 'Will retry when connection improves', 'error');
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncDataDirectly() {
    const pendingData = this.getPendingSyncData();
    
    // Sync patients
    for (const patient of pendingData.patients) {
      console.log('Syncing patient:', patient.name);
      // In real app: await api.syncPatient(patient);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    }
    
    // Sync prescriptions
    for (const prescription of pendingData.prescriptions) {
      console.log('Syncing prescription:', prescription.id);
      // In real app: await api.syncPrescription(prescription);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Clear pending data after successful sync
    localStorage.removeItem('pendingPatients');
    localStorage.removeItem('pendingPrescriptions');
    localStorage.removeItem('pendingAppointments');
    localStorage.removeItem('pendingPharmacy');
    
    this.showNotification('Sync Complete', 'All data synchronized successfully', 'success');
  }

  // Utility methods
  isOffline(): boolean {
    return !this.isOnline;
  }

  getStorageUsage(): { used: number; available: number } {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0
        };
      });
    }
    
    // Fallback estimation
    const data = JSON.stringify(localStorage);
    return {
      used: new Blob([data]).size,
      available: 5 * 1024 * 1024 // Assume 5MB available
    };
  }

  clearOfflineData() {
    const keys = ['patients', 'prescriptions', 'appointments', 'pharmacyData', 
                  'pendingPatients', 'pendingPrescriptions', 'pendingAppointments', 'pendingPharmacy'];
    
    keys.forEach(key => localStorage.removeItem(key));
    this.showNotification('Offline Data Cleared', 'All local data has been removed', 'info');
  }

  private showNotification(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') {
    // Create a custom notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
      type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
      type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
      'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <h4 class="font-semibold">${title}</h4>
          <p class="text-sm mt-1">${message}</p>
        </div>
        <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

export const offlineStorage = new OfflineStorageService();