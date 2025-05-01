import React from 'react';
import { BarChart3 } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <BarChart3 size={28} className="text-blue-900 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">
            Trading Metrics Visualizer
          </h1>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;