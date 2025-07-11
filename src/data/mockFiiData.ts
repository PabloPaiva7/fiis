import { FII, FIIHistoryData } from '../types/fii';

// Lista expandida dos principais FIIs da B3
export const mockFIIs: FII[] = [
  // Logísticos
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
    ticker: "XPLG11",
    name: "XP Log",
    currentPrice: 98.45,
    lastDividend: 0.78,
    lastPaymentDate: "2024-01-20",
    sector: "Logístico",
    dividendYield: 9.51,
    netWorth: 105.2,
    priceChange: 0.95,
    priceChangePercent: 0.97,
    volume: 1750000
  },
  {
    ticker: "RBRR11",
    name: "RBR Alpha",
    currentPrice: 9.67,
    lastDividend: 0.073,
    lastPaymentDate: "2024-01-18",
    sector: "Logístico",
    dividendYield: 9.06,
    netWorth: 2.3,
    priceChange: -0.08,
    priceChangePercent: -0.82,
    volume: 1680000
  },
  {
    ticker: "VRTA11",
    name: "Vinci Logística",
    currentPrice: 8.92,
    lastDividend: 0.069,
    lastPaymentDate: "2024-01-16",
    sector: "Logístico",
    dividendYield: 9.28,
    netWorth: 1.9,
    priceChange: 0.11,
    priceChangePercent: 1.25,
    volume: 1420000
  },
  {
    ticker: "GALG11",
    name: "Gafisa Properties",
    currentPrice: 7.85,
    lastDividend: 0.058,
    lastPaymentDate: "2024-01-22",
    sector: "Logístico",
    dividendYield: 8.86,
    netWorth: 1.6,
    priceChange: 0.06,
    priceChangePercent: 0.77,
    volume: 980000
  },

  // Shoppings
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
    ticker: "MALL11",
    name: "Multiplan",
    currentPrice: 97.30,
    lastDividend: 0.68,
    lastPaymentDate: "2024-01-14",
    sector: "Shoppings",
    dividendYield: 8.38,
    netWorth: 110.5,
    priceChange: -1.15,
    priceChangePercent: -1.17,
    volume: 2850000
  },
  {
    ticker: "SHPH11",
    name: "Shopping Pateo Higienópolis",
    currentPrice: 45.60,
    lastDividend: 0.35,
    lastPaymentDate: "2024-01-11",
    sector: "Shoppings",
    dividendYield: 9.21,
    netWorth: 52.8,
    priceChange: 0.40,
    priceChangePercent: 0.89,
    volume: 1240000
  },

  // Corporativos
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
  },
  {
    ticker: "HGRE11",
    name: "CSHG Real Estate",
    currentPrice: 125.80,
    lastDividend: 1.05,
    lastPaymentDate: "2024-01-17",
    sector: "Corporativo",
    dividendYield: 10.02,
    netWorth: 142.3,
    priceChange: 1.80,
    priceChangePercent: 1.45,
    volume: 1980000
  },
  {
    ticker: "RECT11",
    name: "Receita Ecoagri",
    currentPrice: 8.67,
    lastDividend: 0.072,
    lastPaymentDate: "2024-01-19",
    sector: "Corporativo",
    dividendYield: 9.96,
    netWorth: 1.8,
    priceChange: 0.09,
    priceChangePercent: 1.05,
    volume: 1560000
  },
  {
    ticker: "BCFF11",
    name: "BTG Pactual Corporate Fundo de Fundos",
    currentPrice: 87.45,
    lastDividend: 0.74,
    lastPaymentDate: "2024-01-13",
    sector: "Corporativo",
    dividendYield: 10.16,
    netWorth: 98.7,
    priceChange: 0.65,
    priceChangePercent: 0.75,
    volume: 1820000
  },
  {
    ticker: "BBPO11",
    name: "BB Progressivo",
    currentPrice: 98.20,
    lastDividend: 0.82,
    lastPaymentDate: "2024-01-21",
    sector: "Corporativo",
    dividendYield: 10.02,
    netWorth: 111.4,
    priceChange: -0.45,
    priceChangePercent: -0.46,
    volume: 1650000
  },
  {
    ticker: "CVBI11",
    name: "Caixa Việnhia do Vale",
    currentPrice: 9.38,
    lastDividend: 0.078,
    lastPaymentDate: "2024-01-23",
    sector: "Corporativo",
    dividendYield: 9.98,
    netWorth: 2.1,
    priceChange: 0.12,
    priceChangePercent: 1.30,
    volume: 1380000
  },
  {
    ticker: "JSRE11",
    name: "JSL Real Estate",
    currentPrice: 8.75,
    lastDividend: 0.068,
    lastPaymentDate: "2024-01-24",
    sector: "Corporativo",
    dividendYield: 9.32,
    netWorth: 1.9,
    priceChange: 0.07,
    priceChangePercent: 0.81,
    volume: 1290000
  },

  // Híbridos
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
    ticker: "RBRD11",
    name: "RBR Desenvolvimento",
    currentPrice: 8.95,
    lastDividend: 0.071,
    lastPaymentDate: "2024-01-25",
    sector: "Híbrido",
    dividendYield: 9.53,
    netWorth: 2.0,
    priceChange: 0.14,
    priceChangePercent: 1.59,
    volume: 1120000
  },

  // Residenciais
  {
    ticker: "HGBS11",
    name: "HGBS",
    currentPrice: 124.30,
    lastDividend: 1.08,
    lastPaymentDate: "2024-01-26",
    sector: "Residencial",
    dividendYield: 10.43,
    netWorth: 140.8,
    priceChange: 1.25,
    priceChangePercent: 1.02,
    volume: 1450000
  },
  {
    ticker: "VINO11",
    name: "Vinci Offices",
    currentPrice: 8.67,
    lastDividend: 0.069,
    lastPaymentDate: "2024-01-27",
    sector: "Residencial",
    dividendYield: 9.56,
    netWorth: 1.8,
    priceChange: 0.08,
    priceChangePercent: 0.93,
    volume: 1180000
  },

  // Agronegócio
  {
    ticker: "RZAG11",
    name: "Riza Agro",
    currentPrice: 9.12,
    lastDividend: 0.074,
    lastPaymentDate: "2024-01-28",
    sector: "Agronegócio",
    dividendYield: 9.74,
    netWorth: 2.0,
    priceChange: 0.10,
    priceChangePercent: 1.11,
    volume: 890000
  },
  {
    ticker: "CROP11",
    name: "Crop FII",
    currentPrice: 8.98,
    lastDividend: 0.072,
    lastPaymentDate: "2024-01-29",
    sector: "Agronegócio",
    dividendYield: 9.62,
    netWorth: 1.9,
    priceChange: 0.13,
    priceChangePercent: 1.47,
    volume: 760000
  },

  // Papel e Celulose
  {
    ticker: "HCTR11",
    name: "Hectare",
    currentPrice: 97.65,
    lastDividend: 0.81,
    lastPaymentDate: "2024-01-30",
    sector: "Papel e Celulose",
    dividendYield: 9.95,
    netWorth: 110.2,
    priceChange: 0.75,
    priceChangePercent: 0.77,
    volume: 1340000
  },

  // Outros
  {
    ticker: "FIIP11",
    name: "Fii Prosperitas",
    currentPrice: 89.40,
    lastDividend: 0.73,
    lastPaymentDate: "2024-01-31",
    sector: "Outros",
    dividendYield: 9.80,
    netWorth: 101.2,
    priceChange: -0.35,
    priceChangePercent: -0.39,
    volume: 1050000
  },
  {
    ticker: "BRCO11",
    name: "Banco Btg Pactual Corporate Office Fund",
    currentPrice: 72.15,
    lastDividend: 0.59,
    lastPaymentDate: "2024-02-01",
    sector: "Outros",
    dividendYield: 9.82,
    netWorth: 81.6,
    priceChange: 0.55,
    priceChangePercent: 0.77,
    volume: 1230000
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
