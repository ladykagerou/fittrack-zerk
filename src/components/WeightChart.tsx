
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WeightRecord } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeightChartProps {
  records: WeightRecord[];
}

const WeightChart: React.FC<WeightChartProps> = ({ records }) => {
  if (records.length === 0) return null;
  
  // Sort records by date
  const sortedRecords = [...records].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Format data for the chart
  const chartData = sortedRecords.map(record => ({
    date: format(record.date, 'dd/MM'),
    weight: record.weight,
  }));
  
  // Calculate average weight
  const avgWeight = sortedRecords.reduce((sum, record) => sum + record.weight, 0) / sortedRecords.length;
  
  // Calculate min and max weights
  const minWeight = Math.min(...sortedRecords.map(r => r.weight));
  const maxWeight = Math.max(...sortedRecords.map(r => r.weight));
  
  // Calculate a good domain for the Y axis
  const buffer = Math.max(1, (maxWeight - minWeight) * 0.2);
  const yAxisMin = Math.max(0, minWeight - buffer);
  const yAxisMax = maxWeight + buffer;
  
  // Calculate first and last weights for comparison
  const firstWeight = sortedRecords[0].weight;
  const lastWeight = sortedRecords[sortedRecords.length - 1].weight;
  const weightDiff = lastWeight - firstWeight;
  const percentChange = (weightDiff / firstWeight) * 100;

  return (
    <Card className="w-full hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Histórico de peso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={[yAxisMin, yAxisMax]} 
                width={40}
                tick={{ fontSize: 12 }}
                tickCount={7}
                label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
              />
              <Tooltip
                formatter={(value: number) => [`${value} kg`, 'Peso']}
                labelFormatter={(label) => `Data: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <ReferenceLine 
                y={avgWeight} 
                stroke="#888" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Média', 
                  position: 'right', 
                  fill: '#888',
                  fontSize: 12
                }} 
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "white", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Média</p>
            <p className="text-xl font-semibold">{avgWeight.toFixed(1)} kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Variação</p>
            <p className={`text-xl font-semibold ${weightDiff < 0 ? 'text-green-500' : weightDiff > 0 ? 'text-red-500' : ''}`}>
              {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Percentual</p>
            <p className={`text-xl font-semibold ${percentChange < 0 ? 'text-green-500' : percentChange > 0 ? 'text-red-500' : ''}`}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
