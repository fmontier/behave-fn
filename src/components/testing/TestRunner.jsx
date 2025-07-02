import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Play, 
  StopCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  Tags
} from 'lucide-react';
import toast from 'react-hot-toast';

const TestRunner = ({ 
  onRunTest, 
  loading = false,
  type = 'feature', // 'feature', 'scenario', 'project'
  itemId,
  itemName = '',
  availableTags = []
}) => {
  const { t } = useTranslation();
  const [testResults, setTestResults] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedFeatures, setExpandedFeatures] = useState(new Set());
  const [expandedScenarios, setExpandedScenarios] = useState(new Set());

  const handleRunTest = async () => {
    try {
      const tags = type === 'project' ? selectedTags : undefined;
      const result = await onRunTest(itemId, tags);
      setTestResults(result);
      
      if (result.test_result.success) {
        toast.success('Tests executed successfully');
      } else {
        toast.error('Tests failed');
      }
    } catch (error) {
      console.error('Test execution error:', error);
      toast.error('Error executing tests');
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleFeature = (featureIndex) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureIndex)) {
        newSet.delete(featureIndex);
      } else {
        newSet.add(featureIndex);
      }
      return newSet;
    });
  };

  const toggleScenario = (scenarioKey) => {
    setExpandedScenarios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scenarioKey)) {
        newSet.delete(scenarioKey);
      } else {
        newSet.add(scenarioKey);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'skipped':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatDuration = (duration) => {
    if (duration < 1) return `${Math.round(duration * 1000)}ms`;
    return `${duration.toFixed(2)}s`;
  };

  const downloadResults = () => {
    if (!testResults) return;
    
    const dataStr = JSON.stringify(testResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-results-${type}-${itemId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Test Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('testing.title')} - {itemName}
          </h3>
          
          <div className="flex items-center space-x-3">
            {testResults && (
              <button
                onClick={downloadResults}
                className="btn btn-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('testing.downloadResults')}
              </button>
            )}
            
            <button
              onClick={handleRunTest}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  {t('testing.running')}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {t('testing.runTests')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tag Selection for Project Tests */}
        {type === 'project' && availableTags.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tags className="w-4 h-4 inline mr-1" />
              {t('testing.filterByTags')}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {t('testing.selectedTags')}: {selectedTags.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {t('testing.results')}
              </h4>
              <div className="text-sm text-gray-500">
                {new Date(testResults.test_result.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Summary */}
            {testResults.test_result.behave_results && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.test_result.behave_results.total_scenarios}
                  </div>
                  <div className="text-sm text-gray-600">{t('testing.totalScenarios')}</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.test_result.behave_results.passed_scenarios}
                  </div>
                  <div className="text-sm text-gray-600">{t('testing.passed')}</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.test_result.behave_results.failed_scenarios}
                  </div>
                  <div className="text-sm text-gray-600">{t('testing.failed')}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {formatDuration(testResults.test_result.behave_results.duration)}
                  </div>
                  <div className="text-sm text-gray-600">{t('testing.duration')}</div>
                </div>
              </div>
            )}

            {/* Overall Status */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              testResults.test_result.success ? getStatusColor('passed') : getStatusColor('failed')
            }`}>
              {getStatusIcon(testResults.test_result.success ? 'passed' : 'failed')}
              <span className="ml-2">
                {testResults.test_result.success ? t('testing.allTestsPassed') : t('testing.someTestsFailed')}
              </span>
            </div>
          </div>

          {/* Detailed Results */}
          {testResults.test_result.behave_results && (
            <div className="p-6">
              <h5 className="font-medium text-gray-900 mb-4">{t('testing.detailedResults')}</h5>
              
              {testResults.test_result.behave_results.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="border border-gray-200 rounded-lg mb-4">
                  <button
                    onClick={() => toggleFeature(featureIndex)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {expandedFeatures.has(featureIndex) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 mr-2" />
                      )}
                      {getStatusIcon(feature.status)}
                      <span className="ml-3 font-medium">{feature.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {feature.scenarios.length} scenarios • {formatDuration(feature.duration)}
                    </div>
                  </button>

                  {expandedFeatures.has(featureIndex) && (
                    <div className="border-t border-gray-200 p-4">
                      {feature.scenarios.map((scenario, scenarioIndex) => {
                        const scenarioKey = `${featureIndex}-${scenarioIndex}`;
                        return (
                          <div key={scenarioIndex} className="mb-3 last:mb-0">
                            <button
                              onClick={() => toggleScenario(scenarioKey)}
                              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center">
                                {expandedScenarios.has(scenarioKey) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500 mr-2" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500 mr-2" />
                                )}
                                {getStatusIcon(scenario.status)}
                                <span className="ml-3">{scenario.name}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDuration(scenario.duration)}
                              </div>
                            </button>

                            {expandedScenarios.has(scenarioKey) && (
                              <div className="ml-6 mt-2 space-y-2">
                                {scenario.steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start space-x-3 p-2 rounded bg-gray-50">
                                    {getStatusIcon(step.status)}
                                    <div className="flex-1">
                                      <div className="text-sm">
                                        <span className="font-medium">{step.keyword}</span> {step.name}
                                      </div>
                                      {step.error && (
                                        <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                                          {step.error}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatDuration(step.duration)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Error Output */}
          {testResults.test_result.stderr && (
            <div className="p-6 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">{t('testing.errorOutput')}</h5>
              <pre className="bg-red-50 text-red-800 p-4 rounded-lg text-sm overflow-auto">
                {testResults.test_result.stderr}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestRunner;