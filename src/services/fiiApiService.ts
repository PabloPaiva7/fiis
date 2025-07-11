import { FII, ChartData } from '../types/fii';
import { BrapiResponse, HistoricalData } from '../types/api';
import { mockFIIs } from '../data/mockFiiData';

// Lista expandida de FIIs conhecidos com seus setores
const FII_SECTORS: Record<string, string> = {
  // Logísticos
  'KNRI11': 'Logístico',
  'HGLG11': 'Logístico', 
  'VILG11': 'Logístico',
  'BTLG11': 'Logístico',
  'XPLG11': 'Logístico',
  'RBRR11': 'Logístico',
  'VRTA11': 'Logístico',
  'GALG11': 'Logístico',
  
  // Shoppings
  'XPML11': 'Shoppings',
  'MALL11': 'Shoppings',
  'SHPH11': 'Shoppings',
  
  // Corporativos
  'MXRF11': 'Corporativo',
  'KNCR11': 'Corporativo',
  'HGRE11': 'Corporativo',
  'RECT11': 'Corporativo',
  'BCFF11': 'Corporativo',
  'BBPO11': 'Corporativo',
  'CVBI11': 'Corporativo',
  'JSRE11': 'Corporativo',
  
  // Híbridos
  'IRDM11': 'Híbrido',
  'RBRD11': 'Híbrido',
  
  // Residenciais
  'HGBS11': 'Residencial',
  'VINO11': 'Residencial',
  
  // Agronegócio
  'RZAG11': 'Agronegócio',
  'CROP11': 'Agronegócio',
  
  // Papel e Celulose
  'HCTR11': 'Papel e Celulose',
  
  // Outros
  'FIIP11': 'Outros',
  'BRCO11': 'Outros'
};

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const YAHOO_FINANCE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

class FiiApiService {
  private async fetchWithTimeout(url: string, timeout = 8000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async fetchFiiData(ticker: string): Promise<FII | null> {
    try {
      console.log(`Buscando dados para ${ticker}...`);
      
      // Tentar BRAPI primeiro
      const brapiData = await this.fetchFromBrapi(ticker);
      if (brapiData) {
        return brapiData;
      }

      // Fallback para Yahoo Finance
      const yahooData = await this.fetchFromYahoo(ticker);
      if (yahooData) {
        return yahooData;
      }

      // Fallback final para dados simulados
      return this.getFallbackData(ticker);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return this.getFallbackData(ticker);
    }
  }

  private async fetchFromBrapi(ticker: string): Promise<FII | null> {
    try {
      const url = `${BRAPI_BASE_URL}/quote/${ticker}?token=demo`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`BRAPI HTTP ${response.status}`);
      }

      const data: BrapiResponse = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('Nenhum resultado encontrado na BRAPI');
      }

      const quote = data.results[0];
      return this.mapBrapiToFii(quote);
    } catch (error) {
      console.log('BRAPI falhou:', error);
      return null;
    }
  }

  private async fetchFromYahoo(ticker: string): Promise<FII | null> {
    try {
      const symbol = ticker.endsWith('.SA') ? ticker : `${ticker}.SA`;
      const url = `${YAHOO_FINANCE_URL}/${symbol}`;
      
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.chart?.result?.[0]) {
        throw new Error('Dados não encontrados no Yahoo Finance');
      }

      const result = data.chart.result[0];
      return this.mapYahooToFii(result, ticker);
    } catch (error) {
      console.log('Yahoo Finance falhou:', error);
      return null;
    }
  }

  private mapBrapiToFii(quote: any): FII {
    const ticker = quote.symbol.replace('.SA', '');
    const sector = FII_SECTORS[ticker] || 'Não classificado';
    
    // Simular dados que não estão disponíveis na API gratuita
    const mockDividend = Number((quote.regularMarketPrice * 0.008).toFixed(3)); // ~0.8% do preço
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() - Math.floor(Math.random() * 30)); // Último mês

    return {
      ticker,
      name: quote.longName || quote.shortName || ticker,
      currentPrice: quote.regularMarketPrice || 0,
      lastDividend: mockDividend,
      lastPaymentDate: mockDate.toISOString().split('T')[0],
      sector,
      dividendYield: Number(((mockDividend / quote.regularMarketPrice) * 12 * 100).toFixed(2)),
      netWorth: (quote.marketCap || 1000000000) / 1000000000, // Em bilhões
      priceChange: quote.regularMarketChange || 0,
      priceChangePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0
    };
  }

  private mapYahooToFii(result: any, ticker: string): FII {
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    const sector = FII_SECTORS[ticker] || 'Não classificado';
    
    const currentPrice = meta.regularMarketPrice || 0;
    const priceChange = currentPrice - (meta.previousClose || currentPrice);
    const priceChangePercent = meta.previousClose ? (priceChange / meta.previousClose) * 100 : 0;
    
    // Simular dados não disponíveis
    const mockDividend = Number((currentPrice * 0.008).toFixed(3));
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() - Math.floor(Math.random() * 30));

    return {
      ticker: ticker.replace('.SA', ''),
      name: meta.longName || meta.shortName || ticker,
      currentPrice,
      lastDividend: mockDividend,
      lastPaymentDate: mockDate.toISOString().split('T')[0],
      sector,
      dividendYield: Number(((mockDividend / currentPrice) * 12 * 100).toFixed(2)),
      netWorth: 1.5, // Valor simulado
      priceChange,
      priceChangePercent,
      volume: meta.regularMarketVolume || 0
    };
  }

  private getFallbackData(ticker: string): FII | null {
    console.log(`Usando dados simulados para ${ticker}`);
    return mockFIIs.find(fii => fii.ticker.toLowerCase() === ticker.toLowerCase()) || null;
  }

  async fetchHistoricalData(ticker: string): Promise<ChartData[]> {
    try {
      const symbol = ticker.endsWith('.SA') ? ticker : `${ticker}.SA`;
      const url = `${YAHOO_FINANCE_URL}/${symbol}?interval=1d&range=1y`;
      
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico: ${response.status}`);
      }

      const data = await response.json();
      const result = data.chart?.result?.[0];
      
      if (!result?.timestamp || !result?.indicators?.quote?.[0]?.close) {
        throw new Error('Dados históricos não encontrados');
      }

      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;
      
      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: closes[index] || 0
      })).filter((item: ChartData) => item.price > 0);
      
    } catch (error) {
      console.error('Erro ao buscar dados históricos:', error);
      // Fallback para dados simulados
      return this.generateFallbackHistory(ticker);
    }
  }

  private generateFallbackHistory(ticker: string): ChartData[] {
    const mockFii = mockFIIs.find(fii => fii.ticker === ticker);
    const basePrice = mockFii?.currentPrice || 10;
    
    const history: ChartData[] = [];
    const today = new Date();
    
    for (let i = 365; i >= 0; i -= 7) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const randomVariation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + randomVariation);
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: Number(price.toFixed(2))
      });
    }
    
    return history;
  }

  async getTopFiis(): Promise<FII[]> {
    // Carregar todos os FIIs simulados - lista expandida
    const allTickers = mockFIIs.map(fii => fii.ticker);

    const promises = allTickers.map(ticker => this.fetchFiiData(ticker));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<FII> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
      .sort((a, b) => b.dividendYield - a.dividendYield); // Ordenar por dividend yield
  }
}

export const fiiApiService = new FiiApiService();
