
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useFiiSimulator } from '../hooks/useFiiSimulator';
import { FiiProjectionChart } from './FiiProjectionChart';
import { Calculator, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

export const FiiSimulator = () => {
  const { simulationData, results, updateSimulation } = useFiiSimulator();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    updateSimulation({ [field]: numericValue });
  };

  const resetSimulation = () => {
    updateSimulation({
      cotas: 100,
      precoCompra: 100,
      dividendo: 0.8,
      meses: 12
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-primary rounded-lg">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Simulador de FII
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Simule seus investimentos em Fundos Imobiliários e visualize projeções de rendimento
          com diferentes cenários de crescimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Entrada */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="w-5 h-5" />
              Dados da Simulação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cotas" className="text-foreground">
                  Quantidade de Cotas
                </Label>
                <Input
                  id="cotas"
                  type="number"
                  min="1"
                  value={simulationData.cotas}
                  onChange={(e) => handleInputChange('cotas', e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoCompra" className="text-foreground">
                  Preço de Compra (R$)
                </Label>
                <Input
                  id="precoCompra"
                  type="number"
                  min="0"
                  step="0.01"
                  value={simulationData.precoCompra}
                  onChange={(e) => handleInputChange('precoCompra', e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dividendo" className="text-foreground">
                  Dividendo por Cota (R$)
                </Label>
                <Input
                  id="dividendo"
                  type="number"
                  min="0"
                  step="0.01"
                  value={simulationData.dividendo}
                  onChange={(e) => handleInputChange('dividendo', e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meses" className="text-foreground">
                  Período (meses)
                </Label>
                <Input
                  id="meses"
                  type="number"
                  min="1"
                  max="120"
                  value={simulationData.meses}
                  onChange={(e) => handleInputChange('meses', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <Button 
              onClick={resetSimulation}
              variant="outline"
              className="w-full"
            >
              Resetar Valores
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-6">
          {/* Investimento Inicial */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-info" />
                <h3 className="text-lg font-semibold text-foreground">
                  Investimento Inicial
                </h3>
              </div>
              <p className="text-3xl font-bold text-info">
                {formatCurrency(results.investimentoInicial)}
              </p>
              <p className="text-muted-foreground text-sm">
                {simulationData.cotas} cotas × {formatCurrency(simulationData.precoCompra)}
              </p>
            </CardContent>
          </Card>

          {/* Rendimento Mensal */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold text-foreground">
                  Rendimento Mensal
                </h3>
              </div>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(results.rendimentoMensal)}
              </p>
              <p className="text-muted-foreground text-sm">
                {simulationData.cotas} cotas × {formatCurrency(simulationData.dividendo)}
              </p>
            </CardContent>
          </Card>

          {/* Rendimento Acumulado */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-semibold text-foreground">
                  Rendimento em {simulationData.meses} meses
                </h3>
              </div>
              <p className="text-3xl font-bold text-warning">
                {formatCurrency(results.rendimentoAcumulado)}
              </p>
              <p className="text-muted-foreground text-sm">
                Rentabilidade: {formatPercent(results.rentabilidadePercentual)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfico de Projeções */}
      <FiiProjectionChart 
        data={results.cenarios} 
        meses={simulationData.meses}
      />

      {/* Cenários Detalhados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-warning"></div>
              Cenário Conservador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-warning">
                {formatCurrency(results.cenarios[results.cenarios.length - 1]?.conservador || 0)}
              </p>
              <p className="text-muted-foreground text-sm">
                Crescimento de 0,2% ao mês
              </p>
              <p className="text-muted-foreground text-xs">
                Cenário mais prudente, considerando crescimento mínimo dos dividendos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-info"></div>
              Cenário Moderado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-info">
                {formatCurrency(results.cenarios[results.cenarios.length - 1]?.moderado || 0)}
              </p>
              <p className="text-muted-foreground text-sm">
                Crescimento de 0,5% ao mês
              </p>
              <p className="text-muted-foreground text-xs">
                Cenário equilibrado, baseado na média histórica do mercado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-success"></div>
              Cenário Otimista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-success">
                {formatCurrency(results.cenarios[results.cenarios.length - 1]?.otimista || 0)}
              </p>
              <p className="text-muted-foreground text-sm">
                Crescimento de 1% ao mês
              </p>
              <p className="text-muted-foreground text-xs">
                Cenário otimista, considerando boa performance do fundo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
