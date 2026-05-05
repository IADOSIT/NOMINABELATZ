import { createTheme, alpha } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

const paleta = {
  azul: {
    principal: '#2563EB',
    oscuro: '#1D4ED8',
    claro: '#3B82F6',
    suave: '#93C5FD',
    palido: '#EFF6FF',
    sombra: 'rgba(37, 99, 235, 0.16)',
  },
  indigo: {
    principal: '#4F46E5',
    claro: '#6366F1',
    palido: '#EEF2FF',
  },
  neutros: {
    blanco: '#ffffff',
    fondoBase: '#F8FAFC',
    fondoGris: '#F1F5F9',
    bordeClaro: '#E2E8F0',
    bordeMedio: '#CBD5E1',
    textoOscuro: '#0F172A',
    textoMedio: '#334155',
    textoSecundario: '#64748B',
    textoTerciario: '#94A3B8',
  },
  exito: '#10B981',
  exitoPalido: '#ECFDF5',
  advertencia: '#F59E0B',
  advertenciaPalida: '#FFFBEB',
  error: '#EF4444',
  errorPalido: '#FEF2F2',
  info: '#3B82F6',
  infoPalido: '#EFF6FF',
};

export const temaImperha = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: paleta.azul.principal,
        dark: paleta.azul.oscuro,
        light: paleta.azul.claro,
        contrastText: '#ffffff',
      },
      secondary: {
        main: paleta.indigo.principal,
        dark: '#3730A3',
        light: paleta.indigo.claro,
        contrastText: '#ffffff',
      },
      error: { main: paleta.error },
      warning: { main: paleta.advertencia },
      success: { main: paleta.exito },
      info: { main: paleta.info },
      background: {
        default: paleta.neutros.fondoBase,
        paper: paleta.neutros.blanco,
      },
      text: {
        primary: paleta.neutros.textoOscuro,
        secondary: paleta.neutros.textoSecundario,
        disabled: paleta.neutros.textoTerciario,
      },
      divider: paleta.neutros.bordeClaro,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: paleta.neutros.textoOscuro },
      h2: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em', color: paleta.neutros.textoOscuro },
      h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontSize: '1.25rem', fontWeight: 600 },
      h5: { fontSize: '1.125rem', fontWeight: 600 },
      h6: { fontSize: '1rem', fontWeight: 600 },
      subtitle1: { fontSize: '0.9375rem', fontWeight: 500, color: paleta.neutros.textoSecundario },
      subtitle2: { fontSize: '0.875rem', fontWeight: 500, color: paleta.neutros.textoSecundario },
      body1: { fontSize: '0.9375rem', lineHeight: 1.6, color: paleta.neutros.textoMedio },
      body2: { fontSize: '0.875rem', lineHeight: 1.5, color: paleta.neutros.textoSecundario },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
      caption: { fontSize: '0.75rem', color: paleta.neutros.textoTerciario },
      overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em' },
    },
    shape: { borderRadius: 10 },
    shadows: [
      'none',
      '0 1px 2px 0 rgba(0,0,0,0.05)',
      '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
      '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
      '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.04)',
      '0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.04)',
      '0 25px 50px -12px rgba(0,0,0,0.12)',
      ...Array(18).fill('none'),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: paleta.neutros.fondoBase,
            scrollbarWidth: 'thin',
            scrollbarColor: `${paleta.neutros.bordeMedio} transparent`,
            '&::-webkit-scrollbar': { width: '6px', height: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: paleta.neutros.bordeMedio,
              borderRadius: '999px',
              '&:hover': { background: paleta.neutros.textoTerciario },
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '9px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
          },
          contained: {
            boxShadow: `0 1px 2px rgba(0,0,0,0.08)`,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 12px ${paleta.azul.sombra}`,
            },
            '&:active': { transform: 'translateY(0)' },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${paleta.azul.principal} 0%, ${paleta.indigo.principal} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${paleta.azul.oscuro} 0%, #3730A3 100%)`,
            },
          },
          outlined: {
            borderColor: paleta.neutros.bordeClaro,
            '&:hover': {
              borderColor: paleta.azul.principal,
              backgroundColor: paleta.azul.palido,
            },
          },
          text: {
            '&:hover': { backgroundColor: paleta.azul.palido },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${paleta.neutros.bordeClaro}`,
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(37,99,235,0.09), 0 2px 8px rgba(0,0,0,0.04)',
              borderColor: 'rgba(37,99,235,0.2)',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: 16 },
          outlined: { borderColor: paleta.neutros.bordeClaro },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(248,250,252,0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            color: paleta.neutros.textoOscuro,
            boxShadow: 'none',
            borderBottom: `1px solid ${paleta.neutros.bordeClaro}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: 'transparent',
            borderRight: `1px solid ${paleta.neutros.bordeClaro}`,
            color: paleta.neutros.textoOscuro,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: '1px 8px',
            padding: '8px 12px',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: alpha(paleta.azul.principal, 0.06),
              '& .MuiListItemIcon-root': { color: paleta.azul.principal },
            },
            '&.Mui-selected': {
              background: `linear-gradient(135deg, ${alpha(paleta.azul.principal, 0.12)} 0%, ${alpha(paleta.indigo.principal, 0.08)} 100%)`,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(paleta.azul.principal, 0.18)}`,
              boxShadow: `0 2px 8px ${alpha(paleta.azul.principal, 0.1)}`,
              color: paleta.azul.principal,
              '& .MuiListItemIcon-root': { color: paleta.azul.principal },
              '& .MuiListItemText-primary': { color: paleta.azul.principal, fontWeight: 700 },
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(paleta.azul.principal, 0.16)} 0%, ${alpha(paleta.indigo.principal, 0.12)} 100%)`,
              },
              '&::before': { display: 'none' },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: { color: paleta.neutros.textoSecundario, minWidth: 36, transition: 'color 0.15s' },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: paleta.neutros.blanco,
              '& fieldset': { borderColor: paleta.neutros.bordeClaro },
              '&:hover fieldset': { borderColor: paleta.neutros.bordeMedio },
              '&.Mui-focused fieldset': {
                borderColor: paleta.azul.principal,
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: paleta.azul.principal },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 500, fontSize: '0.8125rem' },
          colorPrimary: { backgroundColor: paleta.azul.palido, color: paleta.azul.principal },
          colorSecondary: { backgroundColor: paleta.indigo.palido, color: paleta.indigo.principal },
          colorSuccess: { backgroundColor: paleta.exitoPalido, color: paleta.exito },
          colorWarning: { backgroundColor: paleta.advertenciaPalida, color: paleta.advertencia },
          colorError: { backgroundColor: paleta.errorPalido, color: paleta.error },
          colorInfo: { backgroundColor: paleta.infoPalido, color: paleta.info },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            backgroundColor: paleta.neutros.blanco,
            borderRadius: 12,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: paleta.neutros.fondoGris,
              borderBottom: `1px solid ${paleta.neutros.bordeClaro}`,
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                color: paleta.neutros.textoMedio,
                fontSize: '0.8125rem',
              },
            },
            '& .MuiDataGrid-row': {
              '&:hover': { backgroundColor: paleta.neutros.fondoBase },
              '&.Mui-selected': {
                backgroundColor: paleta.azul.palido,
                '&:hover': { backgroundColor: alpha(paleta.azul.principal, 0.08) },
              },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${paleta.neutros.bordeClaro}`,
              color: paleta.neutros.textoMedio,
              '&:focus': { outline: `2px solid ${paleta.azul.principal}`, outlineOffset: -2 },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${paleta.neutros.bordeClaro}`,
              backgroundColor: paleta.neutros.fondoGris,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${paleta.neutros.bordeClaro}` },
          indicator: { height: 2, backgroundColor: paleta.azul.principal, borderRadius: '2px 2px 0 0' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            color: paleta.neutros.textoSecundario,
            '&.Mui-selected': { color: paleta.azul.principal, fontWeight: 600 },
            '&:hover': { color: paleta.azul.principal, opacity: 1 },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 10, border: '1px solid', fontSize: '0.875rem' },
          standardSuccess: {
            backgroundColor: paleta.exitoPalido,
            borderColor: alpha(paleta.exito, 0.2),
            color: '#065F46',
            '& .MuiAlert-icon': { color: paleta.exito },
          },
          standardError: {
            backgroundColor: paleta.errorPalido,
            borderColor: alpha(paleta.error, 0.2),
            color: '#991B1B',
            '& .MuiAlert-icon': { color: paleta.error },
          },
          standardWarning: {
            backgroundColor: paleta.advertenciaPalida,
            borderColor: alpha(paleta.advertencia, 0.2),
            color: '#92400E',
            '& .MuiAlert-icon': { color: paleta.advertencia },
          },
          standardInfo: {
            backgroundColor: paleta.infoPalido,
            borderColor: alpha(paleta.info, 0.2),
            color: '#1E40AF',
            '& .MuiAlert-icon': { color: paleta.info },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: paleta.neutros.textoOscuro,
            fontSize: '0.8125rem',
            borderRadius: 6,
            padding: '6px 10px',
          },
          arrow: { color: paleta.neutros.textoOscuro },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: { backgroundColor: paleta.azul.palido, color: paleta.azul.principal, fontWeight: 600 },
          colorDefault: { backgroundColor: paleta.neutros.fondoGris, color: paleta.neutros.textoSecundario },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 999, backgroundColor: paleta.neutros.bordeClaro, height: 6 },
          bar: {
            borderRadius: 999,
            background: `linear-gradient(90deg, ${paleta.azul.principal} 0%, ${paleta.indigo.principal} 100%)`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              backgroundColor: paleta.neutros.fondoGris,
              color: paleta.neutros.textoMedio,
              fontWeight: 600,
              fontSize: '0.8125rem',
              borderBottom: `1px solid ${paleta.neutros.bordeClaro}`,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover td': { backgroundColor: paleta.neutros.fondoBase },
            '& td': { borderBottom: `1px solid ${paleta.neutros.bordeClaro}`, color: paleta.neutros.textoMedio },
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: '10px !important',
            border: `1px solid ${paleta.neutros.bordeClaro}`,
            boxShadow: 'none',
            '&:before': { display: 'none' },
            '&.Mui-expanded': { margin: '8px 0' },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: paleta.neutros.bordeClaro },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            border: `1px solid ${paleta.neutros.bordeClaro}`,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -6px rgba(0,0,0,0.05)',
            marginTop: 4,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            margin: '2px 6px',
            fontSize: '0.875rem',
            '&:hover': { backgroundColor: paleta.neutros.fondoGris },
            '&.Mui-selected': { backgroundColor: paleta.azul.palido, color: paleta.azul.principal },
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: { fontWeight: 700, fontSize: '0.6875rem' },
        },
      },
    },
  },
  esES
);

export const coloresImperha = {
  ...paleta,
  // Alias de compatibilidad con páginas existentes
  guinda: {
    principal: paleta.azul.principal,
    oscuro: paleta.azul.oscuro,
    claro: paleta.azul.claro,
    suave: paleta.azul.suave,
    palido: paleta.azul.palido,
  },
  rojo: {
    principal: paleta.indigo.principal,
    oscuro: '#3730A3',
    claro: paleta.indigo.claro,
    acento: '#818CF8',
  },
  estado: {
    exito: paleta.exito,
    advertencia: paleta.advertencia,
    error: paleta.error,
    info: paleta.info,
  },
};
