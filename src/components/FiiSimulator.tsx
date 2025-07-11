
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useFiiSimulator } from '../hooks/useFiiSimulator';
import { FiiProjectionChart } from './FiiProjectionChart';
import { FII } from '../types/fii';

interface FiiSimulatorProps {
  fiis?: FII[];
}

export const FiiSimulator = ({ fiis = [] }: FiiSimulatorProps) => {
  const [selectedFii, setSelectedFii] = useState<string>('');
  const { simulationData, results, updateSimulation } = useFiiSimulator();

  const handleFiiSelect = (ticker: string) => {
    setSelectedFii(ticker);
    const fii = fiis.find(f => f.ticker === ticker);
    if (fii) {
      updateSimulation({
        precoCompra: fii.currentPrice,
        dividendo: fii.lastDividend
      });
    }
  };

  const handleInputChange = (field: keyof typeof simulationData, value: number) => {
    updateSimulation({ [field]: value });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Simulador de FIIs
        </h2>
        <p className="text-muted-foreground">
          Calcule projeções de rendimentos para seus investimentos em Fundos Imobiliários
        </p>
      </div>

      {/* Input Form */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Parâmetros da Simulação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FII Selector */}
            <div className="space-y-2">
              <Label htmlFor="fii-select">Selecionar FII (Opcional)</Label>
              <Select value={selectedFii} onValueChange={handleFiiSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um FII da lista" />
                </SelectTrigger>
                <SelectContent>
                  {fiis.map((fii) => (
                    <SelectItem key={fii.ticker} value={fii.ticker}>
                      {fii.ticker} - {fii.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <Label htmlFor="cotas">Quantidade de Cotas</Label>
              <Input
                id="cotas"
                type="number"
                value={simulationData.cotas}
                onChange={(e) => handleInputChange('cotas', Number(e.target.value))}
                min="1"
              />
            </div>

            {/* Preço de Compra */}
            <div className="space-y-2">
              <Label htmlFor="preco">Preço de Compra (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={simulationData.precoCompra}
                onChange={(e) => handleInputChange('precoCompra', Number(e.target.value))}
                min="0"
              />
            </div>

            {/* Dividendo */}
            <div className="space-y-2">
              <Label htmlFor="dividendo">Último Dividendo (R$)</Label>
              <Input
                id="dividendo"
                type="number"
                step="0.01"
                value={simulationData.dividendo}
                onChange={(e) => handleInputChange('dividendo', Number(e.target.value))}
                min="0"
              />
            </div>

            {/* Período */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meses">Período de Projeção (meses)</Label>
              <Input
                id="meses"
                type="number"
                value={simulationData.meses}
                onChange={(e) => handleInputChange('meses', Number(e.target.value))}
                min="1"
                max="120"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Rendimento Mensal</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(results.rendimentoMensal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Rendimento Acumulado</p>
                <p className="text-2xl font-bold text-info">
                  {formatCurrency(results.rendimentoAcumulado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Rentabilidade</p>
                <p className="text-2xl font-bold text-warning">
                  {results.rentabilidadePercentual.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Investimento Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(results.investimentoInicial)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projection Chart */}
      <FiiProjectionChart 
        data={results.cenarios} 
        meses={simulationData.meses}
      />
    </div>
  );
};
