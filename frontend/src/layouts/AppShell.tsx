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
  FamilyRestroom as FamilyIcon,
  CardGiftcard as GiftIcon,
  LocalAtm as AtmIcon,
  CreditCard as CreditCardIcon,
  RequestQuote as RequestQuoteIcon,
  ReceiptLong as ReceiptLongIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManageAccountsIcon,
  VpnKey as VpnKeyIcon,
  SwapHoriz as SwapIcon,
  FactCheck as FactCheckIcon,
  Tune as TuneIcon,
  Category as CategoryIcon,
  ListAlt as ListAltIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useEmpresaStore } from '../stores/empresaStore';
import { coloresImperha } from '../tema/temaImperha';
import AsistenteIA from '../components/AsistenteIA/AsistenteIA';

const DW = 260;
const DC = 64;

const menuItems = [
  {
    seccion: 'Principal',
    items: [{ titulo: 'Dashboard', icono: <DashboardIcon />, ruta: '/dashboard' }],
  },
  {
    seccion: 'Recursos Humanos',
    items: [
      {
        titulo: 'Empleados', icono: <PeopleIcon />,
        subMenu: [
          { titulo: 'Catálogo', ruta: '/empleados', icono: <PeopleIcon /> },
          { titulo: 'Expediente Digital', ruta: '/empleados/expediente', icono: <AssignmentIcon /> },
          { titulo: 'Altas y Bajas', ruta: '/empleados/movimientos', icono: <SwapIcon /> },
          { titulo: 'Contratos', ruta: '/empleados/contratos', icono: <GavelIcon /> },
          { titulo: 'Organigrama', ruta: '/empleados/organigrama', icono: <GroupsIcon /> },
        ],
      },
      {
        titulo: 'Estructura Org.', icono: <BusinessIcon />,
        subMenu: [
          { titulo: 'Departamentos', ruta: '/estructura/departamentos', icono: <BusinessIcon /> },
          { titulo: 'Puestos', ruta: '/estructura/puestos', icono: <EngineeringIcon /> },
          { titulo: 'Centros de Costo', ruta: '/estructura/centros-costo', icono: <AccountBalanceIcon /> },
          { titulo: 'Turnos', ruta: '/estructura/turnos', icono: <ScheduleIcon /> },
        ],
      },
      {
        titulo: 'Asistencias', icono: <FingerprintIcon />,
        subMenu: [
          { titulo: 'Control', ruta: '/asistencias', icono: <FingerprintIcon /> },
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
        titulo: 'Proceso', icono: <CalculateIcon />,
        subMenu: [
          { titulo: 'Periodos', ruta: '/nomina/periodos', icono: <CalendarIcon /> },
          { titulo: 'Cálculo', ruta: '/nomina/calculo', icono: <CalculateIcon /> },
          { titulo: 'Pre-Nómina', ruta: '/nomina/pre-nomina', icono: <AssignmentIcon /> },
          { titulo: 'Dispersión Bancaria', ruta: '/nomina/dispersion', icono: <AtmIcon /> },
          { titulo: 'Recibos', ruta: '/nomina/recibos', icono: <ReceiptLongIcon /> },
          { titulo: 'Histórico', ruta: '/nomina/historico', icono: <HistoryIcon /> },
        ],
      },
      {
        titulo: 'Percepciones', icono: <TrendingUpIcon />,
        subMenu: [
          { titulo: 'Catálogo', ruta: '/percepciones', icono: <ListAltIcon /> },
          { titulo: 'Sueldo Base', ruta: '/percepciones/sueldo', icono: <MoneyIcon /> },
          { titulo: 'Bonos', ruta: '/percepciones/bonos', icono: <GiftIcon /> },
          { titulo: 'Aguinaldo', ruta: '/percepciones/aguinaldo', icono: <GiftIcon /> },
          { titulo: 'PTU', ruta: '/percepciones/ptu', icono: <PieChartIcon /> },
        ],
      },
      {
        titulo: 'Deducciones', icono: <WalletIcon />,
        subMenu: [
          { titulo: 'Catálogo', ruta: '/deducciones', icono: <ListAltIcon /> },
          { titulo: 'ISR', ruta: '/deducciones/isr', icono: <RequestQuoteIcon /> },
          { titulo: 'IMSS', ruta: '/deducciones/imss', icono: <MedicalIcon /> },
          { titulo: 'INFONAVIT', ruta: '/deducciones/infonavit', icono: <HomeIcon /> },
          { titulo: 'Préstamos', ruta: '/deducciones/prestamos', icono: <CreditCardIcon /> },
          { titulo: 'Pensión Alimenticia', ruta: '/deducciones/pension', icono: <FamilyIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Industria Azucarera',
    items: [
      {
        titulo: 'Zafra', icono: <GrassIcon />,
        subMenu: [
          { titulo: 'Periodos de Zafra', ruta: '/zafra/periodos', icono: <DateRangeIcon /> },
          { titulo: 'Personal de Zafra', ruta: '/zafra/personal', icono: <PeopleIcon /> },
          { titulo: 'Bonos Productividad', ruta: '/zafra/bonos', icono: <TrendingUpIcon /> },
          { titulo: 'Liquidación', ruta: '/zafra/liquidacion', icono: <ReceiptIcon /> },
          { titulo: 'Transporte Caña', ruta: '/zafra/transporte', icono: <ShippingIcon /> },
        ],
      },
      {
        titulo: 'Contrato Ley', icono: <GavelIcon />,
        subMenu: [
          { titulo: 'Prestaciones', ruta: '/contrato-ley/prestaciones', icono: <HealthIcon /> },
          { titulo: 'Escalafón', ruta: '/contrato-ley/escalafon', icono: <TrendingUpIcon /> },
          { titulo: 'Tabuladores', ruta: '/contrato-ley/tabuladores', icono: <TableChartIcon /> },
          { titulo: 'Categorías', ruta: '/contrato-ley/categorias', icono: <CategoryIcon /> },
        ],
      },
      {
        titulo: 'Sindicato', icono: <HandshakeIcon />,
        subMenu: [
          { titulo: 'Registro', ruta: '/sindicato/registro', icono: <GroupsIcon /> },
          { titulo: 'Cuotas', ruta: '/sindicato/cuotas', icono: <MoneyIcon /> },
          { titulo: 'Representantes', ruta: '/sindicato/representantes', icono: <PeopleIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Fiscal',
    items: [
      {
        titulo: 'CFDI Nómina', icono: <ReceiptIcon />,
        subMenu: [
          { titulo: 'Timbrado', ruta: '/cfdi/timbrado', icono: <ReceiptIcon /> },
          { titulo: 'Cancelaciones', ruta: '/cfdi/cancelaciones', icono: <SwapIcon /> },
          { titulo: 'Acuses SAT', ruta: '/cfdi/acuses', icono: <FactCheckIcon /> },
          { titulo: 'Config. PAC', ruta: '/cfdi/configuracion', icono: <TuneIcon /> },
        ],
      },
      {
        titulo: 'Seguridad Social', icono: <MedicalIcon />,
        subMenu: [
          { titulo: 'SUA / IDSE', ruta: '/imss/sua', icono: <MedicalIcon /> },
          { titulo: 'Movimientos', ruta: '/imss/movimientos', icono: <SwapIcon /> },
          { titulo: 'Cuotas', ruta: '/imss/cuotas', icono: <CalculateIcon /> },
          { titulo: 'Incapacidades', ruta: '/imss/incapacidades', icono: <MedicalIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Reportes',
    items: [
      {
        titulo: 'Reportes', icono: <AssessmentIcon />,
        subMenu: [
          { titulo: 'Nómina por Periodo', ruta: '/reportes/nomina-periodo', icono: <ReceiptLongIcon /> },
          { titulo: 'Acumulados', ruta: '/reportes/acumulados', icono: <BarChartIcon /> },
          { titulo: 'Plantilla', ruta: '/reportes/plantilla', icono: <PeopleIcon /> },
          { titulo: 'Costo Nómina', ruta: '/reportes/costo-nomina', icono: <MoneyIcon /> },
        ],
      },
      {
        titulo: 'Dashboards', icono: <PieChartIcon />,
        subMenu: [
          { titulo: 'KPIs Nómina', ruta: '/dashboards/nomina', icono: <BarChartIcon /> },
          { titulo: 'Análisis Costos', ruta: '/dashboards/costos', icono: <MoneyIcon /> },
          { titulo: 'Indicadores RH', ruta: '/dashboards/rh', icono: <PeopleIcon /> },
          { titulo: 'Productividad Zafra', ruta: '/dashboards/zafra', icono: <GrassIcon /> },
        ],
      },
    ],
  },
  {
    seccion: 'Administración',
    items: [
      {
        titulo: 'Seguridad', icono: <SecurityIcon />,
        subMenu: [
          { titulo: 'Usuarios', ruta: '/seguridad/usuarios', icono: <PeopleIcon /> },
          { titulo: 'Roles', ruta: '/seguridad/roles', icono: <AdminIcon /> },
          { titulo: 'Permisos', ruta: '/seguridad/permisos', icono: <VpnKeyIcon /> },
          { titulo: 'Sesiones', ruta: '/seguridad/sesiones', icono: <ManageAccountsIcon /> },
        ],
      },
      {
        titulo: 'Configuración', icono: <SettingsIcon />,
        subMenu: [
          { titulo: 'Empresa', ruta: '/configuracion/empresa', icono: <BusinessIcon /> },
          { titulo: 'Parámetros Nómina', ruta: '/configuracion/nomina', icono: <TuneIcon /> },
          { titulo: 'Tablas ISR', ruta: '/configuracion/isr', icono: <TableChartIcon /> },
          { titulo: 'Catálogos SAT', ruta: '/configuracion/sat', icono: <CategoryIcon /> },
        ],
      },
    ],
  },
];

const AZUL = coloresImperha.azul.principal;
const BORDE = coloresImperha.neutros.bordeClaro;
const TEXTO_SEC = coloresImperha.neutros.textoSecundario;

// M3 Expressive pill active item style
const activeItemSx = {
  background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(79,70,229,0.08) 100%)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(37,99,235,0.18)',
  boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
  color: AZUL,
  '& .MuiListItemIcon-root': { color: AZUL },
  '& .MuiListItemText-primary': { color: AZUL, fontWeight: 700 },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(79,70,229,0.12) 100%)',
  },
  '&::before': { display: 'none' },
};

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuthStore();
  const { empresaSeleccionada, ingenioSeleccionado, limpiarSeleccion } = useEmpresaStore();

  const [drawerAbierto, setDrawerAbierto] = useState(true);
  const [menuUsuarioAnchor, setMenuUsuarioAnchor] = useState<null | HTMLElement>(null);
  const [subMenusAbiertos, setSubMenusAbiertos] = useState<Record<string, boolean>>({});
  const [mostrarAsistente, setMostrarAsistente] = useState(false);

  const toggleDrawer = () => setDrawerAbierto((p) => !p);
  const toggleSubMenu = (t: string) => setSubMenusAbiertos((p) => ({ ...p, [t]: !p[t] }));
  const handleMenuUsuarioAbrir = (e: React.MouseEvent<HTMLElement>) => setMenuUsuarioAnchor(e.currentTarget);
  const handleMenuUsuarioCerrar = () => setMenuUsuarioAnchor(null);
  const handleCerrarSesion = () => { handleMenuUsuarioCerrar(); logout(); navigate('/login'); };
  const esRutaActiva = (ruta: string) => location.pathname === ruta || location.pathname.startsWith(ruta + '/');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* ── Glass AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerAbierto ? DW : DC}px)`,
          ml: `${drawerAbierto ? DW : DC}px`,
          bgcolor: 'rgba(248,250,252,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${BORDE}`,
          color: 'text.primary',
          boxShadow: 'none',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Toolbar sx={{ minHeight: 60, gap: 1, px: { xs: 2, sm: 3 } }}>
          {/* Toggle button */}
          <IconButton
            onClick={toggleDrawer} size="small"
            sx={{
              color: TEXTO_SEC, borderRadius: 2.5,
              border: `1px solid ${BORDE}`,
              '&:hover': { bgcolor: coloresImperha.azul.palido, borderColor: AZUL, color: AZUL },
              transition: 'all 0.15s',
            }}
          >
            {drawerAbierto ? <ChevronLeftIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>

          {/* Empresa selector */}
          <Button
            onClick={() => { limpiarSeleccion(); navigate('/seleccionar-empresa'); }}
            size="small"
            sx={{
              ml: 1, textTransform: 'none', color: 'text.primary',
              borderRadius: 3, px: 1.5, py: 0.75, gap: 1,
              border: `1px solid ${BORDE}`,
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              '&:hover': { bgcolor: coloresImperha.azul.palido, borderColor: AZUL },
              transition: 'all 0.15s',
            }}
          >
            <Avatar sx={{ width: 26, height: 26, bgcolor: coloresImperha.azul.palido, color: AZUL }}>
              <FactoryIcon sx={{ fontSize: 14 }} />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2, fontSize: '0.8125rem' }}>
                {empresaSeleccionada?.nombreComercial || 'Seleccionar Empresa'}
              </Typography>
              {ingenioSeleccionado && (
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {ingenioSeleccionado.nombre}
                  {ingenioSeleccionado.enZafra && (
                    <Chip label="ZAFRA" size="small" color="success" sx={{ height: 14, fontSize: '0.55rem', ml: 0.5 }} />
                  )}
                </Typography>
              )}
            </Box>
            <ArrowDownIcon sx={{ fontSize: 14, color: TEXTO_SEC }} />
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}
          <Tooltip title="Notificaciones">
            <IconButton
              size="small"
              sx={{
                color: TEXTO_SEC, borderRadius: 2.5,
                border: `1px solid ${BORDE}`,
                background: 'rgba(255,255,255,0.7)',
                '&:hover': { bgcolor: coloresImperha.azul.palido, borderColor: AZUL, color: AZUL },
              }}
            >
              <Badge badgeContent={5} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* AI Assistant */}
          <Tooltip title="Asistente IA">
            <IconButton
              size="small"
              onClick={() => setMostrarAsistente(!mostrarAsistente)}
              sx={{
                borderRadius: 2.5, border: `1px solid ${mostrarAsistente ? AZUL : BORDE}`,
                background: mostrarAsistente ? coloresImperha.azul.palido : 'rgba(255,255,255,0.7)',
                color: mostrarAsistente ? AZUL : TEXTO_SEC,
                '&:hover': { bgcolor: coloresImperha.azul.palido, borderColor: AZUL, color: AZUL },
              }}
            >
              <SmartToyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* User menu */}
          <Box
            onClick={handleMenuUsuarioAbrir}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              cursor: 'pointer', px: 1.5, py: 0.75, borderRadius: 3,
              border: `1px solid ${BORDE}`,
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              ml: 0.5,
              '&:hover': { bgcolor: coloresImperha.azul.palido, borderColor: AZUL },
              transition: 'all 0.15s',
            }}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: coloresImperha.azul.palido, color: AZUL, fontSize: '0.8rem', fontWeight: 700 }}>
              {usuario?.nombreCompleto?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2, fontSize: '0.8125rem' }}>
                {usuario?.nombreCompleto || 'Usuario'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                {usuario?.rol || 'Administrador'}
              </Typography>
            </Box>
            <ArrowDownIcon sx={{ fontSize: 14, color: TEXTO_SEC }} />
          </Box>

          <Menu
            anchorEl={menuUsuarioAnchor}
            open={Boolean(menuUsuarioAnchor)}
            onClose={handleMenuUsuarioCerrar}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${BORDE}` }}>
              <Typography variant="body2" fontWeight={700}>{usuario?.nombreCompleto || 'Usuario'}</Typography>
              <Typography variant="caption" color="text.secondary">{usuario?.email || ''}</Typography>
            </Box>
            <MenuItem onClick={() => { handleMenuUsuarioCerrar(); navigate('/perfil'); }} sx={{ mt: 0.5 }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>Mi Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleMenuUsuarioCerrar(); navigate('/configuracion'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>Configuración
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleCerrarSesion} sx={{ color: 'error.main', mb: 0.5 }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar ── */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerAbierto ? DW : DC,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerAbierto ? DW : DC,
            boxSizing: 'border-box',
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
            overflowX: 'hidden',
            // Subtle gradient + dot pattern background
            background: 'linear-gradient(180deg, #FAFBFF 0%, #F5F3FF 50%, #F0F9FF 100%)',
            backgroundImage: [
              'linear-gradient(180deg, #FAFBFF 0%, #F5F3FF 50%, #F0F9FF 100%)',
              'radial-gradient(rgba(79,70,229,0.055) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: 'auto, 20px 20px',
            borderRight: `1px solid ${BORDE}`,
          },
        }}
      >
        {/* Logo area */}
        <Box
          sx={{
            height: 60, flexShrink: 0,
            display: 'flex', alignItems: 'center',
            px: drawerAbierto ? 2 : 0,
            justifyContent: drawerAbierto ? 'flex-start' : 'center',
            borderBottom: `1px solid ${BORDE}`,
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {drawerAbierto ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
              <Box
                component="img" src="/belatz-logo.jpg" alt="Belatz"
                sx={{
                  height: 36, width: 36, borderRadius: 2, objectFit: 'cover', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(37,99,235,0.22)',
                  border: '2px solid rgba(255,255,255,0.9)',
                }}
                onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
              />
              <Box sx={{ overflow: 'hidden' }}>
                <Typography
                  variant="subtitle2" fontWeight={800} noWrap
                  sx={{
                    lineHeight: 1.15,
                    background: 'linear-gradient(135deg, #1E40AF 0%, #4F46E5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Nóminas Belatz
                </Typography>
                <Typography variant="caption" noWrap sx={{ color: TEXTO_SEC, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                  SISTEMA ENTERPRISE
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              component="img" src="/belatz-logo.jpg" alt="NB"
              sx={{ height: 32, width: 32, borderRadius: 2, objectFit: 'cover', boxShadow: '0 2px 8px rgba(37,99,235,0.2)' }}
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </Box>

        {/* Menu */}
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, py: 1 }}>
          {menuItems.map((seccion, idx) => (
            <Box key={idx} sx={{ mb: 0.25 }}>
              {drawerAbierto && (
                <Typography
                  variant="overline"
                  sx={{
                    px: 2.5, pt: idx === 0 ? 1.25 : 1.5, pb: 0.5, display: 'block',
                    color: alpha(AZUL, 0.45),
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
                  }}
                >
                  {seccion.seccion}
                </Typography>
              )}
              {!drawerAbierto && idx > 0 && <Divider sx={{ my: 0.5, mx: 1.5, borderColor: alpha(AZUL, 0.08) }} />}

              <List component="nav" disablePadding dense>
                {seccion.items.map((item) => {
                  if (item.subMenu) {
                    const abiert = subMenusAbiertos[item.titulo];
                    const tieneActiva = item.subMenu.some((s) => esRutaActiva(s.ruta));

                    return (
                      <Box key={item.titulo}>
                        <Tooltip title={drawerAbierto ? '' : item.titulo} placement="right">
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => toggleSubMenu(item.titulo)}
                              sx={{
                                minHeight: 40, mx: 1, borderRadius: 3,
                                transition: 'all 0.15s',
                                '&:hover': { bgcolor: alpha(AZUL, 0.06) },
                                ...(tieneActiva && !abiert ? activeItemSx : {}),
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: drawerAbierto ? 34 : 'auto', color: tieneActiva ? AZUL : TEXTO_SEC }}>
                                {item.icono}
                              </ListItemIcon>
                              {drawerAbierto && (
                                <>
                                  <ListItemText
                                    primary={item.titulo}
                                    primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: tieneActiva ? 700 : 400, color: tieneActiva ? AZUL : 'text.primary' }}
                                  />
                                  {abiert
                                    ? <ExpandLess sx={{ fontSize: 16, color: TEXTO_SEC }} />
                                    : <ExpandMore sx={{ fontSize: 16, color: TEXTO_SEC }} />}
                                </>
                              )}
                            </ListItemButton>
                          </ListItem>
                        </Tooltip>

                        {drawerAbierto && (
                          <Collapse in={abiert} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding dense>
                              {item.subMenu.map((sub) => (
                                <ListItemButton
                                  key={sub.titulo}
                                  onClick={() => navigate(sub.ruta)}
                                  sx={{
                                    pl: 5.5, pr: 2, py: 0.6, mx: 1, borderRadius: 2.5,
                                    transition: 'all 0.15s',
                                    '&:hover': { bgcolor: alpha(AZUL, 0.06) },
                                    ...(esRutaActiva(sub.ruta) ? {
                                      background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(79,70,229,0.06) 100%)',
                                      border: '1px solid rgba(37,99,235,0.15)',
                                    } : {}),
                                  }}
                                >
                                  <ListItemText
                                    primary={sub.titulo}
                                    primaryTypographyProps={{
                                      fontSize: '0.7875rem',
                                      fontWeight: esRutaActiva(sub.ruta) ? 700 : 400,
                                      color: esRutaActiva(sub.ruta) ? AZUL : 'text.secondary',
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
                    <Tooltip key={item.titulo} title={drawerAbierto ? '' : item.titulo} placement="right">
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate(item.ruta!)}
                          sx={{
                            minHeight: 40, mx: 1, borderRadius: 3,
                            transition: 'all 0.15s',
                            '&:hover': { bgcolor: alpha(AZUL, 0.06) },
                            ...(esRutaActiva(item.ruta!) ? activeItemSx : {}),
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: drawerAbierto ? 34 : 'auto', color: esRutaActiva(item.ruta!) ? AZUL : TEXTO_SEC }}>
                            {item.icono}
                          </ListItemIcon>
                          {drawerAbierto && (
                            <ListItemText
                              primary={item.titulo}
                              primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: esRutaActiva(item.ruta!) ? 700 : 400 }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        {drawerAbierto && (
          <Box
            sx={{
              px: 2, py: 1.5, flexShrink: 0,
              borderTop: `1px solid ${BORDE}`,
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', gap: 1,
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: coloresImperha.exito, flexShrink: 0, boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
            <Typography variant="caption" noWrap sx={{ color: TEXTO_SEC, fontSize: '0.6875rem' }}>
              v1.0.0 · CFDI 4.0 · LFT · Zafra
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* ── Main content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, p: 3, mt: '60px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 60px)',
          width: `calc(100% - ${drawerAbierto ? DW : DC}px)`,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Outlet />
      </Box>

      {mostrarAsistente && <AsistenteIA onCerrar={() => setMostrarAsistente(false)} />}
    </Box>
  );
}

export default AppShell;
