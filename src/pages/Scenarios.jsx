import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useScenarios, useFeatures, useTags } from '../hooks/useApi';
import { 
  Plus, 
  GitBranch, 
  Calendar, 
  Tag, 
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Play,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const ScenarioCard = ({ scenario, onEdit, onDelete, onRunTest }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'passing': return 'bg-green-100 text-green-800';
      case 'failing': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passing': return CheckCircle;
      case 'failing': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(scenario.status);

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <Link 
              to={`/scenarios/${scenario.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {scenario.title}
            </Link>
            <div className="flex items-center space-x-2">
              <span className={`badge ${getStatusColor(scenario.status)} flex items-center`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {scenario.status}
              </span>
            </div>
          </div>
          
          {scenario.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>
          )}
          
          <div className="space-y-3 text-sm">
            {scenario.given_steps && (
              <div>
                <span className="font-medium text-blue-600">Given:</span>
                <p className="text-gray-700 mt-1 line-clamp-2">{scenario.given_steps}</p>
              </div>
            )}
            
            {scenario.when_steps && (
              <div>
                <span className="font-medium text-orange-600">When:</span>
                <p className="text-gray-700 mt-1 line-clamp-2">{scenario.when_steps}</p>
              </div>
            )}
            
            {scenario.then_steps && (
              <div>
                <span className="font-medium text-green-600">Then:</span>
                <p className="text-gray-700 mt-1 line-clamp-2">{scenario.then_steps}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Created {new Date(scenario.created_at).toLocaleDateString()}</span>
            </div>
            
            {scenario.tags && scenario.tags.length > 0 && (
              <div className="flex items-center space-x-1">
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
          </div>
        </div>
        
        <div className="relative ml-4">
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
                    onRunTest(scenario.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </button>
                <button
                  onClick={() => {
                    onEdit(scenario);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Scenario
                </button>
                <button
                  onClick={() => {
                    onDelete(scenario.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Scenario
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ScenarioModal = ({ isOpen, onClose, onSubmit, scenario, features, tags }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: scenario || { 
      title: '', 
      description: '', 
      given_steps: '', 
      when_steps: '', 
      then_steps: '',
      status: 'draft',
      feature_id: '',
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
        feature_id: '',
        tag_ids: []
      });
    }
  }, [scenario, reset]);

  const onFormSubmit = (data) => {
    // Convert tag_ids from strings to numbers
    data.tag_ids = data.tag_ids.map(id => parseInt(id));
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {scenario ? 'Edit Scenario' : 'Create New Scenario'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scenario Title *
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
                      Feature *
                    </label>
                    <select
                      className="select"
                      {...register('feature_id', { required: 'Feature is required' })}
                    >
                      <option value="">Select a feature</option>
                      {features.map((feature) => (
                        <option key={feature.id} value={feature.id}>
                          {feature.title}
                        </option>
                      ))}
                    </select>
                    {errors.feature_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.feature_id.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="textarea"
                    rows={2}
                    {...register('description')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Given Steps (Preconditions)
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Given I am logged in as a user..."
                    {...register('given_steps')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-1">
                    When Steps (Actions)
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="When I click on the login button..."
                    {...register('when_steps')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">
                    Then Steps (Expected Results)
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Then I should be redirected to the dashboard..."
                    {...register('then_steps')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="select" {...register('status')}>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="passing">Passing</option>
                      <option value="failing">Failing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
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
                {scenario ? 'Update Scenario' : 'Create Scenario'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function Scenarios() {
  const [searchParams] = useSearchParams();
  const featureId = searchParams.get('feature');
  
  const { scenarios, loading, createScenario, updateScenario, deleteScenario } = useScenarios(featureId);
  const { features } = useFeatures();
  const { tags } = useTags();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || scenario.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (data) => {
    await createScenario(data);
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setShowModal(true);
  };

  const handleUpdate = async (data) => {
    if (editingScenario) {
      await updateScenario(editingScenario.id, data);
      setEditingScenario(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scenario? This action cannot be undone.')) {
      await deleteScenario(id);
    }
  };

  const handleRunTest = (id) => {
    // This would integrate with actual test runner
    console.log('Running test for scenario:', id);
    // For now, just show a toast
    toast.success('Test execution would start here');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scenarios</h1>
          <p className="text-gray-600 mt-2">Manage your BDD test scenarios</p>
          {featureId && (
            <div className="mt-2">
              <span className="badge badge-primary">
                Filtered by feature: {features.find(f => f.id == featureId)?.title || featureId}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Scenario
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search scenarios..."
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
          <option value="pending">Pending</option>
          <option value="passing">Passing</option>
          <option value="failing">Failing</option>
        </select>
        
        <button className="btn btn-secondary">
          <Filter className="w-5 h-5 mr-2" />
          More Filters
        </button>
      </div>

      {/* Scenarios Grid */}
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
      ) : filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRunTest={handleRunTest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter ? 'No scenarios found' : 'No scenarios yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filter criteria' 
              : 'Create your first scenario to start defining test cases'
            }
          </p>
          {!(searchTerm || statusFilter) && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Scenario
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <ScenarioModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingScenario(null);
        }}
        onSubmit={editingScenario ? handleUpdate : handleCreate}
        scenario={editingScenario}
        features={features}
        tags={tags}
      />
    </div>
  );
}
