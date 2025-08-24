import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  handleRefresh: () => void;
  refreshing: boolean;
  data: any; // You can make this more specific based on your data structure
}

export const Header: React.FC<HeaderProps> = ({ handleRefresh, refreshing, data }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-teal-300 mb-2">Lixer Analytics Dashboard</h1>
        <p className="text-gray-600">Real-time insights into swap activity, liquidity, and market trends</p>
      </div>
      <button
        onClick={handleRefresh}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  );
};