import { useState } from 'react';
import { Plug, Play, Square, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function ConnectorPanel({ connector, connected, onStartCharging, onStopCharging }) {
  const [idTag, setIdTag] = useState('TEST_RFID_001');

  const handleStart = () => {
    if (idTag.trim()) {
      onStartCharging(connector.id, idTag);
    } else {
      alert('Please enter an ID Tag');
    }
  };

  const handleStop = () => {
    onStopCharging(connector.id);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Preparing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Charging':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Finishing':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Reserved':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Unavailable':
      case 'Faulted':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plug className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold">Connector {connector.id}</h3>
        </div>
        <span className={`status-badge border ${getStatusBadgeClass(connector.status)}`}>
          {connector.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Connector Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-400 text-xs">Power Output</div>
            <div className="font-bold text-green-400">
              {connector.currentPower > 0 ? `${(connector.currentPower / 1000).toFixed(1)} kW` : '0 kW'}
            </div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-400 text-xs">Error Code</div>
            <div className={`font-semibold ${connector.errorCode === 'NoError' ? 'text-green-400' : 'text-red-400'}`}>
              {connector.errorCode}
            </div>
          </div>
        </div>

        {/* Transaction Info */}
        {connector.transaction && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Clock className="w-4 h-4" />
              Active Session
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-400">Transaction ID</div>
                <div className="font-mono text-white">{connector.transaction.transactionId}</div>
              </div>
              <div>
                <div className="text-gray-400">ID Tag</div>
                <div className="font-mono text-white">{connector.transaction.idTag}</div>
              </div>
              <div>
                <div className="text-gray-400">Started</div>
                <div className="text-white">
                  {formatDistanceToNow(connector.transaction.startTime, { addSuffix: true })}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Energy</div>
                <div className="font-bold text-yellow-400">
                  {(connector.energyDelivered / 1000).toFixed(2)} kWh
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {!connector.transaction ? (
          <div className="space-y-2">
            <input
              type="text"
              value={idTag}
              onChange={(e) => setIdTag(e.target.value)}
              placeholder="Enter RFID Tag / ID Tag"
              className="input-field text-sm"
              disabled={!connected || connector.status !== 'Available'}
            />
            <button
              onClick={handleStart}
              disabled={!connected || connector.status !== 'Available'}
              className="btn-success w-full flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Charging
            </button>
          </div>
        ) : (
          <button
            onClick={handleStop}
            disabled={!connected}
            className="btn-danger w-full flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Charging
          </button>
        )}
      </div>
    </div>
  );
}

export default ConnectorPanel;
