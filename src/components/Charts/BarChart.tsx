import React, { useEffect, useRef } from 'react';
import { ChartData } from '../../types';

interface BarChartProps {
  data: ChartData;
  height?: number;
  title?: string;
}

// Simple bar chart implementation
const BarChart: React.FC<BarChartProps> = ({ data, height = 200, title }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawing
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Chart dimensions
    const chartWidth = chartRef.current.width;
    const chartHeight = chartRef.current.height;
    const padding = 40;
    
    // Calculate max value for scaling
    const maxValue = Math.max(...data.datasets[0].data);
    const barCount = data.labels.length;
    const barWidth = (chartWidth - padding * 2) / barCount;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, chartHeight - padding);
    ctx.lineTo(chartWidth - padding, chartHeight - padding);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    
    // Draw bars
    data.datasets[0].data.forEach((value, index) => {
      const barHeight = ((chartHeight - padding * 2) * value) / (maxValue || 1);
      const x = padding + index * barWidth;
      const y = chartHeight - padding - barHeight;
      
      // Bar
      ctx.fillStyle = data.datasets[0].backgroundColor[index] || '#3B82F6';
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      
      // Label
      ctx.fillStyle = '#555';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[index], x + barWidth * 0.4, chartHeight - padding + 15);
      
      // Value
      ctx.fillText(value.toString(), x + barWidth * 0.4, y - 5);
    });
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, chartWidth / 2, 20);
    }
  }, [data, height, title]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={chartRef}
        height={height}
        width={500} // Use responsive container instead of hardcoded width
        className="w-full h-auto"
      />
    </div>
  );
};

export default BarChart;