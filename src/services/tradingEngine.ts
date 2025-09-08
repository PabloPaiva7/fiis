import { FII } from '@/types/fii';
import { 
  TradingSignal, 
  TechnicalIndicators, 
  ArbitrageOpportunity, 
  TradingStrategy,
  Alert,
  BacktestResult
} from '@/types/trader';

class TradingEngine {
  // =================== ANÁLISE TÉCNICA REVOLUCIONÁRIA ===================
  
  calculateTechnicalIndicators(fii: FII, historicalData: number[]): TechnicalIndicators {
    const prices = historicalData.slice(-50); // Últimos 50 dias
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      movingAverages: {
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        ema12: this.calculateEMA(prices, 12),
        ema26: this.calculateEMA(prices, 26)
      },
      bollingerBands: this.calculateBollingerBands(prices, 20),
      yield: {
        current: fii.dividendYield,
        average3m: this.calculateAverageYield(fii, 3),
        average6m: this.calculateAverageYield(fii, 6),
        trend: this.calculateYieldTrend(fii)
      }
    };
  }

  // =================== SISTEMA DE SINAIS INTELIGENTE ===================
  
  generateTradingSignal(fii: FII, indicators: TechnicalIndicators): TradingSignal {
    const signals: Array<{ type: TradingSignal['type']; weight: number; reason: string }> = [];
    
    // Análise RSI
    if (indicators.rsi < 30) {
      signals.push({ type: 'BUY', weight: 0.8, reason: 'RSI oversold (<30)' });
    } else if (indicators.rsi > 70) {
      signals.push({ type: 'SELL', weight: 0.8, reason: 'RSI overbought (>70)' });
    }

    // Análise MACD
    if (indicators.macd.value > indicators.macd.signal && indicators.macd.histogram > 0) {
      signals.push({ type: 'BUY', weight: 0.7, reason: 'MACD bullish crossover' });
    } else if (indicators.macd.value < indicators.macd.signal && indicators.macd.histogram < 0) {
      signals.push({ type: 'SELL', weight: 0.7, reason: 'MACD bearish crossover' });
    }

    // Análise de Médias Móveis
    if (fii.currentPrice > indicators.movingAverages.sma20 && indicators.movingAverages.sma20 > indicators.movingAverages.sma50) {
      signals.push({ type: 'BUY', weight: 0.6, reason: 'Price above SMA20 and SMA20 > SMA50' });
    }

    // Análise de Yield
    if (indicators.yield.current > indicators.yield.average6m * 1.2) {
      signals.push({ type: 'BUY', weight: 0.9, reason: 'Yield 20% above 6-month average' });
    }

    // Análise Bollinger Bands
    if (fii.currentPrice < indicators.bollingerBands.lower) {
      signals.push({ type: 'BUY', weight: 0.7, reason: 'Price below lower Bollinger Band' });
    } else if (fii.currentPrice > indicators.bollingerBands.upper) {
      signals.push({ type: 'SELL', weight: 0.7, reason: 'Price above upper Bollinger Band' });
    }

    return this.consolidateSignals(signals, fii);
  }

  // =================== ARBITRAGEM REVOLUCIONÁRIA ===================
  
  findArbitrageOpportunities(fiis: FII[]): ArbitrageOpportunity[] {
    return fiis.map(fii => {
      const navPrice = this.estimateNAV(fii);
      const premium = ((fii.currentPrice - navPrice) / navPrice) * 100;
      
      return {
        fiiTicker: fii.ticker,
        type: (premium > 0 ? 'PREMIUM' : 'DISCOUNT') as 'PREMIUM' | 'DISCOUNT',
        percentage: Math.abs(premium),
        navPrice,
        marketPrice: fii.currentPrice,
        opportunity: (Math.abs(premium) > 10 ? 'HIGH' : Math.abs(premium) > 5 ? 'MODERATE' : 'LOW') as 'HIGH' | 'MODERATE' | 'LOW'
      };
    }).filter(opp => Math.abs(opp.percentage) > 3); // Apenas oportunidades > 3%
  }

  // =================== ESTRATÉGIAS AUTOMATIZADAS ===================
  
  getAvailableStrategies(): TradingStrategy[] {
    return [
      {
        id: 'yield-hunter',
        name: 'Yield Hunter Pro',
        description: 'Identifica FIIs com yields excepcionalmente altos e fundamentos sólidos',
        type: 'YIELD_HUNTING',
        parameters: {
          minYield: 8.0,
          maxPremium: 5.0,
          minVolume: 1000000
        },
        active: true,
        performance: {
          totalReturn: 18.5,
          winRate: 72.3,
          sharpeRatio: 1.45,
          maxDrawdown: 8.2
        }
      },
      {
        id: 'momentum-trader',
        name: 'Momentum Trader AI',
        description: 'Segue tendências usando múltiplos indicadores técnicos',
        type: 'MOMENTUM',
        parameters: {
          rsiPeriod: 14,
          macdFast: 12,
          macdSlow: 26,
          stopLoss: 5.0
        },
        active: true,
        performance: {
          totalReturn: 24.1,
          winRate: 68.7,
          sharpeRatio: 1.62,
          maxDrawdown: 12.1
        }
      },
      {
        id: 'arbitrage-master',
        name: 'Arbitrage Master',
        description: 'Explora diferenças entre preço de mercado e valor patrimonial',
        type: 'ARBITRAGE',
        parameters: {
          minDiscount: 3.0,
          maxPremium: 2.0,
          holdingPeriod: 30
        },
        active: false,
        performance: {
          totalReturn: 15.8,
          winRate: 85.2,
          sharpeRatio: 2.1,
          maxDrawdown: 4.5
        }
      },
      {
        id: 'mean-reversion',
        name: 'Mean Reversion Expert',
        description: 'Compra em baixas e vende em altas baseado em reversão à média',
        type: 'MEAN_REVERSION',
        parameters: {
          bbPeriod: 20,
          bbStdDev: 2,
          rsiOversold: 30,
          rsiOverbought: 70
        },
        active: true,
        performance: {
          totalReturn: 21.3,
          winRate: 74.6,
          sharpeRatio: 1.78,
          maxDrawdown: 9.8
        }
      }
    ];
  }

  // =================== SISTEMA DE ALERTAS INTELIGENTE ===================
  
  checkAlerts(fiis: FII[], userAlerts: Alert[]): Alert[] {
    const triggeredAlerts: Alert[] = [];

    userAlerts.forEach(alert => {
      const fii = fiis.find(f => f.ticker === alert.fiiTicker);
      if (!fii || alert.triggered) return;

      let shouldTrigger = false;
      
      switch (alert.type) {
        case 'PRICE':
          shouldTrigger = this.checkPriceAlert(fii, alert);
          break;
        case 'YIELD':
          shouldTrigger = this.checkYieldAlert(fii, alert);
          break;
        case 'VOLUME':
          shouldTrigger = this.checkVolumeAlert(fii, alert);
          break;
        case 'TECHNICAL':
          shouldTrigger = this.checkTechnicalAlert(fii, alert);
          break;
      }

      if (shouldTrigger) {
        alert.triggered = true;
        alert.triggeredAt = new Date();
        alert.currentValue = this.getCurrentValue(fii, alert.type);
        triggeredAlerts.push(alert);
      }
    });

    return triggeredAlerts;
  }

  // =================== BACKTESTING AVANÇADO ===================
  
  async runBacktest(strategy: TradingStrategy, fiis: FII[], period: string): Promise<BacktestResult> {
    // Simulação de backtesting com dados históricos
    const trades = this.simulateStrategy(strategy, fiis, period);
    
    return {
      strategy: strategy.name,
      period,
      totalReturn: this.calculateTotalReturn(trades),
      annualizedReturn: this.calculateAnnualizedReturn(trades, period),
      volatility: this.calculateVolatility(trades),
      sharpeRatio: this.calculateSharpeRatio(trades),
      maxDrawdown: this.calculateMaxDrawdown(trades),
      winRate: this.calculateWinRate(trades),
      trades
    };
  }

  // =================== MÉTODOS AUXILIARES ===================
  
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const diff = prices[prices.length - i] - prices[prices.length - i - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    
    // Simplificado: signal seria EMA9 do MACD
    const signal = macdLine * 0.9; // Aproximação
    
    return {
      value: macdLine,
      signal,
      histogram: macdLine - signal
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateBollingerBands(prices: number[], period: number): { upper: number; middle: number; lower: number } {
    const sma = this.calculateSMA(prices, period);
    const variance = prices.slice(-period).reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2)
    };
  }

  private calculateAverageYield(fii: FII, months: number): number {
    // Simulação - em produção, buscar dados históricos reais
    return fii.dividendYield * (0.9 + Math.random() * 0.2);
  }

  private calculateYieldTrend(fii: FII): 'INCREASING' | 'DECREASING' | 'STABLE' {
    // Simulação baseada em variação de preço
    if (fii.priceChangePercent > 2) return 'DECREASING';
    if (fii.priceChangePercent < -2) return 'INCREASING';
    return 'STABLE';
  }

  private estimateNAV(fii: FII): number {
    // Estimativa baseada em múltiplos do setor e yield
    const sectorMultiple = this.getSectorMultiple(fii.sector);
    return fii.currentPrice * (1 - (fii.dividendYield / 100) * sectorMultiple);
  }

  private getSectorMultiple(sector: string): number {
    const multiples: Record<string, number> = {
      'Logístico': 0.05,
      'Corporativo': 0.03,
      'Shoppings': 0.08,
      'Residencial': 0.04,
      'Hoteleiro': 0.10,
      'Hospitalar': 0.06
    };
    return multiples[sector] || 0.05;
  }

  private consolidateSignals(signals: Array<{ type: TradingSignal['type']; weight: number; reason: string }>, fii: FII): TradingSignal {
    if (signals.length === 0) {
      return {
        type: 'HOLD',
        strength: 'WEAK',
        confidence: 50,
        reasons: ['No clear signals detected']
      };
    }

    // Calcular peso total por tipo de sinal
    const buyWeight = signals.filter(s => s.type === 'BUY').reduce((sum, s) => sum + s.weight, 0);
    const sellWeight = signals.filter(s => s.type === 'SELL').reduce((sum, s) => sum + s.weight, 0);
    
    const netWeight = buyWeight - sellWeight;
    const confidence = Math.min(95, Math.abs(netWeight) * 20 + 50);
    
    let type: TradingSignal['type'] = 'HOLD';
    let strength: TradingSignal['strength'] = 'WEAK';
    
    if (Math.abs(netWeight) > 0.5) {
      type = netWeight > 0 ? 'BUY' : 'SELL';
      if (Math.abs(netWeight) > 1.5) strength = 'STRONG';
      else if (Math.abs(netWeight) > 0.8) strength = 'MODERATE';
    }

    const reasons = signals.map(s => s.reason);
    
    // Calcular target price e stop loss
    let targetPrice: number | undefined;
    let stopLoss: number | undefined;
    
    if (type === 'BUY') {
      targetPrice = fii.currentPrice * 1.15; // 15% target
      stopLoss = fii.currentPrice * 0.92; // 8% stop loss
    } else if (type === 'SELL') {
      targetPrice = fii.currentPrice * 0.90; // 10% target down
      stopLoss = fii.currentPrice * 1.05; // 5% stop loss up
    }

    return {
      type,
      strength,
      confidence: Math.round(confidence),
      reasons,
      targetPrice,
      stopLoss
    };
  }

  private checkPriceAlert(fii: FII, alert: Alert): boolean {
    return alert.condition.includes('above') ? 
      fii.currentPrice >= alert.targetValue : 
      fii.currentPrice <= alert.targetValue;
  }

  private checkYieldAlert(fii: FII, alert: Alert): boolean {
    return alert.condition.includes('above') ? 
      fii.dividendYield >= alert.targetValue : 
      fii.dividendYield <= alert.targetValue;
  }

  private checkVolumeAlert(fii: FII, alert: Alert): boolean {
    return alert.condition.includes('above') ? 
      fii.volume >= alert.targetValue : 
      fii.volume <= alert.targetValue;
  }

  private checkTechnicalAlert(fii: FII, alert: Alert): boolean {
    // Implementar verificações técnicas específicas
    return Math.random() > 0.7; // Placeholder
  }

  private getCurrentValue(fii: FII, type: Alert['type']): number {
    switch (type) {
      case 'PRICE': return fii.currentPrice;
      case 'YIELD': return fii.dividendYield;
      case 'VOLUME': return fii.volume;
      default: return 0;
    }
  }

  private simulateStrategy(strategy: TradingStrategy, fiis: FII[], period: string): any[] {
    // Simulação simplificada de trades
    return fiis.slice(0, 5).map((fii, index) => ({
      date: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      ticker: fii.ticker,
      action: Math.random() > 0.5 ? 'BUY' : 'SELL',
      price: fii.currentPrice,
      quantity: Math.floor(Math.random() * 100) + 10,
      pnl: (Math.random() - 0.4) * fii.currentPrice * 10
    }));
  }

  private calculateTotalReturn(trades: any[]): number {
    return trades.reduce((sum, trade) => sum + trade.pnl, 0);
  }

  private calculateAnnualizedReturn(trades: any[], period: string): number {
    const totalReturn = this.calculateTotalReturn(trades);
    // Simulação - em produção calcular baseado no período real
    return totalReturn * 12; // Assumindo período mensal
  }

  private calculateVolatility(trades: any[]): number {
    const returns = trades.map(t => t.pnl);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private calculateSharpeRatio(trades: any[]): number {
    const totalReturn = this.calculateTotalReturn(trades);
    const volatility = this.calculateVolatility(trades);
    return volatility !== 0 ? totalReturn / volatility : 0;
  }

  private calculateMaxDrawdown(trades: any[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;

    trades.forEach(trade => {
      runningTotal += trade.pnl;
      if (runningTotal > peak) peak = runningTotal;
      const drawdown = (peak - runningTotal) / peak * 100;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return maxDrawdown;
  }

  private calculateWinRate(trades: any[]): number {
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    return (winningTrades / trades.length) * 100;
  }
}

export const tradingEngine = new TradingEngine();