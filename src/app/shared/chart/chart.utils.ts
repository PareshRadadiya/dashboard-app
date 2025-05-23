import { ChartData } from 'chart.js';

export function generateChartData(
  type: 'bar' | 'line' | 'area' | 'donut' | 'sparkline',
  label: string
): ChartData {
  // Generate last 6 months of data
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', { month: 'short' });
  });

  // Generate random but somewhat consistent data
  const baseValue = Math.random() * 50 + 50; // Random base between 50 and 100
  const data = months.map(() =>
    Math.max(0, baseValue + (Math.random() - 0.5) * 30)
  );

  return {
    labels: months,
    datasets: [
      {
        data,
        label,
        backgroundColor:
          type === 'bar'
            ? 'rgba(59, 130, 246, 0.5)'
            : 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: type === 'line',
        tension: type === 'line' ? 0.4 : 0,
        pointRadius: type === 'line' ? 0 : undefined,
      },
    ],
  };
}
