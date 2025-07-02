import React from 'react';
import { useTranslation } from 'react-i18next';
import { Droppable } from '@hello-pangea/dnd';
import FeatureCard from './FeatureCard';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  Code,
  Plus,
  MoreHorizontal
} from 'lucide-react';

const getStatusIcon = (status) => {
  switch (status) {
    case 'draft':
      return <FileText className="w-4 h-4" />;
    case 'in_progress':
      return <Code className="w-4 h-4" />;
    case 'review':
      return <Eye className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4" />;
    case 'implemented':
      return <Code className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'approved':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'implemented':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const KanbanColumn = ({ status, features, onAddFeature, modules = [] }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-4 min-h-96 w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {t(`features.status.${status}`)}
            </h3>
            <p className="text-sm text-gray-500">
              {features.length} {features.length === 1 ? 'feature' : 'features'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddFeature(status)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            title={t('features.newFeature')}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 min-h-64 rounded-lg transition-all duration-200
              ${snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-inner' : 'border-2 border-transparent'}
            `}
          >
            {/* Features */}
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                index={index}
                modules={modules}
              />
            ))}
            
            {provided.placeholder}
            
            {/* Empty State */}
            {features.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                {getStatusIcon(status)}
                <p className="mt-2 text-sm">
                  {t('features.noFeatures')}
                </p>
                <button
                  onClick={() => onAddFeature(status)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t('features.newFeature')}
                </button>
              </div>
            )}
            
            {/* Drop Indicator */}
            {snapshot.isDraggingOver && features.length === 0 && (
              <div className="flex items-center justify-center h-32 text-blue-600 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    {t('kanban.dropHere')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;