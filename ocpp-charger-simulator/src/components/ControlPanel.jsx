import { Power, PowerOff, Activity, Send } from 'lucide-react';

function ControlPanel({ connected, onConnect, onDisconnect, onBootNotification, ocppClient, connectors }) {
  const sendHeartbeat = () => {
    if (connected) {
      ocppClient.sendHeartbeat();
    }
  };

  const sendStatusForAll = () => {
    if (connected) {
      connectors.forEach(connector => {
        ocppClient.sendStatusNotification(connector.id, connector.status, connector.errorCode);
      });
    }
  };

  const sendAuthorize = () => {
    if (connected) {
      const idTag = prompt('Enter ID Tag to authorize:');
      if (idTag) {
        ocppClient.sendAuthorize(idTag);
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        Control Panel
      </h2>

      <div className="space-y-3">
        {/* Connection Controls */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-300 mb-2">Connection</div>
          {!connected ? (
            <button
              onClick={onConnect}
              className="btn-success w-full flex items-center justify-center gap-2"
            >
              <Power className="w-4 h-4" />
              Connect to Server
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="btn-danger w-full flex items-center justify-center gap-2"
            >
              <PowerOff className="w-4 h-4" />
              Disconnect
            </button>
          )}
        </div>

        <div className="border-t border-gray-700 pt-3"></div>

        {/* OCPP Message Controls */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-300 mb-2">OCPP Messages</div>
          
          <button
            onClick={onBootNotification}
            disabled={!connected}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            Send BootNotification
          </button>

          <button
            onClick={sendHeartbeat}
            disabled={!connected}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            Send Heartbeat
          </button>

          <button
            onClick={sendStatusForAll}
            disabled={!connected}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            Send All Status
          </button>

          <button
            onClick={sendAuthorize}
            disabled={!connected}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            Send Authorize
          </button>
        </div>

        <div className="border-t border-gray-700 pt-3"></div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-300 mb-2">Quick Actions</div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              disabled={!connected}
              className="btn-secondary py-2"
            >
              Simulate Fault
            </button>
            <button
              disabled={!connected}
              className="btn-secondary py-2"
            >
              Reset Charger
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-900 border border-gray-700 rounded p-3 text-xs">
          <div className="text-gray-400 mb-1">Tips</div>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Connect to start OCPP communication</li>
            <li>Use connectors to simulate charging</li>
            <li>Server can send remote commands</li>
            <li>Messages logged in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
