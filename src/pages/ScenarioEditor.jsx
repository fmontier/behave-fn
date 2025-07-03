import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProject } from '../contexts/ProjectContext';
import { scenariosAPI, featuresAPI } from '../services/api';
import ScenarioEditor from '../components/editor/ScenarioEditor';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScenarioEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { selectedProject } = useProject();
  
  const [scenario, setScenario] = useState(null);
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const featureId = searchParams.get('feature_id');
  const mode = id ? 'edit' : 'create';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar feature si se especifica
        if (featureId) {
          const featureResponse = await featuresAPI.getById(featureId);
          setFeature(featureResponse.data);
        }

        // Cargar escenario si estamos editando
        if (id) {
          const scenarioResponse = await scenariosAPI.getById(id);
          setScenario(scenarioResponse.data);
          
          // Si no tenemos feature, cargarla desde el escenario
          if (!featureId && scenarioResponse.data.feature_id) {
            const featureResponse = await featuresAPI.getById(scenarioResponse.data.feature_id);
            setFeature(featureResponse.data);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        toast.error(mode === 'edit' ? 'Error loading scenario' : 'Error loading feature');
      } finally {
        setLoading(false);
      }
    };

    if (featureId || id) {
      loadData();
    }
  }, [id, featureId, mode]);

  const handleSave = async (data) => {
    try {
      setSaving(true);
      
      const scenarioData = {
        ...data,
        feature_id: featureId || (feature && feature.id)
      };

      if (mode === 'create') {
        await scenariosAPI.create(scenarioData);
        toast.success(t('messages.success.created'));
      } else {
        await scenariosAPI.update(id, scenarioData);
        toast.success(t('messages.success.updated'));
      }

      // Navegar de vuelta a la feature o lista de escenarios
      if (feature) {
        navigate(`/projects/${selectedProject.id}/features/${feature.id}`);
      } else {
        navigate(`/projects/${selectedProject.id}/scenarios`);
      }
    } catch (err) {
      console.error('Error saving scenario:', err);
      toast.error(mode === 'create' ? t('messages.error.create') : t('messages.error.update'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (feature) {
      navigate(`/projects/${selectedProject.id}/features/${feature.id}`);
    } else {
      navigate(`/projects/${selectedProject.id}/scenarios`);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-red-500 mb-4">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('messages.error.load')}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </button>
        
        {feature && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{t('scenarios.feature')}:</span> {feature.title}
          </div>
        )}
      </div>

      <ScenarioEditor
        scenario={scenario}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={saving}
        mode={mode}
      />
    </div>
  );
}