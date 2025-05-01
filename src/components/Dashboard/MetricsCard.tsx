import React from 'react';
import Tooltip from '../UI/Tooltip';
import { TradingMetrics } from '../../types';
import { formatNumber, getMetricDescription, getRatingColor, formatRatio } from '../../utils/metricsUtil';

interface MetricsCardProps {
  metrics: TradingMetrics;
  showOnly?: (keyof TradingMetrics)[];
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metrics, showOnly }) => {
  const renderMetric = (
    label: string, 
    value: number | null, 
    metricKey: keyof TradingMetrics,
    goodThreshold: number,
    mediumThreshold: number,
    format?: (val: number | null, key?: keyof TradingMetrics) => string
  ) => {
    const formattedValue = format ? format(value, metricKey) : formatNumber(value);
    const description = getMetricDescription(metricKey);
    
    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">{label}</span>
          <Tooltip content={description} position="right" />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-900">{formattedValue}</span>
          {value !== null && (
            <div className={`ml-2 w-3 h-3 rounded-full ${getRatingColor(value, goodThreshold, mediumThreshold)}`} />
          )}
        </div>
      </div>
    );
  };

  const metricsConfig = {
    sharpe_ratio: { 
      label: 'Sharpe Ratio', 
      good: 1.5, 
      medium: 0.5,
      format: formatRatio
    },
    sortino_ratio: { 
      label: 'Sortino Ratio', 
      good: 2, 
      medium: 0.8,
      format: formatRatio
    },
    calmar_ratio: { 
      label: 'Calmar Ratio', 
      good: 1, 
      medium: 0.5,
      format: formatRatio
    },
    omega_ratio: { 
      label: 'Omega Ratio', 
      good: 1.5, 
      medium: 1,
      format: formatRatio
    },
    total_trades: { 
      label: 'Total Trades', 
      good: 100, 
      medium: 30,
      format: (val: number | null) => val !== null ? val.toString() : 'N/A'
    },
    won_trades: { 
      label: 'Won Trades', 
      good: 60, 
      medium: 30,
      format: (val: number | null) => val !== null ? val.toString() : 'N/A'
    },
    lost_trades: { 
      label: 'Lost Trades', 
      good: 10, 
      medium: 20,
      format: (val: number | null) => val !== null ? val.toString() : 'N/A'
    },
    win_rate: { 
      label: 'Win Rate', 
      good: 60, 
      medium: 45,
      format: (val: number | null) => val !== null ? `${formatNumber(val)}%` : 'N/A'
    },
    max_drawdown: { 
      label: 'Max Drawdown', 
      good: 5, 
      medium: 15,
      format: (val: number | null) => val !== null ? `-${formatNumber(val)}%` : 'N/A'
    },
    VaR_95: { 
      label: 'VaR (95%)', 
      good: 5, 
      medium: 10,
      format: formatRatio
    },
    CVaR_95: { 
      label: 'CVaR (95%)', 
      good: 8, 
      medium: 15,
      format: formatRatio
    },
    reward_risk_ratio: { 
      label: 'Reward/Risk Ratio', 
      good: 1.5, 
      medium: 0.8,
      format: formatRatio
    }
  };
  
  const metricsToShow = showOnly || Object.keys(metricsConfig) as (keyof TradingMetrics)[];
  
  return (
    <div className="space-y-1">
      {metricsToShow.map((key) => {
        const config = metricsConfig[key];
        return renderMetric(
          config.label,
          metrics[key],
          key,
          config.good,
          config.medium,
          config.format
        );
      })}
    </div>
  );
};

export default MetricsCard;