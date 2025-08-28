import { Asset, AssetType } from '../types/global-assets';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Building, DollarSign, Zap, Coins, Minus } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  assetType: AssetType;
  onClick: (asset: Asset) => void;
}

export const AssetCard = ({ asset, assetType, onClick }: AssetCardProps) => {
  const isPositive = asset.priceChange >= 0;
  const isNeutral = asset.priceChange === 0;

  const getAssetIcon = () => {
    switch (assetType) {
      case 'fiis':
        return <Building className="w-4 h-4" />;
      case 'stocks':
        return <TrendingUp className="w-4 h-4" />;
      case 'etfs':
        return <DollarSign className="w-4 h-4" />;
      case 'bdrs':
        return <Zap className="w-4 h-4" />;
      case 'crypto':
        return <Coins className="w-4 h-4" />;
      case 'commodities':
        return <Minus className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const getAssetTypeLabel = () => {
    const labels = {
      fiis: 'FII',
      stocks: 'Stock',
      etfs: 'ETF',
      bdrs: 'BDR',
      crypto: 'Crypto',
      commodities: 'Commodity'
    };
    return labels[assetType];
  };

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(price);
  };

  const getDividendYield = () => {
    if ('dividendYield' in asset) {
      return asset.dividendYield;
    }
    if ('stakingYield' in asset) {
      return asset.stakingYield;
    }
    return null;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/50 group"
      onClick={() => onClick(asset)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getAssetIcon()}
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {asset.ticker}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {getAssetTypeLabel()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {asset.name}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {isNeutral ? (
              <Minus className="w-4 h-4 text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className={`font-medium ${
              isNeutral ? 'text-muted-foreground' : 
              isPositive ? 'text-success' : 'text-destructive'
            }`}>
              {isPositive && !isNeutral && '+'}
              {asset.priceChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Preço atual */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Preço</span>
          <span className="font-semibold text-foreground">
            {formatPrice(asset.currentPrice, asset.currency)}
          </span>
        </div>

        {/* Dividend Yield ou Staking Yield */}
        {getDividendYield() && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {assetType === 'crypto' ? 'Staking' : 'Yield'}
            </span>
            <span className="font-semibold text-success">
              {getDividendYield()?.toFixed(2)}%
            </span>
          </div>
        )}

        {/* Mercado */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Mercado</span>
          <span className="text-sm font-medium text-foreground">
            {asset.market}
          </span>
        </div>

        {/* Volume (formatado) */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Volume</span>
          <span className="text-sm font-medium text-foreground">
            {new Intl.NumberFormat('pt-BR', { 
              notation: 'compact',
              maximumFractionDigits: 1 
            }).format(asset.volume)}
          </span>
        </div>

        {/* Informações específicas por tipo */}
        {assetType === 'fiis' && 'sector' in asset && (
          <div className="pt-2 border-t border-border/50">
            <Badge variant="outline" className="text-xs">
              {asset.sector}
            </Badge>
          </div>
        )}

        {assetType === 'stocks' && 'sector' in asset && (
          <div className="pt-2 border-t border-border/50">
            <Badge variant="outline" className="text-xs">
              {asset.sector}
            </Badge>
          </div>
        )}

        {assetType === 'crypto' && 'rank' in asset && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Rank</span>
              <span className="text-xs font-medium text-foreground">
                #{asset.rank}
              </span>
            </div>
          </div>
        )}

        {assetType === 'commodities' && 'category' in asset && (
          <div className="pt-2 border-t border-border/50">
            <Badge variant="outline" className="text-xs capitalize">
              {asset.category}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};