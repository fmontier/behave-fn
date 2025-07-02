import { useEffect, useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';
import websocketService from '../services/websocket';

export const useWebSocket = (events = {}) => {
  const { currentProject } = useContext(ProjectContext);

  useEffect(() => {
    if (!currentProject) return;

    // Conectar al proyecto actual
    const userInfo = {
      id: localStorage.getItem('userId') || 'anonymous',
      name: localStorage.getItem('userName') || 'Usuario Anónimo'
    };
    
    websocketService.connect(currentProject.id, userInfo);

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
  }, [currentProject, events]);

  return {
    emitFeatureUpdate: websocketService.emitFeatureUpdate.bind(websocketService),
    emitScenarioUpdate: websocketService.emitScenarioUpdate.bind(websocketService),
    emitKanbanUpdate: websocketService.emitKanbanUpdate.bind(websocketService),
    isConnected: websocketService.connected
  };
};