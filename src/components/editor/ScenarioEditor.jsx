import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Code,
  Save,
  Eye,
  EyeOff,
  Wand2
} from 'lucide-react';

// Palabras clave de Gherkin para autocompletado
const GHERKIN_KEYWORDS = {
  given: [
    'Given I am on the',
    'Given I have',
    'Given I am logged in as',
    'Given the user is',
    'Given the system is',
    'Given there is a',
    'Given there are',
    'Given I navigate to',
    'Given the following data exists'
  ],
  when: [
    'When I click on',
    'When I enter',
    'When I select',
    'When I submit',
    'When I press',
    'When I navigate to',
    'When I upload',
    'When I perform',
    'When the user'
  ],
  then: [
    'Then I should see',
    'Then I should be redirected to',
    'Then the page should contain',
    'Then the system should',
    'Then I should receive',
    'Then the following should be displayed',
    'Then an error message should appear',
    'Then the status should be',
    'Then the user should be able to'
  ]
};

const COMMON_STEPS = [
  // Navegación
  'I navigate to the home page',
  'I navigate to the login page',
  'I navigate to the dashboard',
  'I go back to the previous page',
  
  // Interacciones
  'I click on the "{button}" button',
  'I click on the "{link}" link',
  'I enter "{text}" in the "{field}" field',
  'I select "{option}" from the "{dropdown}" dropdown',
  'I check the "{checkbox}" checkbox',
  'I uncheck the "{checkbox}" checkbox',
  
  // Autenticación
  'I am logged in as "{user}"',
  'I log out',
  'I enter valid credentials',
  'I enter invalid credentials',
  
  // Verificaciones
  'I should see "{text}"',
  'I should not see "{text}"',
  'I should be on the "{page}" page',
  'I should see a success message',
  'I should see an error message',
  'the "{element}" should be visible',
  'the "{element}" should be disabled',
  'the "{element}" should be enabled'
];

const ScenarioEditor = ({ 
  scenario = {}, 
  onSave, 
  onCancel, 
  loading = false,
  mode = 'edit' // 'edit' or 'create'
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: scenario.name || '',
    description: scenario.description || '',
    given: scenario.given || '',
    when: scenario.when || '',
    then: scenario.then || '',
    tags: scenario.tags || []
  });

  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  const textareaRefs = {
    given: useRef(null),
    when: useRef(null),
    then: useRef(null)
  };

  // Generar sugerencias basadas en el contexto
  const generateSuggestions = (fieldType, currentText, cursorPos) => {
    const textBeforeCursor = currentText.substring(0, cursorPos);
    const lastLine = textBeforeCursor.split('\n').pop();
    
    let suggestions = [];

    // Sugerencias de palabras clave de Gherkin
    if (GHERKIN_KEYWORDS[fieldType]) {
      suggestions = [...GHERKIN_KEYWORDS[fieldType]];
    }

    // Agregar pasos comunes
    suggestions = [...suggestions, ...COMMON_STEPS];

    // Filtrar por texto actual si hay algo escrito
    if (lastLine.trim()) {
      const searchTerm = lastLine.toLowerCase();
      suggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm)
      );
    }

    return suggestions.slice(0, 8); // Máximo 8 sugerencias
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTextareaChange = (field, value, cursorPos) => {
    handleInputChange(field, value);
    
    if (['given', 'when', 'then'].includes(field)) {
      setActiveField(field);
      setCursorPosition(cursorPos);
      
      const newSuggestions = generateSuggestions(field, value, cursorPos);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!activeField || !textareaRefs[activeField].current) return;

    const textarea = textareaRefs[activeField].current;
    const currentText = formData[activeField];
    const textBeforeCursor = currentText.substring(0, cursorPosition);
    const textAfterCursor = currentText.substring(cursorPosition);
    
    // Encontrar el inicio de la línea actual
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const lineStart = textBeforeCursor.length - currentLine.length;
    
    // Reemplazar la línea actual con la sugerencia
    const newText = currentText.substring(0, lineStart) + 
                   suggestion + 
                   textAfterCursor;
    
    handleInputChange(activeField, newText);
    setShowSuggestions(false);
    
    // Focalizar y posicionar cursor al final de la sugerencia
    setTimeout(() => {
      const newCursorPos = lineStart + suggestion.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    
    if (!formData.given.trim()) {
      newErrors.given = t('validation.required');
    }
    
    if (!formData.when.trim()) {
      newErrors.when = t('validation.required');
    }
    
    if (!formData.then.trim()) {
      newErrors.then = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
  };

  const generatePreview = () => {
    const { name, description, given, when, then } = formData;
    
    let preview = `Scenario: ${name}\n`;
    if (description) {
      preview += `  ${description}\n`;
    }
    preview += '\n';
    
    if (given) {
      preview += '  Given ' + given.split('\n').join('\n  And ') + '\n';
    }
    
    if (when) {
      preview += '  When ' + when.split('\n').join('\n  And ') + '\n';
    }
    
    if (then) {
      preview += '  Then ' + then.split('\n').join('\n  And ') + '\n';
    }
    
    return preview;
  };

  const renderTextareaWithSuggestions = (field, placeholder, icon) => (
    <div className="relative">
      <div className="flex items-center mb-2">
        {icon}
        <label className="text-sm font-medium text-gray-700 ml-2 capitalize">
          {t(`scenarios.${field}`)}
        </label>
      </div>
      
      <textarea
        ref={textareaRefs[field]}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        rows="3"
        placeholder={placeholder}
        value={formData[field]}
        onChange={(e) => {
          const { value, selectionStart } = e.target;
          handleTextareaChange(field, value, selectionStart);
        }}
        onFocus={() => setActiveField(field)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicking
          setTimeout(() => setShowSuggestions(false), 200);
        }}
      />
      
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
      
      {/* Sugerencias */}
      {showSuggestions && activeField === field && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <Wand2 className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                <span className="truncate">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? t('scenarios.create') : t('scenarios.edit')}
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="btn btn-secondary text-sm"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  {t('common.hidePreview')}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {t('common.showPreview')}
                </>
              )}
            </button>
          </div>
        </div>

        <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Editor */}
          <div className="space-y-6">
            {/* Nombre del escenario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('scenarios.name')} *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('scenarios.namePlaceholder')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('scenarios.description')}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
                placeholder={t('scenarios.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Steps con autocompletado */}
            <div className="space-y-4">
              {renderTextareaWithSuggestions(
                'given',
                t('scenarios.givenPlaceholder'),
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
              
              {renderTextareaWithSuggestions(
                'when',
                t('scenarios.whenPlaceholder'),
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              
              {renderTextareaWithSuggestions(
                'then',
                t('scenarios.thenPlaceholder'),
                <Lightbulb className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                {t('common.preview')}
              </h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {generatePreview()}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            {t('common.cancel')}
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {t('common.saving')}
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('common.save')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioEditor;