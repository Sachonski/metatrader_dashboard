export interface TradingMetrics {
  sharpe_ratio: number | null;
  sortino_ratio: number | null;
  max_drawdown: number | null;
  calmar_ratio: number | null;
  omega_ratio: number | null;
  VaR_95: number | null;
  CVaR_95: number | null;
  reward_risk_ratio: number | null;
  win_rate: number | null;
  total_trades: number | null;
  won_trades: number | null;
  lost_trades: number | null;
  initial_deposit?: number;
  total_return?: number;
  trades?: Array<{
    date: string;
    type: string;
    size: number;
    price: number;
    profit: number;
  }>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}