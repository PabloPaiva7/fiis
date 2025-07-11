import { useState, useEffect } from 'react';
import { FII } from '../types/fii';
import { fiiApiService } from '../services/fiiApiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FiiChart } from './FiiChart';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { TrendingUp, Calendar, Building, DollarSign, BarChart3 } from 'lucide-react';

interface FiiDetailModalProps {
  fii: FII | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FiiDetailModal = ({ fii, isOpen, onClose }: FiiDetailModalProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (fii) {
      const loadHistoricalData = async () => {
        try {
          const historyData = await fiiApiService.fetchHistoricalData(fii.ticker);
          setChartData(historyData);
        } catch (error) {
          console.error('Erro ao carregar dados históricos:', error);
          setChartData([]);
        }
      };
      
      loadHistoricalData();
    }
  }, [fii]);

  if (!fii) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Logístico': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Shoppings': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Corporativo': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Híbrido': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[sector] || 'bg-muted text-muted-foreground';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            {fii.ticker}
            <Badge className={getSectorColor(fii.sector)} variant="outline">
              {fii.sector}
            </Badge>
          </DialogTitle>
          <p className="text-muted-foreground">{fii.name}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Preço Atual</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(fii.currentPrice)}
              </p>
              <p className={`text-sm ${fii.priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {fii.priceChange >= 0 ? '+' : ''}{formatCurrency(fii.priceChange)} 
                ({fii.priceChangePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Dividend Yield</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {fii.dividendYield.toFixed(2)}%
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Último Dividendo</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(fii.lastDividend)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(fii.lastPaymentDate)}
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Volume</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(fii.volume)}
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações do Fundo
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patrimônio Líquido</span>
                  <span className="text-foreground font-medium">
                    {formatCurrency(fii.netWorth * 1000000000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Setor</span>
                  <Badge className={getSectorColor(fii.sector)} variant="outline">
                    {fii.sector}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticker</span>
                  <span className="text-foreground font-mono font-bold">
                    {fii.ticker}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Performance Recente
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variação do Dia</span>
                  <span className={`font-medium ${fii.priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {fii.priceChange >= 0 ? '+' : ''}{fii.priceChangePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume Negociado</span>
                  <span className="text-foreground font-medium">
                    {new Intl.NumberFormat('pt-BR').format(fii.volume)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Gráfico */}
          <div className="space-y-4">
            <FiiChart data={chartData} ticker={fii.ticker} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};