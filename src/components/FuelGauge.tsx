import React from 'react';
import clsx from 'clsx';

interface FuelGaugeProps {
  balance: number; // For now representing XLM balance
  maxCapacity?: number;
}

export const FuelGauge: React.FC<FuelGaugeProps> = ({ balance, maxCapacity = 10000 }) => {
  const percentage = Math.min(100, Math.max(0, (balance / maxCapacity) * 100));

  let colorClass = 'bg-blue-500'; // Default
  if (percentage < 20) colorClass = 'bg-red-500';
  else if (percentage < 50) colorClass = 'bg-yellow-500';
  else colorClass = 'bg-green-500';

  return (
    <div className="flex flex-col gap-2 w-full max-w-md my-4">
      <div className="flex justify-between items-end text-sm text-green-400">
        <span>FUEL LEVEL</span>
        <span>{balance.toFixed(2)} XLM</span>
      </div>
      <div className="h-4 w-full bg-gray-900 border border-green-800 rounded-sm overflow-hidden relative">
        <div 
          className={clsx("h-full transition-all duration-500 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        ></div>
        {/* CRT Scanline effect overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>EMPTY</span>
        <span>FULL ({maxCapacity / 1000}k)</span>
      </div>
    </div>
  );
};
