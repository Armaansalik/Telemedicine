import { PharmacyStock, Prescription, Medication } from '../types';

export class PharmacyManagerService {
  private stockData: PharmacyStock[] = [
    {
      medicationId: '1',
      name: 'Paracetamol 500mg',
      currentStock: 150,
      minimumStock: 50,
      demandPrediction: 200,
      lastRestocked: '2024-12-01',
      status: 'In Stock'
    },
    {
      medicationId: '2',
      name: 'Insulin (Rapid-acting)',
      currentStock: 25,
      minimumStock: 30,
      demandPrediction: 45,
      lastRestocked: '2024-12-05',
      status: 'Low Stock'
    },
    {
      medicationId: '3',
      name: 'Antibiotics (Amoxicillin)',
      currentStock: 80,
      minimumStock: 40,
      demandPrediction: 120,
      lastRestocked: '2024-11-28',
      status: 'In Stock'
    }
  ];

  private prescriptionHistory: Prescription[] = [];

  analyzePharmacyDemand(): PharmacyStock[] {
    return this.stockData.map(stock => {
      // Analyze prescription patterns to predict demand
      const recentPrescriptions = this.prescriptionHistory.filter(
        p => p.dateIssued >= this.getDateDaysAgo(30)
      );

      const medicationDemand = recentPrescriptions
        .flatMap(p => p.medications)
        .filter(m => m.name === stock.name)
        .reduce((total, m) => total + m.quantity, 0);

      // Predict next month's demand based on recent trends
      stock.demandPrediction = Math.ceil(medicationDemand * 1.2);

      // Update status based on current stock vs predicted demand
      if (stock.currentStock <= stock.minimumStock) {
        stock.status = 'Low Stock';
      } else if (stock.currentStock === 0) {
        stock.status = 'Out of Stock';
      } else {
        stock.status = 'In Stock';
      }

      return stock;
    });
  }

  getCriticalStockAlerts(): PharmacyStock[] {
    return this.stockData.filter(stock => 
      stock.status === 'Low Stock' || stock.status === 'Out of Stock'
    );
  }

  updateStock(medicationId: string, newQuantity: number): void {
    const stock = this.stockData.find(s => s.medicationId === medicationId);
    if (stock) {
      stock.currentStock = newQuantity;
      stock.lastRestocked = new Date().toISOString().split('T')[0];
      this.analyzePharmacyDemand(); // Recalculate status
    }
  }

  addPrescriptionToHistory(prescription: Prescription): void {
    this.prescriptionHistory.push(prescription);
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  getStockData(): PharmacyStock[] {
    return this.stockData;
  }
}

export const pharmacyManager = new PharmacyManagerService();