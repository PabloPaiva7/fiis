
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScenarioData } from '../hooks/useFiiSimulator';

interface FiiProjectionChartProps {
  data: ScenarioData[];
  meses: number;
}

export const FiiProjectionChart = ({ data, meses }: FiiProjectionChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium mb-2">
            Mês {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground capitalize">
                {entry.dataKey}:
              </span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <span>Projeção de Rendimentos Acumulados</span>
          <span className="text-sm text-muted-foreground font-normal">
            ({meses} meses)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                label={{ value: 'Meses', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="conservador" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                dot={false}
                name="Conservador (0,2%/mês)"
                activeDot={{ 
                  r: 4, 
                  fill: 'hsl(var(--warning))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="moderado" 
                stroke="hsl(var(--info))" 
                strokeWidth={2}
                dot={false}
                name="Moderado (0,5%/mês)"
                activeDot={{ 
                  r: 4, 
                  fill: 'hsl(var(--info))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="otimista" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={false}
                name="Otimista (1%/mês)"
                activeDot={{ 
                  r: 4, 
                  fill: 'hsl(var(--success))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
