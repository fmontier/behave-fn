import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        
        // Fetch user data
        await fetchCurrentUser(data.access_token);
        
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/');
        return { success: true };
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error en el inicio de sesión');
        return { success: false, error: errorData.detail };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error de conexión');
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
        return { success: true, user: newUser };
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error en el registro');
        return { success: false, error: errorData.detail };
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Error de conexión');
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      toast.success('Sesión cerrada correctamente');
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};