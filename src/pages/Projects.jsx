import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/useApi';
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link 
            to={`/projects/${project.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {project.name}
          </Link>
          <p className="text-gray-600 mt-1 line-clamp-2">{project.description}</p>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(project.created_at).toLocaleDateString()}</span>
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
                    onEdit(project);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('projects.editProject')}
                </button>
                <button
                  onClick={() => {
                    onDelete(project.id);
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

const ProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: project || { name: '', description: '' }
  });

  React.useEffect(() => {
    if (project) {
      reset(project);
    } else {
      reset({ name: '', description: '' });
    }
  }, [project, reset]);

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
{project ? t('projects.editProject') : t('projects.newProject')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('projects.projectName')} *
                  </label>
                  <input
                    type="text"
                    className="input"
                    {...register('name', { required: 'Project name is required' })}
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
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
              >
{project ? t('projects.editProject') : t('projects.newProject')}
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

export default function Projects() {
  const { t } = useTranslation();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data) => {
    await createProject(data);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleUpdate = async (data) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
      setEditingProject(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('messages.confirm.delete'))) {
      await deleteProject(id);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('projects.title')}</h1>
          <p className="text-gray-600 mt-2">{t('projects.title')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
{t('projects.newProject')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('common.search')}
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter className="w-5 h-5 mr-2" />
{t('common.filter')}
        </button>
      </div>

      {/* Projects Grid */}
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
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
{searchTerm ? t('projects.noProjects') : t('projects.noProjects')}
          </h3>
          <p className="text-gray-600 mb-6">
{searchTerm 
              ? t('common.search') 
              : t('projects.createFirst')
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
{t('projects.createFirst')}
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <ProjectModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        project={editingProject}
      />
    </div>
  );
}
