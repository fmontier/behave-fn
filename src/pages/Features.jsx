import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProject } from '../contexts/ProjectContext';
import { useFeatures, useProjects, useModules, useTags } from '../hooks/useApi';
import { rolesAPI } from '../services/api';
import { 
  Plus, 
  FileText, 
  Calendar, 
  Tag, 
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const FeatureCard = ({ feature, onEdit, onDelete, onDownloadBDD, modules }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getModule = (moduleId) => {
    return modules.find(m => m.id === moduleId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link 
            to={`/features/${feature.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {feature.title}
          </Link>
          {feature.description && (
            <p className="text-gray-600 mt-1 line-clamp-2">{feature.description}</p>
          )}
          
          {feature.roles && feature.roles.length > 0 && feature.i_want && feature.so_that && (
            <div className="bg-gray-50 rounded-lg p-3 mt-3 text-sm">
              <p><strong>As a</strong> {feature.roles.map(r => r.name).join(', ')}</p>
              <p><strong>I want</strong> {feature.i_want}</p>
              <p><strong>So that</strong> {feature.so_that}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className={`badge ${getStatusColor(feature.status)}`}>
                {feature.status}
              </span>
              <span className={`badge ${getPriorityColor(feature.priority)}`}>
                {feature.priority}
              </span>
            </div>
            
            {feature.tags && feature.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex space-x-1">
                  {feature.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                      title={tag.name}
                    />
                  ))}
                  {feature.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{feature.tags.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Created {new Date(feature.created_at).toLocaleDateString()}</span>
            </div>
            {feature.module_id && getModule(feature.module_id) && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getModule(feature.module_id).color }}
                ></div>
                <span className="text-xs font-medium">{getModule(feature.module_id).name}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onDownloadBDD(feature.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download BDD File
                </button>
                <button
                  onClick={() => {
                    onEdit(feature);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Feature
                </button>
                <button
                  onClick={() => {
                    onDelete(feature.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Feature
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureModal = ({ isOpen, onClose, onSubmit, feature, projects, modules, tags, roles, onCreateRole, defaultProjectId, defaultModuleId }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: feature || { 
      title: '', 
      description: '', 
      i_want: '', 
      so_that: '',
      priority: 'medium',
      status: 'draft',
      project_id: defaultProjectId || '',
      module_id: defaultModuleId || '',
      tag_ids: [],
      role_ids: []
    }
  });

  const [selectedRoles, setSelectedRoles] = React.useState([]);

  React.useEffect(() => {
    if (feature) {
      const roleIds = feature.roles?.map(role => role.id) || [];
      setSelectedRoles(roleIds);
      reset({
        ...feature,
        tag_ids: feature.tags?.map(tag => tag.id) || [],
        role_ids: roleIds
      });
    } else {
      setSelectedRoles([]);
      reset({ 
        title: '', 
        description: '', 
        i_want: '', 
        so_that: '',
        priority: 'medium',
        status: 'draft',
        project_id: defaultProjectId || '',
        module_id: defaultModuleId || '',
        tag_ids: [],
        role_ids: []
      });
    }
  }, [feature, reset]);

  const handleRoleChange = (roleId, checked) => {
    const newSelectedRoles = checked 
      ? [...selectedRoles, roleId]
      : selectedRoles.filter(id => id !== roleId);
    setSelectedRoles(newSelectedRoles);
    setValue('role_ids', newSelectedRoles);
  };

  const onFormSubmit = (data) => {
    // Convert tag_ids from strings to numbers
    data.tag_ids = data.tag_ids.map(id => parseInt(id));
    // Convert role_ids from strings to numbers
    data.role_ids = data.role_ids.map(id => parseInt(id));
    // Convert project_id and module_id to numbers
    data.project_id = parseInt(data.project_id);
    data.module_id = parseInt(data.module_id);
    onSubmit(data);
    onClose();
  };

  const onFormSubmitAndGoToScenarios = async (data) => {
    // Convert tag_ids from strings to numbers
    data.tag_ids = data.tag_ids.map(id => parseInt(id));
    // Convert role_ids from strings to numbers
    data.role_ids = data.role_ids.map(id => parseInt(id));
    // Convert project_id and module_id to numbers
    data.project_id = parseInt(data.project_id);
    data.module_id = parseInt(data.module_id);
    
    try {
      const result = await onSubmit(data);
      onClose();
      
      // Si es una nueva funcionalidad, necesitamos el ID de la respuesta
      if (!feature && result && result.id) {
        window.location.href = `/features/${result.id}`;
      } else if (feature) {
        window.location.href = `/features/${feature.id}`;
      }
    } catch (error) {
      console.error('Error creating/updating feature:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="bg-white px-6 pt-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {feature ? 'Editar Funcionalidad' : 'Crear Nueva Funcionalidad'}
              </h3>
              
              <div className="space-y-8">
                {/* Información Básica */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    📋 Información Básica
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título de la Funcionalidad *
                        </label>
                        <input
                          type="text"
                          className="input w-full"
                          placeholder="Ingrese el título de la funcionalidad"
                          {...register('title', { required: 'Feature title is required' })}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proyecto *
                        </label>
                        <select
                          className="select w-full"
                          {...register('project_id', { required: 'Project is required' })}
                        >
                          <option value="">Selecciona un proyecto</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                        {errors.project_id && (
                          <p className="mt-1 text-sm text-red-600">{errors.project_id.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('modules.title')} *
                      </label>
                      <select
                        className="select w-full"
                        {...register('module_id', { required: t('modules.moduleRequired') })}
                      >
                        <option value="">{t('modules.selectModule')}</option>
                        {modules
                          .filter(module => !watch('project_id') || module.project_id == watch('project_id'))
                          .map((module) => (
                            <option key={module.id} value={module.id}>
                              {module.name}
                            </option>
                          ))}
                      </select>
                      {errors.module_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.module_id.message}</p>
                      )}
                      {watch('project_id') && modules.filter(m => m.project_id == watch('project_id')).length === 0 && (
                        <p className="mt-1 text-sm text-amber-600">{t('modules.noModulesForProject')}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        className="textarea w-full"
                        rows={3}
                        placeholder="Describa brevemente la funcionalidad"
                        {...register('description')}
                      />
                    </div>
                  </div>
                </div>

                {/* Historia de Usuario */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-blue-200 pb-2">
                    👤 Historia de Usuario
                  </h4>
                  
                  {/* Sección Como */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      🎭 Como...
                    </label>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {roles?.map((role) => (
                          <label key={role.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedRoles.includes(role.id)}
                              onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">{role.name}</span>
                          </label>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newRoleName = prompt('Ingrese el nombre del nuevo rol:');
                          if (newRoleName && onCreateRole) {
                            onCreateRole(newRoleName);
                          }
                        }}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        ➕ Agregar nuevo rol
                      </button>
                    </div>
                  </div>

                  {/* Sección Quiero */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 Quiero...
                    </label>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <textarea
                        className="textarea w-full resize-none"
                        rows={3}
                        placeholder="poder realizar una acción específica..."
                        {...register('i_want')}
                        style={{ minHeight: '72px' }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.max(72, e.target.scrollHeight) + 'px';
                        }}
                      />
                    </div>
                  </div>

                  {/* Sección Para que */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏆 Para que...
                    </label>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <textarea
                        className="textarea w-full resize-none"
                        rows={3}
                        placeholder="pueda obtener un beneficio específico..."
                        {...register('so_that')}
                        style={{ minHeight: '72px' }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.max(72, e.target.scrollHeight) + 'px';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración Adicional */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-green-200 pb-2">
                    ⚙️ Configuración Adicional
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🎚️ Prioridad
                      </label>
                      <select className="select w-full" {...register('priority')}>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📊 Estado
                      </label>
                      <select className="select w-full" {...register('status')}>
                        <option value="draft">Borrador</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completado</option>
                        <option value="blocked">Bloqueado</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏷️ Etiquetas
                    </label>
                    <select 
                      multiple 
                      className="select w-full min-h-[100px]" 
                      {...register('tag_ids')}
                    >
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Mantén presionado Ctrl/Cmd para seleccionar múltiples etiquetas
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:space-x-reverse sm:space-x-2">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
              >
                {feature ? 'Actualizar Funcionalidad' : 'Crear Funcionalidad'}
              </button>
              <button
                type="button"
                onClick={handleSubmit(onFormSubmitAndGoToScenarios)}
                className="btn bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto mt-3 sm:mt-0"
              >
                💾📋 {feature ? 'Guardar y Ver Escenarios' : 'Crear y Ver Escenarios'}
              </button>
              {feature && (
                <Link
                  to={`/features/${feature.id}`}
                  className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0 text-center"
                  onClick={onClose}
                >
                  📋 Solo Ver Escenarios
                </Link>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  const { t } = useTranslation();
  const location = useLocation();
  const { projectId } = useParams();
  const { selectedProject } = useProject();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const isNewFeature = location.pathname.includes('/features/new');
  
  const { features, loading, createFeature, updateFeature, deleteFeature, downloadBDDFile } = useFeatures(projectId);
  const { projects } = useProjects();
  const { modules } = useModules();
  const { tags } = useTags();
  
  const [roles, setRoles] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  
  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolesAPI.getAll();
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Auto-open modal for new feature creation
  useEffect(() => {
    if (isNewFeature) {
      setShowModal(true);
    }
  }, [isNewFeature]);

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || feature.status === statusFilter;
    const matchesPriority = !priorityFilter || feature.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreate = async (data) => {
    await createFeature(data);
    if (isNewFeature) {
      // Redirect back to project detail or features list
      if (projectId) {
        window.location.href = `/projects/${projectId}`;
      } else {
        window.location.href = '/features';
      }
    }
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setShowModal(true);
  };

  const handleUpdate = async (data) => {
    if (editingFeature) {
      await updateFeature(editingFeature.id, data);
      setEditingFeature(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
      await deleteFeature(id);
    }
  };

  const handleCreateRole = async (roleName) => {
    try {
      const response = await rolesAPI.create({ name: roleName, description: '' });
      setRoles([...roles, response.data]);
      toast.success('Role created successfully');
    } catch (err) {
      toast.error('Error creating role');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Features</h1>
          <p className="text-gray-600 mt-2">Manage your BDD features and user stories</p>
          {projectId && (
            <div className="mt-2">
              <span className="badge badge-primary">
                Filtered by project: {projects.find(p => p.id == projectId)?.name || projectId}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Feature
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search features..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>
        
        <select
          className="select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button className="btn btn-secondary">
          <Filter className="w-5 h-5 mr-2" />
          More Filters
        </button>
      </div>

      {/* Features Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredFeatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              modules={modules}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownloadBDD={downloadBDDFile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter || priorityFilter ? 'No features found' : 'No features yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter || priorityFilter
              ? 'Try adjusting your search or filter criteria' 
              : 'Create your first feature to start defining user stories'
            }
          </p>
          {!(searchTerm || statusFilter || priorityFilter) && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Feature
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <FeatureModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingFeature(null);
          if (isNewFeature) {
            // Redirect back when closing modal in new feature mode
            if (projectId) {
              window.location.href = `/projects/${projectId}`;
            } else {
              window.location.href = '/features';
            }
          }
        }}
        onSubmit={editingFeature ? handleUpdate : handleCreate}
        feature={editingFeature}
        projects={projects}
        modules={modules}
        tags={tags}
        roles={roles}
        onCreateRole={handleCreateRole}
        defaultProjectId={projectId}
        defaultModuleId={moduleId}
      />
    </div>
  );
}
