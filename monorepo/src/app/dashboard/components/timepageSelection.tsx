import React from 'react';

type TimeRange = '1h' | '24h' | '7d' | '30d';

interface TimeRangeSelectionProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export const TimeRangeSelection: React.FC<TimeRangeSelectionProps> = ({ 
  timeRange, 
  setTimeRange 
}) => {
  const timeRanges: TimeRange[] = ['1h', '24h', '7d', '30d'];

  return (
    <div className="mb-6 flex gap-4">
      {timeRanges.map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {range.toUpperCase()}
        </button>
      ))}
    </div>
  );
};