import { TradingMetrics, ChartData } from "../types";

/**
 * Gets a rating color based on metric value compared to threshold
 */
export const getRatingColor = (value: number | null, goodThreshold: number, mediumThreshold: number): string => {
  if (value === null) return 'bg-gray-200';
  
  if (value >= goodThreshold) return 'bg-emerald-500';
  if (value >= mediumThreshold) return 'bg-amber-500';
  return 'bg-rose-500';
};

/**
 * Formats a number with specified decimals
 */
export const formatNumber = (num: number | null, decimals = 2): string => {
  if (num === null) return 'N/A';
  return num.toFixed(decimals);
};

/**
 * Formats a ratio as a percentage
 */
export const formatRatio = (num: number | null, metricKey?: keyof TradingMetrics): string => {
  if (num === null) return 'N/A';
  
  // Don't multiply these metrics by 100
  if (metricKey === 'sortino_ratio' || metricKey === 'VaR_95' || metricKey === 'CVaR_95') {
    return `${num.toFixed(2)}%`;
  }

  // All other ratios should be multiplied by 100
  return `${(num * 100).toFixed(2)}%`;
};

/**
 * Gets the description for a metric
 */
export const getMetricDescription = (metricKey: keyof TradingMetrics): string => {
  const descriptions: Record<keyof TradingMetrics, string> = {
    sharpe_ratio: 'Measures risk-adjusted return relative to volatility',
    sortino_ratio: 'Similar to Sharpe ratio but only considers downside volatility',
    calmar_ratio: 'Measures return relative to maximum drawdown',
    omega_ratio: 'Probability-weighted ratio of gains versus losses',
    total_trades: 'Total number of completed trades',
    won_trades: 'Number of profitable trades',
    lost_trades: 'Number of unprofitable trades',
    win_rate: 'Percentage of trades that were profitable',
    max_drawdown: 'Largest peak-to-trough decline',
    VaR_95: 'Maximum loss expected with 95% confidence',
    CVaR_95: 'Average loss beyond VaR threshold',
    reward_risk_ratio: 'Ratio of average profit to average loss'
  };
  
  return descriptions[metricKey];
};