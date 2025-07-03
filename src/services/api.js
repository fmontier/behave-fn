import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Modules API
export const modulesAPI = {
  getAll: (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {};
    return api.get('/modules/', { params });
  },
  getById: (id) => api.get(`/modules/${id}`),
  create: (data) => api.post('/modules/', data),
  update: (id, data) => api.put(`/modules/${id}`, data),
  delete: (id) => api.delete(`/modules/${id}`),
};

// Features API
export const featuresAPI = {
  getAll: (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {};
    return api.get('/features/', { params });
  },
  getById: (id) => api.get(`/features/${id}`),
  create: (data) => api.post('/features/', data),
  update: (id, data) => api.put(`/features/${id}`, data),
  delete: (id) => api.delete(`/features/${id}`),
  getBDDFile: (id) => api.get(`/features/${id}/bdd-file`, { 
    responseType: 'blob',
    headers: { 'Accept': 'text/plain' }
  }),
};

// Scenarios API
export const scenariosAPI = {
  getAll: (featureId = null) => {
    const params = featureId ? { feature_id: featureId } : {};
    return api.get('/scenarios/', { params });
  },
  getById: (id) => api.get(`/scenarios/${id}`),
  create: (data) => api.post('/scenarios/', data),
  update: (id, data) => api.put(`/scenarios/${id}`, data),
  delete: (id) => api.delete(`/scenarios/${id}`),
};

// Tags API
export const tagsAPI = {
  getAll: () => api.get('/tags/'),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags/', data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Roles API
export const rolesAPI = {
  getAll: () => api.get('/roles/'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles/', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
};

// Test Results API
export const testResultsAPI = {
  getAll: (scenarioId = null) => {
    const params = scenarioId ? { scenario_id: scenarioId } : {};
    return api.get('/test-results/', { params });
  },
  create: (data) => api.post('/test-results/', data),
};

// Dashboard Stats API
export const statsAPI = {
  getDashboard: (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {};
    return api.get('/stats/dashboard', { params });
  },
};

// Testing API
export const testingAPI = {
  runFeatureTest: (featureId) => api.post(`/features/${featureId}/test`),
  runScenarioTest: (scenarioId) => api.post(`/scenarios/${scenarioId}/test`),
  runProjectTests: (projectId, tags = null) => {
    const data = tags && tags.length > 0 ? { tags } : {};
    return api.post(`/projects/${projectId}/test`, data);
  },
  getAvailableTags: () => api.get('/test/tags'),
};

// Analytics API
export const analyticsAPI = {
  getProjectAnalytics: (projectId) => api.get(`/analytics/projects/${projectId}`),
  getGlobalAnalytics: () => api.get('/analytics/global'),
  getTimeBasedAnalytics: (projectId = null, days = 30) => {
    const params = {};
    if (projectId) params.project_id = projectId;
    if (days) params.days = days;
    return api.get('/analytics/time-based', { params });
  },
  getTestExecutionAnalytics: (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {};
    return api.get('/analytics/test-execution', { params });
  },
  getEnhancedDashboard: (projectId) => api.get(`/analytics/dashboard/${projectId}`),
};

export default api;
