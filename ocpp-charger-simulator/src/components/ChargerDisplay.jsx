import { Battery, Plug } from 'lucide-react';

function ChargerDisplay({ connectors, connected }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Preparing':
        return 'bg-yellow-500 animate-pulse';
      case 'Charging':
        return 'bg-blue-500 animate-pulse';
      case 'Finishing':
        return 'bg-orange-500 animate-pulse';
      case 'Reserved':
        return 'bg-purple-500';
      case 'Unavailable':
      case 'Faulted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Battery className="w-6 h-6 text-green-400" />
        Charger Visual Display
      </h2>

      <div className="relative bg-gray-900 rounded-xl p-8 border-2 border-gray-700">
        {/* Charger Station Body */}
        <div className="mx-auto max-w-md">
          {/* Top LED Indicator */}
          <div className="flex justify-center mb-6">
            <div className={`w-6 h-6 rounded-full ${connected ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-600'}`}></div>
          </div>

          {/* Charger Screen */}
          <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-4 mb-6">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-blue-400">ZYNK CHARGER</div>
              <div className="text-xs text-gray-400 mt-1">OCPP 1.6J Enabled</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-gray-400 text-xs">Status</div>
                <div className={`font-semibold ${connected ? 'text-green-400' : 'text-red-400'}`}>
                  {connected ? 'Online' : 'Offline'}
                </div>
              </div>
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-gray-400 text-xs">Active Sessions</div>
                <div className="font-semibold text-blue-400">
                  {connectors.filter(c => c.transaction).length}
                </div>
              </div>
            </div>
          </div>

          {/* Connectors */}
          <div className="grid grid-cols-2 gap-6">
            {connectors.map((connector) => (
              <div key={connector.id} className="text-center">
                <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 relative">
                  {/* Connector Number */}
                  <div className="absolute top-2 left-2 bg-gray-700 text-xs px-2 py-1 rounded font-bold">
                    #{connector.id}
                  </div>

                  {/* Status LED */}
                  <div className="flex justify-center mb-3 mt-4">
                    <div className={`w-12 h-12 rounded-full ${getStatusColor(connector.status)} flex items-center justify-center shadow-lg`}>
                      <Plug className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-sm font-semibold text-gray-300 mb-2">
                    {connector.status}
                  </div>

                  {/* Power Display */}
                  {connector.transaction && (
                    <div className="bg-gray-900 rounded p-2">
                      <div className="text-xs text-gray-400">Power</div>
                      <div className="text-lg font-bold text-green-400">
                        {(connector.currentPower / 1000).toFixed(1)} kW
                      </div>
                    </div>
                  )}

                  {/* Cable */}
                  <div className="mt-4">
                    <div className={`h-16 w-2 mx-auto rounded-full ${connector.transaction ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                    <div className={`h-4 w-6 mx-auto rounded-t-full ${connector.transaction ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                  </div>
                </div>

                {/* Energy Meter */}
                {connector.transaction && (
                  <div className="mt-2 bg-gray-800 rounded p-2 text-xs">
                    <div className="text-gray-400">Energy Delivered</div>
                    <div className="font-mono font-bold text-yellow-400">
                      {(connector.energyDelivered / 1000).toFixed(2)} kWh
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Status Bar */}
          <div className="mt-6 bg-gray-800 border border-gray-600 rounded px-4 py-2 text-center text-xs text-gray-400">
            <span className="font-mono">Status: </span>
            {connectors.every(c => c.status === 'Available') ? (
              <span className="text-green-400">All Connectors Ready</span>
            ) : connectors.some(c => c.status === 'Charging') ? (
              <span className="text-blue-400">Charging in Progress</span>
            ) : (
              <span className="text-yellow-400">Preparing</span>
            )}
          </div>
        </div>

        {/* Connection Indicator */}
        {!connected && (
          <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-400 text-2xl font-bold mb-2">OFFLINE</div>
              <div className="text-gray-400">Connect to OCPP Server</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChargerDisplay;
