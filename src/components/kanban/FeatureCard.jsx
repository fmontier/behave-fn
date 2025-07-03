import React from 'react';
import { useTranslation } from 'react-i18next';
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import { 
  Calendar, 
  Tag, 
  User, 
  AlertCircle, 
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Package
} from 'lucide-react';

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'high':
      return <ArrowUp className="w-4 h-4 text-red-500" />;
    case 'low':
      return <ArrowDown className="w-4 h-4 text-gray-400" />;
    default:
      return <Minus className="w-4 h-4 text-yellow-500" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50';
    case 'low':
      return 'border-l-gray-300 bg-gray-50';
    default:
      return 'border-l-yellow-500 bg-yellow-50';
  }
};

const FeatureCard = ({ feature, index, modules = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useProject();
  
  const getModule = (moduleId) => {
    return modules.find(m => m.id === moduleId);
  };

  const handleCardClick = (e) => {
    // Only navigate if not dragging
    if (!e.defaultPrevented) {
      navigate(`/project/${projectId}/features/${feature.id}`);
    }
  };

  return (
    <Draggable draggableId={feature.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`
            bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-3
            ${getPriorityColor(feature.priority)}
            ${snapshot.isDragging ? 'rotate-2 shadow-xl transform scale-105 z-50' : 'cursor-pointer hover:cursor-pointer'}
            ${snapshot.isDragging ? '' : 'hover:shadow-lg hover:-translate-y-1'}
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">
              {feature.title}
            </h3>
            <div className="flex items-center ml-2">
              {getPriorityIcon(feature.priority)}
            </div>
          </div>

          {/* Description */}
          {feature.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {feature.description}
            </p>
          )}

          {/* User Story */}
          {feature.as_a && (
            <div className="bg-blue-50 rounded-md p-2 mb-3 text-xs">
              <div className="text-blue-800">
                <strong>{t('features.asA')}:</strong> {feature.as_a}
              </div>
              {feature.i_want && (
                <div className="text-blue-700 mt-1">
                  <strong>{t('features.iWant')}:</strong> {feature.i_want}
                </div>
              )}
              {feature.so_that && (
                <div className="text-blue-600 mt-1">
                  <strong>{t('features.soThat')}:</strong> {feature.so_that}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {feature.tags && feature.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {feature.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
              {feature.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{feature.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Module */}
          {feature.module_id && getModule(feature.module_id) && (
            <div className="flex items-center mb-2 text-xs">
              <Package className="w-3 h-3 mr-1" style={{ color: getModule(feature.module_id).color }} />
              <span className="text-gray-600">{getModule(feature.module_id).name}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(feature.created_at).toLocaleDateString()}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${feature.priority === 'high' ? 'bg-red-100 text-red-800' :
                  feature.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'}
              `}>
                {t(`features.priority.${feature.priority}`)}
              </span>
            </div>
          </div>

          {/* Scenarios count */}
          {feature.scenarios && feature.scenarios.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                {feature.scenarios.length} {t('nav.scenarios')}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default FeatureCard;