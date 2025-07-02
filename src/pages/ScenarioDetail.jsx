import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { scenariosAPI } from '../services/api';
import { 
  ArrowLeft, 
  Edit, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  Tag,
  GitBranch
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScenarioDetail() {
  const { id } = useParams();
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setLoading(true);
        const response = await scenariosAPI.getById(id);
        setScenario(response.data);
      } catch (err) {
        setError(err.message);
        toast.error('Error loading scenario details');
      } finally {
        setLoading(false);
      }
    };

    fetchScenario();
  }, [id]);

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

  const handleRunTest = () => {
    // This would integrate with actual test runner
    toast.success('Test execution would start here');
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="card p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Scenario Not Found</h3>
          <p className="text-gray-600 mb-4">The scenario you're looking for doesn't exist.</p>
          <Link to="/scenarios" className="btn btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Scenarios
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(scenario.status);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/scenarios" className="hover:text-gray-700">Scenarios</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{scenario.title}</span>
      </div>

      {/* Header */}
      <div className="card p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Link 
                to="/scenarios"
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{scenario.title}</h1>
            </div>
            
            {scenario.description && (
              <p className="text-gray-600 mb-4">{scenario.description}</p>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <span className={`badge ${getStatusColor(scenario.status)} flex items-center`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {scenario.status}
              </span>
              
              {scenario.tags && scenario.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex space-x-2">
                    {scenario.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: tag.color + '20', 
                          color: tag.color 
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                Created {new Date(scenario.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleRunTest}
              className="btn btn-secondary"
            >
              <Play className="w-5 h-5 mr-2" />
              Run Test
            </button>
            <button className="btn btn-secondary">
              <Edit className="w-5 h-5 mr-2" />
              Edit Scenario
            </button>
          </div>
        </div>
      </div>

      {/* BDD Steps */}
      <div className="space-y-6">
        {/* Given Steps */}
        {scenario.given_steps && (
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-600">Given (Preconditions)</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <pre className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                {scenario.given_steps}
              </pre>
            </div>
          </div>
        )}

        {/* When Steps */}
        {scenario.when_steps && (
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 font-bold text-sm">W</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-600">When (Actions)</h3>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <pre className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                {scenario.when_steps}
              </pre>
            </div>
          </div>
        )}

        {/* Then Steps */}
        {scenario.then_steps && (
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold text-sm">T</span>
              </div>
              <h3 className="text-lg font-semibold text-green-600">Then (Expected Results)</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <pre className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                {scenario.then_steps}
              </pre>
            </div>
          </div>
        )}

        {/* BDD Format Preview */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <GitBranch className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">BDD Format Preview</h3>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
            <div className="text-gray-800">
              <div className="mb-2">
                <span className="text-purple-600 font-bold">Scenario:</span> {scenario.title}
              </div>
              {scenario.description && (
                <div className="mb-2 text-gray-600 ml-2">{scenario.description}</div>
              )}
              
              {scenario.given_steps && (
                <div className="mb-2">
                  {scenario.given_steps.split('\n').map((step, index) => (
                    step.trim() && (
                      <div key={index} className="ml-2">
                        <span className="text-blue-600 font-bold">Given</span> {step.trim()}
                      </div>
                    )
                  ))}
                </div>
              )}
              
              {scenario.when_steps && (
                <div className="mb-2">
                  {scenario.when_steps.split('\n').map((step, index) => (
                    step.trim() && (
                      <div key={index} className="ml-2">
                        <span className="text-orange-600 font-bold">When</span> {step.trim()}
                      </div>
                    )
                  ))}
                </div>
              )}
              
              {scenario.then_steps && (
                <div className="mb-2">
                  {scenario.then_steps.split('\n').map((step, index) => (
                    step.trim() && (
                      <div key={index} className="ml-2">
                        <span className="text-green-600 font-bold">Then</span> {step.trim()}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test History - Placeholder for future implementation */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Execution History</h3>
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No test execution history available</p>
            <p className="text-sm mt-2">Run tests to see execution results here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
