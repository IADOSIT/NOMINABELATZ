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
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useEmpresaStore } from '../stores/empresaStore';
import { coloresImperha } from '../tema/temaImperha';
import AsistenteIA from '../components/AsistenteIA/AsistenteIA';

const DRAWER_WIDTH = 264;
const DRAWER_COLLAPSED = 64;

const menuItems = [
  {
    seccion: 'Principal',
    items: [
      { titulo: 'Dashboard', icono: <DashboardIcon />, ruta: '/dashboard' },
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
        titulo: 'Estructura Org.',
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
          { titulo: 'Histórico', ruta: '/nomina/historico', icono: <HistoryIcon /> },
        ],
      },
      {
        titulo: 'Percepciones',
        icono: <TrendingUpIcon />,
        subMenu: [
          { titulo: 'Catálogo', ruta: '/percepciones', icono: <ListAltIcon /> },
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
          { titulo: 'Catálogo', ruta: '/deducciones', icono: <ListAltIcon /> },
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
        titulo: 'Contrato Ley',
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
          { titulo: 'Fondo de Ahorro', ruta: '/sindicato/fondo-ahorro', icono: <WalletIcon /> },
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
    seccion: 'Reportes',
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
          { titulo: 'Notificaciones', ruta: '/configuracion/notificaciones', icono: <NotificationsIcon /> },
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

  const toggleDrawer = () => setDrawerAbierto((prev) => !prev);
  const toggleSubMenu = (titulo: string) =>
    setSubMenusAbiertos((prev) => ({ ...prev, [titulo]: !prev[titulo] }));

  const handleMenuUsuarioAbrir = (e: React.MouseEvent<HTMLElement>) =>
    setMenuUsuarioAnchor(e.currentTarget);
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

  const esRutaActiva = (ruta: string) =>
    location.pathname === ruta || location.pathname.startsWith(ruta + '/');

  const AZUL = coloresImperha.azul.principal;
  const AZUL_PALIDO = coloresImperha.azul.palido;
  const BORDE = coloresImperha.neutros.bordeClaro;
  const TEXTO_SEC = coloresImperha.neutros.textoSecundario;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerAbierto ? DRAWER_WIDTH : DRAWER_COLLAPSED}px)`,
          ml: `${drawerAbierto ? DRAWER_WIDTH : DRAWER_COLLAPSED}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${BORDE}`,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Toolbar sx={{ minHeight: 60, gap: 1 }}>
          <IconButton
            onClick={toggleDrawer}
            size="small"
            sx={{
              color: 'text.secondary',
              border: `1px solid ${BORDE}`,
              borderRadius: 2,
              '&:hover': { bgcolor: AZUL_PALIDO, borderColor: AZUL, color: AZUL },
            }}
          >
            {drawerAbierto ? <ChevronLeftIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>

          {/* Selector empresa */}
          <Button
            onClick={handleCambiarEmpresa}
            size="small"
            sx={{
              ml: 1,
              textTransform: 'none',
              color: 'text.primary',
              border: `1px solid ${BORDE}`,
              borderRadius: 2,
              px: 1.5,
              py: 0.75,
              gap: 1,
              '&:hover': { bgcolor: AZUL_PALIDO, borderColor: AZUL },
            }}
          >
            <Avatar
              sx={{ width: 26, height: 26, bgcolor: AZUL_PALIDO, color: AZUL }}
            >
              <FactoryIcon sx={{ fontSize: 14 }} />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2, fontSize: '0.8125rem' }}>
                {empresaSeleccionada?.nombreComercial || 'Seleccionar Empresa'}
              </Typography>
              {ingenioSeleccionado && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, lineHeight: 1 }}>
                  {ingenioSeleccionado.nombre}
                  {ingenioSeleccionado.enZafra && (
                    <Chip label="ZAFRA" size="small" color="success" sx={{ height: 14, fontSize: '0.5625rem', ml: 0.5 }} />
                  )}
                </Typography>
              )}
            </Box>
            <ArrowDownIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 0.5 }} />
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Notificaciones">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                border: `1px solid ${BORDE}`,
                borderRadius: 2,
                '&:hover': { bgcolor: AZUL_PALIDO, borderColor: AZUL, color: AZUL },
              }}
            >
              <Badge badgeContent={5} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Asistente IA">
            <IconButton
              size="small"
              onClick={() => setMostrarAsistente(!mostrarAsistente)}
              sx={{
                color: mostrarAsistente ? AZUL : 'text.secondary',
                border: `1px solid ${mostrarAsistente ? AZUL : BORDE}`,
                borderRadius: 2,
                bgcolor: mostrarAsistente ? AZUL_PALIDO : 'transparent',
                '&:hover': { bgcolor: AZUL_PALIDO, borderColor: AZUL, color: AZUL },
              }}
            >
              <SmartToyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            onClick={handleMenuUsuarioAbrir}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              border: `1px solid ${BORDE}`,
              ml: 0.5,
              '&:hover': { bgcolor: AZUL_PALIDO, borderColor: AZUL },
            }}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: AZUL_PALIDO, color: AZUL, fontSize: '0.8rem', fontWeight: 700 }}>
              {usuario?.nombreCompleto?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2, fontSize: '0.8125rem' }}>
                {usuario?.nombreCompleto || 'Usuario'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                {usuario?.rol || 'Administrador'}
              </Typography>
            </Box>
            <ArrowDownIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          </Box>

          <Menu anchorEl={menuUsuarioAnchor} open={Boolean(menuUsuarioAnchor)} onClose={handleMenuUsuarioCerrar}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${BORDE}` }}>
              <Typography variant="body2" fontWeight={600}>{usuario?.nombreCompleto || 'Usuario'}</Typography>
              <Typography variant="caption" color="text.secondary">{usuario?.email || ''}</Typography>
            </Box>
            <MenuItem onClick={() => { handleMenuUsuarioCerrar(); navigate('/perfil'); }} sx={{ mt: 0.5 }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleMenuUsuarioCerrar(); navigate('/configuracion'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Configuración
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleCerrarSesion} sx={{ color: 'error.main', mb: 0.5 }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerAbierto ? DRAWER_WIDTH : DRAWER_COLLAPSED,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerAbierto ? DRAWER_WIDTH : DRAWER_COLLAPSED,
            boxSizing: 'border-box',
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
            overflowX: 'hidden',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${BORDE}`,
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            px: drawerAbierto ? 2 : 0,
            justifyContent: drawerAbierto ? 'flex-start' : 'center',
            borderBottom: `1px solid ${BORDE}`,
            flexShrink: 0,
          }}
        >
          {drawerAbierto ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
              <Box
                component="img"
                src="/belatz-logo.jpg"
                alt="Belatz"
                sx={{ height: 36, width: 36, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
              />
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                  Nóminas Belatz
                </Typography>
                <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  Sistema Enterprise
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              component="img"
              src="/belatz-logo.jpg"
              alt="B"
              sx={{ height: 32, width: 32, borderRadius: 1.5, objectFit: 'cover' }}
              onError={(e: any) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<span style="font-weight:800;font-size:1.1rem;color:${AZUL}">NB</span>`;
              }}
            />
          )}
        </Box>

        {/* Menu list */}
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, py: 1 }}>
          {menuItems.map((seccion, idx) => (
            <Box key={idx} sx={{ mb: 0.5 }}>
              {drawerAbierto && (
                <Typography
                  variant="overline"
                  sx={{
                    px: 2.5,
                    pt: idx === 0 ? 1 : 1.5,
                    pb: 0.5,
                    display: 'block',
                    color: coloresImperha.neutros.textoTerciario,
                    fontWeight: 600,
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  {seccion.seccion}
                </Typography>
              )}
              {!drawerAbierto && idx > 0 && <Divider sx={{ my: 0.75, mx: 1.5 }} />}

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
                              selected={tieneActiva && !abiert}
                              sx={{ minHeight: 40, mx: 1, borderRadius: 2 }}
                            >
                              <ListItemIcon sx={{ minWidth: drawerAbierto ? 36 : 'auto' }}>
                                {item.icono}
                              </ListItemIcon>
                              {drawerAbierto && (
                                <>
                                  <ListItemText
                                    primary={item.titulo}
                                    primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: tieneActiva ? 600 : 400 }}
                                  />
                                  {abiert ? (
                                    <ExpandLess sx={{ fontSize: 16, color: TEXTO_SEC }} />
                                  ) : (
                                    <ExpandMore sx={{ fontSize: 16, color: TEXTO_SEC }} />
                                  )}
                                </>
                              )}
                            </ListItemButton>
                          </ListItem>
                        </Tooltip>

                        {drawerAbierto && (
                          <Collapse in={abiert} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding dense>
                              {item.subMenu.map((subItem) => (
                                <ListItemButton
                                  key={subItem.titulo}
                                  onClick={() => navigate(subItem.ruta)}
                                  selected={esRutaActiva(subItem.ruta)}
                                  sx={{
                                    pl: 6,
                                    pr: 1.5,
                                    py: 0.625,
                                    mx: 1,
                                    borderRadius: 2,
                                  }}
                                >
                                  <ListItemText
                                    primary={subItem.titulo}
                                    primaryTypographyProps={{
                                      fontSize: '0.8125rem',
                                      fontWeight: esRutaActiva(subItem.ruta) ? 600 : 400,
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
                          selected={esRutaActiva(item.ruta!)}
                          sx={{ minHeight: 40, mx: 1, borderRadius: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: drawerAbierto ? 36 : 'auto' }}>
                            {item.icono}
                          </ListItemIcon>
                          {drawerAbierto && (
                            <ListItemText
                              primary={item.titulo}
                              primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: esRutaActiva(item.ruta!) ? 600 : 400 }}
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

        {/* Sidebar footer */}
        {drawerAbierto && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: `1px solid ${BORDE}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: coloresImperha.exito,
                flexShrink: 0,
              }}
            />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="caption" noWrap sx={{ display: 'block', color: TEXTO_SEC, fontSize: '0.6875rem' }}>
                v1.0.0 • CFDI 4.0 • LFT
              </Typography>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '60px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 60px)',
          width: `calc(100% - ${drawerAbierto ? DRAWER_WIDTH : DRAWER_COLLAPSED}px)`,
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
