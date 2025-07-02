import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { featuresAPI, scenariosAPI, modulesAPI, projectsAPI, tagsAPI, testingAPI } from '../services/api';
import { useForm } from 'react-hook-form';
import TestRunner from '../components/testing/TestRunner';
import { 
  ArrowLeft, 
  Plus, 
  GitBranch, 
  Download,
  Edit,
  Tag,
  Calendar,
  FileText,
  Package,
  Eye,
  Trash2,
  MoreVertical,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

const ScenarioCard = ({ scenario, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <Link 
              to={`/scenarios/${scenario.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {scenario.title}
            </Link>
            <span className={`badge ${getStatusColor(scenario.status)}`}>
              {t(`scenarios.status.${scenario.status}`)}
            </span>
          </div>
          
          {scenario.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>
          )}
          
          <div className="space-y-3 text-sm">
            {scenario.given_steps && (
              <div>
                <span className="font-medium text-blue-600">{t('scenarios.givenSteps')}:</span>
                <p className="text-gray-700 mt-1 line-clamp-2">{scenario.given_steps}</p>
              </div>
            )}
            {scenario.when_steps && (
              <div>
                <span className="font-medium text-green-600">{t('scenarios.whenSteps')}:</span>
                <p className="text-gray-700 mt-1 line-clamp-2">{scenario.when_steps}</p>
              </div>
            )}
            {scenario.then_steps && (
              <div>
                <span className="font-medium text-purple-600">{t('scenarios.thenSteps')}:</span>
                <p className="text-gray-700 mt-1 line-clamp-2">{scenario.then_steps}</p>
              </div>
            )}
          </div>

          {scenario.tags && scenario.tags.length > 0 && (
            <div className="flex items-center space-x-1 mt-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex space-x-1">
                {scenario.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                    title={tag.name}
                  />
                ))}
                {scenario.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{scenario.tags.length - 3}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center mt-3 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(scenario.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="relative ml-2">
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
                  to={`/scenarios/${scenario.id}`}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.view')}
                </Link>
                <button
                  onClick={() => {
                    onEdit(scenario);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('scenarios.editScenario')}
                </button>
                <button
                  onClick={() => {
                    onDelete(scenario.id);
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

const ScenarioModal = ({ isOpen, onClose, onSubmit, scenario, feature, tags }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: scenario || { 
      title: '', 
      description: '', 
      given_steps: '', 
      when_steps: '', 
      then_steps: '',
      status: 'draft',
      feature_id: feature?.id || '',
      tag_ids: []
    }
  });

  React.useEffect(() => {
    if (scenario) {
      reset({
        ...scenario,
        tag_ids: scenario.tags?.map(tag => tag.id) || []
      });
    } else {
      reset({ 
        title: '', 
        description: '', 
        given_steps: '', 
        when_steps: '', 
        then_steps: '',
        status: 'draft',
        feature_id: feature?.id || '',
        tag_ids: []
      });
    }
  }, [scenario, feature, reset]);

  const onFormSubmit = (data) => {
    data.tag_ids = data.tag_ids.map(id => parseInt(id));
    data.feature_id = parseInt(data.feature_id);
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {scenario ? t('scenarios.editScenario') : t('scenarios.newScenario')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('scenarios.scenarioTitle')} *
                  </label>
                  <input
                    type="text"
                    className="input"
                    {...register('title', { required: 'Scenario title is required' })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
                    {t('scenarios.givenSteps')}
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Given that..."
                    {...register('given_steps')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('scenarios.whenSteps')}
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="When I..."
                    {...register('when_steps')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('scenarios.thenSteps')}
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Then I should see..."
                    {...register('then_steps')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('common.status')}
                    </label>
                    <select className="select" {...register('status')}>
                      <option value="draft">{t('scenarios.status.draft')}</option>
                      <option value="ready">{t('scenarios.status.ready')}</option>
                      <option value="passed">{t('scenarios.status.passed')}</option>
                      <option value="failed">{t('scenarios.status.failed')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('features.tags')}
                    </label>
                    <select 
                      multiple 
                      className="select min-h-[80px]" 
                      {...register('tag_ids')}
                    >
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
              >
                {scenario ? t('scenarios.editScenario') : t('scenarios.newScenario')}
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

export default function FeatureDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [feature, setFeature] = useState(null);
  const [module, setModule] = useState(null);
  const [project, setProject] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'scenarios', 'tests'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featureResponse = await featuresAPI.getById(id);
        const featureData = featureResponse.data;
        setFeature(featureData);

        // Get scenarios and tags for this feature
        const [scenariosResponse, tagsResponse] = await Promise.all([
          scenariosAPI.getAll(),
          tagsAPI.getAll()
        ]);
        setScenarios(scenariosResponse.data.filter(s => s.feature_id === parseInt(id)));
        setTags(tagsResponse.data);

        // Get module and project information
        if (featureData.module_id) {
          const moduleResponse = await modulesAPI.getById(featureData.module_id);
          const moduleData = moduleResponse.data;
          setModule(moduleData);

          const projectResponse = await projectsAPI.getById(moduleData.project_id);
          setProject(projectResponse.data);
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

  const handleDownloadBDD = async () => {
    try {
      const response = await featuresAPI.getBDDFile(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feature_${id}.feature`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('messages.success.created'));
    } catch (err) {
      toast.error(t('messages.error.create'));
    }
  };

  const handleEditScenario = (scenario) => {
    setEditingScenario(scenario);
    setShowModal(true);
  };

  const handleUpdateScenario = async (data) => {
    if (editingScenario) {
      try {
        const response = await scenariosAPI.update(editingScenario.id, data);
        setScenarios(scenarios.map(s => s.id === editingScenario.id ? response.data : s));
        setEditingScenario(null);
        toast.success(t('messages.success.updated'));
      } catch (err) {
        toast.error(t('messages.error.update'));
      }
    }
  };

  const handleCreateScenarioFromModal = async (data) => {
    try {
      const response = await scenariosAPI.create(data);
      setScenarios([...scenarios, response.data]);
      toast.success(t('messages.success.created'));
    } catch (err) {
      toast.error(t('messages.error.create'));
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    if (window.confirm(t('messages.confirm.delete'))) {
      try {
        await scenariosAPI.delete(scenarioId);
        setScenarios(scenarios.filter(s => s.id !== scenarioId));
        toast.success(t('messages.success.deleted'));
      } catch (err) {
        toast.error(t('messages.error.delete'));
      }
    }
  };

  const handleCreateScenario = () => {
    setEditingScenario(null);
    setShowModal(true);
  };

  const handleRunFeatureTest = async (featureId) => {
    try {
      setTestLoading(true);
      const response = await testingAPI.runFeatureTest(featureId);
      return response.data;
    } catch (error) {
      console.error('Test execution error:', error);
      throw error;
    } finally {
      setTestLoading(false);
    }
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

  if (error || !feature) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.notFound')}</h3>
          <p className="text-gray-600 mb-4">{t('features.notFoundMessage')}</p>
          <Link to="/features" className="btn btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('features.backToFeatures')}
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
        {project && (
          <>
            <Link to={`/projects/${project.id}`} className="hover:text-gray-700">{project.name}</Link>
            <span>/</span>
          </>
        )}
        {module && (
          <>
            <Link to={`/modules/${module.id}`} className="hover:text-gray-700">{module.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{feature.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link 
              to={module ? `/modules/${module.id}` : '/features'}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            {module && (
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: module.color }}
                title={module.name}
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900">{feature.title}</h1>
          </div>
          {feature.description && (
            <p className="text-gray-600 mb-4">{feature.description}</p>
          )}

          {/* User Story */}
          {feature.roles && feature.roles.length > 0 && feature.i_want && feature.so_that && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">{t('features.userStory')}</h3>
              <div className="text-sm space-y-1">
                <p><strong>{t('features.asA')}:</strong> {feature.roles.map(r => r.name).join(', ')}</p>
                <p><strong>{t('features.iWant')}:</strong> {feature.i_want}</p>
                <p><strong>{t('features.soThat')}:</strong> {feature.so_that}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <span className={`badge ${getStatusColor(feature.status)}`}>
              {t(`features.status.${feature.status}`)}
            </span>
            <span className={`badge ${getPriorityColor(feature.priority)}`}>
              {t(`features.priority.${feature.priority}`)}
            </span>
            {feature.tags && feature.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex space-x-1">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                      title={tag.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{t('common.created')} {new Date(feature.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadBDD}
            className="btn btn-secondary"
          >
            <Download className="w-5 h-5 mr-2" />
            {t('features.downloadBDD')}
          </button>
          <button 
            onClick={handleCreateScenario}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('scenarios.newScenario')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            {t('common.details')}
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scenarios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <GitBranch className="w-5 h-5 inline mr-2" />
            {t('scenarios.title')} ({scenarios.length})
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Play className="w-5 h-5 inline mr-2" />
            {t('testing.title')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <>
          {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{scenarios.length}</div>
          <div className="text-gray-600">{t('scenarios.title')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {scenarios.filter(s => s.status === 'draft').length}
          </div>
          <div className="text-gray-600">{t('scenarios.status.draft')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {scenarios.filter(s => s.status === 'ready').length}
          </div>
          <div className="text-gray-600">{t('scenarios.status.ready')}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {scenarios.filter(s => s.status === 'passed').length}
          </div>
          <div className="text-gray-600">{t('scenarios.status.passed')}</div>
        </div>
      </div>

        </>
      )}

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('scenarios.title')} ({scenarios.length})
            </h2>
            <button 
              onClick={handleCreateScenario}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('scenarios.newScenario')}
            </button>
          </div>
          
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onEdit={handleEditScenario}
                  onDelete={handleDeleteScenario}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card">
              <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('scenarios.noScenarios')}</h3>
              <p className="text-gray-600 mb-6">
                {t('scenarios.createFirst')}
              </p>
              <button 
                onClick={handleCreateScenario}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('scenarios.newScenario')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <TestRunner
          type="feature"
          itemId={feature.id}
          itemName={feature.title}
          onRunTest={handleRunFeatureTest}
          loading={testLoading}
        />
      )}

      {/* Scenario Modal */}
      <ScenarioModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingScenario(null);
        }}
        onSubmit={editingScenario ? handleUpdateScenario : handleCreateScenarioFromModal}
        scenario={editingScenario}
        feature={feature}
        tags={tags}
      />
    </div>
  );
}