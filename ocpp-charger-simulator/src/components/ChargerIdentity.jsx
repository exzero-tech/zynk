import { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

function ChargerIdentity({ config, connected, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(config);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const generateNewId = () => {
    setFormData(prev => ({
      ...prev,
      chargePointId: `CHARGER_${Date.now()}`,
      serialNumber: `SN${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    }));
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold">Charger Identity</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateNewId}
            disabled={connected}
            className="btn-secondary text-sm py-1 px-3 flex items-center gap-1"
            title="Generate new identity"
          >
            <RefreshCw className="w-4 h-4" />
            New ID
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={connected}
            className="btn-primary text-sm py-1 px-3"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Charge Point ID
              </label>
              <input
                type="text"
                name="chargePointId"
                value={formData.chargePointId}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Server URL
              </label>
              <input
                type="text"
                name="serverUrl"
                value={formData.serverUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="ws://localhost:3002/ocpp"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vendor
              </label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Firmware Version
              </label>
              <input
                type="text"
                name="firmwareVersion"
                value={formData.firmwareVersion}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-success">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400 mb-1">Charge Point ID</div>
            <div className="font-mono font-semibold text-blue-400">{config.chargePointId}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Server URL</div>
            <div className="font-mono truncate">{config.serverUrl}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Vendor</div>
            <div className="font-medium">{config.vendor}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Model</div>
            <div className="font-medium">{config.model}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Firmware</div>
            <div className="font-medium">{config.firmwareVersion}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Serial Number</div>
            <div className="font-mono text-sm">{config.serialNumber || 'Auto-generated'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChargerIdentity;
