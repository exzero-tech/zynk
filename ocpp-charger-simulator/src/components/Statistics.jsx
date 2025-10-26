import { BarChart3 } from 'lucide-react';

function Statistics({ stats }) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-green-400" />
        Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Messages Sent</div>
          <div className="text-2xl font-bold text-green-400">{stats.messagesSent}</div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Messages Received</div>
          <div className="text-2xl font-bold text-blue-400">{stats.messagesReceived}</div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Total Sessions</div>
          <div className="text-2xl font-bold text-purple-400">{stats.totalSessions}</div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Total Energy (kWh)</div>
          <div className="text-2xl font-bold text-yellow-400">
            {stats.totalEnergy.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded p-3 col-span-2">
          <div className="text-xs text-gray-400 mb-1">Connection Uptime</div>
          <div className="text-2xl font-bold text-cyan-400">{stats.uptime}</div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
