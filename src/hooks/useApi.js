import { useState, useEffect } from 'react';
import { projectsAPI, modulesAPI, featuresAPI, scenariosAPI, tagsAPI, statsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Hook for projects
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await projectsAPI.create(projectData);
      setProjects(prev => [...prev, response.data]);
      toast.success('Project created successfully');
      return response.data;
    } catch (err) {
      toast.error('Error creating project');
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await projectsAPI.update(id, projectData);
      setProjects(prev => prev.map(p => p.id === id ? response.data : p));
      toast.success('Project updated successfully');
      return response.data;
    } catch (err) {
      toast.error('Error updating project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Error deleting project');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};

// Hook for modules
export const useModules = (projectId = null) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await modulesAPI.getAll(projectId);
      setModules(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error loading modules');
    } finally {
      setLoading(false);
    }
  };

  const createModule = async (moduleData) => {
    try {
      const response = await modulesAPI.create(moduleData);
      setModules(prev => [...prev, response.data]);
      toast.success('Module created successfully');
      return response.data;
    } catch (err) {
      toast.error('Error creating module');
      throw err;
    }
  };

  const updateModule = async (id, moduleData) => {
    try {
      const response = await modulesAPI.update(id, moduleData);
      setModules(prev => prev.map(m => m.id === id ? response.data : m));
      toast.success('Module updated successfully');
      return response.data;
    } catch (err) {
      toast.error('Error updating module');
      throw err;
    }
  };

  const deleteModule = async (id) => {
    try {
      await modulesAPI.delete(id);
      setModules(prev => prev.filter(m => m.id !== id));
      toast.success('Module deleted successfully');
    } catch (err) {
      toast.error('Error deleting module');
      throw err;
    }
  };

  useEffect(() => {
    fetchModules();
  }, [projectId]);

  return {
    modules,
    loading,
    error,
    createModule,
    updateModule,
    deleteModule,
    refetch: fetchModules
  };
};

// Hook for features
export const useFeatures = (projectId = null) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await featuresAPI.getAll(projectId);
      setFeatures(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error loading features');
    } finally {
      setLoading(false);
    }
  };

  const createFeature = async (featureData) => {
    try {
      const response = await featuresAPI.create(featureData);
      setFeatures(prev => [...prev, response.data]);
      toast.success('Feature created successfully');
      return response.data;
    } catch (err) {
      toast.error('Error creating feature');
      throw err;
    }
  };

  const updateFeature = async (id, featureData) => {
    try {
      const response = await featuresAPI.update(id, featureData);
      setFeatures(prev => prev.map(f => f.id === id ? response.data : f));
      toast.success('Feature updated successfully');
      return response.data;
    } catch (err) {
      toast.error('Error updating feature');
      throw err;
    }
  };

  const deleteFeature = async (id) => {
    try {
      await featuresAPI.delete(id);
      setFeatures(prev => prev.filter(f => f.id !== id));
      toast.success('Feature deleted successfully');
    } catch (err) {
      toast.error('Error deleting feature');
      throw err;
    }
  };

  const downloadBDDFile = async (id) => {
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
      toast.success('BDD file downloaded successfully');
    } catch (err) {
      toast.error('Error downloading BDD file');
      throw err;
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [projectId]);

  return {
    features,
    loading,
    error,
    createFeature,
    updateFeature,
    deleteFeature,
    downloadBDDFile,
    refetch: fetchFeatures
  };
};

// Hook for scenarios
export const useScenarios = (featureId = null) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const response = await scenariosAPI.getAll(featureId);
      setScenarios(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error loading scenarios');
    } finally {
      setLoading(false);
    }
  };

  const createScenario = async (scenarioData) => {
    try {
      const response = await scenariosAPI.create(scenarioData);
      setScenarios(prev => [...prev, response.data]);
      toast.success('Scenario created successfully');
      return response.data;
    } catch (err) {
      toast.error('Error creating scenario');
      throw err;
    }
  };

  const updateScenario = async (id, scenarioData) => {
    try {
      const response = await scenariosAPI.update(id, scenarioData);
      setScenarios(prev => prev.map(s => s.id === id ? response.data : s));
      toast.success('Scenario updated successfully');
      return response.data;
    } catch (err) {
      toast.error('Error updating scenario');
      throw err;
    }
  };

  const deleteScenario = async (id) => {
    try {
      await scenariosAPI.delete(id);
      setScenarios(prev => prev.filter(s => s.id !== id));
      toast.success('Scenario deleted successfully');
    } catch (err) {
      toast.error('Error deleting scenario');
      throw err;
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, [featureId]);

  return {
    scenarios,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
    refetch: fetchScenarios
  };
};

// Hook for tags
export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagsAPI.getAll();
      setTags(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error loading tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (tagData) => {
    try {
      const response = await tagsAPI.create(tagData);
      setTags(prev => [...prev, response.data]);
      toast.success('Tag created successfully');
      return response.data;
    } catch (err) {
      toast.error('Error creating tag');
      throw err;
    }
  };

  const deleteTag = async (id) => {
    try {
      await tagsAPI.delete(id);
      setTags(prev => prev.filter(t => t.id !== id));
      toast.success('Tag deleted successfully');
    } catch (err) {
      toast.error('Error deleting tag');
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    createTag,
    deleteTag,
    refetch: fetchTags
  };
};

// Hook for dashboard stats
export const useStats = (projectId = null) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await statsAPI.getDashboard(projectId);
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error loading dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [projectId]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
