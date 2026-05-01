// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Layout principal con menú completo
// Industria Azucarera / Ley Federal del Trabajo
// ===================================

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Collapse,
  Tooltip,
  Badge,
  alpha,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Calculate as CalculateIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon,
  SmartToy as SmartToyIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Factory as FactoryIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  EventNote as EventNoteIcon,
  Gavel as GavelIcon,
  Groups as GroupsIcon,
  MedicalServices as MedicalIcon,
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  Assignment as AssignmentIcon,
  Fingerprint as FingerprintIcon,
  Schedule as ScheduleIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Grass as GrassIcon,
  LocalShipping as ShippingIcon,
  Engineering as EngineeringIcon,
  Handshake as HandshakeIcon,
  HealthAndSafety as HealthIcon,
  School as SchoolIcon,
  FamilyRestroom as FamilyIcon,
  CardGiftcard as GiftIcon,
  LocalAtm as AtmIcon,
  CreditCard as CreditCardIcon,
  RequestQuote as RequestQuoteIcon,
  ReceiptLong as ReceiptLongIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Print as PrintIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManageAccountsIcon,
  VpnKey as VpnKeyIcon,
  Rule as RuleIcon,
  SwapHoriz as SwapIcon,
  FactCheck as FactCheckIcon,
  Tune as TuneIcon,
  Category as CategoryIcon,
  ListAlt as ListAltIcon,
  Summarize as SummarizeIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useEmpresaStore } from '../stores/empresaStore';
import { coloresImperha } from '../tema/temaImperha';
import AsistenteIA from '../components/AsistenteIA/AsistenteIA';

const anchoDrawer = 300;
const anchoDrawerColapsado = 72;

// Menú lateral completo enterprise
const menuItems = [
  {
    seccion: 'Principal',
    items: [
      {
        titulo: 'Dashboard',
        icono: <DashboardIcon />,
        ruta: '/dashboard',
        descripcion: 'Panel principal de control',
      },
    ],
  },
  {
    seccion: 'Recursos Humanos',
    items: [
      {
        titulo: 'Empleados',
        icono: <PeopleIcon />,
        subMenu: [
          { titulo: 'Catálogo de Empleados', ruta: '/empleados', icono: <PeopleIcon /> },
          { titulo: 'Expediente Digital', ruta: '/empleados/expediente', icono: <AssignmentIcon /> },
          { titulo: 'Altas y Bajas', ruta: '/empleados/movimientos', icono: <SwapIcon /> },
          { titulo: 'Contratos', ruta: '/empleados/contratos', icono: <GavelIcon /> },
          { titulo: 'Organigrama', ruta: '/empleados/organigrama', icono: <GroupsIcon /> },
        ],
      },
      {
        titulo: 'Estructura Organizacional',
        icono: <BusinessIcon />,
        subMenu: [
          { titulo: 'Departamentos', ruta: '/estructura/departamentos', icono: <BusinessIcon /> },
          { titulo: 'Puestos', ruta: '/estructura/puestos', icono: <EngineeringIcon /> },
          { titulo: 'Centros de Costo', ruta: '/estructura/centros-costo', icono: <AccountBalanceIcon /> },
          { titulo: 'Turnos', ruta: '/estructura/turnos', icono: <ScheduleIcon /> },
        ],
      },
      {
        titulo: 'Asistencias',
        icono: <FingerprintIcon />,
        subMenu: [
          { titulo: 'Control de Asistencia', ruta: '/asistencias', icono: <FingerprintIcon /> },
          { titulo: 'Incidencias', ruta: '/asistencias/incidencias', icono: <EventNoteIcon /> },
          { titulo: 'Vacaciones', ruta: '/asistencias/vacaciones', icono: <DateRangeIcon /> },
          { titulo: 'Permisos y Faltas', ruta: '/asistencias/permisos', icono: <FactCheckIcon /> },
          { titulo: 'Horas Extra', ruta: '/asistencias/horas-extra', icono: <ScheduleIcon /> },
          { titulo: 'Días Festivos', ruta: '/asistencias/festivos', icono: <CalendarIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Nómina',
    items: [
      {
        titulo: 'Proceso de Nómina',
        icono: <CalculateIcon />,
        subMenu: [
          { titulo: 'Periodos de Nómina', ruta: '/nomina/periodos', icono: <CalendarIcon /> },
          { titulo: 'Cálculo de Nómina', ruta: '/nomina/calculo', icono: <CalculateIcon /> },
          { titulo: 'Pre-Nómina', ruta: '/nomina/pre-nomina', icono: <AssignmentIcon /> },
          { titulo: 'Dispersión Bancaria', ruta: '/nomina/dispersion', icono: <AtmIcon /> },
          { titulo: 'Recibos de Nómina', ruta: '/nomina/recibos', icono: <ReceiptLongIcon /> },
          { titulo: 'Histórico de Nóminas', ruta: '/nomina/historico', icono: <HistoryIcon /> },
        ],
      },
      {
        titulo: 'Percepciones',
        icono: <TrendingUpIcon />,
        subMenu: [
          { titulo: 'Catálogo de Percepciones', ruta: '/percepciones', icono: <ListAltIcon /> },
          { titulo: 'Sueldo Base', ruta: '/percepciones/sueldo', icono: <MoneyIcon /> },
          { titulo: 'Bonos y Comisiones', ruta: '/percepciones/bonos', icono: <GiftIcon /> },
          { titulo: 'Prestaciones', ruta: '/percepciones/prestaciones', icono: <HealthIcon /> },
          { titulo: 'Tiempo Extra', ruta: '/percepciones/tiempo-extra', icono: <ScheduleIcon /> },
          { titulo: 'Prima Dominical', ruta: '/percepciones/prima-dominical', icono: <CalendarIcon /> },
          { titulo: 'Aguinaldo', ruta: '/percepciones/aguinaldo', icono: <GiftIcon /> },
          { titulo: 'PTU', ruta: '/percepciones/ptu', icono: <PieChartIcon /> },
        ],
      },
      {
        titulo: 'Deducciones',
        icono: <WalletIcon />,
        subMenu: [
          { titulo: 'Catálogo de Deducciones', ruta: '/deducciones', icono: <ListAltIcon /> },
          { titulo: 'ISR', ruta: '/deducciones/isr', icono: <RequestQuoteIcon /> },
          { titulo: 'IMSS', ruta: '/deducciones/imss', icono: <MedicalIcon /> },
          { titulo: 'INFONAVIT', ruta: '/deducciones/infonavit', icono: <HomeIcon /> },
          { titulo: 'Préstamos', ruta: '/deducciones/prestamos', icono: <CreditCardIcon /> },
          { titulo: 'Pensión Alimenticia', ruta: '/deducciones/pension', icono: <FamilyIcon /> },
          { titulo: 'Cuota Sindical', ruta: '/deducciones/sindicato', icono: <GroupsIcon /> },
          { titulo: 'Caja de Ahorro', ruta: '/deducciones/ahorro', icono: <WalletIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Industria Azucarera',
    items: [
      {
        titulo: 'Zafra',
        icono: <GrassIcon />,
        subMenu: [
          { titulo: 'Periodos de Zafra', ruta: '/zafra/periodos', icono: <DateRangeIcon /> },
          { titulo: 'Personal de Zafra', ruta: '/zafra/personal', icono: <PeopleIcon /> },
          { titulo: 'Bonos de Productividad', ruta: '/zafra/bonos', icono: <TrendingUpIcon /> },
          { titulo: 'Liquidación de Zafra', ruta: '/zafra/liquidacion', icono: <ReceiptIcon /> },
          { titulo: 'Transporte de Caña', ruta: '/zafra/transporte', icono: <ShippingIcon /> },
        ],
      },
      {
        titulo: 'Contrato Ley Azucarero',
        icono: <GavelIcon />,
        subMenu: [
          { titulo: 'Prestaciones de Ley', ruta: '/contrato-ley/prestaciones', icono: <HealthIcon /> },
          { titulo: 'Escalafón', ruta: '/contrato-ley/escalafon', icono: <TrendingUpIcon /> },
          { titulo: 'Tabuladores', ruta: '/contrato-ley/tabuladores', icono: <TableChartIcon /> },
          { titulo: 'Categorías Sindicales', ruta: '/contrato-ley/categorias', icono: <CategoryIcon /> },
          { titulo: 'Jornadas Especiales', ruta: '/contrato-ley/jornadas', icono: <ScheduleIcon /> },
        ],
      },
      {
        titulo: 'Sindicato',
        icono: <HandshakeIcon />,
        subMenu: [
          { titulo: 'Registro Sindical', ruta: '/sindicato/registro', icono: <GroupsIcon /> },
          { titulo: 'Cuotas Sindicales', ruta: '/sindicato/cuotas', icono: <MoneyIcon /> },
          { titulo: 'Representantes', ruta: '/sindicato/representantes', icono: <PeopleIcon /> },
          { titulo: 'Acuerdos', ruta: '/sindicato/acuerdos', icono: <GavelIcon /> },
          { titulo: 'Fondo de Ahorro Sindical', ruta: '/sindicato/fondo-ahorro', icono: <WalletIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Fiscal y Contable',
    items: [
      {
        titulo: 'CFDI Nómina',
        icono: <ReceiptIcon />,
        subMenu: [
          { titulo: 'Timbrado de Recibos', ruta: '/cfdi/timbrado', icono: <ReceiptIcon /> },
          { titulo: 'Cancelaciones', ruta: '/cfdi/cancelaciones', icono: <SwapIcon /> },
          { titulo: 'Acuses SAT', ruta: '/cfdi/acuses', icono: <FactCheckIcon /> },
          { titulo: 'Descarga Masiva', ruta: '/cfdi/descarga', icono: <DownloadIcon /> },
          { titulo: 'Configuración PAC', ruta: '/cfdi/configuracion', icono: <TuneIcon /> },
        ],
      },
      {
        titulo: 'Seguridad Social',
        icono: <MedicalIcon />,
        subMenu: [
          { titulo: 'SUA / IDSE', ruta: '/imss/sua', icono: <MedicalIcon /> },
          { titulo: 'Movimientos Afiliatorios', ruta: '/imss/movimientos', icono: <SwapIcon /> },
          { titulo: 'Determinación de Cuotas', ruta: '/imss/cuotas', icono: <CalculateIcon /> },
          { titulo: 'SDI / SBC', ruta: '/imss/sdi', icono: <MoneyIcon /> },
          { titulo: 'Prima de Riesgo', ruta: '/imss/prima-riesgo', icono: <HealthIcon /> },
          { titulo: 'Incapacidades', ruta: '/imss/incapacidades', icono: <MedicalIcon /> },
        ],
      },
      {
        titulo: 'Contabilidad',
        icono: <AccountBalanceIcon />,
        subMenu: [
          { titulo: 'Pólizas de Nómina', ruta: '/contabilidad/polizas', icono: <ReceiptLongIcon /> },
          { titulo: 'Cuentas Contables', ruta: '/contabilidad/cuentas', icono: <ListAltIcon /> },
          { titulo: 'Centros de Costo', ruta: '/contabilidad/centros-costo', icono: <BusinessIcon /> },
          { titulo: 'Provisiones', ruta: '/contabilidad/provisiones', icono: <WalletIcon /> },
          { titulo: 'Conciliación Bancaria', ruta: '/contabilidad/conciliacion', icono: <FactCheckIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Reportes y Análisis',
    items: [
      {
        titulo: 'Reportes',
        icono: <AssessmentIcon />,
        subMenu: [
          { titulo: 'Nómina por Periodo', ruta: '/reportes/nomina-periodo', icono: <ReceiptLongIcon /> },
          { titulo: 'Acumulados Anuales', ruta: '/reportes/acumulados', icono: <BarChartIcon /> },
          { titulo: 'Plantilla de Personal', ruta: '/reportes/plantilla', icono: <PeopleIcon /> },
          { titulo: 'Costo de Nómina', ruta: '/reportes/costo-nomina', icono: <MoneyIcon /> },
          { titulo: 'Rotación de Personal', ruta: '/reportes/rotacion', icono: <SwapIcon /> },
          { titulo: 'Reportes IMSS', ruta: '/reportes/imss', icono: <MedicalIcon /> },
          { titulo: 'Reportes ISR', ruta: '/reportes/isr', icono: <RequestQuoteIcon /> },
          { titulo: 'Reportes Personalizados', ruta: '/reportes/personalizados', icono: <TuneIcon /> },
        ],
      },
      {
        titulo: 'Dashboards',
        icono: <PieChartIcon />,
        subMenu: [
          { titulo: 'KPIs de Nómina', ruta: '/dashboards/nomina', icono: <BarChartIcon /> },
          { titulo: 'Análisis de Costos', ruta: '/dashboards/costos', icono: <MoneyIcon /> },
          { titulo: 'Indicadores de RH', ruta: '/dashboards/rh', icono: <PeopleIcon /> },
          { titulo: 'Productividad Zafra', ruta: '/dashboards/zafra', icono: <GrassIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Importaciones',
    items: [
      {
        titulo: 'Carga de Datos',
        icono: <UploadIcon />,
        subMenu: [
          { titulo: 'Importar Empleados', ruta: '/importar/empleados', icono: <PeopleIcon /> },
          { titulo: 'Importar Asistencias', ruta: '/importar/asistencias', icono: <FingerprintIcon /> },
          { titulo: 'Importar Incidencias', ruta: '/importar/incidencias', icono: <EventNoteIcon /> },
          { titulo: 'Importar Movimientos', ruta: '/importar/movimientos', icono: <SwapIcon /> },
          { titulo: 'Plantillas Excel', ruta: '/importar/plantillas', icono: <TableChartIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Administración',
    items: [
      {
        titulo: 'Seguridad',
        icono: <SecurityIcon />,
        subMenu: [
          { titulo: 'Usuarios', ruta: '/seguridad/usuarios', icono: <PeopleIcon /> },
          { titulo: 'Roles', ruta: '/seguridad/roles', icono: <AdminIcon /> },
          { titulo: 'Permisos', ruta: '/seguridad/permisos', icono: <VpnKeyIcon /> },
          { titulo: 'Sesiones Activas', ruta: '/seguridad/sesiones', icono: <ManageAccountsIcon /> },
          { titulo: 'Políticas de Seguridad', ruta: '/seguridad/politicas', icono: <RuleIcon /> },
        ],
      },
      {
        titulo: 'Auditoría',
        icono: <HistoryIcon />,
        subMenu: [
          { titulo: 'Bitácora de Accesos', ruta: '/auditoria/accesos', icono: <VpnKeyIcon /> },
          { titulo: 'Cambios en Sistema', ruta: '/auditoria/cambios', icono: <SwapIcon /> },
          { titulo: 'Historial de Nómina', ruta: '/auditoria/nomina', icono: <ReceiptIcon /> },
          { titulo: 'Exportar Auditoría', ruta: '/auditoria/exportar', icono: <DownloadIcon /> },
        ],
      },
      {
        titulo: 'Configuración',
        icono: <SettingsIcon />,
        subMenu: [
          { titulo: 'Empresa e Ingenios', ruta: '/configuracion/empresa', icono: <BusinessIcon /> },
          { titulo: 'Parámetros de Nómina', ruta: '/configuracion/nomina', icono: <TuneIcon /> },
          { titulo: 'Tablas ISR', ruta: '/configuracion/isr', icono: <TableChartIcon /> },
          { titulo: 'Tablas IMSS', ruta: '/configuracion/imss', icono: <MedicalIcon /> },
          { titulo: 'Catálogos SAT', ruta: '/configuracion/sat', icono: <CategoryIcon /> },
          { titulo: 'Correo y Notificaciones', ruta: '/configuracion/notificaciones', icono: <NotificationsIcon /> },
          { titulo: 'Respaldos', ruta: '/configuracion/respaldos', icono: <DownloadIcon /> },
        ],
      },
    ],
  },
];

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuthStore();
  const { empresaSeleccionada, ingenioSeleccionado, limpiarSeleccion } = useEmpresaStore();

  const [drawerAbierto, setDrawerAbierto] = useState(true);
  const [menuUsuarioAnchor, setMenuUsuarioAnchor] = useState<null | HTMLElement>(null);
  const [subMenusAbiertos, setSubMenusAbiertos] = useState<Record<string, boolean>>({});
  const [mostrarAsistente, setMostrarAsistente] = useState(false);

  const toggleDrawer = () => setDrawerAbierto(!drawerAbierto);

  const toggleSubMenu = (titulo: string) => {
    setSubMenusAbiertos((prev) => ({ ...prev, [titulo]: !prev[titulo] }));
  };

  const handleMenuUsuarioAbrir = (event: React.MouseEvent<HTMLElement>) => {
    setMenuUsuarioAnchor(event.currentTarget);
  };

  const handleMenuUsuarioCerrar = () => setMenuUsuarioAnchor(null);

  const handleCerrarSesion = () => {
    handleMenuUsuarioCerrar();
    logout();
    navigate('/login');
  };

  const handleCambiarEmpresa = () => {
    limpiarSeleccion();
    navigate('/seleccionar-empresa');
  };

  const esRutaActiva = (ruta: string) => {
    return location.pathname === ruta || location.pathname.startsWith(ruta + '/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar Superior */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerAbierto ? anchoDrawer : anchoDrawerColapsado}px)`,
          ml: `${drawerAbierto ? anchoDrawer : anchoDrawerColapsado}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${coloresImperha.neutros.bordeClaro}`,
          transition: 'width 0.2s, margin-left 0.2s',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
            {drawerAbierto ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          {/* Selector de empresa/ingenio */}
          <Button
            onClick={handleCambiarEmpresa}
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': { bgcolor: alpha(coloresImperha.guinda.principal, 0.04) },
            }}
            startIcon={
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: coloresImperha.guinda.principal,
                  fontSize: '0.875rem',
                }}
              >
                <FactoryIcon fontSize="small" />
              </Avatar>
            }
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                {empresaSeleccionada?.nombreComercial || 'Seleccionar Empresa'}
              </Typography>
              {ingenioSeleccionado && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {ingenioSeleccionado.nombre}
                  {ingenioSeleccionado.enZafra && (
                    <Chip label="ZAFRA" size="small" color="success" sx={{ height: 16, fontSize: '0.625rem' }} />
                  )}
                </Typography>
              )}
            </Box>
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Asistente IA */}
          <Tooltip title="Asistente IA">
            <IconButton
              onClick={() => setMostrarAsistente(!mostrarAsistente)}
              sx={{
                mr: 2,
                bgcolor: mostrarAsistente ? alpha(coloresImperha.guinda.principal, 0.1) : 'transparent',
                color: coloresImperha.guinda.principal,
              }}
            >
              <SmartToyIcon />
            </IconButton>
          </Tooltip>

          {/* Usuario */}
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: coloresImperha.guinda.principal }}>
                {usuario?.nombreCompleto?.charAt(0) || 'U'}
              </Avatar>
            }
            label={
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" fontWeight={500}>
                  {usuario?.nombreCompleto || 'Usuario'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {usuario?.rol || 'Administrador'}
                </Typography>
              </Box>
            }
            onClick={handleMenuUsuarioAbrir}
            sx={{
              height: 'auto',
              py: 0.5,
              cursor: 'pointer',
              '& .MuiChip-label': { px: 1 },
            }}
          />

          <Menu anchorEl={menuUsuarioAnchor} open={Boolean(menuUsuarioAnchor)} onClose={handleMenuUsuarioCerrar}>
            <MenuItem onClick={() => { handleMenuUsuarioCerrar(); navigate('/perfil'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleMenuUsuarioCerrar(); navigate('/configuracion'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Configuración
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCerrarSesion} sx={{ color: 'error.main' }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer Lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerAbierto ? anchoDrawer : anchoDrawerColapsado,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerAbierto ? anchoDrawer : anchoDrawerColapsado,
            boxSizing: 'border-box',
            transition: 'width 0.2s',
            overflowX: 'hidden',
            bgcolor: coloresImperha.guinda.oscuro,
            color: '#fff',
            borderRight: 'none',
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${coloresImperha.guinda.principal} 0%, ${coloresImperha.rojo.principal} 100%)`,
          }}
        >
          {drawerAbierto ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 2 }}>
                IMPERHA
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 4 }}>
                NÓMINAS
              </Typography>
            </Box>
          ) : (
            <Typography variant="h5" fontWeight={800}>
              IN
            </Typography>
          )}
        </Box>

        {/* Menú */}
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, py: 1 }}>
          {menuItems.map((seccion, idx) => (
            <Box key={idx}>
              {drawerAbierto && (
                <Typography
                  variant="overline"
                  sx={{
                    px: 3,
                    py: 1.5,
                    display: 'block',
                    color: alpha('#fff', 0.5),
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    letterSpacing: 1.5,
                  }}
                >
                  {seccion.seccion}
                </Typography>
              )}

              <List component="nav" disablePadding>
                {seccion.items.map((item) => {
                  if (item.subMenu) {
                    const subMenuAbierto = subMenusAbiertos[item.titulo];
                    const tieneRutaActiva = item.subMenu.some((sub) => esRutaActiva(sub.ruta));

                    return (
                      <Box key={item.titulo}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => toggleSubMenu(item.titulo)}
                            sx={{
                              minHeight: 44,
                              px: 2.5,
                              mx: 1,
                              borderRadius: 2,
                              bgcolor: tieneRutaActiva ? alpha('#fff', 0.1) : 'transparent',
                              '&:hover': { bgcolor: alpha('#fff', 0.08) },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36, color: tieneRutaActiva ? '#fff' : alpha('#fff', 0.7) }}>
                              {item.icono}
                            </ListItemIcon>
                            {drawerAbierto && (
                              <>
                                <ListItemText
                                  primary={item.titulo}
                                  primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: tieneRutaActiva ? 600 : 400,
                                  }}
                                />
                                {subMenuAbierto ? <ExpandLess /> : <ExpandMore />}
                              </>
                            )}
                          </ListItemButton>
                        </ListItem>

                        {drawerAbierto && (
                          <Collapse in={subMenuAbierto} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {item.subMenu.map((subItem) => (
                                <ListItemButton
                                  key={subItem.titulo}
                                  onClick={() => navigate(subItem.ruta)}
                                  sx={{
                                    pl: 5,
                                    py: 0.75,
                                    mx: 1,
                                    borderRadius: 1,
                                    bgcolor: esRutaActiva(subItem.ruta) ? alpha('#fff', 0.15) : 'transparent',
                                    borderLeft: esRutaActiva(subItem.ruta)
                                      ? `3px solid ${coloresImperha.rojo.acento}`
                                      : '3px solid transparent',
                                    '&:hover': { bgcolor: alpha('#fff', 0.08) },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 28, color: alpha('#fff', 0.6) }}>
                                    {subItem.icono}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={subItem.titulo}
                                    primaryTypographyProps={{
                                      fontSize: '0.8125rem',
                                      fontWeight: esRutaActiva(subItem.ruta) ? 600 : 400,
                                      color: esRutaActiva(subItem.ruta) ? '#fff' : alpha('#fff', 0.85),
                                    }}
                                  />
                                </ListItemButton>
                              ))}
                            </List>
                          </Collapse>
                        )}
                      </Box>
                    );
                  }

                  return (
                    <ListItem key={item.titulo} disablePadding>
                      <ListItemButton
                        onClick={() => navigate(item.ruta!)}
                        sx={{
                          minHeight: 44,
                          px: 2.5,
                          mx: 1,
                          borderRadius: 2,
                          bgcolor: esRutaActiva(item.ruta!) ? alpha('#fff', 0.15) : 'transparent',
                          borderLeft: esRutaActiva(item.ruta!)
                            ? `3px solid ${coloresImperha.rojo.acento}`
                            : '3px solid transparent',
                          '&:hover': { bgcolor: alpha('#fff', 0.08) },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color: esRutaActiva(item.ruta!) ? '#fff' : alpha('#fff', 0.7),
                          }}
                        >
                          {item.icono}
                        </ListItemIcon>
                        {drawerAbierto && (
                          <ListItemText
                            primary={item.titulo}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              fontWeight: esRutaActiva(item.ruta!) ? 600 : 400,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>

              {idx < menuItems.length - 1 && (
                <Divider sx={{ my: 1, borderColor: alpha('#fff', 0.1) }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Footer del drawer */}
        {drawerAbierto && (
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${alpha('#fff', 0.1)}`,
              bgcolor: alpha('#000', 0.2),
            }}
          >
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'block' }}>
              IMPERHA NÓMINAS v1.0.0
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.4), fontSize: '0.65rem' }}>
              Contrato Ley Azucarero • LFT • SAT
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerAbierto ? anchoDrawer : anchoDrawerColapsado}px)`,
          mt: '64px',
          bgcolor: coloresImperha.neutros.fondoClaro,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>

      {/* Asistente IA */}
      {mostrarAsistente && <AsistenteIA onCerrar={() => setMostrarAsistente(false)} />}
    </Box>
  );
}

export default AppShell;
