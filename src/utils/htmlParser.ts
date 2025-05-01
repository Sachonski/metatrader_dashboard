import { TradingMetrics } from "../types";

export const parseMetaTraderHtml = (htmlContent: string): TradingMetrics => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  
  const metrics: TradingMetrics = {
    sharpe_ratio: null,
    sortino_ratio: null,
    max_drawdown: null,
    calmar_ratio: null,
    omega_ratio: null,
    VaR_95: null,
    CVaR_95: null,
    reward_risk_ratio: null,
    win_rate: null,
    total_trades: null,
    won_trades: null,
    lost_trades: null,
    trades: []
  };
  
  try {
    const extractNumber = (text: string | null): number | null => {
      if (!text) return null;
      // Remove any % signs, spaces, and handle parentheses for negative values
      text = text.replace('%', '').replace(/\s/g, '').replace('(', '').replace(')', '');
      const match = text.match(/-?\d+\.?\d*/);
      return match ? parseFloat(match[0]) : null;
    };

    // Extract initial deposit and final balance
    const initialDepositCell = Array.from(doc.querySelectorAll('td')).find(td => 
      td.textContent?.includes('Initial Deposit:')
    );
    metrics.initial_deposit = initialDepositCell 
      ? extractNumber(initialDepositCell.nextElementSibling?.textContent)
      : null;

    // Extract total trades
    const totalTradesCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Total Trades:')
    );
    metrics.total_trades = totalTradesCell 
      ? extractNumber(totalTradesCell.nextElementSibling?.textContent)
      : null;

    // Extract won trades
    const wonTradesText = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Profit Trades (% of total):')
    )?.nextElementSibling?.textContent;
    if (wonTradesText) {
      const match = wonTradesText.match(/(\d+)/);
      metrics.won_trades = match ? parseInt(match[1]) : null;
    }

    // Extract lost trades
    const lostTradesText = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Loss Trades (% of total):')
    )?.nextElementSibling?.textContent;
    if (lostTradesText) {
      const match = lostTradesText.match(/(\d+)/);
      metrics.lost_trades = match ? parseInt(match[1]) : null;
    }

    // Calculate win rate
    if (metrics.total_trades && metrics.won_trades) {
      metrics.win_rate = (metrics.won_trades / metrics.total_trades) * 100;
    }

    // Extract Sharpe Ratio directly and divide by 100
    const sharpeCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Sharpe Ratio:')
    );
    const sharpeValue = sharpeCell 
      ? extractNumber(sharpeCell.nextElementSibling?.textContent)
      : null;
    metrics.sharpe_ratio = sharpeValue !== null ? sharpeValue / 100 : null;

    // Extract maximum drawdown
    const maxDrawdownCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Balance Drawdown Maximal:')
    );
    if (maxDrawdownCell?.nextElementSibling?.textContent) {
      const match = maxDrawdownCell.nextElementSibling.textContent.match(/\((.+?)%\)/);
      metrics.max_drawdown = match ? parseFloat(match[1]) : null;
    }

    // Calculate Omega Ratio
    const grossProfitCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Gross Profit:')
    );
    const grossLossCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Gross Loss:')
    );
    
    const grossProfit = grossProfitCell 
      ? Math.abs(extractNumber(grossProfitCell.nextElementSibling?.textContent) || 0)
      : 0;
    const grossLoss = grossLossCell 
      ? Math.abs(extractNumber(grossLossCell.nextElementSibling?.textContent) || 0)
      : 0;
    
    if (grossLoss !== 0) {
      metrics.omega_ratio = grossProfit / grossLoss;
    }

    // Calculate Reward/Risk Ratio
    const avgProfitTradeCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Average profit trade:')
    );
    const avgLossTradeCell = Array.from(doc.querySelectorAll('td')).find(td =>
      td.textContent?.includes('Average loss trade:')
    );

    const avgProfit = avgProfitTradeCell 
      ? Math.abs(extractNumber(avgProfitTradeCell.nextElementSibling?.textContent) || 0)
      : 0;
    const avgLoss = avgLossTradeCell 
      ? Math.abs(extractNumber(avgLossTradeCell.nextElementSibling?.textContent) || 0)
      : 0;

    if (avgLoss !== 0) {
      metrics.reward_risk_ratio = avgProfit / avgLoss;
    }

    // Extract trades for VaR, CVaR, and return calculations
    const trades: number[] = [];
    const returns: number[] = [];
    const rows = doc.querySelectorAll('tr');
    let currentBalance = metrics.initial_deposit || 0;
    
    // Extract individual trades
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 11) {
        const dateCell = cells[0];
        const typeCell = cells[3];
        const sizeCell = cells[4];
        const priceCell = cells[5];
        const profitCell = cells[10];
        
        if (typeCell.textContent?.toLowerCase() !== 'balance') {
          const profit = extractNumber(profitCell?.textContent);
          if (profit !== null) {
            trades.push(profit);
            currentBalance += profit;
            
            // Add trade to metrics
            metrics.trades?.push({
              date: dateCell.textContent || '',
              type: typeCell.textContent || '',
              size: extractNumber(sizeCell?.textContent) || 0,
              price: extractNumber(priceCell?.textContent) || 0,
              profit: profit
            });
            
            // Calculate return for this trade
            if (metrics.initial_deposit && metrics.initial_deposit > 0) {
              returns.push((profit / metrics.initial_deposit) * 100);
            }
          }
        }
      }
    });

    // Set total return
    metrics.total_return = currentBalance;

    // Calculate VaR and CVaR
    if (returns.length > 0) {
      const sortedReturns = [...returns].sort((a, b) => a - b);
      const varIndex = Math.floor(sortedReturns.length * 0.05);
      
      metrics.VaR_95 = Math.abs(sortedReturns[varIndex]);
      
      const varsForCVaR = sortedReturns.slice(0, varIndex + 1);
      metrics.CVaR_95 = Math.abs(varsForCVaR.reduce((sum, value) => sum + value, 0) / varsForCVaR.length);
    }

    // Calculate Calmar Ratio and divide by 100
    if (metrics.max_drawdown && metrics.max_drawdown !== 0 && metrics.initial_deposit) {
      const totalReturn = ((currentBalance - metrics.initial_deposit) / metrics.initial_deposit) * 100;
      // Annualize the return (assuming 252 trading days)
      const daysInReport = returns.length;
      const annualizedReturn = totalReturn * (252 / daysInReport);
      metrics.calmar_ratio = (annualizedReturn / metrics.max_drawdown) / 100;
    }

    // Calculate Sortino Ratio (without dividing by 100)
    if (returns.length > 0) {
      const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      const downsideReturns = returns.filter(ret => ret < 0);
      
      if (downsideReturns.length > 0) {
        const downsideDeviation = Math.sqrt(
          downsideReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / downsideReturns.length
        );
        
        // Annualize both return and deviation (√252 for deviation)
        const annualizedReturn = avgReturn * 252;
        const annualizedDownsideDeviation = downsideDeviation * Math.sqrt(252);
        
        if (annualizedDownsideDeviation !== 0) {
          metrics.sortino_ratio = annualizedReturn / annualizedDownsideDeviation;
        }
      }
    }

  } catch (error) {
    console.error('Error parsing MetaTrader HTML:', error);
  }
  
  return metrics;
};

export const hasValidMetrics = (metrics: TradingMetrics): boolean => {
  return Object.values(metrics).some(value => value !== null);
};