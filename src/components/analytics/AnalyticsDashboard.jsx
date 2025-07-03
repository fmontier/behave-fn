import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#6366F1',
  gray: '#6B7280'
};

const STATUS_COLORS = {
  draft: COLORS.gray,
  in_progress: COLORS.info,
  completed: COLORS.success,
  failed: COLORS.error,
  passed: COLORS.success,
  ready: COLORS.warning
};

const AnalyticsDashboard = ({ analyticsData, loading = false }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('analytics.noData')}
        </h3>
        <p className="text-gray-600">
          {t('analytics.noDataDescription')}
        </p>
      </div>
    );
  }

  const { summary, distributions, coverage, trends, time_based } = analyticsData;

  // Preparar datos para gráficos
  const statusData = Object.entries(distributions.features_by_status || {}).map(([status, count]) => ({
    name: t(`features.status.${status}`),
    value: count,
    color: STATUS_COLORS[status] || COLORS.gray
  }));

  const priorityData = Object.entries(distributions.features_by_priority || {}).map(([priority, count]) => ({
    name: t(`features.priority.${priority}`),
    value: count,
    color: priority === 'high' ? COLORS.error : priority === 'medium' ? COLORS.warning : COLORS.success
  }));

  const moduleData = Object.entries(distributions.features_by_module || {}).map(([module, count]) => ({
    name: module,
    features: count,
    scenarios: distributions.scenarios_by_module[module] || 0
  }));

  const trendsData = trends?.features_trend?.map((item, index) => ({
    week: item.week,
    features: item.count,
    scenarios: trends.scenarios_trend[index]?.count || 0
  })) || [];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Check if we're showing time-based analytics only
  const isTimeBasedOnly = time_based && !summary?.total_features;

  return (
    <div className="space-y-8">
      {/* Summary Cards - Only show if not time-based view */}
      {!isTimeBasedOnly && summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={t('analytics.totalFeatures')}
          value={summary.total_features}
          subtitle={`${summary.completed_features} ${t('analytics.completed')}`}
          icon={Target}
          color="blue"
        />
        <StatCard
          title={t('analytics.totalScenarios')}
          value={summary.total_scenarios}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title={t('analytics.progressPercentage')}
          value={`${summary.progress_percentage}%`}
          subtitle={`${summary.pending_features} ${t('analytics.pending')}`}
          icon={Activity}
          color="purple"
        />
        <StatCard
          title={t('analytics.totalModules')}
          value={summary.total_modules}
          icon={BarChart3}
          color="orange"
        />
        </div>
      )}

      {/* Charts Grid - Only show if not time-based view */}
      {!isTimeBasedOnly && distributions && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2" />
            {t('analytics.featuresByStatus')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Features by Priority */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {t('analytics.featuresByPriority')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Module Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            {t('analytics.moduleDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="features" fill={COLORS.primary} name={t('features.title')} />
              <Bar dataKey="scenarios" fill={COLORS.success} name={t('scenarios.title')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trends */}
        {trendsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('analytics.weeklyTrends')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="features"
                  stackId="1"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  name={t('features.title')}
                />
                <Area
                  type="monotone"
                  dataKey="scenarios"
                  stackId="1"
                  stroke={COLORS.success}
                  fill={COLORS.success}
                  name={t('scenarios.title')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      )}

      {/* Coverage Table - Only show if not time-based view */}
      {!isTimeBasedOnly && coverage && coverage.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            {t('analytics.featureCoverage')}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('features.title')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.totalScenarios')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.passedScenarios')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.failedScenarios')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.coverage')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coverage.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.feature_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.scenarios_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {item.passed_scenarios}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {item.failed_scenarios}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${item.coverage_percentage}%` }}
                          ></div>
                        </div>
                        <span>{item.coverage_percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Time-Based Analytics Section */}
      {time_based && (
        <div className="space-y-6">
          {/* Daily Activity Chart */}
          {time_based.daily_activity && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-gray-500" />
                {t('analytics.dailyActivity')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={Object.entries(time_based.daily_activity).map(([date, data]) => ({
                  date: new Date(date).toLocaleDateString(),
                  features: data.features,
                  scenarios: data.scenarios
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="features" 
                    stackId="1"
                    stroke={COLORS.primary} 
                    fill={COLORS.primary} 
                    name={t('features.features')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="scenarios" 
                    stackId="1"
                    stroke={COLORS.success} 
                    fill={COLORS.success} 
                    name={t('scenarios.scenarios')}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Weekly Completion Chart */}
          {time_based.weekly_completion && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-gray-500" />
                {t('analytics.weeklyCompletion')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(time_based.weekly_completion).map(([week, count]) => ({
                  week,
                  completed: count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill={COLORS.success} name={t('analytics.completed')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Period Summary */}
          {time_based.period_summary && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
                {t('analytics.periodSummary')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">
                    {time_based.period_summary.total_features_created || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('analytics.featuresCreated')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {time_based.period_summary.total_scenarios_created || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('analytics.scenariosCreated')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {time_based.period_summary.days || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('analytics.daysAnalyzed')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;