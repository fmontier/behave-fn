import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { useStats } from '../hooks/useApi';
import { 
  FolderOpen, 
  FileText, 
  GitBranch, 
  BarChart3,
  TrendingUp,
  CheckCircle,
  Package,
  AlertCircle,
  Clock,
  XCircle,
  Settings
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'primary', change, changeType, to }) => {
  const CardContent = () => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="card p-6">
      <CardContent />
    </div>
  );
};

const StatusBadge = ({ status, count }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
      case 'passing':
        return { color: 'green', icon: CheckCircle, label: 'Completed' };
      case 'in_progress':
        return { color: 'blue', icon: Clock, label: 'In Progress' };
      case 'draft':
      case 'pending':
        return { color: 'gray', icon: AlertCircle, label: 'Draft' };
      case 'blocked':
      case 'failing':
        return { color: 'red', icon: XCircle, label: 'Blocked' };
      default:
        return { color: 'gray', icon: AlertCircle, label: status };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 text-${config.color}-500`} />
        <span className="text-sm font-medium text-gray-700 capitalize">
          {config.label}
        </span>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${config.color}-100 text-${config.color}-800`}>
        {count}
      </span>
    </div>
  );
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { selectedProject } = useProject();
  const { stats, loading, error } = useStats(projectId);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.dashboard')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.title')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {selectedProject ? `${selectedProject.name} - ${t('nav.dashboard')}` : t('nav.dashboard')}
        </h1>
        <p className="text-gray-600 mt-2">{t('dashboard.title')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title={t('dashboard.stats.totalProjects')}
          value={stats?.total_projects || 1}
          icon={FolderOpen}
          color="primary"
          to="/"
        />
        <StatCard
          title="Total Módulos"
          value={stats?.total_modules || 0}
          icon={Package}
          color="orange"
          to={`/project/${projectId}/modules`}
        />
        <StatCard
          title={t('dashboard.stats.totalFeatures')}
          value={stats?.total_features || 0}
          icon={FileText}
          color="blue"
          to={`/project/${projectId}/features`}
        />
        <StatCard
          title={t('dashboard.stats.totalScenarios')}
          value={stats?.total_scenarios || 0}
          icon={GitBranch}
          color="green"
          to={`/project/${projectId}/kanban`}
        />
        <StatCard
          title="Test Coverage"
          value={`${Math.round(((stats?.scenarios_by_status?.passing || 0) / Math.max(stats?.total_scenarios || 1, 1)) * 100)}%`}
          icon={BarChart3}
          color="purple"
          to={`/project/${projectId}/kanban`}
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features Status */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.stats.featuresStatus')}</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.features_by_status && Object.keys(stats.features_by_status).length > 0 ? (
              Object.entries(stats.features_by_status).map(([status, count]) => (
                <StatusBadge key={status} status={status} count={count} />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{t('features.noFeatures')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scenarios Status */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.stats.scenariosStatus')}</h3>
            <GitBranch className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.scenarios_by_status && Object.keys(stats.scenarios_by_status).length > 0 ? (
              Object.entries(stats.scenarios_by_status).map(([status, count]) => (
                <StatusBadge key={status} status={status} count={count} />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{t('scenarios.noScenarios')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to={`/project/${projectId}/settings`}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Configuración del Proyecto</h4>
                <p className="text-sm text-gray-600">Gestionar proyecto actual</p>
              </div>
            </Link>
            <Link
              to={`/project/${projectId}/modules`}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">{t('nav.modules')}</h4>
                <p className="text-sm text-gray-600">{t('dashboard.quickActions.newModule')}</p>
              </div>
            </Link>
            <Link
              to={`/project/${projectId}/kanban`}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">{t('nav.kanban')}</h4>
                <p className="text-sm text-gray-600">{t('dashboard.quickActions.manageWorkflow')}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
