export interface SmartCard {
  cardNumber: string;
  holderName: string;
  balance: number;
  createdTime: string;
  mobileNumber?: string;
  stoppageHistory: {
    stationId: string;
    stationName: string;
    action: 'Tap-In' | 'Tap-Out';
    timestamp: string;
    deduction: number;
    balanceAfter: number;
  }[];
}
