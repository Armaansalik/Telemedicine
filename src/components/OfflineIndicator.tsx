import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Sync, Database, HardDrive } from 'lucide-react';
import { offlineStorage } from '../services/offlineStorage';

interface OfflineIndicatorProps {
  language: 'en' | 'pa';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const [storageUsage, setStorageUsage] = useState({ used: 0, available: 0 });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updatePendingSync = () => {
      const pending = offlineStorage.getPendingSyncData();
      const total = pending.patients.length + pending.prescriptions.length + 
                   pending.appointments.length + pending.pharmacy.length;
      setPendingSync(total);
    };

    const updateStorageUsage = () => {
      const usage = offlineStorage.getStorageUsage();
      setStorageUsage(usage);
    };

    // Set up event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Update data periodically
    const interval = setInterval(() => {
      updatePendingSync();
      updateStorageUsage();
    }, 5000);

    // Initial update
    updatePendingSync();
    updateStorageUsage();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const syncNow = async () => {
    if (isOnline) {
      await offlineStorage.syncPendingData();
      setPendingSync(0);
    }
  };

  const clearData = () => {
    if (confirm(language === 'pa' 
      ? 'ਕੀ ਤੁਸੀਂ ਸਾਰਾ ਔਫਲਾਈਨ ਡੇਟਾ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?'
      : 'Are you sure you want to clear all offline data?'
    )) {
      offlineStorage.clearOfflineData();
      setPendingSync(0);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Main Status Bar */}
        <div 
          className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {isOnline 
                ? (language === 'pa' ? 'ਔਨਲਾਈਨ' : 'Online')
                : (language === 'pa' ? 'ਔਫਲਾਈਨ' : 'Offline')
              }
            </p>
            {pendingSync > 0 && (
              <p className="text-xs text-gray-600">
                {pendingSync} {language === 'pa' ? 'ਸਿੰਕ ਬਾਕੀ' : 'pending sync'}
              </p>
            )}
          </div>
          
          {pendingSync > 0 && (
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Detailed View */}
        {showDetails && (
          <div className="border-t border-gray-200 p-3 space-y-3">
            {/* Sync Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sync className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  {language === 'pa' ? 'ਸਿੰਕ ਸਥਿਤੀ' : 'Sync Status'}
                </span>
              </div>
              {isOnline && pendingSync > 0 && (
                <button
                  onClick={syncNow}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  {language === 'pa' ? 'ਸਿੰਕ ਕਰੋ' : 'Sync Now'}
                </button>
              )}
            </div>

            {/* Storage Usage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {language === 'pa' ? 'ਸਟੋਰੇਜ' : 'Storage'}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {formatBytes(storageUsage.used)}
              </span>
            </div>

            {/* Data Management */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {language === 'pa' ? 'ਡੇਟਾ' : 'Data'}
                </span>
              </div>
              <button
                onClick={clearData}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                {language === 'pa' ? 'ਸਾਫ਼ ਕਰੋ' : 'Clear'}
              </button>
            </div>

            {/* Offline Capabilities */}
            <div className="text-xs text-gray-600 pt-2 border-t border-gray-100">
              <p className="font-medium mb-1">
                {language === 'pa' ? 'ਔਫਲਾਈਨ ਸੁਵਿਧਾਵਾਂ:' : 'Offline Features:'}
              </p>
              <ul className="space-y-1">
                <li>• {language === 'pa' ? 'ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ' : 'Patient Registration'}</li>
                <li>• {language === 'pa' ? 'ਡਿਜੀਟਲ ਨੁਸਖੇ' : 'Digital Prescriptions'}</li>
                <li>• {language === 'pa' ? 'AI ਟ੍ਰਾਈਏਜ' : 'AI Triage'}</li>
                <li>• {language === 'pa' ? 'ਆਵਾਜ਼ ਜਾਂਚ' : 'Voice Checker'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};