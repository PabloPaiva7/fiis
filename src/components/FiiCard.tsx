import { FII } from '../types/fii';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowUp, ArrowDown, TrendingUp, Calendar } from 'lucide-react';

interface FiiCardProps {
  fii: FII;
  onClick: () => void;
}

export const FiiCard = ({ fii, onClick }: FiiCardProps) => {
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
      'Residencial': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Agronegócio': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Papel e Celulose': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'Outros': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[sector] || 'bg-muted text-muted-foreground';
  };

  const isPositiveChange = fii.priceChange >= 0;

  return (
    <Card 
      className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10 animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground font-semibold text-lg">
              {fii.ticker}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
              {fii.name}
            </p>
          </div>
          <Badge className={getSectorColor(fii.sector)} variant="outline">
            {fii.sector}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preço Atual */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Preço Atual</span>
          <div className="text-right">
            <p className="text-foreground font-bold text-lg">
              {formatCurrency(fii.currentPrice)}
            </p>
            <div className={`flex items-center gap-1 text-sm ${
              isPositiveChange ? 'text-success' : 'text-destructive'
            }`}>
              {isPositiveChange ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span>
                {formatCurrency(Math.abs(fii.priceChange))} ({Math.abs(fii.priceChangePercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Dividendo */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Último Dividendo</span>
          <div className="text-right">
            <p className="text-foreground font-semibold">
              {formatCurrency(fii.lastDividend)}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(fii.lastPaymentDate)}</span>
            </div>
          </div>
        </div>

        {/* Dividend Yield */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Dividend Yield</span>
          <div className="flex items-center gap-1 text-success font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>{fii.dividendYield.toFixed(2)}%</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-muted-foreground text-sm">Volume</span>
          <span className="text-foreground text-sm font-medium">
            {new Intl.NumberFormat('pt-BR').format(fii.volume)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
