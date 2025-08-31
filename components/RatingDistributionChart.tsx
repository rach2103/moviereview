
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RatingDistributionChartProps {
  data: { rating: string; count: number }[];
}

const COLORS = ['#FFBB28', '#FFBB28', '#FF8042', '#FF8042', '#FF4242'];

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="rating" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#A0AEC0' }} 
            width={60}
          />
          <Tooltip 
            cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
            contentStyle={{ backgroundColor: '#222222', border: 'none' }}
          />
          <Bar dataKey="count" barSize={20} radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingDistributionChart;
