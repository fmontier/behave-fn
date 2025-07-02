import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load selected project from localStorage on mount
  useEffect(() => {
    const loadStoredProject = async () => {
      try {
        const storedProjectId = localStorage.getItem('selectedProjectId');
        if (storedProjectId) {
          const response = await projectsAPI.getById(storedProjectId);
          setSelectedProject(response.data);
        }
      } catch (error) {
        console.error('Error loading stored project:', error);
        localStorage.removeItem('selectedProjectId');
      } finally {
        setLoading(false);
      }
    };

    loadStoredProject();
  }, []);

  const selectProject = async (project) => {
    try {
      setSelectedProject(project);
      localStorage.setItem('selectedProjectId', project.id.toString());
      navigate(`/project/${project.id}/dashboard`);
    } catch (error) {
      console.error('Error selecting project:', error);
      toast.error('Error al seleccionar el proyecto');
    }
  };

  const clearProject = () => {
    setSelectedProject(null);
    localStorage.removeItem('selectedProjectId');
    navigate('/');
  };

  const refreshProject = async () => {
    if (selectedProject) {
      try {
        const response = await projectsAPI.getById(selectedProject.id);
        setSelectedProject(response.data);
      } catch (error) {
        console.error('Error refreshing project:', error);
        toast.error('Error al actualizar el proyecto');
      }
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      selectedProject, 
      selectProject, 
      clearProject,
      refreshProject,
      projectId: selectedProject?.id,
      loading
    }}>
      {children}
    </ProjectContext.Provider>
  );
};