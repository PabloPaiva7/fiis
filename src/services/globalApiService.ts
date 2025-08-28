import { Asset, AssetType, FII, LegacyFII, DividendStock, ETF, BDR, Crypto, Commodity, ChartData } from '../types/global-assets';

// API Configuration
const API_CONFIG = {
  // Para dados da B3 e FIIs
  BRAPI: {
    baseUrl: 'https://brapi.dev/api',
    // Usar token demo para testes, mas recomendar token próprio
    token: 'demo', // Usuário deve configurar seu próprio token
  },
  
  // Para dados internacionais de ações
  ALPHA_VANTAGE: {
    baseUrl: 'https://www.alphavantage.co/query',
    // API key gratuita com limite de requests
    apiKey: 'demo', // Usuário deve configurar
  },
  
  // Para criptomoedas
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    // API gratuita com rate limits
  },
  
  // Para commodities e dados adicionais
  YAHOO_FINANCE: {
    baseUrl: 'https://query1.finance.yahoo.com',
  },
  
  // Para dados de ETFs
  FINANCIAL_MODELING_PREP: {
    baseUrl: 'https://financialmodelingprep.com/api/v3',
    apiKey: 'demo', // Usuário deve configurar
  }
};

class GlobalApiService {
  private async fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ========== FIIs (Brazilian REITs) ==========
  async fetchFiiData(ticker: string): Promise<FII | null> {
    try {
      // Usar serviço existente e converter para novo formato
      const { fiiApiService } = await import('./fiiApiService');
      const legacyFii = await fiiApiService.fetchFiiData(ticker);
      return legacyFii ? this.convertLegacyFII(legacyFii) : null;
    } catch (error) {
      console.error('Error fetching FII data:', error);
      return null;
    }
  }

  async getTopFiis(): Promise<FII[]> {
    try {
      const { fiiApiService } = await import('./fiiApiService');
      const legacyFiis = await fiiApiService.getTopFiis();
      return legacyFiis.map(fii => this.convertLegacyFII(fii));
    } catch (error) {
      console.error('Error fetching top FIIs:', error);
      return this.getMockFiis();
    }
  }

  // Converter FII legacy para novo formato
  private convertLegacyFII(legacyFii: LegacyFII): FII {
    return {
      ...legacyFii,
      currency: 'BRL',
      market: 'B3',
      country: 'Brazil',
      lastUpdate: new Date().toISOString(),
      dividendFrequency: 'monthly' as const,
      nextPaymentDate: this.calculateNextPaymentDate(legacyFii.lastPaymentDate)
    };
  }

  private calculateNextPaymentDate(lastPayment: string): string {
    const lastDate = new Date(lastPayment);
    lastDate.setMonth(lastDate.getMonth() + 1);
    return lastDate.toISOString().split('T')[0];
  }

  // ========== US/International Dividend Stocks ==========
  async fetchDividendStock(ticker: string): Promise<DividendStock | null> {
    try {
      const url = `${API_CONFIG.ALPHA_VANTAGE.baseUrl}?function=OVERVIEW&symbol=${ticker}&apikey=${API_CONFIG.ALPHA_VANTAGE.apiKey}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      if (data.Symbol) {
        return this.mapToStock(data);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return this.getMockStock(ticker);
    }
  }

  async getTopDividendStocks(): Promise<DividendStock[]> {
    // Mock data for top dividend-paying US stocks
    return this.getMockStocks();
  }

  // ========== ETFs ==========
  async fetchETF(ticker: string): Promise<ETF | null> {
    try {
      // Try multiple APIs for ETF data
      return await this.fetchETFFromYahoo(ticker) || this.getMockETF(ticker);
    } catch (error) {
      console.error('Error fetching ETF data:', error);
      return this.getMockETF(ticker);
    }
  }

  async getTopETFs(): Promise<ETF[]> {
    return this.getMockETFs();
  }

  // ========== BDRs ==========
  async fetchBDR(ticker: string): Promise<BDR | null> {
    try {
      // BDRs são negociados na B3, então usar BRAPI
      const url = `${API_CONFIG.BRAPI.baseUrl}/quote/${ticker}?token=${API_CONFIG.BRAPI.token}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) throw new Error('BDR API request failed');
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return this.mapToBDR(data.results[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching BDR data:', error);
      return this.getMockBDR(ticker);
    }
  }

  async getTopBDRs(): Promise<BDR[]> {
    return this.getMockBDRs();
  }

  // ========== Cryptocurrencies ==========
  async fetchCrypto(id: string): Promise<Crypto | null> {
    try {
      const url = `${API_CONFIG.COINGECKO.baseUrl}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) throw new Error('Crypto API request failed');
      
      const data = await response.json();
      return this.mapToCrypto(data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getMockCrypto(id);
    }
  }

  async getTopCryptos(): Promise<Crypto[]> {
    try {
      const url = `${API_CONFIG.COINGECKO.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) throw new Error('Crypto API request failed');
      
      const data = await response.json();
      return data.map((crypto: any) => this.mapToCrypto(crypto));
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return this.getMockCryptos();
    }
  }

  // ========== Commodities ==========
  async fetchCommodity(symbol: string): Promise<Commodity | null> {
    try {
      // Use Yahoo Finance for commodity data
      const url = `${API_CONFIG.YAHOO_FINANCE.baseUrl}/v8/finance/chart/${symbol}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) throw new Error('Commodity API request failed');
      
      const data = await response.json();
      return this.mapToCommodity(data, symbol);
    } catch (error) {
      console.error('Error fetching commodity data:', error);
      return this.getMockCommodity(symbol);
    }
  }

  async getTopCommodities(): Promise<Commodity[]> {
    return this.getMockCommodities();
  }

  // ========== Universal Search ==========
  async searchAsset(query: string, assetType?: AssetType): Promise<Asset[]> {
    const results: Asset[] = [];
    
    // Search across all asset types if no specific type provided
    const typesToSearch = assetType ? [assetType] : ['fiis', 'stocks', 'etfs', 'bdrs', 'crypto', 'commodities'] as AssetType[];
    
    for (const type of typesToSearch) {
      try {
        let asset: Asset | null = null;
        
        switch (type) {
          case 'fiis':
            asset = await this.fetchFiiData(query);
            break;
          case 'stocks':
            asset = await this.fetchDividendStock(query);
            break;
          case 'etfs':
            asset = await this.fetchETF(query);
            break;
          case 'bdrs':
            asset = await this.fetchBDR(query);
            break;
          case 'crypto':
            asset = await this.fetchCrypto(query.toLowerCase());
            break;
          case 'commodities':
            asset = await this.fetchCommodity(query);
            break;
        }
        
        if (asset) {
          results.push(asset);
        }
      } catch (error) {
        console.error(`Error searching ${type}:`, error);
      }
    }
    
    return results;
  }

  // ========== Historical Data ==========
  async fetchHistoricalData(ticker: string, assetType: AssetType): Promise<ChartData[]> {
    try {
      switch (assetType) {
        case 'fiis':
          const { fiiApiService } = await import('./fiiApiService');
          return await fiiApiService.fetchHistoricalData(ticker);
        case 'crypto':
          return await this.fetchCryptoHistory(ticker);
        default:
          return await this.fetchYahooHistory(ticker);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.generateMockHistory(ticker);
    }
  }

  // ========== Helper Methods ==========
  private async fetchETFFromYahoo(ticker: string): Promise<ETF | null> {
    // Implementation for Yahoo Finance ETF data
    return null;
  }

  private async fetchCryptoHistory(id: string): Promise<ChartData[]> {
    try {
      const url = `${API_CONFIG.COINGECKO.baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=365`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) throw new Error('Crypto history API request failed');
      
      const data = await response.json();
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toISOString().split('T')[0],
        price: Number(price.toFixed(2))
      }));
    } catch (error) {
      console.error('Error fetching crypto history:', error);
      return this.generateMockHistory(id);
    }
  }

  private async fetchYahooHistory(ticker: string): Promise<ChartData[]> {
    // Implementation for Yahoo Finance historical data
    return this.generateMockHistory(ticker);
  }

  // ========== Mapping Functions ==========
  private mapToStock(data: any): DividendStock {
    return {
      ticker: data.Symbol,
      name: data.Name || 'Unknown Company',
      currentPrice: parseFloat(data.Price || '0'),
      currency: 'USD',
      market: 'US',
      country: 'United States',
      priceChange: 0,
      priceChangePercent: 0,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      lastDividend: parseFloat(data.DividendPerShare || '0'),
      lastPaymentDate: data.ExDividendDate || '',
      dividendYield: parseFloat(data.DividendYield || '0') * 100,
      dividendFrequency: 'quarterly',
      sector: data.Sector || 'Unknown',
      marketCap: parseFloat(data.MarketCapitalization || '0'),
      peRatio: parseFloat(data.PERatio || '0'),
      eps: parseFloat(data.EPS || '0'),
      dividendHistory: []
    };
  }

  private mapToBDR(data: any): BDR {
    return {
      ticker: data.symbol,
      name: data.shortName || data.longName || 'Unknown BDR',
      currentPrice: data.regularMarketPrice || 0,
      currency: 'BRL',
      market: 'B3',
      country: 'Brazil',
      priceChange: data.regularMarketChange || 0,
      priceChangePercent: data.regularMarketChangePercent || 0,
      volume: data.regularMarketVolume || 0,
      lastUpdate: new Date().toISOString(),
      underlyingAsset: data.symbol?.replace('34', '').replace('35', '') || '',
      underlyingMarket: 'US',
      ratio: data.symbol?.endsWith('34') ? 1 : 10, // Simplified logic
      sponsor: 'Banco do Brasil' // Simplified
    };
  }

  private mapToCrypto(data: any): Crypto {
    return {
      ticker: data.symbol?.toUpperCase() || '',
      name: data.name || 'Unknown Crypto',
      currentPrice: data.current_price || data.market_data?.current_price?.usd || 0,
      currency: 'USD',
      market: 'Crypto',
      country: 'Global',
      priceChange: data.price_change_24h || data.market_data?.price_change_24h || 0,
      priceChangePercent: data.price_change_percentage_24h || data.market_data?.price_change_percentage_24h || 0,
      volume: data.total_volume || data.market_data?.total_volume?.usd || 0,
      lastUpdate: new Date().toISOString(),
      symbol: data.symbol?.toUpperCase() || '',
      marketCap: data.market_cap || data.market_data?.market_cap?.usd || 0,
      maxSupply: data.max_supply || data.market_data?.max_supply,
      circulatingSupply: data.circulating_supply || data.market_data?.circulating_supply,
      rank: data.market_cap_rank || 0,
      change24h: data.price_change_percentage_24h || 0,
      change7d: data.price_change_percentage_7d || 0
    };
  }

  private mapToCommodity(data: any, symbol: string): Commodity {
    const result = data.chart?.result?.[0];
    const meta = result?.meta;
    const quote = result?.indicators?.quote?.[0];
    
    return {
      ticker: symbol,
      name: meta?.longName || symbol,
      currentPrice: meta?.regularMarketPrice || 0,
      currency: meta?.currency || 'USD',
      market: 'Commodity',
      country: 'Global',
      priceChange: meta?.regularMarketPrice - meta?.previousClose || 0,
      priceChangePercent: ((meta?.regularMarketPrice - meta?.previousClose) / meta?.previousClose * 100) || 0,
      volume: meta?.regularMarketVolume || 0,
      lastUpdate: new Date().toISOString(),
      category: this.getCommodityCategory(symbol),
      unit: this.getCommodityUnit(symbol)
    };
  }

  private getCommodityCategory(symbol: string): 'metals' | 'energy' | 'agriculture' | 'livestock' {
    if (['GC=F', 'SI=F', 'PL=F'].includes(symbol)) return 'metals';
    if (['CL=F', 'NG=F'].includes(symbol)) return 'energy';
    if (['ZC=F', 'ZS=F', 'ZW=F'].includes(symbol)) return 'agriculture';
    return 'livestock';
  }

  private getCommodityUnit(symbol: string): string {
    const units: Record<string, string> = {
      'GC=F': 'oz',
      'SI=F': 'oz',
      'CL=F': 'barrel',
      'NG=F': 'MMBtu',
      'ZC=F': 'bushel'
    };
    return units[symbol] || 'unit';
  }

  // ========== Mock Data Methods ==========
  private getMockFiis(): FII[] {
    const { mockFIIs } = require('../data/mockFiiData');
    return mockFIIs;
  }

  private getMockStock(ticker: string): DividendStock {
    return {
      ticker,
      name: `Mock Stock ${ticker}`,
      currentPrice: 150 + Math.random() * 100,
      currency: 'USD',
      market: 'NYSE',
      country: 'United States',
      priceChange: (Math.random() - 0.5) * 10,
      priceChangePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 1000000),
      lastUpdate: new Date().toISOString(),
      lastDividend: 2 + Math.random() * 3,
      lastPaymentDate: '2024-01-15',
      dividendYield: 3 + Math.random() * 4,
      dividendFrequency: 'quarterly',
      sector: 'Technology',
      marketCap: 50000000000 + Math.random() * 100000000000,
      peRatio: 15 + Math.random() * 20,
      eps: 5 + Math.random() * 10,
      dividendHistory: []
    };
  }

  private getMockStocks(): DividendStock[] {
    const tickers = ['AAPL', 'MSFT', 'JNJ', 'KO', 'PG', 'XOM', 'T', 'VZ', 'IBM', 'GE'];
    return tickers.map(ticker => this.getMockStock(ticker));
  }

  private getMockETF(ticker: string): ETF {
    return {
      ticker,
      name: `Mock ETF ${ticker}`,
      currentPrice: 50 + Math.random() * 200,
      currency: 'USD',
      market: 'NYSE',
      country: 'United States',
      priceChange: (Math.random() - 0.5) * 5,
      priceChangePercent: (Math.random() - 0.5) * 3,
      volume: Math.floor(Math.random() * 10000000),
      lastUpdate: new Date().toISOString(),
      category: 'equity',
      totalAssets: 1000000000 + Math.random() * 50000000000,
      expenseRatio: 0.1 + Math.random() * 0.5,
      inception: '2010-01-01',
      dividendYield: 1 + Math.random() * 5,
      holdings: []
    };
  }

  private getMockETFs(): ETF[] {
    const tickers = ['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'EEM', 'TLT', 'GLD', 'USO', 'XLE'];
    return tickers.map(ticker => this.getMockETF(ticker));
  }

  private getMockBDR(ticker: string): BDR {
    return {
      ticker,
      name: `Mock BDR ${ticker}`,
      currentPrice: 20 + Math.random() * 100,
      currency: 'BRL',
      market: 'B3',
      country: 'Brazil',
      priceChange: (Math.random() - 0.5) * 5,
      priceChangePercent: (Math.random() - 0.5) * 3,
      volume: Math.floor(Math.random() * 1000000),
      lastUpdate: new Date().toISOString(),
      underlyingAsset: ticker.replace('34', '').replace('35', ''),
      underlyingMarket: 'NYSE',
      ratio: ticker.endsWith('34') ? 1 : 10,
      sponsor: 'Banco do Brasil'
    };
  }

  private getMockBDRs(): BDR[] {
    const tickers = ['AAPL34', 'MSFT34', 'GOOGL34', 'AMZN34', 'TSLA34', 'META34', 'NVDA34', 'NFLX34', 'DIS34', 'BA34'];
    return tickers.map(ticker => this.getMockBDR(ticker));
  }

  private getMockCrypto(id: string): Crypto {
    return {
      ticker: id.toUpperCase(),
      name: `Mock Crypto ${id}`,
      currentPrice: 1000 + Math.random() * 50000,
      currency: 'USD',
      market: 'Crypto',
      country: 'Global',
      priceChange: (Math.random() - 0.5) * 1000,
      priceChangePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 1000000000),
      lastUpdate: new Date().toISOString(),
      symbol: id.toUpperCase(),
      marketCap: 10000000000 + Math.random() * 100000000000,
      rank: Math.floor(Math.random() * 100) + 1,
      change24h: (Math.random() - 0.5) * 10,
      change7d: (Math.random() - 0.5) * 20
    };
  }

  private getMockCryptos(): Crypto[] {
    const ids = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'avalanche', 'chainlink', 'polygon', 'uniswap', 'aave'];
    return ids.map(id => this.getMockCrypto(id));
  }

  private getMockCommodity(symbol: string): Commodity {
    return {
      ticker: symbol,
      name: `Mock Commodity ${symbol}`,
      currentPrice: 50 + Math.random() * 2000,
      currency: 'USD',
      market: 'Commodity',
      country: 'Global',
      priceChange: (Math.random() - 0.5) * 50,
      priceChangePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 100000),
      lastUpdate: new Date().toISOString(),
      category: this.getCommodityCategory(symbol),
      unit: this.getCommodityUnit(symbol)
    };
  }

  private getMockCommodities(): Commodity[] {
    const symbols = ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'ZC=F', 'ZS=F', 'ZW=F', 'CT=F', 'SB=F', 'KC=F'];
    return symbols.map(symbol => this.getMockCommodity(symbol));
  }

  private generateMockHistory(ticker: string): ChartData[] {
    const history = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    const basePrice = 100 + Math.random() * 500;
    
    for (let i = 0; i < 365; i += 7) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const randomVariation = (Math.random() - 0.5) * 0.1;
      const trend = (i / 365) * 0.1;
      const price = basePrice * (1 + trend + randomVariation);
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: Number(price.toFixed(2))
      });
    }
    
    return history;
  }
}

export const globalApiService = new GlobalApiService();