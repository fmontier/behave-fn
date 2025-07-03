import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFeatures, useProjects, useModules } from '../../hooks/useApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useProject } from '../../contexts/ProjectContext';
import KanbanColumn from './KanbanColumn';
import { 
  Filter, 
  Search,
  Settings,
  RefreshCw,
  Plus,
  BarChart3,
  Users
} from 'lucide-react';

const FEATURE_STATUSES = ['draft', 'in_progress', 'completed'];

const KanbanBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useProject();
  const { features, loading, updateFeature, error, refetch } = useFeatures();
  const { projects } = useProjects();
  const { modules } = useModules();
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  // Configurar WebSocket
  const { emitKanbanUpdate } = useWebSocket({
    active_users: (data) => {
      setActiveUsers(data.users || []);
    },
    user_joined: (data) => {
      toast.success(`${data.user.name || 'Usuario'} se unió al proyecto`);
      refetch();
    },
    user_left: (data) => {
      toast(`${data.user.name || 'Usuario'} salió del proyecto`);
    },
    feature_created: (data) => {
      toast.success('Nueva feature creada');
      refetch();
    },
    feature_updated: (data) => {
      toast.success('Feature actualizada');
      refetch();
    },
    feature_deleted: (data) => {
      toast.success('Feature eliminada');
      refetch();
    },
    kanban_updated: (data) => {
      // Solo refrescar si el cambio no fue hecho por este cliente
      refetch();
    }
  });

  // Organizar features por estado
  const featuresByStatus = FEATURE_STATUSES.reduce((acc, status) => {
    acc[status] = filteredFeatures.filter(feature => feature.status === status);
    return acc;
  }, {});

  // Filtrar features
  useEffect(() => {
    let filtered = features;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(feature =>
        feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.as_a?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.i_want?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por proyecto
    if (selectedProject !== 'all') {
      filtered = filtered.filter(feature => feature.project_id === parseInt(selectedProject));
    }

    // Filtro por módulo
    if (selectedModule !== 'all') {
      filtered = filtered.filter(feature => feature.module_id === parseInt(selectedModule));
    }

    setFilteredFeatures(filtered);
  }, [features, searchTerm, selectedProject, selectedModule]);

  // Manejar drag and drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino, cancelar
    if (!destination) return;

    // Si la posición no cambió, cancelar
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const featureId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    try {
      // Actualizar en la API
      await updateFeature(featureId, { status: newStatus });
      
      // Emitir evento WebSocket para actualizar otros clientes
      emitKanbanUpdate({
        type: 'feature_moved',
        feature_id: featureId,
        old_status: source.droppableId,
        new_status: newStatus
      });
      
      // Mostrar toast de éxito
      toast.success(`Feature moved to ${t(`features.status.${newStatus}`)}`);
    } catch (error) {
      console.error('Error updating feature status:', error);
      toast.error(t('messages.error.update'));
    }
  };

  const handleAddFeature = (status) => {
    // Redirigir a crear feature con estado predefinido
    navigate(`/project/${projectId}/features/new?status=${status}`);
  };

  const getAvailableModules = () => {
    if (selectedProject === 'all') {
      return modules;
    }
    return modules.filter(module => module.project_id === parseInt(selectedProject));
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('kanban.title')}</h1>
          <p className="text-gray-600 mt-2">{t('kanban.subtitle')}</p>
        </div>
        
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {FEATURE_STATUSES.map((status) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 w-80 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 text-center">
          <div className="text-red-500 mb-4">
            <RefreshCw className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('messages.error.load')}
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('kanban.title')}</h1>
          <p className="text-gray-600 mt-2">{t('kanban.subtitle')}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Usuarios activos */}
          {activeUsers.length > 0 && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {activeUsers.length} usuario{activeUsers.length !== 1 ? 's' : ''} en línea
              </span>
            </div>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Filter className="w-5 h-5 mr-2" />
            {t('common.filter')}
          </button>
          
          <button 
            onClick={() => navigate(`/project/${projectId}/features/new`)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('features.newFeature')}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('kanban.searchFeatures')}
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Project Filter */}
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedModule('all'); // Reset module filter when project changes
              }}
              className="input"
            >
              <option value="all">{t('kanban.allProjects')}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="input"
              disabled={selectedProject === 'all'}
            >
              <option value="all">{t('modules.allModules')}</option>
              {getAvailableModules().map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>

            {/* Stats */}
            <div className="flex items-center text-sm text-gray-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              {filteredFeatures.length} {t('features.title')}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {FEATURE_STATUSES.map((status) => (
          <div key={status} className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {featuresByStatus[status].length}
            </div>
            <div className="text-sm text-gray-600">
              {t(`features.status.${status}`)}
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 min-w-max pb-4">
          {FEATURE_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              features={featuresByStatus[status]}
              onAddFeature={handleAddFeature}
              modules={modules}
            />
          ))}
          </div>
        </DragDropContext>
      </div>

      {/* Empty State */}
      {filteredFeatures.length === 0 && !loading && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedProject !== 'all' || selectedModule !== 'all'
              ? t('features.noFeatures') 
              : t('kanban.noFeatures')
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedProject !== 'all' || selectedModule !== 'all'
              ? t('kanban.adjustFilters')
              : t('kanban.createFirst')
            }
          </p>
          <button 
            onClick={() => navigate(`/project/${projectId}/features/new`)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('features.newFeature')}
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;