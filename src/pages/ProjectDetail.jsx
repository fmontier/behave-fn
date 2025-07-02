import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projectsAPI, modulesAPI, featuresAPI } from '../services/api';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calendar, 
  Tag, 
  Package,
  ChevronRight,
  ChevronDown,
  Download,
  Edit,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const FeatureCard = ({ feature, onDownloadBDD }) => {
  const { t } = useTranslation();

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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Link 
          to={`/features/${feature.id}`}
          className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
        >
          {feature.title}
        </Link>
        <button
          onClick={() => onDownloadBDD(feature.id)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 ml-2"
          title={t('features.downloadBDD')}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      
      {feature.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{feature.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`badge text-xs ${getStatusColor(feature.status)}`}>
            {t(`features.status.${feature.status}`)}
          </span>
          <span className={`badge text-xs ${getPriorityColor(feature.priority)}`}>
            {t(`features.priority.${feature.priority}`)}
          </span>
        </div>
        
        {feature.tags && feature.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="w-3 h-3 text-gray-400" />
            <div className="flex space-x-1">
              {feature.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                  title={tag.name}
                />
              ))}
              {feature.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{feature.tags.length - 2}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModuleCard = ({ module, features, onToggleExpand, expanded, onDownloadBDD, onCreateFeature }) => {
  const { t } = useTranslation();
  const moduleFeatures = features.filter(f => f.module_id === module.id);

  return (
    <div className="card border-l-4" style={{ borderLeftColor: module.color }}>
      <div className="p-6">
        {/* Module Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onToggleExpand(module.id)}
            className="flex items-center space-x-3 text-left flex-1 hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
          >
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: module.color }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
              {module.description && (
                <p className="text-gray-600 text-sm mt-1">{module.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {moduleFeatures.length} {moduleFeatures.length === 1 ? t('features.title').slice(0, -1) : t('features.title')}
              </span>
              {expanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>
          
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={() => onCreateFeature(module.id)}
              className="btn btn-sm btn-primary"
              title={t('features.newFeature')}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('features.newFeature')}
            </button>
          </div>
        </div>

        {/* Features List */}
        {expanded && (
          <div className="space-y-3">
            {moduleFeatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {moduleFeatures.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onDownloadBDD={onDownloadBDD}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">{t('features.noFeatures')}</p>
                <button
                  onClick={() => onCreateFeature(module.id)}
                  className="btn btn-sm btn-primary"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t('features.newFeature')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectResponse, modulesResponse, featuresResponse] = await Promise.all([
          projectsAPI.getById(id),
          modulesAPI.getAll(id),
          featuresAPI.getAll(id)
        ]);
        setProject(projectResponse.data);
        setModules(modulesResponse.data);
        setFeatures(featuresResponse.data);
        
        // Expand first module by default if exists
        if (modulesResponse.data.length > 0) {
          setExpandedModules(new Set([modulesResponse.data[0].id]));
        }
      } catch (err) {
        setError(err.message);
        toast.error(t('messages.error.load'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const handleToggleExpand = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

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

  const handleCreateFeature = (moduleId) => {
    // Redirect to create feature with pre-selected project and module
    window.location.href = `/features/new?project=${id}&module=${moduleId}`;
  };

  const handleCreateModule = () => {
    // Redirect to modules page with project filter
    window.location.href = `/modules?project=${id}`;
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('projects.notFound')}</h3>
          <p className="text-gray-600 mb-4">{t('projects.notFoundMessage')}</p>
          <Link to="/projects" className="btn btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('projects.backToProjects')}
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
        <span className="text-gray-900 font-medium">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link 
              to="/projects"
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          </div>
          {project.description && (
            <p className="text-gray-600">{project.description}</p>
          )}
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to={`/kanban?project=${id}`}
            className="btn btn-secondary"
          >
            <FileText className="w-5 h-5 mr-2" />
            {t('kanban.title')}
          </Link>
          <button 
            onClick={handleCreateModule}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('modules.newModule')}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{modules.length}</div>
          <div className="text-gray-600">{t('modules.title')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{features.length}</div>
          <div className="text-gray-600">{t('features.title')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {features.filter(f => f.status === 'completed').length}
          </div>
          <div className="text-gray-600">{t('features.status.completed')}</div>
        </div>
      </div>

      {/* Modules List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('modules.title')} ({modules.length})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setExpandedModules(new Set(modules.map(m => m.id)))}
              className="btn btn-sm btn-secondary"
            >
              {t('common.expandAll')}
            </button>
            <button
              onClick={() => setExpandedModules(new Set())}
              className="btn btn-sm btn-secondary"
            >
              {t('common.collapseAll')}
            </button>
          </div>
        </div>
        
        {modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                features={features}
                expanded={expandedModules.has(module.id)}
                onToggleExpand={handleToggleExpand}
                onDownloadBDD={handleDownloadBDD}
                onCreateFeature={handleCreateFeature}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('modules.noModulesYet')}</h3>
            <p className="text-gray-600 mb-6">
              {t('modules.createFirst')}
            </p>
            <button 
              onClick={handleCreateModule}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('modules.newModule')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}