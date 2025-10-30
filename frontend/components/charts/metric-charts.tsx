'use client';

import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MetricCardData {
  title: string;
  value: string | number;
  color?: string;
}

interface MetricChartsProps {
  metricsData: MetricCardData[];
  currentTheme: any;
  title: string;
  subtitle: string;
  chartType?: 'dual' | 'bar-only' | 'line' | 'line-bar';
  skipFirst?: boolean;
  timeSeriesData?: any[];
}

export const MetricCharts = ({ 
  metricsData, 
  currentTheme, 
  title, 
  subtitle,
  chartType = 'dual',
  skipFirst = true,
  timeSeriesData
}: MetricChartsProps) => {
  
  // Cores padrão dos gráficos
  const chartColors = ['#3B82F6', '#10B981', '#ab0707', '#A855F7', '#FBBF24'];
  
  // Extrai dados (pula o primeiro se skipFirst = true)
  const startIndex = skipFirst ? 1 : 0;
  const statusData = metricsData.slice(startIndex, startIndex + 4).map((card, index) => ({
    name: card.title,
    value: typeof card.value === 'string' ? parseFloat(card.value.replace(/[^\d.-]/g, '')) : card.value,
    fill: chartColors[index] || chartColors[0]
  }));

  // Cores do tema
  const isLight = currentTheme.name === 'Claro';
  const gridColor = isLight ? '#E5E7EB' : '#374151';
  const axisColor = isLight ? '#6B7280' : '#9CA3AF';
  const tooltipBg = isLight ? '#FFFFFF' : '#1F2937';
  const tooltipBorder = isLight ? '#D1D5DB' : '#374151';
  const tooltipTextColor = isLight ? '#111827' : '#F9FAFB';

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Não mostra label se for menor que 5%
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const labelColor = isLight ? '#000000' : '#FFFFFF';

    return (
      <text 
        x={x} 
        y={y} 
        fill={labelColor}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold drop-shadow-lg"
        style={{ fontSize: '18px' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Componente de Donut (Rosca)
  const PieChartComponent = () => (
    <div className={`p-4 md:p-6 rounded-xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all`}>
      <h3 className={`text-lg font-semibold ${currentTheme.titleColor} mb-4`}>
        Distribuição por Status
      </h3>
      <div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              innerRadius={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 70}
              outerRadius={typeof window !== 'undefined' && window.innerWidth < 768 ? 90 : 110}
              dataKey="value"
              stroke={isLight ? '#FFFFFF' : '#1F2937'}
              strokeWidth={2}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipTextColor,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: tooltipTextColor }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
              iconType="circle"
              formatter={(value) => (
                <span className={currentTheme.cardText}>{value}</span>
              )}
            />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Componente de Barras
  const BarChartComponent = () => (
    <div className={`p-4 md:p-6 rounded-xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all`}>
      <h3 className={`text-lg font-semibold ${currentTheme.titleColor} mb-4`}>
        {chartType === 'bar-only' ? title : 'Comparação'}
      </h3>
      <div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={statusData}
            barSize={40}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={{ stroke: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={{ stroke: axisColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipTextColor,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: tooltipTextColor }}
              cursor={{ fill: isLight ? '#F3F4F6' : '#374151', opacity: 0.3 }}
            />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
              label={{ position: 'top', fill: axisColor, fontSize: 12, fontWeight: 'bold' }}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Componente de Linha
  const LineChartComponent = () => (
    <div className={`p-4 md:p-6 rounded-xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all`}>
      <h3 className={`text-lg font-semibold ${currentTheme.titleColor} mb-4`}>
        Evolução Temporal
      </h3>
      <div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={timeSeriesData || []}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={{ stroke: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={{ stroke: axisColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipTextColor,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: tooltipTextColor }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
              formatter={(value) => (
                <span className={currentTheme.cardText}>{value}</span>
              )}
            />
            {/* Linhas dinâmicas baseadas nos dados */}
            {statusData.map((entry, index) => (
              <Line 
                key={`line-${index}`}
                type="monotone" 
                dataKey={entry.name.toLowerCase().replace(/\s+/g, '_')}
                stroke={entry.fill}
                strokeWidth={3}
                dot={{ fill: entry.fill, r: 4 }}
                activeDot={{ r: 6 }}
                name={entry.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>
          {title}
        </h2>
        <p className={`mt-1 text-sm ${currentTheme.mainText} opacity-70`}>
          {subtitle}
        </p>
      </div>

      {chartType === 'dual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <PieChartComponent />
          <BarChartComponent />
        </div>
      )}

      {chartType === 'bar-only' && <BarChartComponent />}

      {chartType === 'line' && <LineChartComponent />}

      {chartType === 'line-bar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <LineChartComponent />
          <BarChartComponent />
        </div>
      )}
    </div>
  );
};