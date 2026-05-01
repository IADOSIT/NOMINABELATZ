// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Configuración de cliente HTTP (Axios)
// ===================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Agregar empresa e ingenio si están disponibles
    const usuario = useAuthStore.getState().usuario;
    if (usuario) {
      if (usuario.empresaId) {
        config.headers['X-Empresa-Id'] = usuario.empresaId;
      }
      if (usuario.ingenioId) {
        config.headers['X-Ingenio-Id'] = usuario.ingenioId;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el token expiró, intentar refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          const { token } = response.data;
          useAuthStore.getState().actualizarToken(token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    // Manejar otros errores
    return Promise.reject(error);
  }
);

// Tipos de respuesta de la API
export interface RespuestaApi<T> {
  exitoso: boolean;
  mensaje?: string;
  datos?: T;
}

export interface RespuestaPaginada<T> {
  elementos: T[];
  paginaActual: number;
  elementosPorPagina: number;
  totalElementos: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

export interface ErrorApi {
  codigo: string;
  mensaje: string;
  traceId?: string;
  errores?: Array<{
    campo: string;
    mensaje: string;
  }>;
  detalles?: Record<string, unknown>;
}

// Funciones helper para extraer datos
export const extraerDatos = <T>(respuesta: RespuestaApi<T>): T => {
  if (!respuesta.exitoso) {
    throw new Error(respuesta.mensaje || 'Error desconocido');
  }
  return respuesta.datos as T;
};

export const extraerError = (error: AxiosError<ErrorApi>): string => {
  if (error.response?.data) {
    const errorData = error.response.data;

    if (errorData.errores && errorData.errores.length > 0) {
      return errorData.errores.map(e => `${e.campo}: ${e.mensaje}`).join(', ');
    }

    return errorData.mensaje || 'Error en la solicitud';
  }

  if (error.message) {
    return error.message;
  }

  return 'Error de conexión';
};

export default api;
