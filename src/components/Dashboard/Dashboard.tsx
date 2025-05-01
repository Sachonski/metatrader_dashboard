import React, { useState } from 'react';
import { TradingMetrics } from '../../types';
import UploadSection from './UploadSection';
import MetricsCard from './MetricsCard';
import DashboardHeader from './DashboardHeader';
import Card from '../UI/Card';
import TradeReport from './TradeReport';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  
  const handleMetricsExtracted = (extractedMetrics: TradingMetrics) => {
    setMetrics(extractedMetrics);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <UploadSection onMetricsExtracted={handleMetricsExtracted} />
        
        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <div>
                <Card title="Performance Metrics" className="h-full">
                  <MetricsCard 
                    metrics={metrics}
                    showOnly={['sharpe_ratio', 'sortino_ratio', 'calmar_ratio', 'omega_ratio']}
                  />
                </Card>
              </div>
              
              {/* Trading Statistics */}
              <div>
                <Card title="Trading Statistics" className="h-full">
                  <MetricsCard 
                    metrics={metrics}
                    showOnly={['total_trades', 'won_trades', 'lost_trades', 'win_rate']}
                  />
                </Card>
              </div>
              
              {/* Risk Metrics */}
              <div>
                <Card title="Risk Metrics" className="h-full">
                  <MetricsCard 
                    metrics={metrics}
                    showOnly={['max_drawdown', 'VaR_95', 'CVaR_95', 'reward_risk_ratio']}
                  />
                </Card>
              </div>
            </div>

            {/* Trade Report Section */}
            {metrics.initial_deposit && metrics.total_return && metrics.trades && (
              <TradeReport
                initialDeposit={metrics.initial_deposit}
                totalReturn={metrics.total_return}
                trades={metrics.trades}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;