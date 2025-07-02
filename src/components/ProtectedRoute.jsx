import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ children, redirectTo, message }) => {
  const { t } = useTranslation();
  
  return (
    <div className="animate-fade-in">
      <div className="card p-8 text-center max-w-md mx-auto mt-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('navigation.accessRestricted')}
        </h3>
        <p className="text-gray-600 mb-6">
          {message || t('navigation.hierarchicalAccess')}
        </p>
        <Navigate to={redirectTo} replace />
      </div>
    </div>
  );
};

export default ProtectedRoute;