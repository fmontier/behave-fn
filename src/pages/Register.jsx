import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, User, Mail, Lock, FileText } from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        password: data.password,
      });
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Regístrate para acceder al sistema BDD
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.full_name ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="Tu nombre completo"
                  {...register('full_name', { 
                    required: 'El nombre completo es requerido',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres'
                    }
                  })}
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.username ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="Nombre de usuario"
                  {...register('username', { 
                    required: 'El usuario es requerido',
                    minLength: {
                      value: 3,
                      message: 'El usuario debe tener al menos 3 caracteres'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Solo se permiten letras, números y guiones bajos'
                    }
                  })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.email ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="tu@email.com"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`
                    block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.password ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="Mínimo 6 caracteres"
                  {...register('password', { 
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`
                    block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="Confirma tu contraseña"
                  {...register('confirmPassword', { 
                    required: 'Confirma tu contraseña',
                    validate: value => value === password || 'Las contraseñas no coinciden'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }
                transition-colors duration-200
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}