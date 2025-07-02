import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.projectId = null;
    this.listeners = new Map();
  }

  connect(projectId, userInfo = {}) {
    if (this.socket && this.connected && this.projectId === projectId) {
      return; // Ya conectado al mismo proyecto
    }

    // Desconectar si estaba conectado a otro proyecto
    if (this.socket && this.projectId !== projectId) {
      this.disconnect();
    }

    // Conectar al servidor WebSocket
    this.socket = io('http://localhost:8000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.projectId = projectId;

    // Event handlers
    this.socket.on('connect', () => {
      console.log('WebSocket conectado');
      this.connected = true;
      
      // Unirse al proyecto
      this.socket.emit('join_project', {
        project_id: projectId,
        user: userInfo
      });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket desconectado');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Manejar usuarios activos
    this.socket.on('active_users', (data) => {
      this.emit('active_users', data);
    });

    this.socket.on('user_joined', (data) => {
      this.emit('user_joined', data);
    });

    this.socket.on('user_left', (data) => {
      this.emit('user_left', data);
    });

    // Eventos de features
    this.socket.on('feature_created', (data) => {
      this.emit('feature_created', data);
    });

    this.socket.on('feature_updated', (data) => {
      this.emit('feature_updated', data);
    });

    this.socket.on('feature_deleted', (data) => {
      this.emit('feature_deleted', data);
    });

    // Eventos de escenarios
    this.socket.on('scenario_created', (data) => {
      this.emit('scenario_created', data);
    });

    this.socket.on('scenario_updated', (data) => {
      this.emit('scenario_updated', data);
    });

    this.socket.on('scenario_deleted', (data) => {
      this.emit('scenario_deleted', data);
    });

    // Eventos del kanban
    this.socket.on('kanban_updated', (data) => {
      this.emit('kanban_updated', data);
    });
  }

  disconnect() {
    if (this.socket) {
      // Salir del proyecto actual
      if (this.projectId) {
        this.socket.emit('leave_project', { project_id: this.projectId });
      }
      
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.projectId = null;
    }
  }

  // Emitir eventos al servidor
  emitFeatureUpdate(data) {
    if (this.socket && this.connected) {
      this.socket.emit('feature_updated', { ...data, project_id: this.projectId });
    }
  }

  emitScenarioUpdate(data) {
    if (this.socket && this.connected) {
      this.socket.emit('scenario_updated', { ...data, project_id: this.projectId });
    }
  }

  emitKanbanUpdate(data) {
    if (this.socket && this.connected) {
      this.socket.emit('kanban_updated', { ...data, project_id: this.projectId });
    }
  }

  // Sistema de suscripción para componentes
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    // Retornar función para desuscribirse
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en callback para evento ${event}:`, error);
        }
      });
    }
  }
}

// Exportar instancia única
export default new WebSocketService();