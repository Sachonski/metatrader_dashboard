import React, { useEffect, useRef } from 'react';
import { ChartData } from '../../types';

interface DoughnutChartProps {
  data: ChartData;
  size?: number;
  title?: string;
  showLabels?: boolean;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data, 
  size = 200, 
  title,
  showLabels = true
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawing
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Calculate total for percentages
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    
    // Doughnut chart dimensions
    const centerX = chartRef.current.width / 2;
    const centerY = chartRef.current.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.5; // Inner circle for doughnut effect
    
    // Draw doughnut segments
    let startAngle = -0.5 * Math.PI; // Start from top
    
    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = data.datasets[0].backgroundColor[index] || '#3B82F6';
      ctx.fill();
      
      // Cut out center for doughnut effect
      ctx.beginPath();
      ctx.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle));
      ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle, false);
      ctx.lineTo(centerX + innerRadius * Math.cos(endAngle), centerY + innerRadius * Math.sin(endAngle));
      ctx.fillStyle = '#fff';
      ctx.fill();
      
      // Add labels if needed
      if (showLabels && (value / total) > 0.05) { // Only show labels for segments > 5%
        // Calculate position for label
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.75;
        const labelX = centerX + labelRadius * Math.cos(midAngle);
        const labelY = centerY + labelRadius * Math.sin(midAngle);
        
        // Draw label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Show percentage
        const percentage = Math.round((value / total) * 100);
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }
      
      startAngle = endAngle;
    });
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(title, centerX, 10);
    }
    
    // Draw center info - total value
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY);
    
    // Draw legend
    if (showLabels) {
      const legendX = 10;
      let legendY = chartRef.current.height - 10 - (data.labels.length * 20);
      
      data.labels.forEach((label, index) => {
        // Color box
        ctx.fillStyle = data.datasets[0].backgroundColor[index] || '#3B82F6';
        ctx.fillRect(legendX, legendY, 15, 15);
        
        // Label text
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, legendX + 20, legendY + 7.5);
        
        legendY += 20;
      });
    }
  }, [data, size, title, showLabels]);
  
  return (
    <div className="w-full flex justify-center">
      <canvas 
        ref={chartRef}
        height={size}
        width={size} 
        className="h-auto"
      />
    </div>
  );
};

export default DoughnutChart;