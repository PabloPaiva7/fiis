import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartData } from '../types/fii';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FiiChartProps {
  data: ChartData[];
  ticker: string;
}

export const FiiChart = ({ data, ticker }: FiiChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'short',
      day: '2-digit'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">
            {new Date(label).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-primary font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <span>Histórico de Preços - {ticker}</span>
          <span className="text-sm text-muted-foreground font-normal">
            (Últimos 12 meses)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--chart-line))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: 'hsl(var(--chart-line))',
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