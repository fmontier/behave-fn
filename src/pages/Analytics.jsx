import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectContext } from '../contexts/ProjectContext';
import { analyticsAPI } from '../services/api';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import {
  BarChart3,
  Calendar,
  Globe,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { t } = useTranslation();
  const { currentProject } = useContext(ProjectContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [globalAnalytics, setGlobalAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('project'); // 'project', 'global', 'time-based'
  const [timeRange, setTimeRange] = useState(30);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentProject && viewMode === 'project') {
      loadProjectAnalytics();
    } else if (viewMode === 'global') {
      loadGlobalAnalytics();
    } else if (viewMode === 'time-based') {
      loadTimeBasedAnalytics();
    }
  }, [currentProject, viewMode, timeRange]);

  const loadProjectAnalytics = async () => {
    if (!currentProject) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getEnhancedDashboard(currentProject.id);
      setAnalyticsData(response.data.dashboard);
    } catch (err) {
      console.error('Error loading project analytics:', err);
      setError(err.message);
      toast.error(t('analytics.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getGlobalAnalytics();
      setGlobalAnalytics(response.data.analytics);
    } catch (err) {
      console.error('Error loading global analytics:', err);
      setError(err.message);
      toast.error(t('analytics.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const loadTimeBasedAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectId = currentProject ? currentProject.id : null;
      const response = await analyticsAPI.getTimeBasedAnalytics(projectId, timeRange);
      setAnalyticsData(response.data.analytics);
    } catch (err) {
      console.error('Error loading time-based analytics:', err);
      setError(err.message);
      toast.error(t('analytics.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const dataToDownload = viewMode === 'global' ? globalAnalytics : analyticsData;
      if (!dataToDownload) return;

      const reportData = {
        project: currentProject?.name || 'Global',
        viewMode,
        timeRange,
        generatedAt: new Date().toISOString(),
        data: dataToDownload
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${viewMode}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(t('analytics.reportDownloaded'));
    } catch (err) {
      console.error('Error downloading report:', err);
      toast.error(t('analytics.errorDownloading'));
    }
  };

  const refreshData = () => {
    if (viewMode === 'project') {
      loadProjectAnalytics();
    } else if (viewMode === 'global') {
      loadGlobalAnalytics();
    } else if (viewMode === 'time-based') {
      loadTimeBasedAnalytics();
    }
  };

  const renderGlobalAnalytics = () => {
    if (!globalAnalytics) return null;

    return (
      <div className="space-y-8">
        {/* Projects Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('analytics.projectsActivity')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalAnalytics.projects_activity.slice(0, 6).map((project) => (
              <div key={project.project_id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">{project.project_name}</h4>
                <p className="text-2xl font-bold text-blue-600">{project.features_count}</p>
                <p className="text-sm text-gray-600">{t('features.title')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('analytics.qualityStats')}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('projects.title')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('analytics.totalScenarios')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('analytics.successRate')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {globalAnalytics.quality_stats.map((stat) => (
                  <tr key={stat.project_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.project_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.total_scenarios}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              stat.success_rate >= 80 ? 'bg-green-500' :
                              stat.success_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${stat.success_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900">{stat.success_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Used Tags */}
        {globalAnalytics.tags_usage.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('analytics.mostUsedTags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {globalAnalytics.tags_usage.map((tag) => (
                <span
                  key={tag.tag_id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag.tag_name}
                  <span className="ml-2 px-2 py-0.5 bg-blue-200 rounded-full text-xs">
                    {tag.usage_count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!currentProject && viewMode === 'project') {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('analytics.selectProject')}
          </h3>
          <p className="text-gray-600">
            {t('analytics.selectProjectDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('analytics.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {viewMode === 'project' && currentProject
              ? `${t('analytics.projectAnalytics')} - ${currentProject.name}`
              : viewMode === 'global'
              ? t('analytics.globalAnalytics')
              : t('analytics.timeBasedAnalytics')
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadReport}
            className="btn btn-secondary text-sm"
            disabled={loading || (!analyticsData && !globalAnalytics)}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('analytics.downloadReport')}
          </button>

          <button
            onClick={refreshData}
            className="btn btn-secondary text-sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setViewMode('project')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'project'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={!currentProject}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            {t('analytics.projectView')}
          </button>
          <button
            onClick={() => setViewMode('global')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'global'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="w-5 h-5 inline mr-2" />
            {t('analytics.globalView')}
          </button>
          <button
            onClick={() => setViewMode('time-based')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'time-based'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            {t('analytics.timeBasedView')}
          </button>
        </nav>
      </div>

      {/* Time Range Filter for Time-Based View */}
      {viewMode === 'time-based' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {t('analytics.timeRange')}:
            </span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>{t('analytics.last7Days')}</option>
              <option value={30}>{t('analytics.last30Days')}</option>
              <option value={90}>{t('analytics.last90Days')}</option>
              <option value={180}>{t('analytics.last180Days')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('analytics.errorLoading')}
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'global' ? (
        renderGlobalAnalytics()
      ) : (
        <AnalyticsDashboard
          analyticsData={analyticsData}
          loading={loading}
        />
      )}
    </div>
  );
}