import { useEffect, useRef, useState } from 'react';

type LogEntry = {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
};

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capturar console.log
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      originalLog(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'log',
        message,
      }]);
    };

    // Capturar console.error
    const originalError = console.error;
    console.error = (...args: any[]) => {
      originalError(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'error',
        message,
      }]);
    };

    // Capturar console.warn
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      originalWarn(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'warn',
        message,
      }]);
    };

    // Capturar console.info
    const originalInfo = console.info;
    console.info = (...args: any[]) => {
      originalInfo(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        message,
      }]);
    };

    // Capturar errores no manejados
    const handleError = (event: ErrorEvent) => {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'error',
        message: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error?.stack,
      }]);
    };

    window.addEventListener('error', handleError);

    // Capturar promesas rechazadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'error',
        message: `Unhandled Promise Rejection: ${String(event.reason)}`,
      }]);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return '#f87171';
      case 'warn':
        return '#fbbf24';
      case 'info':
        return '#60a5fa';
      default:
        return '#d1d5db';
    }
  };

  const copyLog = (idx: number, log: LogEntry) => {
    const text = `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.stack ? '\n' + log.stack : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: isOpen ? '300px' : '40px',
        background: '#1f2937',
        border: '1px solid #374151',
        borderTop: '2px solid #06b6d4',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: '12px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          background: '#111827',
          borderBottom: '1px solid #374151',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>
          DEBUG CONSOLE ({logs.length} logs)
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLogs([]);
          }}
          style={{
            background: '#374151',
            color: '#d1d5db',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Clear
        </button>
      </div>

      {/* Logs */}
      {isOpen && (
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px 12px',
            background: '#1f2937',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#6b7280' }}>Waiting for logs...</div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '6px',
                  color: getLevelColor(log.level),
                  lineHeight: '1.4',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '4px 6px',
                  borderRadius: '2px',
                  background: 'rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ flex: 1, wordBreak: 'break-word' }}>
                  <span style={{ color: '#9ca3af' }}>[{log.timestamp}]</span>
                  {' '}
                  <span style={{ color: '#6b7280' }}>
                    [{log.level.toUpperCase()}]
                  </span>
                  {' '}
                  {log.message}
                  {log.stack && (
                    <div style={{ color: '#ef4444', marginTop: '4px', marginLeft: '20px', fontSize: '11px' }}>
                      {log.stack}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => copyLog(idx, log)}
                  style={{
                    background: copiedIdx === idx ? '#10b981' : '#374151',
                    color: '#d1d5db',
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                  title="Copy log"
                >
                  {copiedIdx === idx ? '✓' : 'Copy'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
