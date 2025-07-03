import { useEffect } from 'react';
import { useProject } from '../contexts/ProjectContext';
import websocketService from '../services/websocket';

export const useWebSocket = (events = {}) => {
  const { selectedProject } = useProject();

  useEffect(() => {
    if (!selectedProject) return;

    // Conectar al proyecto actual
    const userInfo = {
      id: localStorage.getItem('userId') || 'anonymous',
      name: localStorage.getItem('userName') || 'Usuario Anónimo'
    };
    
    websocketService.connect(selectedProject.id, userInfo);

    // Suscribirse a los eventos especificados
    const unsubscribers = [];
    
    Object.entries(events).forEach(([event, handler]) => {
      const unsubscribe = websocketService.subscribe(event, handler);
      unsubscribers.push(unsubscribe);
    });

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [selectedProject, events]);

  return {
    emitFeatureUpdate: websocketService.emitFeatureUpdate.bind(websocketService),
    emitScenarioUpdate: websocketService.emitScenarioUpdate.bind(websocketService),
    emitKanbanUpdate: websocketService.emitKanbanUpdate.bind(websocketService),
    isConnected: websocketService.connected
  };
};