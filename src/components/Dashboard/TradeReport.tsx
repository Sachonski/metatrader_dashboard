import React from 'react';
import Card from '../UI/Card';

interface Trade {
  date: string;
  type: string;
  size: number;
  price: number;
  profit: number;
}

interface TradeReportProps {
  trades: Trade[];
  initialDeposit: number;
  totalReturn: number;
}

const TradeReport: React.FC<TradeReportProps> = ({ trades, initialDeposit, totalReturn }) => {
  const returnPercentage = ((totalReturn - initialDeposit) / initialDeposit) * 100;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-600">Initial Deposit</h3>
            <p className="text-3xl font-bold text-blue-900">${initialDeposit.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-600">Current Balance</h3>
            <p className="text-3xl font-bold text-blue-900">${totalReturn.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-600">Total Return</h3>
            <p className={`text-3xl font-bold ${returnPercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
            </p>
          </div>
        </Card>
      </div>
      
      <Card title="Trade History">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trades.map((trade, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{trade.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${trade.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${trade.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TradeReport;