import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProjectProvider } from './contexts/ProjectContext';
import ProjectLayout from './components/ProjectLayout';
import ProjectSelection from './pages/ProjectSelection';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Features from './pages/Features';
import FeaturesRedirect from './pages/FeaturesRedirect';
import FeatureDetail from './pages/FeatureDetail';
import Scenarios from './pages/Scenarios';
import ScenariosRedirect from './pages/ScenariosRedirect';
import ScenarioDetail from './pages/ScenarioDetail';
import ScenarioEditorPage from './pages/ScenarioEditor';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Router>
        <ProjectProvider>
          <Routes>
            {/* Root route - Project selection */}
            <Route path="/" element={<ProjectSelection />} />
            <Route path="/projects" element={<Navigate to="/" replace />} />
            
            {/* Project-scoped routes */}
            <Route path="/project/:projectId" element={<ProjectLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="modules" element={<Modules />} />
              <Route path="modules/:id" element={<ModuleDetail />} />
              <Route path="features" element={<Features />} />
              <Route path="features/new" element={<Features />} />
              <Route path="features/:id" element={<FeatureDetail />} />
              <Route path="scenarios" element={<Scenarios />} />
              <Route path="scenarios/new" element={<ScenarioEditorPage />} />
              <Route path="scenarios/:id" element={<ScenarioDetail />} />
              <Route path="scenarios/:id/edit" element={<ScenarioEditorPage />} />
              <Route path="kanban" element={<Kanban />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<ProjectDetail />} />
            </Route>
            
            {/* Catch-all redirect to project selection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProjectProvider>
      </Router>
    </div>
  );
}

export default App;
