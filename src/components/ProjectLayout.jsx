import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { projectsAPI } from '../services/api';
import Layout from './Layout';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const { selectedProject, selectProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If no project selected or URL project differs, load it
        if (!selectedProject || selectedProject.id !== parseInt(projectId)) {
          const response = await projectsAPI.getById(projectId);
          await selectProject(response.data);
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, selectedProject, selectProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProject) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}