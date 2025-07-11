import { FII, FIIHistoryData } from '../types/fii';

// Dados simulados dos principais FIIs da B3
export const mockFIIs: FII[] = [
  {
    ticker: "KNRI11",
    name: "Kinea Renda Imobiliária",
    currentPrice: 9.85,
    lastDividend: 0.075,
    lastPaymentDate: "2024-01-15",
    sector: "Logístico",
    dividendYield: 9.13,
    netWorth: 2.4,
    priceChange: 0.12,
    priceChangePercent: 1.23,
    volume: 2450000
  },
  {
    ticker: "HGLG11",
    name: "CSHG Logística",
    currentPrice: 152.50,
    lastDividend: 1.20,
    lastPaymentDate: "2024-01-12",
    sector: "Logístico",
    dividendYield: 9.44,
    netWorth: 167.8,
    priceChange: -2.30,
    priceChangePercent: -1.49,
    volume: 1800000
  },
  {
    ticker: "XPML11",
    name: "XP Malls",
    currentPrice: 9.15,
    lastDividend: 0.065,
    lastPaymentDate: "2024-01-10",
    sector: "Shoppings",
    dividendYield: 8.52,
    netWorth: 1.8,
    priceChange: 0.08,
    priceChangePercent: 0.88,
    volume: 3200000
  },
  {
    ticker: "VILG11",
    name: "Vinci Logística",
    currentPrice: 9.92,
    lastDividend: 0.08,
    lastPaymentDate: "2024-01-08",
    sector: "Logístico",
    dividendYield: 9.68,
    netWorth: 2.1,
    priceChange: 0.15,
    priceChangePercent: 1.54,
    volume: 1950000
  },
  {
    ticker: "BTLG11",
    name: "BTG Pactual Logística",
    currentPrice: 102.80,
    lastDividend: 0.85,
    lastPaymentDate: "2024-01-05",
    sector: "Logístico",
    dividendYield: 9.92,
    netWorth: 118.5,
    priceChange: 1.20,
    priceChangePercent: 1.18,
    volume: 2100000
  },
  {
    ticker: "IRDM11",
    name: "Iridium Recebíveis Imobiliários",
    currentPrice: 97.25,
    lastDividend: 0.75,
    lastPaymentDate: "2024-01-03",
    sector: "Híbrido",
    dividendYield: 9.25,
    netWorth: 108.3,
    priceChange: -0.80,
    priceChangePercent: -0.82,
    volume: 1600000
  },
  {
    ticker: "MXRF11",
    name: "Maxi Renda",
    currentPrice: 10.15,
    lastDividend: 0.09,
    lastPaymentDate: "2023-12-28",
    sector: "Corporativo",
    dividendYield: 10.64,
    netWorth: 2.8,
    priceChange: 0.25,
    priceChangePercent: 2.53,
    volume: 2850000
  },
  {
    ticker: "KNCR11",
    name: "Kinea Rendimentos Imobiliários",
    currentPrice: 8.92,
    lastDividend: 0.07,
    lastPaymentDate: "2023-12-25",
    sector: "Corporativo",
    dividendYield: 9.42,
    netWorth: 1.9,
    priceChange: -0.05,
    priceChangePercent: -0.56,
    volume: 1750000
  }
];

// Dados históricos simulados para gráficos
export const generateMockHistory = (ticker: string): FIIHistoryData => {
  const currentFii = mockFIIs.find(f => f.ticker === ticker);
  const currentPrice = currentFii?.currentPrice || 10;
  
  const history = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);
  
  for (let i = 0; i < 365; i += 7) { // dados semanais
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simular variação de preço com tendência e volatilidade
    const randomVariation = (Math.random() - 0.5) * 0.1;
    const trend = (i / 365) * 0.05; // leve tendência de alta
    const price = currentPrice * (1 + trend + randomVariation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  
  return { ticker, history };
};

export const searchFII = async (ticker: string): Promise<FII | null> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const upperTicker = ticker.toUpperCase();
  return mockFIIs.find(fii => fii.ticker === upperTicker) || null;
};