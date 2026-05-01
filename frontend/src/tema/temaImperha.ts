// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Tema Visual - Guinda/Rojo con Blanco
// ===================================

import { createTheme, alpha } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

// Paleta de colores Guinda/Rojo Enterprise
const colores = {
  guinda: {
    principal: '#800020',
    oscuro: '#5c0018',
    claro: '#a3324a',
    suave: '#c45c6a',
    palido: '#f5e6e8',
  },
  rojo: {
    principal: '#c41e3a',
    oscuro: '#8b0000',
    claro: '#dc3545',
    acento: '#ff4757',
  },
  neutros: {
    blanco: '#ffffff',
    fondoClaro: '#fafbfc',
    fondoGris: '#f5f6f8',
    bordeClaro: '#e8eaed',
    textoOscuro: '#1a1a2e',
    textoSecundario: '#6c757d',
    textoTerciario: '#9ca3af',
  },
  exito: '#10b981',
  advertencia: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const temaImperha = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colores.guinda.principal,
      dark: colores.guinda.oscuro,
      light: colores.guinda.claro,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colores.rojo.principal,
      dark: colores.rojo.oscuro,
      light: colores.rojo.claro,
      contrastText: '#ffffff',
    },
    error: { main: colores.error },
    warning: { main: colores.advertencia },
    success: { main: colores.exito },
    info: { main: colores.info },
    background: {
      default: colores.neutros.fondoClaro,
      paper: colores.neutros.blanco,
    },
    text: {
      primary: colores.neutros.textoOscuro,
      secondary: colores.neutros.textoSecundario,
    },
    divider: colores.neutros.bordeClaro,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.1rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500, color: colores.neutros.textoSecundario },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, color: colores.neutros.textoSecundario },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600 },
    caption: { fontSize: '0.75rem', color: colores.neutros.textoTerciario },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colores.neutros.fondoClaro,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '8px', height: '8px' },
          '&::-webkit-scrollbar-track': { background: colores.neutros.fondoGris },
          '&::-webkit-scrollbar-thumb': {
            background: colores.guinda.suave,
            borderRadius: '4px',
            '&:hover': { background: colores.guinda.claro },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(128, 0, 32, 0.3)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colores.guinda.principal} 0%, ${colores.rojo.principal} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colores.guinda.oscuro} 0%, ${colores.rojo.oscuro} 100%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: alpha(colores.guinda.principal, 0.04),
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colores.neutros.bordeClaro}`,
          backgroundColor: colores.neutros.blanco,
          transition: 'all 0.2s ease-in-out',
          '&:hover': { boxShadow: '0 8px 24px rgba(128, 0, 32, 0.08)' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 16 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colores.neutros.blanco,
          color: colores.neutros.textoOscuro,
          boxShadow: `0 1px 0 ${colores.neutros.bordeClaro}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colores.guinda.oscuro,
          color: colores.neutros.blanco,
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '10px 16px',
          '&:hover': { backgroundColor: alpha(colores.neutros.blanco, 0.08) },
          '&.Mui-selected': {
            backgroundColor: alpha(colores.neutros.blanco, 0.15),
            '&:hover': { backgroundColor: alpha(colores.neutros.blanco, 0.2) },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '60%',
              width: 3,
              backgroundColor: colores.neutros.blanco,
              borderRadius: '0 4px 4px 0',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { color: 'inherit', minWidth: 40 } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colores.neutros.blanco,
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colores.guinda.claro },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colores.guinda.principal,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        colorPrimary: { backgroundColor: alpha(colores.guinda.principal, 0.1), color: colores.guinda.principal },
        colorSuccess: { backgroundColor: alpha(colores.exito, 0.1), color: colores.exito },
        colorWarning: { backgroundColor: alpha(colores.advertencia, 0.1), color: colores.advertencia },
        colorError: { backgroundColor: alpha(colores.error, 0.1), color: colores.error },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: colores.neutros.blanco,
          borderRadius: 12,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colores.guinda.palido,
            borderBottom: `2px solid ${colores.guinda.principal}`,
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, color: colores.guinda.oscuro },
          },
          '& .MuiDataGrid-row': {
            '&:hover': { backgroundColor: alpha(colores.guinda.principal, 0.04) },
            '&.Mui-selected': {
              backgroundColor: alpha(colores.guinda.principal, 0.08),
              '&:hover': { backgroundColor: alpha(colores.guinda.principal, 0.12) },
            },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colores.neutros.bordeClaro}`,
            '&:focus': { outline: `2px solid ${colores.guinda.principal}`, outlineOffset: -2 },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${colores.neutros.bordeClaro}`,
            backgroundColor: colores.neutros.fondoGris,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: colores.guinda.principal },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: colores.guinda.principal },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standardSuccess: { backgroundColor: alpha(colores.exito, 0.1), color: colores.exito },
        standardError: { backgroundColor: alpha(colores.error, 0.1), color: colores.error },
        standardWarning: { backgroundColor: alpha(colores.advertencia, 0.1), color: colores.advertencia },
        standardInfo: { backgroundColor: alpha(colores.info, 0.1), color: colores.info },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16 } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: colores.guinda.oscuro, fontSize: '0.8125rem', borderRadius: 6, padding: '8px 12px' },
        arrow: { color: colores.guinda.oscuro },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { backgroundColor: colores.guinda.principal, color: colores.neutros.blanco } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: alpha(colores.guinda.principal, 0.1) },
        bar: { borderRadius: 4, background: `linear-gradient(90deg, ${colores.guinda.principal} 0%, ${colores.rojo.principal} 100%)` },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': { backgroundColor: colores.guinda.palido, color: colores.guinda.oscuro, fontWeight: 700 },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: alpha(colores.guinda.principal, 0.04) } },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colores.neutros.bordeClaro}`,
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: '8px 0' },
        },
      },
    },
  },
}, esES);

export const coloresImperha = colores;
