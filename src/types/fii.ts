export interface FII {
  ticker: string;
  name: string;
  currentPrice: number;
  lastDividend: number;
  lastPaymentDate: string;
  sector: string;
  dividendYield: number;
  netWorth: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
}

export interface ChartData {
  date: string;
  price: number;
}

export interface FIIHistoryData {
  ticker: string;
  history: ChartData[];
}