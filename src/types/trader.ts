export interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
  confidence: number;
  reasons: string[];
  targetPrice?: number;
  stopLoss?: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    ema12: number;
    ema26: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  yield: {
    current: number;
    average3m: number;
    average6m: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  };
}

export interface ArbitrageOpportunity {
  fiiTicker: string;
  type: 'PREMIUM' | 'DISCOUNT';
  percentage: number;
  navPrice: number;
  marketPrice: number;
  opportunity: 'HIGH' | 'MODERATE' | 'LOW';
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'YIELD_HUNTING' | 'MOMENTUM' | 'ARBITRAGE' | 'MEAN_REVERSION';
  parameters: Record<string, any>;
  active: boolean;
  performance: {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface Alert {
  id: string;
  fiiTicker: string;
  type: 'PRICE' | 'YIELD' | 'VOLUME' | 'TECHNICAL';
  condition: string;
  targetValue: number;
  currentValue: number;
  triggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface Portfolio {
  positions: Array<{
    ticker: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    totalValue: number;
    yield: number;
    allocation: number;
  }>;
  totalValue: number;
  totalYield: number;
  monthlyDividends: number;
  diversificationScore: number;
}

export interface BacktestResult {
  strategy: string;
  period: string;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trades: Array<{
    date: string;
    ticker: string;
    action: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    pnl: number;
  }>;
}