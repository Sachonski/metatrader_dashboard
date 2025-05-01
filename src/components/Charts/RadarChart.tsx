import React, { useEffect, useRef } from 'react';
import { ChartData } from '../../types';

interface RadarChartProps {
  data: ChartData;
  size?: number;
  title?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 250, title }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawing
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Radar chart dimensions
    const centerX = chartRef.current.width / 2;
    const centerY = chartRef.current.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Number of axes (categories)
    const numAxes = data.labels.length;
    const angleStep = (Math.PI * 2) / numAxes;
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const axisX = centerX + radius * Math.cos(angle);
      const axisY = centerY + radius * Math.sin(angle);
      
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(axisX, axisY);
      
      // Draw axis label
      ctx.fillStyle = '#555';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelX = centerX + (radius + 15) * Math.cos(angle);
      const labelY = centerY + (radius + 15) * Math.sin(angle);
      ctx.fillText(data.labels[i], labelX, labelY);
    }
    ctx.stroke();
    
    // Draw concentric circles for scale
    const numLevels = 5;
    ctx.setLineDash([2, 2]);
    for (let level = 1; level <= numLevels; level++) {
      const levelRadius = (radius * level) / numLevels;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add scale label
      ctx.fillStyle = '#999';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${level * 20}%`, centerX - 5, centerY - levelRadius);
    }
    ctx.setLineDash([]);
    
    // Draw data
    const dataset = data.datasets[0];
    const dataPoints = dataset.data;
    
    // First draw fill
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = dataPoints[i] || 0;
      const normalizedValue = value / 100; // Assuming data is normalized to 0-100
      const pointRadius = radius * normalizedValue;
      const pointX = centerX + pointRadius * Math.cos(angle);
      const pointY = centerY + pointRadius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    ctx.closePath();
    ctx.fillStyle = dataset.backgroundColor || 'rgba(59, 130, 246, 0.2)';
    ctx.fill();
    
    // Then draw stroke
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = dataPoints[i] || 0;
      const normalizedValue = value / 100;
      const pointRadius = radius * normalizedValue;
      const pointX = centerX + pointRadius * Math.cos(angle);
      const pointY = centerY + pointRadius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = dataset.borderColor?.[0] || 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = dataset.borderWidth || 2;
    ctx.stroke();
    
    // Draw data points
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = dataPoints[i] || 0;
      const normalizedValue = value / 100;
      const pointRadius = radius * normalizedValue;
      const pointX = centerX + pointRadius * Math.cos(angle);
      const pointY = centerY + pointRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
      ctx.fillStyle = dataset.borderColor?.[0] || 'rgba(59, 130, 246, 0.8)';
      ctx.fill();
    }
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(title, centerX, 10);
    }
  }, [data, size, title]);
  
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

export default RadarChart;