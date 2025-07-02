import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProject } from '../contexts/ProjectContext';
import { useModules, useProjects } from '../hooks/useApi';
import { 
  Plus, 
  Package, 
  Calendar, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  MoreVertical,
  Eye
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const ModuleCard = ({ module, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: module.color }}
            ></div>
            <Link 
              to={`/project/${module.project_id}/modules/${module.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {module.name}
            </Link>
          </div>
          <p className="text-gray-600 mt-1 line-clamp-2">{module.description}</p>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(module.created_at).toLocaleDateString()}</span>
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
                  to={`/modules/${module.id}`}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.view')}
                </Link>
                <button
                  onClick={() => {
                    onEdit(module);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('modules.editModule')}
                </button>
                <button
                  onClick={() => {
                    onDelete(module.id);
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

const ModuleModal = ({ isOpen, onClose, onSubmit, module, projectId, projectName }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: module || { 
      name: '', 
      description: '', 
      color: '#007bff',
      project_id: projectId
    }
  });

  React.useEffect(() => {
    if (module) {
      reset(module);
    } else {
      reset({ 
        name: '', 
        description: '', 
        color: '#007bff',
        project_id: projectId
      });
    }
  }, [module, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
    onClose();
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {module ? t('modules.editModule') : t('modules.newModule')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('modules.moduleName')} *
                  </label>
                  <input
                    type="text"
                    className="input"
                    {...register('name', { required: 'Module name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.description')}
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    {...register('description')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('projects.title')}
                  </label>
                  <input
                    type="hidden"
                    {...register('project_id')}
                    value={projectId}
                  />
                  <input
                    type="text"
                    className="input bg-gray-100"
                    value={projectName || ''}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('modules.color')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      {...register('color')}
                    />
                    <input
                      type="text"
                      className="input flex-1"
                      {...register('color')}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
              >
                {module ? t('modules.editModule') : t('modules.newModule')}
              </button>
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

export default function Modules() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { selectedProject } = useProject();
  const { modules, loading, createModule, updateModule, deleteModule } = useModules(projectId);
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreate = async (data) => {
    await createModule({
      ...data,
      project_id: parseInt(projectId)
    });
  };

  const handleEdit = (module) => {
    setEditingModule(module);
    setShowModal(true);
  };

  const handleUpdate = async (data) => {
    if (editingModule) {
      await updateModule(editingModule.id, data);
      setEditingModule(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('messages.confirm.delete'))) {
      await deleteModule(id);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('modules.title')}</h1>
          <p className="text-gray-600 mt-2">{t('modules.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('modules.newModule')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('modules.searchModules')}
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Modules Grid */}
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
      ) : filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? t('modules.noModules') 
              : t('modules.noModulesYet')
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? t('modules.adjustFilters')
              : t('modules.createFirst')
            }
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('modules.newModule')}
          </button>
        </div>
      )}

      {/* Modal */}
      <ModuleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingModule(null);
        }}
        onSubmit={editingModule ? handleUpdate : handleCreate}
        module={editingModule}
        projectId={projectId}
        projectName={selectedProject?.name}
      />
    </div>
  );
}