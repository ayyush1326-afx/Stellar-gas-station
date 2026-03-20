import React from 'react';
import type { RefuelEvent } from '../hooks/useStellar';
import { Fuel, Activity } from 'lucide-react';

interface ActivityFeedProps {
  events: RefuelEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  return (
    <div className="border border-gray-800 p-4 rounded bg-black/40 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-gray-400 tracking-wider flex items-center gap-2">
        <Activity size={14} /> ACTIVITY_FEED
        <span className="ml-auto text-xs text-gray-600 font-normal">LIVE · 10s</span>
      </h3>

      {events.length === 0 ? (
        <div className="text-center py-6">
          <Fuel size={24} className="text-gray-700 mx-auto mb-2" />
          <p className="text-gray-600 text-xs">No deposit events yet.</p>
          <p className="text-gray-700 text-xs mt-1">Events appear here in real-time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between text-xs border border-gray-800/60 bg-gray-950/60 px-3 py-2 rounded"
            >
              <div className="flex items-center gap-2">
                <Fuel size={10} className="text-green-500" />
                <span className="text-green-400 font-mono font-bold">+{event.amount}</span>
                <span className="text-gray-600">units</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="font-mono">
                  {event.user && event.user !== 'unknown'
                    ? `${event.user.slice(0, 4)}...${event.user.slice(-4)}`
                    : '???'}
                </span>
                <span className="text-gray-700">LEDGER #{event.ledger}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
