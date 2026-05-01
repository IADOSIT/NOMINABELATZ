// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Página de Empleados con DataGrid de Alto Rendimiento
// ===================================

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  alpha,
  Collapse,
  Stack,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  PersonOff as PersonOffIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  LocalHospital as HospitalIcon,
  Badge as BadgeIcon,
  Factory as FactoryIcon,
  Agriculture as AgricultureIcon,
  Engineering as EngineeringIcon,
  AccountBalance as AccountIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Upload as ImportIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { coloresImperha } from '../../tema/temaImperha';
import { useEmpresaStore } from '../../stores/empresaStore';

// Tipos
interface Empleado {
  id: string;
  numeroEmpleado: string;
  nombreCompleto: string;
  rfc: string;
  curp: string;
  nss: string;
  departamento: string;
  departamentoId: string;
  puesto: string;
  puestoId: string;
  categoriaContrato: string;
  tipoTrabajador: 'Sindicalizado' | 'Confianza' | 'Eventual' | 'Temporal Zafra';
  estatusLaboral: 'Activo' | 'Baja' | 'Incapacidad' | 'Vacaciones' | 'Permiso';
  salarioDiario: number;
  sdi: number;
  fechaIngreso: string;
  fechaBaja?: string;
  antiguedadAnios: number;
  turno: string;
  area: 'Fábrica' | 'Campo' | 'Administración' | 'Taller';
  sindicato?: string;
  numCredencial?: string;
  correoElectronico?: string;
  telefono?: string;
  esJefeArea: boolean;
  trabajaEnZafra: boolean;
}

// Generador de datos de ejemplo (500 empleados)
const generarEmpleadosEjemplo = (): Empleado[] => {
  const nombres = ['JUAN', 'PEDRO', 'MARIA', 'JOSE', 'CARLOS', 'MIGUEL', 'FRANCISCO', 'LUIS', 'ANTONIO', 'MANUEL', 'GUADALUPE', 'ANA', 'ROSA', 'MARTHA', 'PATRICIA', 'ROBERTO', 'RICARDO', 'ALEJANDRO', 'FERNANDO', 'SERGIO'];
  const apellidos1 = ['GARCIA', 'MARTINEZ', 'HERNANDEZ', 'LOPEZ', 'GONZALEZ', 'RODRIGUEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ', 'TORRES', 'FLORES', 'RIVERA', 'GOMEZ', 'DIAZ', 'REYES', 'MORALES', 'JIMENEZ', 'RUIZ', 'ALVAREZ', 'ROMERO'];
  const apellidos2 = ['CRUZ', 'MORENO', 'ORTIZ', 'GUTIERREZ', 'CHAVEZ', 'RAMOS', 'VARGAS', 'CASTILLO', 'MENDOZA', 'AGUILAR', 'MEDINA', 'VEGA', 'CASTRO', 'CAMPOS', 'SANTOS', 'DELGADO', 'HERRERA', 'NUNEZ', 'LEON', 'SILVA'];

  const departamentos = [
    { id: 'PROD', nombre: 'Producción', area: 'Fábrica' as const },
    { id: 'MANT', nombre: 'Mantenimiento', area: 'Taller' as const },
    { id: 'CAMP', nombre: 'Campo', area: 'Campo' as const },
    { id: 'CALD', nombre: 'Calderas', area: 'Fábrica' as const },
    { id: 'ELEC', nombre: 'Eléctrico', area: 'Fábrica' as const },
    { id: 'MOLI', nombre: 'Molinos', area: 'Fábrica' as const },
    { id: 'ELAB', nombre: 'Elaboración', area: 'Fábrica' as const },
    { id: 'CENT', nombre: 'Centrífugas', area: 'Fábrica' as const },
    { id: 'ADMI', nombre: 'Administración', area: 'Administración' as const },
    { id: 'CONT', nombre: 'Contabilidad', area: 'Administración' as const },
    { id: 'RRHH', nombre: 'Recursos Humanos', area: 'Administración' as const },
    { id: 'ALMA', nombre: 'Almacén', area: 'Administración' as const },
    { id: 'TRAN', nombre: 'Transporte', area: 'Campo' as const },
    { id: 'BASCUL', nombre: 'Báscula', area: 'Campo' as const },
  ];

  const puestos: Record<string, string[]> = {
    PROD: ['Operador de Producción', 'Supervisor de Producción', 'Ayudante General', 'Jefe de Turno'],
    MANT: ['Mecánico Industrial', 'Soldador', 'Tornero', 'Ayudante de Mecánico', 'Jefe de Mantenimiento'],
    CAMP: ['Cortador de Caña', 'Cargador', 'Regador', 'Tractorista', 'Mayordomo de Campo'],
    CALD: ['Operador de Calderas', 'Alimentador', 'Ayudante de Calderas', 'Supervisor de Calderas'],
    ELEC: ['Electricista', 'Ayudante Electricista', 'Supervisor Eléctrico', 'Instrumentista'],
    MOLI: ['Operador de Molinos', 'Cañero', 'Ayudante de Molinos', 'Supervisor de Molinos'],
    ELAB: ['Operador de Evaporadores', 'Tachos', 'Clarificador', 'Supervisor de Elaboración'],
    CENT: ['Operador de Centrífugas', 'Secador', 'Ensacador', 'Supervisor de Centrífugas'],
    ADMI: ['Auxiliar Administrativo', 'Secretaria', 'Recepcionista', 'Jefe Administrativo'],
    CONT: ['Contador', 'Auxiliar Contable', 'Analista Fiscal', 'Jefe de Contabilidad'],
    RRHH: ['Analista de Nómina', 'Reclutador', 'Capacitador', 'Jefe de RH'],
    ALMA: ['Almacenista', 'Auxiliar de Almacén', 'Jefe de Almacén'],
    TRAN: ['Chofer', 'Operador de Grúa', 'Despachador'],
    BASCUL: ['Basculero', 'Auxiliar de Báscula', 'Supervisor de Báscula'],
  };

  const turnos = ['Matutino', 'Vespertino', 'Nocturno', 'Mixto', 'Rotativo'];
  const tiposTrabajador: Empleado['tipoTrabajador'][] = ['Sindicalizado', 'Confianza', 'Eventual', 'Temporal Zafra'];
  const estatusLaboral: Empleado['estatusLaboral'][] = ['Activo', 'Activo', 'Activo', 'Activo', 'Activo', 'Activo', 'Activo', 'Activo', 'Incapacidad', 'Vacaciones', 'Baja'];
  const sindicatos = ['STIASRM', 'SNTIHA', 'CTM Local', 'Sin Sindicato'];

  const empleados: Empleado[] = [];

  for (let i = 1; i <= 500; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido1 = apellidos1[Math.floor(Math.random() * apellidos1.length)];
    const apellido2 = apellidos2[Math.floor(Math.random() * apellidos2.length)];
    const depto = departamentos[Math.floor(Math.random() * departamentos.length)];
    const puestosList = puestos[depto.id];
    const puesto = puestosList[Math.floor(Math.random() * puestosList.length)];
    const tipo = tiposTrabajador[Math.floor(Math.random() * tiposTrabajador.length)];
    const estatus = estatusLaboral[Math.floor(Math.random() * estatusLaboral.length)];
    const fechaIngreso = new Date(2010 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));
    const antiguedad = Math.floor((new Date().getTime() - fechaIngreso.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const salarioBase = depto.area === 'Administración' ? 500 + Math.random() * 500 : 300 + Math.random() * 400;
    const factorIntegracion = 1.0452 + (antiguedad * 0.002);

    empleados.push({
      id: i.toString(),
      numeroEmpleado: `EMP${i.toString().padStart(4, '0')}`,
      nombreCompleto: `${nombre} ${apellido1} ${apellido2}`,
      rfc: `${apellido1.substring(0, 2)}${apellido2.substring(0, 1)}${nombre.substring(0, 1)}${(70 + Math.floor(Math.random() * 30)).toString().padStart(2, '0')}${(1 + Math.floor(Math.random() * 12)).toString().padStart(2, '0')}${(1 + Math.floor(Math.random() * 28)).toString().padStart(2, '0')}XXX`,
      curp: `${apellido1.substring(0, 2)}${apellido2.substring(0, 1)}${nombre.substring(0, 1)}${(70 + Math.floor(Math.random() * 30)).toString().padStart(2, '0')}${(1 + Math.floor(Math.random() * 12)).toString().padStart(2, '0')}${(1 + Math.floor(Math.random() * 28)).toString().padStart(2, '0')}HXXXXXX`,
      nss: `${Math.floor(Math.random() * 100).toString().padStart(2, '0')}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}${Math.floor(Math.random() * 10)}`,
      departamento: depto.nombre,
      departamentoId: depto.id,
      puesto: puesto,
      puestoId: `${depto.id}-${puestosList.indexOf(puesto) + 1}`,
      categoriaContrato: tipo === 'Sindicalizado' ? `CAT-${Math.floor(Math.random() * 20) + 1}` : 'N/A',
      tipoTrabajador: tipo,
      estatusLaboral: estatus,
      salarioDiario: Math.round(salarioBase * 100) / 100,
      sdi: Math.round(salarioBase * factorIntegracion * 100) / 100,
      fechaIngreso: fechaIngreso.toISOString().split('T')[0],
      fechaBaja: estatus === 'Baja' ? new Date(2023, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString().split('T')[0] : undefined,
      antiguedadAnios: antiguedad,
      turno: turnos[Math.floor(Math.random() * turnos.length)],
      area: depto.area,
      sindicato: tipo === 'Sindicalizado' ? sindicatos[Math.floor(Math.random() * (sindicatos.length - 1))] : sindicatos[3],
      numCredencial: `CR-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
      correoElectronico: `${nombre.toLowerCase()}.${apellido1.toLowerCase()}@ingenio.com`,
      telefono: `(123) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      esJefeArea: puesto.includes('Jefe') || puesto.includes('Supervisor'),
      trabajaEnZafra: depto.area === 'Fábrica' || depto.area === 'Campo' || tipo === 'Temporal Zafra',
    });
  }

  return empleados;
};

// Datos generados
const empleadosData = generarEmpleadosEjemplo();

// Toolbar personalizado
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 1, borderBottom: `1px solid ${coloresImperha.neutros.bordeClaro}` }}>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

// Estadísticas
interface EstadisticasEmpleados {
  total: number;
  activos: number;
  bajas: number;
  incapacidad: number;
  vacaciones: number;
  sindicalizados: number;
  confianza: number;
  eventuales: number;
  temporalesZafra: number;
}

const calcularEstadisticas = (empleados: Empleado[]): EstadisticasEmpleados => ({
  total: empleados.length,
  activos: empleados.filter(e => e.estatusLaboral === 'Activo').length,
  bajas: empleados.filter(e => e.estatusLaboral === 'Baja').length,
  incapacidad: empleados.filter(e => e.estatusLaboral === 'Incapacidad').length,
  vacaciones: empleados.filter(e => e.estatusLaboral === 'Vacaciones').length,
  sindicalizados: empleados.filter(e => e.tipoTrabajador === 'Sindicalizado').length,
  confianza: empleados.filter(e => e.tipoTrabajador === 'Confianza').length,
  eventuales: empleados.filter(e => e.tipoTrabajador === 'Eventual').length,
  temporalesZafra: empleados.filter(e => e.tipoTrabajador === 'Temporal Zafra').length,
});

// Componente de Tarjeta de Estadística
interface StatCardProps {
  titulo: string;
  valor: number;
  icono: React.ReactNode;
  color: string;
  porcentaje?: number;
  onClick?: () => void;
  seleccionado?: boolean;
}

function StatCard({ titulo, valor, icono, color, porcentaje, onClick, seleccionado }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        border: seleccionado ? `2px solid ${color}` : '1px solid transparent',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {titulo}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color }}>
              {valor.toLocaleString('es-MX')}
            </Typography>
            {porcentaje !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {porcentaje.toFixed(1)}% del total
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 48, height: 48 }}>
            {icono}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

function EmpleadosPage() {
  const navigate = useNavigate();
  const { ingenioSeleccionado } = useEmpresaStore();

  // Estados
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroArea, setFiltroArea] = useState<string>('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState<string>('todos');
  const [filtroTurno, setFiltroTurno] = useState<string>('todos');
  const [filtroSindicato, setFiltroSindicato] = useState<string>('todos');
  const [filtroZafra, setFiltroZafra] = useState<string>('todos');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [tabActual, setTabActual] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<GridRowSelectionModel>([]);
  const [cargando, setCargando] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'numeroEmpleado', sort: 'asc' }]);

  // Estadísticas
  const estadisticas = useMemo(() => calcularEstadisticas(empleadosData), []);

  // Filtrar empleados
  const empleadosFiltrados = useMemo(() => {
    let resultado = [...empleadosData];

    // Filtro de búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(e =>
        e.nombreCompleto.toLowerCase().includes(busquedaLower) ||
        e.numeroEmpleado.toLowerCase().includes(busquedaLower) ||
        e.rfc.toLowerCase().includes(busquedaLower) ||
        e.nss.includes(busqueda) ||
        e.departamento.toLowerCase().includes(busquedaLower) ||
        e.puesto.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtros por estatus
    if (filtroEstatus !== 'todos') {
      resultado = resultado.filter(e => e.estatusLaboral.toLowerCase() === filtroEstatus);
    }

    // Filtro por tipo de trabajador
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(e => e.tipoTrabajador.toLowerCase().replace(' ', '-') === filtroTipo);
    }

    // Filtro por área
    if (filtroArea !== 'todos') {
      resultado = resultado.filter(e => e.area.toLowerCase() === filtroArea);
    }

    // Filtro por departamento
    if (filtroDepartamento !== 'todos') {
      resultado = resultado.filter(e => e.departamentoId === filtroDepartamento);
    }

    // Filtro por turno
    if (filtroTurno !== 'todos') {
      resultado = resultado.filter(e => e.turno.toLowerCase() === filtroTurno);
    }

    // Filtro por sindicato
    if (filtroSindicato !== 'todos') {
      resultado = resultado.filter(e => e.sindicato === filtroSindicato);
    }

    // Filtro por zafra
    if (filtroZafra === 'si') {
      resultado = resultado.filter(e => e.trabajaEnZafra);
    } else if (filtroZafra === 'no') {
      resultado = resultado.filter(e => !e.trabajaEnZafra);
    }

    // Filtro por tabs
    if (tabActual === 1) resultado = resultado.filter(e => e.estatusLaboral === 'Activo');
    if (tabActual === 2) resultado = resultado.filter(e => e.tipoTrabajador === 'Sindicalizado');
    if (tabActual === 3) resultado = resultado.filter(e => e.tipoTrabajador === 'Confianza');
    if (tabActual === 4) resultado = resultado.filter(e => e.trabajaEnZafra);

    return resultado;
  }, [busqueda, filtroEstatus, filtroTipo, filtroArea, filtroDepartamento, filtroTurno, filtroSindicato, filtroZafra, tabActual]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setFiltroEstatus('todos');
    setFiltroTipo('todos');
    setFiltroArea('todos');
    setFiltroDepartamento('todos');
    setFiltroTurno('todos');
    setFiltroSindicato('todos');
    setFiltroZafra('todos');
    setTabActual(0);
  }, []);

  // Manejadores de menú
  const handleMenuAbrir = (event: React.MouseEvent<HTMLElement>, empleadoId: string) => {
    setMenuAnchor(event.currentTarget);
    setEmpleadoSeleccionado(empleadoId);
  };

  const handleMenuCerrar = () => {
    setMenuAnchor(null);
    setEmpleadoSeleccionado(null);
  };

  // Refrescar datos
  const handleRefrescar = () => {
    setCargando(true);
    setTimeout(() => setCargando(false), 1000);
  };

  // Columnas del DataGrid
  const columnas: GridColDef[] = [
    {
      field: 'numeroEmpleado',
      headerName: 'No. Emp',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: coloresImperha.guinda.claro }}
        />
      ),
    },
    {
      field: 'nombreCompleto',
      headerName: 'Nombre del Empleado',
      width: 280,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: params.row.esJefeArea ? coloresImperha.guinda.principal : coloresImperha.guinda.claro,
              fontSize: '0.875rem',
            }}
          >
            {params.value.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.puesto}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'rfc',
      headerName: 'RFC',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'departamento',
      headerName: 'Departamento',
      width: 140,
    },
    {
      field: 'area',
      headerName: 'Área',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const iconos: Record<string, React.ReactNode> = {
          'Fábrica': <FactoryIcon sx={{ fontSize: 16 }} />,
          'Campo': <AgricultureIcon sx={{ fontSize: 16 }} />,
          'Taller': <EngineeringIcon sx={{ fontSize: 16 }} />,
          'Administración': <AccountIcon sx={{ fontSize: 16 }} />,
        };
        return (
          <Chip
            icon={iconos[params.value] as React.ReactElement}
            label={params.value}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'tipoTrabajador',
      headerName: 'Tipo',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const colores: Record<string, string> = {
          'Sindicalizado': coloresImperha.estado.info,
          'Confianza': coloresImperha.guinda.principal,
          'Eventual': coloresImperha.estado.advertencia,
          'Temporal Zafra': coloresImperha.rojo.principal,
        };
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              bgcolor: alpha(colores[params.value] || '#666', 0.1),
              color: colores[params.value] || '#666',
              fontWeight: 500,
            }}
          />
        );
      },
    },
    {
      field: 'salarioDiario',
      headerName: 'Salario Diario',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight={600}>
          ${params.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Typography>
      ),
    },
    {
      field: 'sdi',
      headerName: 'SDI',
      width: 110,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          ${params.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Typography>
      ),
    },
    {
      field: 'antiguedadAnios',
      headerName: 'Antigüedad',
      width: 100,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={`${params.value} años`}
          size="small"
          color={params.value >= 15 ? 'success' : params.value >= 5 ? 'primary' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'turno',
      headerName: 'Turno',
      width: 100,
    },
    {
      field: 'estatusLaboral',
      headerName: 'Estatus',
      width: 110,
      renderCell: (params: GridRenderCellParams) => {
        const colores: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
          'Activo': 'success',
          'Baja': 'error',
          'Incapacidad': 'warning',
          'Vacaciones': 'info',
          'Permiso': 'default',
        };
        return (
          <Chip
            label={params.value}
            size="small"
            color={colores[params.value] || 'default'}
          />
        );
      },
    },
    {
      field: 'trabajaEnZafra',
      headerName: 'Zafra',
      width: 80,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        params.value ? (
          <CheckCircleIcon sx={{ color: coloresImperha.estado.exito }} />
        ) : (
          <Typography color="text.disabled">—</Typography>
        )
      ),
    },
    {
      field: 'acciones',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuAbrir(e, params.row.id)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  // Departamentos únicos para filtro
  const departamentosUnicos = useMemo(() => {
    const deptos = [...new Set(empleadosData.map(e => e.departamentoId))];
    return deptos.map(id => ({
      id,
      nombre: empleadosData.find(e => e.departamentoId === id)?.departamento || id,
    }));
  }, []);

  // Sindicatos únicos
  const sindicatosUnicos = useMemo(() => {
    return [...new Set(empleadosData.map(e => e.sindicato).filter(Boolean))];
  }, []);

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color={coloresImperha.guinda.oscuro}>
            Empleados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gestión del catálogo de empleados • {ingenioSeleccionado?.nombre || 'Sin ingenio seleccionado'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Importar empleados">
            <Button variant="outlined" size="small" startIcon={<ImportIcon />}>
              Importar
            </Button>
          </Tooltip>
          <Tooltip title="Exportar a Excel">
            <Button variant="outlined" size="small" startIcon={<ExportIcon />}>
              Exportar
            </Button>
          </Tooltip>
          <Tooltip title="Imprimir reporte">
            <Button variant="outlined" size="small" startIcon={<PrintIcon />}>
              Imprimir
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/recursos-humanos/empleados/nuevo')}
            sx={{
              bgcolor: coloresImperha.guinda.principal,
              '&:hover': { bgcolor: coloresImperha.guinda.oscuro },
            }}
          >
            Nuevo Empleado
          </Button>
        </Stack>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <StatCard
            titulo="Total Empleados"
            valor={estadisticas.total}
            icono={<PeopleIcon />}
            color={coloresImperha.guinda.principal}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <StatCard
            titulo="Activos"
            valor={estadisticas.activos}
            icono={<PersonAddIcon />}
            color={coloresImperha.estado.exito}
            porcentaje={(estadisticas.activos / estadisticas.total) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <StatCard
            titulo="Sindicalizados"
            valor={estadisticas.sindicalizados}
            icono={<BadgeIcon />}
            color={coloresImperha.estado.info}
            porcentaje={(estadisticas.sindicalizados / estadisticas.total) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <StatCard
            titulo="Confianza"
            valor={estadisticas.confianza}
            icono={<EngineeringIcon />}
            color={coloresImperha.guinda.claro}
            porcentaje={(estadisticas.confianza / estadisticas.total) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <StatCard
            titulo="Incapacidad"
            valor={estadisticas.incapacidad}
            icono={<HospitalIcon />}
            color={coloresImperha.estado.advertencia}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <StatCard
            titulo="Bajas"
            valor={estadisticas.bajas}
            icono={<PersonRemoveIcon />}
            color={coloresImperha.estado.error}
          />
        </Grid>
      </Grid>

      {/* Tabs de filtro rápido */}
      <Card sx={{ mb: 2 }}>
        <Tabs
          value={tabActual}
          onChange={(_, v) => setTabActual(v)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { minHeight: 48 },
            '& .Mui-selected': { color: coloresImperha.guinda.principal },
            '& .MuiTabs-indicator': { bgcolor: coloresImperha.guinda.principal },
          }}
        >
          <Tab label={`Todos (${empleadosData.length})`} />
          <Tab label={`Activos (${estadisticas.activos})`} />
          <Tab label={`Sindicalizados (${estadisticas.sindicalizados})`} />
          <Tab label={`Confianza (${estadisticas.confianza})`} />
          <Tab label={`Personal de Zafra (${empleadosData.filter(e => e.trabajaEnZafra).length})`} />
        </Tabs>
      </Card>

      {/* Filtros */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nombre, RFC, No. empleado, puesto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: coloresImperha.guinda.claro }} />
                    </InputAdornment>
                  ),
                  endAdornment: busqueda && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setBusqueda('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estatus</InputLabel>
                <Select
                  value={filtroEstatus}
                  label="Estatus"
                  onChange={(e) => setFiltroEstatus(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="incapacidad">Incapacidad</MenuItem>
                  <MenuItem value="vacaciones">Vacaciones</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filtroTipo}
                  label="Tipo"
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="sindicalizado">Sindicalizado</MenuItem>
                  <MenuItem value="confianza">Confianza</MenuItem>
                  <MenuItem value="eventual">Eventual</MenuItem>
                  <MenuItem value="temporal-zafra">Temporal Zafra</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Área</InputLabel>
                <Select
                  value={filtroArea}
                  label="Área"
                  onChange={(e) => setFiltroArea(e.target.value)}
                >
                  <MenuItem value="todos">Todas</MenuItem>
                  <MenuItem value="fábrica">Fábrica</MenuItem>
                  <MenuItem value="campo">Campo</MenuItem>
                  <MenuItem value="taller">Taller</MenuItem>
                  <MenuItem value="administración">Administración</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={mostrarFiltrosAvanzados ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                  sx={{ height: 40 }}
                >
                  Más filtros
                </Button>
                <Tooltip title="Refrescar">
                  <IconButton onClick={handleRefrescar} sx={{ border: 1, borderColor: 'divider' }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>

          {/* Filtros avanzados */}
          <Collapse in={mostrarFiltrosAvanzados}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Departamento</InputLabel>
                  <Select
                    value={filtroDepartamento}
                    label="Departamento"
                    onChange={(e) => setFiltroDepartamento(e.target.value)}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    {departamentosUnicos.map(d => (
                      <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Turno</InputLabel>
                  <Select
                    value={filtroTurno}
                    label="Turno"
                    onChange={(e) => setFiltroTurno(e.target.value)}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="matutino">Matutino</MenuItem>
                    <MenuItem value="vespertino">Vespertino</MenuItem>
                    <MenuItem value="nocturno">Nocturno</MenuItem>
                    <MenuItem value="mixto">Mixto</MenuItem>
                    <MenuItem value="rotativo">Rotativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sindicato</InputLabel>
                  <Select
                    value={filtroSindicato}
                    label="Sindicato"
                    onChange={(e) => setFiltroSindicato(e.target.value)}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    {sindicatosUnicos.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trabaja en Zafra</InputLabel>
                  <Select
                    value={filtroZafra}
                    label="Trabaja en Zafra"
                    onChange={(e) => setFiltroZafra(e.target.value)}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="si">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={limpiarFiltros}
                  sx={{ color: coloresImperha.guinda.principal }}
                >
                  Limpiar todos los filtros
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* Barra de información */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando <strong>{empleadosFiltrados.length.toLocaleString('es-MX')}</strong> de{' '}
          <strong>{empleadosData.length.toLocaleString('es-MX')}</strong> empleados
          {seleccion.length > 0 && (
            <Chip
              label={`${seleccion.length} seleccionado(s)`}
              size="small"
              color="primary"
              onDelete={() => setSeleccion([])}
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        {seleccion.length > 0 && (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<PrintIcon />}>
              Imprimir selección
            </Button>
            <Button size="small" variant="outlined" startIcon={<ExportIcon />}>
              Exportar selección
            </Button>
          </Stack>
        )}
      </Box>

      {/* DataGrid */}
      <Card>
        {cargando && <LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: coloresImperha.guinda.principal } }} />}
        <DataGrid
          rows={empleadosFiltrados}
          columns={columnas}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          pageSizeOptions={[10, 25, 50, 100, 250, 500]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={seleccion}
          onRowSelectionModelChange={setSeleccion}
          slots={{ toolbar: CustomToolbar }}
          loading={cargando}
          getRowClassName={(params) =>
            params.row.estatusLaboral === 'Baja' ? 'row-baja' : ''
          }
          sx={{
            border: 'none',
            minHeight: 600,
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: coloresImperha.guinda.palido,
              borderBottom: `2px solid ${coloresImperha.guinda.claro}`,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              color: coloresImperha.guinda.oscuro,
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(coloresImperha.guinda.principal, 0.04),
            },
            '& .MuiDataGrid-row.Mui-selected': {
              bgcolor: alpha(coloresImperha.guinda.principal, 0.08),
              '&:hover': {
                bgcolor: alpha(coloresImperha.guinda.principal, 0.12),
              },
            },
            '& .row-baja': {
              bgcolor: alpha(coloresImperha.estado.error, 0.05),
              color: coloresImperha.estado.error,
            },
            '& .MuiCheckbox-root.Mui-checked': {
              color: coloresImperha.guinda.principal,
            },
          }}
          localeText={{
            noRowsLabel: 'No hay empleados para mostrar',
            noResultsOverlayLabel: 'No se encontraron resultados',
            footerRowSelected: (count) => `${count.toLocaleString('es-MX')} empleado(s) seleccionado(s)`,
            footerTotalRows: 'Total de filas:',
            footerTotalVisibleRows: (visibleCount, totalCount) =>
              `${visibleCount.toLocaleString('es-MX')} de ${totalCount.toLocaleString('es-MX')}`,
            toolbarColumns: 'Columnas',
            toolbarColumnsLabel: 'Seleccionar columnas',
            toolbarDensity: 'Densidad',
            toolbarDensityLabel: 'Densidad',
            toolbarDensityCompact: 'Compacta',
            toolbarDensityStandard: 'Estándar',
            toolbarDensityComfortable: 'Cómoda',
            toolbarExport: 'Exportar',
            toolbarExportLabel: 'Exportar',
            toolbarExportCSV: 'Descargar como CSV',
            toolbarExportPrint: 'Imprimir',
            columnMenuLabel: 'Menú',
            columnMenuShowColumns: 'Mostrar columnas',
            columnMenuFilter: 'Filtrar',
            columnMenuHideColumn: 'Ocultar',
            columnMenuUnsort: 'Quitar orden',
            columnMenuSortAsc: 'Ordenar ascendente',
            columnMenuSortDesc: 'Ordenar descendente',
            filterPanelAddFilter: 'Agregar filtro',
            filterPanelDeleteIconLabel: 'Eliminar',
            filterPanelOperators: 'Operadores',
            filterPanelOperatorAnd: 'Y',
            filterPanelOperatorOr: 'O',
            filterPanelColumns: 'Columnas',
            filterPanelInputLabel: 'Valor',
            filterPanelInputPlaceholder: 'Valor del filtro',
            filterOperatorContains: 'contiene',
            filterOperatorEquals: 'igual a',
            filterOperatorStartsWith: 'empieza con',
            filterOperatorEndsWith: 'termina con',
            filterOperatorIs: 'es',
            filterOperatorNot: 'no es',
            filterOperatorAfter: 'después de',
            filterOperatorOnOrAfter: 'en o después de',
            filterOperatorBefore: 'antes de',
            filterOperatorOnOrBefore: 'en o antes de',
            filterOperatorIsEmpty: 'está vacío',
            filterOperatorIsNotEmpty: 'no está vacío',
            filterOperatorIsAnyOf: 'es cualquiera de',
          }}
        />
      </Card>

      {/* Menú de acciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuCerrar}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleMenuCerrar();
            navigate(`/recursos-humanos/empleados/${empleadoSeleccionado}`);
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          Ver expediente completo
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuCerrar();
            navigate(`/recursos-humanos/empleados/${empleadoSeleccionado}/editar`);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Editar información
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuCerrar}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          Imprimir credencial
        </MenuItem>
        <MenuItem onClick={handleMenuCerrar}>
          <ListItemIcon>
            <ExportIcon fontSize="small" />
          </ListItemIcon>
          Exportar expediente
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuCerrar} sx={{ color: coloresImperha.estado.error }}>
          <ListItemIcon>
            <PersonOffIcon fontSize="small" sx={{ color: coloresImperha.estado.error }} />
          </ListItemIcon>
          Dar de baja
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default EmpleadosPage;
