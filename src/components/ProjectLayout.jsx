import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { projectsAPI } from '../services/api';
import Layout from './Layout';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const { selectedProject, selectProject, loading: contextLoading } = useProject();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        // Wait for context to finish loading first
        if (contextLoading) {
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // If no project selected or URL project differs, load it
        if (!selectedProject || selectedProject.id !== parseInt(projectId)) {
          const response = await projectsAPI.getById(projectId);
          // Use selectProject which handles localStorage
          await selectProject(response.data, true); // Add skipNavigation flag
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (projectId && !contextLoading) {
      loadProject();
    } else if (!projectId) {
      setLoading(false);
    }
  }, [projectId, selectedProject, selectProject, contextLoading]);

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Navigate to="/" replace />;
  }

  // Only redirect if we're certain there's no project after loading
  if (!selectedProject && !contextLoading && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}