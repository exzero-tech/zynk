import { MessageSquare, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

function MessageLog({ messages, onClear }) {
  const getMessageIcon = (direction) => {
    return direction === 'sent' ? (
      <ArrowUp className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-400" />
    );
  };

  const getMessageColor = (direction) => {
    return direction === 'sent' ? 'border-green-500/30 bg-green-900/10' : 'border-blue-500/30 bg-blue-900/10';
  };

  const formatMessage = (msg) => {
    try {
      return JSON.stringify(msg, null, 2);
    } catch {
      return String(msg);
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Message Log
          <span className="text-sm font-normal text-gray-400">({messages.length})</span>
        </h2>
        <button
          onClick={onClear}
          className="btn-secondary text-xs flex items-center gap-1 px-2 py-1"
          disabled={messages.length === 0}
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[600px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Connect to start communication.
          </div>
        ) : (
          messages.slice().reverse().map((msg, idx) => (
            <div
              key={messages.length - 1 - idx}
              className={`border rounded p-3 ${getMessageColor(msg.direction)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getMessageIcon(msg.direction)}
                  <span className="font-semibold text-sm">
                    {msg.direction === 'sent' ? 'SENT' : 'RECEIVED'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {msg.action}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(msg.timestamp, 'HH:mm:ss.SSS')}
                </span>
              </div>
              
              <div className="bg-gray-900 rounded p-2 overflow-x-auto">
                <pre className="text-xs text-gray-300 font-mono">
                  {formatMessage(msg.payload)}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessageLog;
