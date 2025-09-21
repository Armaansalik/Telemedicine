import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { PharmacyStock } from '../types';
import { pharmacyManager } from '../services/pharmacyManager';

export const PharmacyDashboard: React.FC = () => {
  const [stockData, setStockData] = useState<PharmacyStock[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<PharmacyStock[]>([]);

  useEffect(() => {
    // Load and analyze pharmacy data
    const analyzedStock = pharmacyManager.analyzePharmacyDemand();
    setStockData(analyzedStock);
    
    const alerts = pharmacyManager.getCriticalStockAlerts();
    setCriticalAlerts(alerts);
  }, []);

  const updateStock = (medicationId: string, newQuantity: number) => {
    pharmacyManager.updateStock(medicationId, newQuantity);
    
    // Refresh data
    const updatedStock = pharmacyManager.analyzePharmacyDemand();
    setStockData(updatedStock);
    setCriticalAlerts(pharmacyManager.getCriticalStockAlerts());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-700 bg-green-50 border-green-200';
      case 'Low Stock': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Out of Stock': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pharmacy Dashboard</h1>
        <p className="text-gray-600">Smart inventory management with AI-powered demand prediction</p>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Critical Stock Alerts</h2>
          </div>
          <div className="space-y-2">
            {criticalAlerts.map((alert) => (
              <div key={alert.medicationId} className="flex items-center justify-between p-2 bg-white rounded border border-red-100">
                <span className="font-medium text-red-900">{alert.name}</span>
                <span className="text-red-700">
                  {alert.currentStock} units remaining (Min: {alert.minimumStock})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Total Medications</p>
              <p className="text-2xl font-bold text-gray-900">{stockData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{criticalAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Predicted Demand</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockData.reduce((total, item) => total + item.demandPrediction, 0)} units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Minimum Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted Demand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockData.map((item) => (
                <tr key={item.medicationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.currentStock} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.minimumStock} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <TrendingUp className="w-4 h-4 mr-1 text-blue-500" />
                      {item.demandPrediction} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.lastRestocked}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <input
                      type="number"
                      defaultValue={item.currentStock}
                      onBlur={(e) => updateStock(item.medicationId, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};