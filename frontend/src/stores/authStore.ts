// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Store de autenticación con Zustand
// ===================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface Usuario {
  id: string;
  nombreUsuario: string;
  nombreCompleto: string;
  correoElectronico: string;
  rol: string;
  roles: string[];
  empresaId: string;
  empresaNombre: string;
  ingenioId?: string;
  ingenioNombre?: string;
}

interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  roles: string[];
  empresaId: string;
  empresaNombre: string;
  ingenioId?: string;
  ingenioNombre?: string;
  exp: number;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  usuario: Usuario | null;
  estaAutenticado: boolean;

  // Acciones
  login: (token: string, refreshToken: string) => void;
  loginDemo: () => void;
  logout: () => void;
  actualizarToken: (token: string) => void;
  tieneRol: (rol: string) => boolean;
  tienePermiso: (modulo: string, accion: string) => boolean;
}

// Usuario de demostración
const usuarioDemo: Usuario = {
  id: 'demo-001',
  nombreUsuario: 'admin',
  nombreCompleto: 'Administrador del Sistema',
  correoElectronico: 'admin@imperha.com',
  rol: 'Administrador',
  roles: ['Administrador'],
  empresaId: '1',
  empresaNombre: 'GASU',
  ingenioId: '1-1',
  ingenioNombre: 'Ingenio San Cristóbal',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      usuario: null,
      estaAutenticado: false,

      login: (token: string, refreshToken: string) => {
        try {
          const decoded = jwtDecode<TokenPayload>(token);

          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expirado');
          }

          const usuario: Usuario = {
            id: decoded.sub,
            nombreUsuario: decoded.name,
            nombreCompleto: decoded.name,
            correoElectronico: decoded.email,
            rol: decoded.roles?.[0] || 'Usuario',
            roles: decoded.roles || [],
            empresaId: decoded.empresaId,
            empresaNombre: decoded.empresaNombre,
            ingenioId: decoded.ingenioId,
            ingenioNombre: decoded.ingenioNombre,
          };

          set({
            token,
            refreshToken,
            usuario,
            estaAutenticado: true,
          });
        } catch (error) {
          console.error('Error al decodificar token:', error);
          set({
            token: null,
            refreshToken: null,
            usuario: null,
            estaAutenticado: false,
          });
        }
      },

      // Login de demostración (sin backend)
      loginDemo: () => {
        set({
          token: 'demo-token',
          refreshToken: 'demo-refresh',
          usuario: usuarioDemo,
          estaAutenticado: true,
        });
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null,
          usuario: null,
          estaAutenticado: false,
        });
      },

      actualizarToken: (token: string) => {
        try {
          const decoded = jwtDecode<TokenPayload>(token);

          if (decoded.exp * 1000 < Date.now()) {
            get().logout();
            return;
          }

          set({ token });
        } catch (error) {
          console.error('Error al actualizar token:', error);
          get().logout();
        }
      },

      tieneRol: (rol: string) => {
        const { usuario } = get();
        if (!usuario) return false;
        if (usuario.roles.includes('Administrador')) return true;
        return usuario.roles.includes(rol);
      },

      tienePermiso: (modulo: string, accion: string) => {
        const { tieneRol } = get();
        if (tieneRol('Administrador')) return true;

        const permisosRol: Record<string, Record<string, string[]>> = {
          Nominas: {
            Nomina: ['Ver', 'Calcular', 'Cerrar', 'Timbrar'],
            Empleados: ['Ver'],
            CFDI: ['Ver', 'Timbrar', 'Cancelar'],
          },
          RecursosHumanos: {
            Empleados: ['Ver', 'Crear', 'Editar', 'Eliminar'],
            Nomina: ['Ver'],
          },
          Consulta: {
            Empleados: ['Ver'],
            Nomina: ['Ver'],
            CFDI: ['Ver'],
            Auditoria: ['Ver'],
          },
        };

        const { usuario } = get();
        if (!usuario) return false;

        for (const rol of usuario.roles) {
          const permisos = permisosRol[rol];
          if (permisos && permisos[modulo]?.includes(accion)) {
            return true;
          }
        }

        return false;
      },
    }),
    {
      name: 'imperha-auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        usuario: state.usuario,
        estaAutenticado: state.estaAutenticado,
      }),
    }
  )
);
