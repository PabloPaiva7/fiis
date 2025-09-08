import { useState, useEffect } from 'react';
import { FII } from '@/types/fii';
import { 
  TradingSignal, 
  TechnicalIndicators, 
  ArbitrageOpportunity, 
  TradingStrategy,
  Alert 
} from '@/types/trader';
import { tradingEngine } from '@/services/tradingEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Brain, 
  AlertTriangle,
  BarChart3,
  Settings,
  Play,
  Pause,
  DollarSign,
  Activity,
  Shield
} from 'lucide-react';

interface TradingDashboardProps {
  fiis: FII[];
}

export const TradingDashboard = ({ fiis }: TradingDashboardProps) => {
  const [signals, setSignals] = useState<Record<string, TradingSignal>>({});
  const [arbitrageOps, setArbitrageOps] = useState<ArbitrageOpportunity[]>([]);
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeMarket();
    loadStrategies();
    checkAlerts();
  }, [fiis]);

  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    
    // Simular análise com delay para UX
    setTimeout(() => {
      // Gerar sinais para os FIIs
      const newSignals: Record<string, TradingSignal> = {};
      fiis.forEach(fii => {
        const mockHistoricalData = Array.from({ length: 50 }, (_, i) => 
          fii.currentPrice * (0.9 + Math.random() * 0.2)
        );
        const indicators = tradingEngine.calculateTechnicalIndicators(fii, mockHistoricalData);
        newSignals[fii.ticker] = tradingEngine.generateTradingSignal(fii, indicators);
      });
      
      setSignals(newSignals);
      setArbitrageOps(tradingEngine.findArbitrageOpportunities(fiis));
      setIsAnalyzing(false);
    }, 2000);
  };

  const loadStrategies = () => {
    setStrategies(tradingEngine.getAvailableStrategies());
  };

  const checkAlerts = () => {
    // Mock alerts - em produção viria do banco de dados do usuário
    const mockAlerts: Alert[] = [
      {
        id: '1',
        fiiTicker: 'HGLG11',
        type: 'YIELD',
        condition: 'above',
        targetValue: 10.0,
        currentValue: 9.2,
        triggered: false,
        createdAt: new Date()
      }
    ];
    
    const triggeredAlerts = tradingEngine.checkAlerts(fiis, mockAlerts);
    setAlerts(triggeredAlerts);
  };

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(s => 
      s.id === strategyId ? { ...s, active: !s.active } : s
    ));
  };

  const getSignalColor = (signal: TradingSignal) => {
    if (signal.type === 'BUY') return 'text-success';
    if (signal.type === 'SELL') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getSignalIcon = (signal: TradingSignal) => {
    if (signal.type === 'BUY') return <TrendingUp className="w-4 h-4" />;
    if (signal.type === 'SELL') return <TrendingDown className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getStrengthBadgeVariant = (strength: TradingSignal['strength']) => {
    switch (strength) {
      case 'STRONG': return 'default';
      case 'MODERATE': return 'secondary';
      case 'WEAK': return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Trading Engine AI
          </h2>
          <p className="text-muted-foreground mt-1">
            Sistema revolucionário de análise e trading automatizado para FIIs
          </p>
        </div>
        <Button 
          onClick={analyzeMarket} 
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Análise Completa
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="signals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signals" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Sinais
          </TabsTrigger>
          <TabsTrigger value="arbitrage" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Arbitragem
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estratégias
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alertas
          </TabsTrigger>
        </TabsList>

        {/* Sinais de Trading */}
        <TabsContent value="signals" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(signals).map(([ticker, signal]) => {
              const fii = fiis.find(f => f.ticker === ticker);
              if (!fii) return null;

              return (
                <Card key={ticker} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{ticker}</CardTitle>
                        <CardDescription>{fii.name}</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStrengthBadgeVariant(signal.strength)}>
                          {signal.strength}
                        </Badge>
                        <div className={`flex items-center gap-2 font-semibold ${getSignalColor(signal)}`}>
                          {getSignalIcon(signal)}
                          {signal.type}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confiança</span>
                      <div className="flex items-center gap-2">
                        <Progress value={signal.confidence} className="w-20" />
                        <span className="text-sm font-medium">{signal.confidence}%</span>
                      </div>
                    </div>
                    
                    {signal.targetPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Meta</span>
                        <span className="font-medium">R$ {signal.targetPrice.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {signal.stopLoss && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Stop Loss</span>
                        <span className="font-medium">R$ {signal.stopLoss.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">Razões:</span>
                      <ul className="text-sm space-y-1">
                        {signal.reasons.map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Oportunidades de Arbitragem */}
        <TabsContent value="arbitrage" className="space-y-4">
          <div className="grid gap-4">
            {arbitrageOps.map((opp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{opp.fiiTicker}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={opp.opportunity === 'HIGH' ? 'destructive' : opp.opportunity === 'MODERATE' ? 'default' : 'secondary'}>
                        {opp.opportunity}
                      </Badge>
                      <Badge variant={opp.type === 'PREMIUM' ? 'outline' : 'default'}>
                        {opp.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Preço de Mercado</p>
                      <p className="font-semibold">R$ {opp.marketPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Patrimonial Est.</p>
                      <p className="font-semibold">R$ {opp.navPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Diferença</span>
                    <span className={`font-bold text-lg ${opp.type === 'DISCOUNT' ? 'text-success' : 'text-destructive'}`}>
                      {opp.type === 'DISCOUNT' ? '-' : '+'}{opp.percentage.toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Estratégias Automatizadas */}
        <TabsContent value="strategies" className="space-y-4">
          <div className="grid gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </div>
                    <Button
                      variant={strategy.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleStrategy(strategy.id)}
                      className="flex items-center gap-2"
                    >
                      {strategy.active ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Ativa
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Inativa
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Retorno Total</p>
                      <p className="font-semibold text-success">+{strategy.performance.totalReturn.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                      <p className="font-semibold">{strategy.performance.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="font-semibold">{strategy.performance.sharpeRatio.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Drawdown</p>
                      <p className="font-semibold text-destructive">-{strategy.performance.maxDrawdown.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{strategy.type.replace('_', ' ')}</Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sistema de Alertas */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sistema de Alertas Inteligente
              </CardTitle>
              <CardDescription>
                Configure alertas personalizados para não perder oportunidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum alerta configurado ainda.
                </p>
                <Button>Criar Primeiro Alerta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};