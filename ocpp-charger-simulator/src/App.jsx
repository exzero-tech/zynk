import { useState, useEffect, useRef } from 'react';
import OCPPClient from './services/ocppClient';
import ChargerIdentity from './components/ChargerIdentity';
import ChargerDisplay from './components/ChargerDisplay';
import ConnectorPanel from './components/ConnectorPanel';
import ControlPanel from './components/ControlPanel';
import MessageLog from './components/MessageLog';
import Statistics from './components/Statistics';
import { Zap } from 'lucide-react';

function App() {
  const [ocppClient] = useState(() => new OCPPClient());
  const [connected, setConnected] = useState(false);
  const [chargerConfig, setChargerConfig] = useState({
    chargePointId: `CHARGER_${Date.now()}`,
    serverUrl: 'ws://localhost:3002/ocpp',
    vendor: 'ZYNK Simulator',
    model: 'ZS-1000',
    firmwareVersion: '1.0.0',
    serialNumber: '',
    numberOfConnectors: 2
  });

  const [connectors, setConnectors] = useState([
    { id: 1, status: 'Available', errorCode: 'NoError', currentPower: 0, energyDelivered: 0, transaction: null },
    { id: 2, status: 'Available', errorCode: 'NoError', currentPower: 0, energyDelivered: 0, transaction: null }
  ]);

  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalMessages: 0,
    sentMessages: 0,
    receivedMessages: 0,
    uptime: 0
  });

  const uptimeIntervalRef = useRef(null);
  const connectTimeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (type, data) => {
      const timestamp = new Date().toISOString();
      
      switch (type) {
        case 'call':
          addMessage({
            timestamp,
            direction: 'incoming',
            type: 'CALL',
            action: data.action,
            messageId: data.messageId,
            payload: data.payload
          });
          handleServerCommand(data);
          break;

        case 'callresult':
          addMessage({
            timestamp,
            direction: 'incoming',
            type: 'CALLRESULT',
            messageId: data.messageId,
            payload: data.payload
          });
          break;

        case 'callerror':
          addMessage({
            timestamp,
            direction: 'incoming',
            type: 'CALLERROR',
            errorCode: data.errorCode,
            errorDescription: data.errorDescription,
            messageId: data.messageId
          });
          break;

        case 'sent':
          addMessage({
            timestamp,
            direction: 'outgoing',
            type: data.type || 'CALL',
            action: data.action,
            messageId: data.messageId,
            payload: data.payload
          });
          break;

        case 'connection':
          if (data.type === 'disconnected') {
            handleDisconnect();
          }
          break;

        default:
          break;
      }
    };

    ocppClient.onMessage(handleMessage);

    return () => {
      ocppClient.offMessage(handleMessage);
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
      }
    };
  }, [ocppClient]);

  const addMessage = (message) => {
    setMessages(prev => [message, ...prev].slice(0, 100)); // Keep last 100 messages
    setStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 1,
      sentMessages: message.direction === 'outgoing' ? prev.sentMessages + 1 : prev.sentMessages,
      receivedMessages: message.direction === 'incoming' ? prev.receivedMessages + 1 : prev.receivedMessages
    }));
  };

  const handleServerCommand = (data) => {
    const { action, messageId, payload } = data;

    console.log(`[App] Handling server command: ${action}`, payload);

    switch (action) {
      case 'RemoteStartTransaction':
        handleRemoteStart(messageId, payload);
        break;

      case 'RemoteStopTransaction':
        handleRemoteStop(messageId, payload);
        break;

      case 'Reset':
        handleReset(messageId, payload);
        break;

      case 'UnlockConnector':
        handleUnlockConnector(messageId, payload);
        break;

      case 'ChangeConfiguration':
        handleChangeConfiguration(messageId, payload);
        break;

      case 'GetConfiguration':
        handleGetConfiguration(messageId, payload);
        break;

      case 'TriggerMessage':
        handleTriggerMessage(messageId, payload);
        break;

      default:
        // Send not supported response
        ocppClient.sendCallError(messageId, 'NotSupported', `Action ${action} not supported`);
        break;
    }
  };

  const handleRemoteStart = (messageId, payload) => {
    const { connectorId, idTag } = payload;
    
    // Send acceptance response
    ocppClient.sendCallResult(messageId, { status: 'Accepted' });

    // Start transaction on specified connector
    setTimeout(() => {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector && connector.status === 'Available') {
        startCharging(connectorId, idTag);
      }
    }, 1000);
  };

  const handleRemoteStop = (messageId, payload) => {
    const { transactionId } = payload;
    
    // Find connector with this transaction
    const connector = connectors.find(c => c.transaction?.transactionId === transactionId);
    
    if (connector) {
      ocppClient.sendCallResult(messageId, { status: 'Accepted' });
      setTimeout(() => stopCharging(connector.id), 1000);
    } else {
      ocppClient.sendCallResult(messageId, { status: 'Rejected' });
    }
  };

  const handleReset = (messageId, payload) => {
    const { type } = payload; // Soft or Hard
    ocppClient.sendCallResult(messageId, { status: 'Accepted' });
    
    setTimeout(() => {
      // Stop all transactions
      connectors.forEach(connector => {
        if (connector.transaction) {
          stopCharging(connector.id);
        }
      });
      
      // Disconnect and reconnect
      if (type === 'Hard') {
        handleDisconnect();
        setTimeout(() => handleConnect(), 5000);
      }
    }, 1000);
  };

  const handleUnlockConnector = (messageId, payload) => {
    const { connectorId } = payload;
    ocppClient.sendCallResult(messageId, { status: 'Unlocked' });
    
    // Stop transaction if any
    setTimeout(() => {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector?.transaction) {
        stopCharging(connectorId);
      }
    }, 1000);
  };

  const handleChangeConfiguration = (messageId) => {
    ocppClient.sendCallResult(messageId, { status: 'Accepted' });
  };

  const handleGetConfiguration = (messageId, payload) => {
    ocppClient.sendCallResult(messageId, {
      configurationKey: [],
      unknownKey: payload.key || []
    });
  };

  const handleTriggerMessage = (messageId, payload) => {
    const { requestedMessage, connectorId } = payload;
    
    ocppClient.sendCallResult(messageId, { status: 'Accepted' });
    
    setTimeout(() => {
      switch (requestedMessage) {
        case 'BootNotification':
          sendBootNotification();
          break;
        case 'StatusNotification':
          if (connectorId) {
            const connector = connectors.find(c => c.id === connectorId);
            if (connector) {
              ocppClient.sendStatusNotification(connectorId, connector.status, connector.errorCode);
            }
          }
          break;
        case 'Heartbeat':
          ocppClient.sendHeartbeat();
          break;
        default:
          break;
      }
    }, 500);
  };

  const handleConnect = async () => {
    try {
      await ocppClient.connect(chargerConfig.serverUrl, chargerConfig.chargePointId);
      setConnected(true);
      connectTimeRef.current = Date.now();
      
      // Start uptime counter
      uptimeIntervalRef.current = setInterval(() => {
        if (connectTimeRef.current) {
          const uptime = Math.floor((Date.now() - connectTimeRef.current) / 1000);
          setStats(prev => ({ ...prev, uptime }));
        }
      }, 1000);

      // Send BootNotification
      setTimeout(() => sendBootNotification(), 500);

      // Send initial status for all connectors
      setTimeout(() => {
        connectors.forEach(connector => {
          ocppClient.sendStatusNotification(connector.id, connector.status, connector.errorCode);
        });
      }, 1500);

    } catch (error) {
      console.error('Connection failed:', error);
      alert(`Connection failed: ${error.message}`);
    }
  };

  const handleDisconnect = () => {
    ocppClient.disconnect();
    setConnected(false);
    if (uptimeIntervalRef.current) {
      clearInterval(uptimeIntervalRef.current);
    }
    connectTimeRef.current = null;
    setStats(prev => ({ ...prev, uptime: 0 }));
  };

  const sendBootNotification = () => {
    ocppClient.sendBootNotification({
      vendor: chargerConfig.vendor,
      model: chargerConfig.model,
      serialNumber: chargerConfig.serialNumber,
      firmwareVersion: chargerConfig.firmwareVersion
    });
  };

  const startCharging = (connectorId, idTag) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (!connector || connector.transaction) return;

    // Update connector status
    updateConnectorStatus(connectorId, 'Preparing');

    // Authorize
    ocppClient.sendAuthorize(idTag);

    // Start transaction after delay
    setTimeout(() => {
      const meterStart = Math.floor(Math.random() * 10000);
      const transactionId = ocppClient.sendStartTransaction(connectorId, idTag, meterStart);
      
      updateConnector(connectorId, {
        status: 'Charging',
        transaction: {
          transactionId,
          idTag,
          meterStart,
          startTime: Date.now()
        },
        currentPower: 7200 // 7.2 kW
      });

      // Start meter values simulation
      startMeterValues(connectorId);
    }, 2000);
  };

  const stopCharging = (connectorId) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (!connector || !connector.transaction) return;

    updateConnectorStatus(connectorId, 'Finishing');

    setTimeout(() => {
      const meterStop = connector.transaction.meterStart + connector.energyDelivered;
      
      ocppClient.sendStopTransaction(
        connector.transaction.transactionId,
        meterStop,
        null,
        'Local'
      );

      updateConnector(connectorId, {
        status: 'Available',
        transaction: null,
        currentPower: 0,
        energyDelivered: 0
      });
    }, 1500);
  };

  const startMeterValues = (connectorId) => {
    const interval = setInterval(() => {
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector || !connector.transaction) {
        clearInterval(interval);
        return;
      }

      // Simulate energy consumption
      const energyIncrement = Math.floor(Math.random() * 100) + 50;
      updateConnector(connectorId, {
        energyDelivered: connector.energyDelivered + energyIncrement
      });

      // Send meter values
      const timestamp = new Date().toISOString();
      ocppClient.sendMeterValues(connectorId, connector.transaction.transactionId, [
        {
          timestamp,
          sampledValue: [
            {
              value: (connector.transaction.meterStart + connector.energyDelivered).toString(),
              context: 'Sample.Periodic',
              format: 'Raw',
              measurand: 'Energy.Active.Import.Register',
              unit: 'Wh'
            },
            {
              value: connector.currentPower.toString(),
              context: 'Sample.Periodic',
              format: 'Raw',
              measurand: 'Power.Active.Import',
              unit: 'W'
            }
          ]
        }
      ]);
    }, 10000); // Every 10 seconds
  };

  const updateConnectorStatus = (connectorId, status) => {
    updateConnector(connectorId, { status });
    if (connected) {
      ocppClient.sendStatusNotification(connectorId, status, 'NoError');
    }
  };

  const updateConnector = (connectorId, updates) => {
    setConnectors(prev => prev.map(c => 
      c.id === connectorId ? { ...c, ...updates } : c
    ));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const changeChargerIdentity = (newConfig) => {
    if (connected) {
      alert('Please disconnect before changing charger identity');
      return;
    }
    setChargerConfig(newConfig);
    setMessages([]);
    setStats({
      totalMessages: 0,
      sentMessages: 0,
      receivedMessages: 0,
      uptime: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ZYNK OCPP Charger Simulator</h1>
                <p className="text-gray-400">OCPP 1.6J Protocol | Real-time Testing</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Charge Point ID</div>
              <div className="text-lg font-mono font-semibold">{chargerConfig.chargePointId}</div>
            </div>
          </div>
          
          {/* Connection Status Bar */}
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-semibold">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="border-l border-gray-700 h-6"></div>
            <div className="text-sm">
              <span className="text-gray-400">Uptime:</span> <span className="font-mono">{formatUptime(stats.uptime)}</span>
            </div>
            <div className="border-l border-gray-700 h-6"></div>
            <div className="text-sm">
              <span className="text-gray-400">Messages:</span> <span className="font-mono">{stats.totalMessages}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Sent:</span> <span className="font-mono text-blue-400">{stats.sentMessages}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Received:</span> <span className="font-mono text-green-400">{stats.receivedMessages}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charger Identity */}
            <ChargerIdentity 
              config={chargerConfig}
              connected={connected}
              onUpdate={changeChargerIdentity}
            />

            {/* Charger Display */}
            <ChargerDisplay 
              connectors={connectors}
              connected={connected}
            />

            {/* Connector Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectors.map(connector => (
                <ConnectorPanel
                  key={connector.id}
                  connector={connector}
                  connected={connected}
                  onStartCharging={startCharging}
                  onStopCharging={stopCharging}
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Control Panel */}
            <ControlPanel
              connected={connected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onBootNotification={sendBootNotification}
              ocppClient={ocppClient}
              connectors={connectors}
            />

            {/* Statistics */}
            <Statistics stats={{
              messagesSent: stats.sentMessages,
              messagesReceived: stats.receivedMessages,
              totalSessions: connectors.reduce((acc, c) => acc + (c.transaction ? 1 : 0), 0),
              totalEnergy: connectors.reduce((acc, c) => acc + c.energyDelivered, 0),
              uptime: formatUptime(stats.uptime)
            }} />

            {/* Message Log */}
            <MessageLog messages={messages} onClear={clearMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default App;

