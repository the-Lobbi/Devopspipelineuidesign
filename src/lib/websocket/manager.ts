
type EventHandler = (data: any) => void;

export class WebSocketManager {
  private url: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxRetries = 10;
  private baseReconnectDelay = 1000;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private statusChangeListeners: Set<(status: 'connecting' | 'connected' | 'disconnected' | 'error') => void> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private simulationInterval: NodeJS.Timeout | null = null;
  
  public status: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    // Clear any pending reconnects
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Mock mode support
    if (this.url === 'mock' || this.url.includes('api.goldenarmada.ai')) {
        this.updateStatus('connected');
        console.log('WebSocket connected (Mock Mode)');
        
        // Clear existing interval if any
        if (this.simulationInterval) clearInterval(this.simulationInterval);

        // Simulate random activity in mock mode
        this.simulationInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                this.emit('activity.new', {
                    type: 'system',
                    agent: 'System',
                    message: 'Simulated activity event from mock socket',
                    timestamp: 'Just now'
                });
            }
        }, 10000);
        return;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.updateStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.updateStatus('connected');
        this.reconnectAttempts = 0;
        console.log('WebSocket connected');
      };

      this.ws.onclose = () => {
        this.updateStatus('disconnected');
        this.handleDisconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateStatus('error');
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.emit(message.type, message.payload);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
    } catch (e) {
      this.updateStatus('error');
      this.handleDisconnect();
    }
  }

  disconnect() {
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Clear simulation interval
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    if (this.ws) {
      // Remove listeners to prevent auto-reconnect logic
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onopen = null;
      this.ws.onmessage = null;
      
      this.ws.close();
      this.ws = null;
    }
    this.updateStatus('disconnected');
  }

  private handleDisconnect() {
    if (this.url === 'mock' || this.url.includes('api.goldenarmada.ai')) return;

    if (this.reconnectAttempts < this.maxRetries) {
      const delay = Math.min(30000, this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts));
      this.reconnectAttempts++;
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  private updateStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error') {
    this.status = status;
    this.statusChangeListeners.forEach(listener => listener(status));
  }

  onStatusChange(listener: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void) {
    this.statusChangeListeners.add(listener);
    return () => this.statusChangeListeners.delete(listener);
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emit(event: string, data: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  send(type: string, payload: any) {
    if (this.url === 'mock' || this.url.includes('api.goldenarmada.ai')) {
        console.log('Mock WS send:', type, payload);
        return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }
}
