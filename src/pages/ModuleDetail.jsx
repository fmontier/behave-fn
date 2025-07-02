import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { modulesAPI, featuresAPI, projectsAPI, tagsAPI, rolesAPI } from '../services/api';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calendar, 
  Tag, 
  Package,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const FeatureCard = ({ feature, onEdit, onDelete, onDownloadBDD }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

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
              <p><strong>{t('features.asA')}:</strong> {feature.roles.map(r => r.name).join(', ')}</p>
              <p><strong>{t('features.iWant')}:</strong> {feature.i_want}</p>
              <p><strong>{t('features.soThat')}:</strong> {feature.so_that}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className={`badge ${getStatusColor(feature.status)}`}>
                {t(`features.status.${feature.status}`)}
              </span>
              <span className={`badge ${getPriorityColor(feature.priority)}`}>
                {t(`features.priority.${feature.priority}`)}
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
          
          <div className="flex items-center mt-3 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(feature.created_at).toLocaleDateString()}</span>
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
                <Link
                  to={`/features/${feature.id}`}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.view')}
                </Link>
                <button
                  onClick={() => {
                    onDownloadBDD(feature.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('features.downloadBDD')}
                </button>
                <button
                  onClick={() => {
                    onEdit(feature);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('features.editFeature')}
                </button>
                <button
                  onClick={() => {
                    onDelete(feature.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureModal = ({ isOpen, onClose, onSubmit, feature, project, module, tags, roles, onCreateRole }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: feature || { 
      title: '', 
      description: '', 
      i_want: '', 
      so_that: '',
      priority: 'medium',
      status: 'draft',
      project_id: project?.id || '',
      module_id: module?.id || '',
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
        project_id: project?.id || '',
        module_id: module?.id || '',
        tag_ids: [],
        role_ids: []
      });
    }
  }, [feature, project, module, reset]);

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
                {feature ? t('features.editFeature') : t('features.newFeature')}
              </h3>
              
              <div className="space-y-8">
                {/* Información Básica */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    📋 Información Básica
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('features.featureTitle')} *
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
                        {t('common.description')}
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
                        🎚️ {t('features.priority')}
                      </label>
                      <select className="select w-full" {...register('priority')}>
                        <option value="low">{t('features.priority.low')}</option>
                        <option value="medium">{t('features.priority.medium')}</option>
                        <option value="high">{t('features.priority.high')}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📊 {t('common.status')}
                      </label>
                      <select className="select w-full" {...register('status')}>
                        <option value="draft">{t('features.status.draft')}</option>
                        <option value="in_progress">{t('features.status.in_progress')}</option>
                        <option value="completed">{t('features.status.completed')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏷️ {t('features.tags')}
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
                {feature ? t('features.editFeature') : t('features.newFeature')}
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
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function ModuleDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [project, setProject] = useState(null);
  const [features, setFeatures] = useState([]);
  const [tags, setTags] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const moduleResponse = await modulesAPI.getById(id);
        const moduleData = moduleResponse.data;
        setModule(moduleData);

        const [projectResponse, featuresResponse, tagsResponse, rolesResponse] = await Promise.all([
          projectsAPI.getById(moduleData.project_id),
          featuresAPI.getAll(), // We'll filter by module_id on frontend
          tagsAPI.getAll(),
          rolesAPI.getAll()
        ]);
        
        setProject(projectResponse.data);
        setTags(tagsResponse.data);
        setRoles(rolesResponse.data);
        // Filter features by module_id
        setFeatures(featuresResponse.data.filter(f => f.module_id === parseInt(id)));
      } catch (err) {
        setError(err.message);
        toast.error(t('messages.error.load'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const handleDownloadBDD = async (featureId) => {
    try {
      const response = await featuresAPI.getBDDFile(featureId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feature_${featureId}.feature`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('messages.success.created'));
    } catch (err) {
      toast.error(t('messages.error.create'));
    }
  };

  const handleEditFeature = (feature) => {
    setEditingFeature(feature);
    setShowModal(true);
  };

  const handleUpdateFeature = async (data) => {
    if (editingFeature) {
      try {
        const response = await featuresAPI.update(editingFeature.id, data);
        setFeatures(features.map(f => f.id === editingFeature.id ? response.data : f));
        setEditingFeature(null);
        toast.success(t('messages.success.updated'));
      } catch (err) {
        toast.error(t('messages.error.update'));
      }
    }
  };

  const handleCreateFeatureFromModal = async (data) => {
    try {
      const response = await featuresAPI.create(data);
      setFeatures([...features, response.data]);
      toast.success(t('messages.success.created'));
    } catch (err) {
      toast.error(t('messages.error.create'));
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (window.confirm(t('messages.confirm.delete'))) {
      try {
        await featuresAPI.delete(featureId);
        setFeatures(features.filter(f => f.id !== featureId));
        toast.success(t('messages.success.deleted'));
      } catch (err) {
        toast.error(t('messages.error.delete'));
      }
    }
  };

  const handleCreateFeature = () => {
    setEditingFeature(null);
    setShowModal(true);
  };

  const handleCreateRole = async (roleName) => {
    try {
      const response = await rolesAPI.create({ name: roleName, description: '' });
      setRoles([...roles, response.data]);
      toast.success(t('messages.success.created'));
    } catch (err) {
      toast.error(t('messages.error.create'));
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !module || !project) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('modules.notFound')}</h3>
          <p className="text-gray-600 mb-4">{t('modules.notFoundMessage')}</p>
          <Link to="/modules" className="btn btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('modules.backToModules')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/projects" className="hover:text-gray-700">{t('projects.title')}</Link>
        <span>/</span>
        <Link to={`/projects/${project.id}`} className="hover:text-gray-700">{project.name}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{module.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link 
              to={`/projects/${project.id}`}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: module.color }}
            />
            <h1 className="text-3xl font-bold text-gray-900">{module.name}</h1>
          </div>
          {module.description && (
            <p className="text-gray-600">{module.description}</p>
          )}
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(module.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to={`/kanban?project=${project.id}&module=${id}`}
            className="btn btn-secondary"
          >
            <FileText className="w-5 h-5 mr-2" />
            {t('kanban.title')}
          </Link>
          <button 
            onClick={handleCreateFeature}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('features.newFeature')}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{features.length}</div>
          <div className="text-gray-600">{t('features.title')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {features.filter(f => f.status === 'draft').length}
          </div>
          <div className="text-gray-600">{t('features.status.draft')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {features.filter(f => f.status === 'in_progress').length}
          </div>
          <div className="text-gray-600">{t('features.status.in_progress')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {features.filter(f => f.status === 'completed').length}
          </div>
          <div className="text-gray-600">{t('features.status.completed')}</div>
        </div>
      </div>

      {/* Features List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('features.title')} ({features.length})
          </h2>
        </div>
        
        {features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onEdit={handleEditFeature}
                onDelete={handleDeleteFeature}
                onDownloadBDD={handleDownloadBDD}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('features.noFeatures')}</h3>
            <p className="text-gray-600 mb-6">
              {t('features.createFirst')}
            </p>
            <button 
              onClick={handleCreateFeature}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('features.newFeature')}
            </button>
          </div>
        )}
      </div>

      {/* Feature Modal */}
      <FeatureModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingFeature(null);
        }}
        onSubmit={editingFeature ? handleUpdateFeature : handleCreateFeatureFromModal}
        feature={editingFeature}
        project={project}
        module={module}
        tags={tags}
        roles={roles}
        onCreateRole={handleCreateRole}
      />
    </div>
  );
}