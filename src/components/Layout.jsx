import React, { useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProject } from '../contexts/ProjectContext';
import LanguageSelector from './LanguageSelector';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  TestTube2, 
  Settings, 
  Menu, 
  X,
  Layers,
  GitBranch,
  Trello,
  Package,
  BarChart3
} from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedProject, clearProject } = useProject();

  const navigation = [
    { name: t('nav.dashboard'), href: `/project/${projectId}/dashboard`, icon: Home, key: 'dashboard' },
    { name: t('nav.modules'), href: `/project/${projectId}/modules`, icon: Package, key: 'modules' },
    { name: t('nav.features'), href: `/project/${projectId}/features`, icon: FileText, key: 'features' },
    { name: t('nav.kanban'), href: `/project/${projectId}/kanban`, icon: Trello, key: 'kanban' },
    { name: t('analytics.title'), href: `/project/${projectId}/analytics`, icon: BarChart3, key: 'analytics' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-auto">
          {/* App Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <TestTube2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">BDD Manager</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Project Info */}
          {selectedProject && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedProject.name}</h3>
                  <p className="text-sm text-gray-500">Proyecto Actual</p>
                </div>
                <button
                  onClick={clearProject}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="mt-8">
          <div className="px-3">
            {navigation.map((item) => {
              const isActive = location.pathname.endsWith(item.key) || 
                               (item.key === 'dashboard' && location.pathname.endsWith(`/project/${projectId}`));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <Settings className="w-4 h-4" />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-2 text-sm">
                {selectedProject && (
                  <>
                    <span className="text-gray-500">{selectedProject.name}</span>
                    <span className="text-gray-400">/</span>
                  </>
                )}
                <span className="font-medium text-gray-900">
                  {navigation.find(item => {
                    return location.pathname.endsWith(item.key) || 
                           (item.key === 'dashboard' && location.pathname.endsWith(`/project/${projectId}`));
                  })?.name || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="text-sm text-gray-500">
                Behavior Driven Development
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
