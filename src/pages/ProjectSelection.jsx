import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/useApi';
import { useProject } from '../contexts/ProjectContext';
import { 
  FolderOpen, 
  Plus, 
  Calendar,
  Package,
  FileText,
  GitBranch,
  ArrowRight,
  Search
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ProjectCard = ({ project, onSelect }) => {
  const { t } = useTranslation();
  
  // Calculate project stats
  const moduleCount = project.modules?.length || 0;
  const featureCount = project.features?.length || 0;
  
  return (
    <div 
      className="card p-6 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
          <FolderOpen className="w-8 h-8 text-primary-600" />
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
      {project.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>{moduleCount} {t('modules.title')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>{featureCount} {t('features.title')}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center mt-4 text-sm text-gray-500">
        <Calendar className="w-4 h-4 mr-1" />
        <span>{t('common.created')} {new Date(project.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    await onCreate(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('projects.newProject')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('projects.projectName')} *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder={t('projects.projectNamePlaceholder')}
                    {...register('name', { required: t('projects.projectNameRequired') })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.description')}
                  </label>
                  <textarea
                    className="textarea w-full"
                    rows={3}
                    placeholder={t('projects.projectDescriptionPlaceholder')}
                    {...register('description')}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
              >
                {t('projects.createProject')}
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

export default function ProjectSelection() {
  const { t } = useTranslation();
  const { projects, loading, createProject } = useProjects();
  const { selectProject } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateProject = async (data) => {
    try {
      const newProject = await createProject(data);
      toast.success(t('messages.success.created'));
      selectProject(newProject);
    } catch (error) {
      toast.error(t('messages.error.create'));
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('projects.selectProject')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('projects.selectProjectDescription')}
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('projects.searchProjects')}
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('projects.newProject')}
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={selectProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? t('projects.noProjectsFound') : t('projects.noProjects')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? t('projects.tryDifferentSearch')
                : t('projects.createFirstProject')
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('projects.createYourFirstProject')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}