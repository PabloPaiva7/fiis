export type AssetType = 'fiis' | 'stocks' | 'etfs' | 'bdrs' | 'crypto' | 'commodities';

export interface BaseAsset {
  ticker: string;
  name: string;
  currentPrice: number;
  currency: string;
  market: string; // 'B3', 'NYSE', 'NASDAQ', etc.
  country: string;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  lastUpdate: string;
}

// Extensão para ativos que pagam dividendos/rendimentos
export interface DividendAsset extends BaseAsset {
  lastDividend: number;
  lastPaymentDate: string;
  dividendYield: number;
  dividendFrequency: 'monthly' | 'quarterly' | 'semiannual' | 'annual';
  nextPaymentDate?: string;
}

// FIIs brasileiros (compatível com o tipo existente)
export interface FII extends DividendAsset {
  sector: string;
  netWorth: number;
}

// Tipo legacy para compatibilidade com o código existente
export interface LegacyFII {
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

// Ações que pagam dividendos
export interface DividendStock extends DividendAsset {
  sector: string;
  marketCap: number;
  peRatio?: number;
  eps?: number;
  dividendHistory: DividendHistory[];
}

// ETFs
export interface ETF extends BaseAsset {
  category: string; // 'equity', 'bond', 'commodity', 'mixed'
  totalAssets: number;
  expenseRatio: number;
  inception: string;
  benchmark?: string;
  dividendYield?: number;
  holdings: ETFHolding[];
}

// BDRs
export interface BDR extends BaseAsset {
  underlyingAsset: string;
  underlyingMarket: string;
  ratio: number; // quantas BDRs equivalem a 1 ação
  sponsor: string;
}

// Criptomoedas
export interface Crypto extends BaseAsset {
  symbol: string;
  marketCap: number;
  maxSupply?: number;
  circulatingSupply?: number;
  rank: number;
  change24h: number;
  change7d: number;
  stakingYield?: number; // para cryptos que oferecem staking
}

// Commodities
export interface Commodity extends BaseAsset {
  category: 'metals' | 'energy' | 'agriculture' | 'livestock';
  unit: string; // 'oz', 'barrel', 'bushel', etc.
  futures?: CommodityFuture[];
}

// Tipos auxiliares
export interface DividendHistory {
  date: string;
  amount: number;
  type: 'regular' | 'special' | 'interim';
}

export interface ETFHolding {
  ticker: string;
  name: string;
  weight: number;
}

export interface CommodityFuture {
  expiry: string;
  price: number;
  volume: number;
}

export interface ChartData {
  date: string;
  price: number;
  volume?: number;
}

export interface AssetHistoryData {
  ticker: string;
  history: ChartData[];
}

// Union type para todos os tipos de assets
export type Asset = FII | DividendStock | ETF | BDR | Crypto | Commodity;

// Filtros de busca
export interface AssetFilters {
  assetType?: AssetType[];
  market?: string[];
  country?: string[];
  sector?: string[];
  minDividendYield?: number;
  maxPrice?: number;
  minPrice?: number;
  currency?: string[];
}