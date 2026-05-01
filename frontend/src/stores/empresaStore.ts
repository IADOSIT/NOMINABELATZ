// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Store de Empresa/Ingenio Seleccionado
// ===================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos
export interface Ingenio {
  id: string;
  nombre: string;
  clave: string;
  ubicacion: string;
  estado: string;
  telefono: string;
  gerente: string;
  empleadosActivos: number;
  enZafra: boolean;
  inicioZafra?: string;
  finZafra?: string;
}

export interface Empresa {
  id: string;
  razonSocial: string;
  rfc: string;
  nombreComercial: string;
  logo?: string;
  colorPrimario: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  regimenFiscal: string;
  ingenios: Ingenio[];
}

interface EmpresaState {
  empresas: Empresa[];
  empresaSeleccionada: Empresa | null;
  ingenioSeleccionado: Ingenio | null;
  cargando: boolean;

  // Acciones
  setEmpresas: (empresas: Empresa[]) => void;
  seleccionarEmpresa: (empresa: Empresa) => void;
  seleccionarIngenio: (ingenio: Ingenio) => void;
  limpiarSeleccion: () => void;
  setCargando: (cargando: boolean) => void;
}

// Datos de ejemplo - Empresas e Ingenios Azucareros
export const empresasEjemplo: Empresa[] = [
  {
    id: '1',
    razonSocial: 'Grupo Azucarero del Sureste S.A. de C.V.',
    rfc: 'GAS850101ABC',
    nombreComercial: 'GASU',
    colorPrimario: '#800020',
    direccion: 'Av. Central 1234, Col. Centro, Córdoba, Veracruz',
    telefono: '(271) 123-4567',
    email: 'contacto@gasu.com.mx',
    sitioWeb: 'www.gasu.com.mx',
    regimenFiscal: '601 - General de Ley Personas Morales',
    ingenios: [
      {
        id: '1-1',
        nombre: 'Ingenio San Cristóbal',
        clave: 'ISC',
        ubicacion: 'Km 5 Carretera Córdoba-Veracruz',
        estado: 'Veracruz',
        telefono: '(271) 123-4568',
        gerente: 'Ing. Roberto Martínez Sánchez',
        empleadosActivos: 1250,
        enZafra: true,
        inicioZafra: '2024-11-15',
        finZafra: '2025-05-30',
      },
      {
        id: '1-2',
        nombre: 'Ingenio La Providencia',
        clave: 'ILP',
        ubicacion: 'Km 12 Carretera Fortín-Huatusco',
        estado: 'Veracruz',
        telefono: '(271) 234-5678',
        gerente: 'Ing. María Elena Flores Ruiz',
        empleadosActivos: 980,
        enZafra: true,
        inicioZafra: '2024-11-20',
        finZafra: '2025-05-25',
      },
      {
        id: '1-3',
        nombre: 'Ingenio El Potrero',
        clave: 'IEP',
        ubicacion: 'Municipio de Atoyac, Veracruz',
        estado: 'Veracruz',
        telefono: '(271) 345-6789',
        gerente: 'Ing. Carlos Hernández López',
        empleadosActivos: 850,
        enZafra: false,
      },
    ],
  },
  {
    id: '2',
    razonSocial: 'Azúcares y Derivados del Pacífico S.A. de C.V.',
    rfc: 'ADP900215XYZ',
    nombreComercial: 'AZUDEPAC',
    colorPrimario: '#800020',
    direccion: 'Blvd. Costero 567, Lázaro Cárdenas, Michoacán',
    telefono: '(753) 987-6543',
    email: 'info@azudepac.com.mx',
    regimenFiscal: '601 - General de Ley Personas Morales',
    ingenios: [
      {
        id: '2-1',
        nombre: 'Ingenio Lázaro Cárdenas',
        clave: 'ILC',
        ubicacion: 'Km 8 Carretera Lázaro Cárdenas-Uruapan',
        estado: 'Michoacán',
        telefono: '(753) 987-6544',
        gerente: 'Ing. Fernando Jiménez Moreno',
        empleadosActivos: 1450,
        enZafra: true,
        inicioZafra: '2024-12-01',
        finZafra: '2025-06-15',
      },
      {
        id: '2-2',
        nombre: 'Ingenio Tierra Caliente',
        clave: 'ITC',
        ubicacion: 'Apatzingán, Michoacán',
        estado: 'Michoacán',
        telefono: '(453) 876-5432',
        gerente: 'Ing. Laura Mendoza Vega',
        empleadosActivos: 720,
        enZafra: true,
        inicioZafra: '2024-11-25',
        finZafra: '2025-05-20',
      },
    ],
  },
  {
    id: '3',
    razonSocial: 'Industria Azucarera de Jalisco S.A. de C.V.',
    rfc: 'IAJ880530MNO',
    nombreComercial: 'INAZUCAR',
    colorPrimario: '#800020',
    direccion: 'Av. Vallarta 890, Guadalajara, Jalisco',
    telefono: '(33) 3456-7890',
    email: 'contacto@inazucar.com.mx',
    sitioWeb: 'www.inazucar.com.mx',
    regimenFiscal: '601 - General de Ley Personas Morales',
    ingenios: [
      {
        id: '3-1',
        nombre: 'Ingenio Tala',
        clave: 'ITA',
        ubicacion: 'Tala, Jalisco',
        estado: 'Jalisco',
        telefono: '(33) 3456-7891',
        gerente: 'Ing. Pedro Ramírez Castro',
        empleadosActivos: 1100,
        enZafra: true,
        inicioZafra: '2024-11-10',
        finZafra: '2025-05-28',
      },
      {
        id: '3-2',
        nombre: 'Ingenio José María Martínez',
        clave: 'IJM',
        ubicacion: 'Casimiro Castillo, Jalisco',
        estado: 'Jalisco',
        telefono: '(33) 3567-8901',
        gerente: 'Ing. Ana García Rodríguez',
        empleadosActivos: 890,
        enZafra: false,
      },
    ],
  },
];

export const useEmpresaStore = create<EmpresaState>()(
  persist(
    (set) => ({
      empresas: empresasEjemplo,
      empresaSeleccionada: null,
      ingenioSeleccionado: null,
      cargando: false,

      setEmpresas: (empresas) => set({ empresas }),

      seleccionarEmpresa: (empresa) => set({
        empresaSeleccionada: empresa,
        ingenioSeleccionado: null
      }),

      seleccionarIngenio: (ingenio) => set({ ingenioSeleccionado: ingenio }),

      limpiarSeleccion: () => set({
        empresaSeleccionada: null,
        ingenioSeleccionado: null
      }),

      setCargando: (cargando) => set({ cargando }),
    }),
    {
      name: 'imperha-empresa-storage',
      partialize: (state) => ({
        empresaSeleccionada: state.empresaSeleccionada,
        ingenioSeleccionado: state.ingenioSeleccionado,
      }),
    }
  )
);
