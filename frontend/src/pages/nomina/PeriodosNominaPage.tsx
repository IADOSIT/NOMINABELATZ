// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Página de Períodos de Nómina
// ===================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Grid,
  Tooltip,
  alpha,
  Stack,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Calculate as CalculateIcon,
  Receipt as ReceiptIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { coloresImperha } from '../../tema/temaImperha';
import { useEmpresaStore } from '../../stores/empresaStore';

// Tipos
interface PeriodoNomina {
  id: string;
  numero: number;
  anio: number;
  tipoNomina: 'Semanal' | 'Quincenal' | 'Mensual' | 'Extraordinaria';
  fechaInicio: string;
  fechaFin: string;
  fechaPago: string;
  estatus: 'Abierto' | 'En Proceso' | 'Calculado' | 'Cerrado' | 'Timbrado' | 'Pagado';
  empleadosIncluidos: number;
  totalPercepciones: number;
  totalDeducciones: number;
  totalNeto: number;
  totalISR: number;
  totalIMSS: number;
  cfdiGenerados: number;
  cfdiTimbrados: number;
  creadoPor: string;
  fechaCreacion: string;
  esZafra: boolean;
}

// Datos de ejemplo
const generarPeriodosEjemplo = (): PeriodoNomina[] => {
  const periodos: PeriodoNomina[] = [];
  const anioActual = new Date().getFullYear();
  const estatuses: PeriodoNomina['estatus'][] = ['Pagado', 'Pagado', 'Pagado', 'Timbrado', 'Cerrado', 'Calculado', 'En Proceso', 'Abierto'];

  for (let semana = 1; semana <= 52; semana++) {
    const fechaInicio = new Date(anioActual, 0, 1 + (semana - 1) * 7);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 6);
    const fechaPago = new Date(fechaFin);
    fechaPago.setDate(fechaPago.getDate() + 3);

    const empleados = 450 + Math.floor(Math.random() * 100);
    const promedioSalario = 3500 + Math.random() * 1500;
    const totalPercepciones = empleados * promedioSalario;
    const totalDeducciones = totalPercepciones * (0.15 + Math.random() * 0.05);
    const estatus = semana <= 4 ? estatuses[Math.min(semana - 1, estatuses.length - 1)] : 'Pagado';
    const esZafra = semana >= 1 && semana <= 24;

    periodos.push({
      id: `SEM-${anioActual}-${semana.toString().padStart(2, '0')}`,
      numero: semana,
      anio: anioActual,
      tipoNomina: 'Semanal',
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
      fechaPago: fechaPago.toISOString().split('T')[0],
      estatus: estatus as PeriodoNomina['estatus'],
      empleadosIncluidos: empleados,
      totalPercepciones,
      totalDeducciones,
      totalNeto: totalPercepciones - totalDeducciones,
      totalISR: totalDeducciones * 0.4,
      totalIMSS: totalDeducciones * 0.35,
      cfdiGenerados: estatus !== 'Abierto' && estatus !== 'En Proceso' ? empleados : 0,
      cfdiTimbrados: estatus === 'Timbrado' || estatus === 'Pagado' ? empleados : 0,
      creadoPor: 'Sistema',
      fechaCreacion: fechaInicio.toISOString(),
      esZafra,
    });
  }

  return periodos.reverse();
};

const periodosData = generarPeriodosEjemplo();

// Componente de Tarjeta de Estado
interface StatCardProps {
  titulo: string;
  valor: string | number;
  icono: React.ReactNode;
  color: string;
  subtitulo?: string;
}

function StatCard({ titulo, valor, icono, color, subtitulo }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {titulo}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color }}>
              {typeof valor === 'number' ? valor.toLocaleString('es-MX') : valor}
            </Typography>
            {subtitulo && (
              <Typography variant="caption" color="text.secondary">
                {subtitulo}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 44, height: 44 }}>
            {icono}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente de Estado de Periodo
function EstatusPeriodo({ estatus }: { estatus: PeriodoNomina['estatus'] }) {
  const config: Record<string, { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; icon: React.ReactNode }> = {
    'Abierto': { color: 'info', icon: <UnlockIcon sx={{ fontSize: 14 }} /> },
    'En Proceso': { color: 'warning', icon: <ScheduleIcon sx={{ fontSize: 14 }} /> },
    'Calculado': { color: 'secondary', icon: <CalculateIcon sx={{ fontSize: 14 }} /> },
    'Cerrado': { color: 'default', icon: <LockIcon sx={{ fontSize: 14 }} /> },
    'Timbrado': { color: 'primary', icon: <ReceiptIcon sx={{ fontSize: 14 }} /> },
    'Pagado': { color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  };

  const { color, icon } = config[estatus] || { color: 'default', icon: null };

  return (
    <Chip
      icon={icon as React.ReactElement}
      label={estatus}
      size="small"
      color={color}
      sx={{ fontWeight: 500 }}
    />
  );
}

function PeriodosNominaPage() {
  const navigate = useNavigate();
  const { ingenioSeleccionado } = useEmpresaStore();

  const [filtroAnio, setFiltroAnio] = useState(new Date().getFullYear());
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstatus, setFiltroEstatus] = useState<string>('todos');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<PeriodoNomina | null>(null);
  const [dialogoNuevo, setDialogoNuevo] = useState(false);
  const [dialogoDetalle, setDialogoDetalle] = useState(false);
  const [cargando, setCargando] = useState(false);

  const periodosFiltrados = useMemo(() => {
    let resultado = [...periodosData];
    if (filtroAnio) resultado = resultado.filter(p => p.anio === filtroAnio);
    if (filtroTipo !== 'todos') resultado = resultado.filter(p => p.tipoNomina.toLowerCase() === filtroTipo);
    if (filtroEstatus !== 'todos') resultado = resultado.filter(p => p.estatus.toLowerCase().replace(' ', '-') === filtroEstatus);
    return resultado;
  }, [filtroAnio, filtroTipo, filtroEstatus]);

  const estadisticas = useMemo(() => {
    const periodoActual = periodosFiltrados.find(p => p.estatus !== 'Pagado');
    const totalAnual = periodosFiltrados.reduce((acc, p) => acc + p.totalNeto, 0);
    const empleadosPromedio = Math.round(periodosFiltrados.reduce((acc, p) => acc + p.empleadosIncluidos, 0) / periodosFiltrados.length);
    const periodosAbiertos = periodosFiltrados.filter(p => p.estatus === 'Abierto' || p.estatus === 'En Proceso').length;
    return { periodoActual, totalAnual, empleadosPromedio, periodosAbiertos };
  }, [periodosFiltrados]);

  const handleMenuAbrir = (event: React.MouseEvent<HTMLElement>, periodo: PeriodoNomina) => {
    setMenuAnchor(event.currentTarget);
    setPeriodoSeleccionado(periodo);
  };

  const handleMenuCerrar = () => setMenuAnchor(null);

  const handleVerDetalle = (periodo: PeriodoNomina) => {
    setPeriodoSeleccionado(periodo);
    setDialogoDetalle(true);
    handleMenuCerrar();
  };

  const formatearMoneda = (valor: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);

  const formatearFecha = (fecha: string) => new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

  const aniosDisponibles = useMemo(() => [...new Set(periodosData.map(p => p.anio))].sort((a, b) => b - a), []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color={coloresImperha.guinda.oscuro}>
            Períodos de Nómina
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gestión de períodos de pago • {ingenioSeleccionado?.nombre || 'Sin ingenio seleccionado'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Historial">
            <Button variant="outlined" size="small" startIcon={<HistoryIcon />}>Historial</Button>
          </Tooltip>
          <Tooltip title="Reportes">
            <Button variant="outlined" size="small" startIcon={<AssessmentIcon />}>Reportes</Button>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogoNuevo(true)}
            sx={{ bgcolor: coloresImperha.guinda.principal, '&:hover': { bgcolor: coloresImperha.guinda.oscuro } }}
          >
            Nuevo Período
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard titulo="Período Actual" valor={estadisticas.periodoActual ? `Semana ${estadisticas.periodoActual.numero}` : 'N/A'} icono={<CalendarIcon />} color={coloresImperha.guinda.principal} subtitulo={estadisticas.periodoActual?.estatus} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard titulo="Total Anual Pagado" valor={formatearMoneda(estadisticas.totalAnual)} icono={<MoneyIcon />} color={coloresImperha.estado.exito} subtitulo={`${periodosFiltrados.length} períodos`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard titulo="Empleados Promedio" valor={estadisticas.empleadosPromedio} icono={<PeopleIcon />} color={coloresImperha.estado.info} subtitulo="Por período" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard titulo="Períodos Pendientes" valor={estadisticas.periodosAbiertos} icono={<ScheduleIcon />} color={estadisticas.periodosAbiertos > 0 ? coloresImperha.estado.advertencia : coloresImperha.estado.exito} subtitulo={estadisticas.periodosAbiertos > 0 ? 'Requieren atención' : 'Todo al día'} />
        </Grid>
      </Grid>

      {estadisticas.periodoActual && (
        <Card sx={{ mb: 3, border: `2px solid ${coloresImperha.guinda.principal}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Período en Proceso</Typography>
                <Typography variant="h5" fontWeight={700} color={coloresImperha.guinda.principal}>
                  Semana {estadisticas.periodoActual.numero} - {estadisticas.periodoActual.anio}
                  {estadisticas.periodoActual.esZafra && <Chip label="ZAFRA" size="small" color="error" sx={{ ml: 1 }} />}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatearFecha(estadisticas.periodoActual.fechaInicio)} al {formatearFecha(estadisticas.periodoActual.fechaFin)} • Pago: {formatearFecha(estadisticas.periodoActual.fechaPago)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <EstatusPeriodo estatus={estadisticas.periodoActual.estatus} />
                <Box sx={{ mt: 2 }}>
                  <Stepper
                    activeStep={
                      estadisticas.periodoActual.estatus === 'Abierto' ? 0 :
                      estadisticas.periodoActual.estatus === 'En Proceso' ? 1 :
                      estadisticas.periodoActual.estatus === 'Calculado' ? 2 :
                      estadisticas.periodoActual.estatus === 'Cerrado' ? 3 :
                      estadisticas.periodoActual.estatus === 'Timbrado' ? 4 : 5
                    }
                    alternativeLabel
                    sx={{ minWidth: 350 }}
                  >
                    {['Abierto', 'Proceso', 'Cálculo', 'Cierre', 'Timbrado', 'Pagado'].map((label) => (
                      <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                  </Stepper>
                </Box>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<ViewIcon />} onClick={() => handleVerDetalle(estadisticas.periodoActual!)}>Ver Detalle</Button>
                <Button
                  variant="contained"
                  startIcon={<CalculateIcon />}
                  sx={{ bgcolor: coloresImperha.guinda.principal, '&:hover': { bgcolor: coloresImperha.guinda.oscuro } }}
                  onClick={() => navigate(`/nomina/calculo/${estadisticas.periodoActual!.id}`)}
                >
                  Procesar Nómina
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Año</InputLabel>
                <Select value={filtroAnio} label="Año" onChange={(e) => setFiltroAnio(e.target.value as number)}>
                  {aniosDisponibles.map(anio => <MenuItem key={anio} value={anio}>{anio}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select value={filtroTipo} label="Tipo" onChange={(e) => setFiltroTipo(e.target.value)}>
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="quincenal">Quincenal</MenuItem>
                  <MenuItem value="mensual">Mensual</MenuItem>
                  <MenuItem value="extraordinaria">Extraordinaria</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estatus</InputLabel>
                <Select value={filtroEstatus} label="Estatus" onChange={(e) => setFiltroEstatus(e.target.value)}>
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="abierto">Abierto</MenuItem>
                  <MenuItem value="en-proceso">En Proceso</MenuItem>
                  <MenuItem value="calculado">Calculado</MenuItem>
                  <MenuItem value="cerrado">Cerrado</MenuItem>
                  <MenuItem value="timbrado">Timbrado</MenuItem>
                  <MenuItem value="pagado">Pagado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<ExportIcon />}>Exportar</Button>
                <Button variant="outlined" size="small" startIcon={<PrintIcon />}>Imprimir</Button>
                <IconButton onClick={() => setCargando(!cargando)} sx={{ border: 1, borderColor: 'divider' }}><RefreshIcon /></IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        {cargando && <LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: coloresImperha.guinda.principal } }} />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: coloresImperha.guinda.palido }}>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }}>Período</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }}>Fechas</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }} align="center">Empleados</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }} align="right">Total Neto</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }} align="center">CFDI</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }} align="center">Estatus</TableCell>
                <TableCell sx={{ fontWeight: 600, color: coloresImperha.guinda.oscuro }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periodosFiltrados.slice(0, 15).map((periodo) => (
                <TableRow key={periodo.id} hover sx={{ '&:hover': { bgcolor: alpha(coloresImperha.guinda.principal, 0.04) }, ...(periodo.esZafra && { bgcolor: alpha(coloresImperha.rojo.principal, 0.03) }) }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: periodo.estatus === 'Abierto' || periodo.estatus === 'En Proceso' ? coloresImperha.guinda.principal : coloresImperha.guinda.claro, fontSize: '0.75rem' }}>S{periodo.numero}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Semana {periodo.numero}</Typography>
                        <Typography variant="caption" color="text.secondary">{periodo.anio}</Typography>
                      </Box>
                      {periodo.esZafra && <Chip label="Zafra" size="small" color="error" variant="outlined" sx={{ ml: 1, height: 20 }} />}
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={periodo.tipoNomina} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatearFecha(periodo.fechaInicio)}</Typography>
                    <Typography variant="caption" color="text.secondary">al {formatearFecha(periodo.fechaFin)}</Typography>
                  </TableCell>
                  <TableCell align="center"><Chip label={periodo.empleadosIncluidos.toLocaleString('es-MX')} size="small" icon={<PeopleIcon sx={{ fontSize: '14px !important' }} />} /></TableCell>
                  <TableCell align="right"><Typography variant="body2" fontWeight={600} color={coloresImperha.guinda.principal}>{formatearMoneda(periodo.totalNeto)}</Typography></TableCell>
                  <TableCell align="center">
                    <Tooltip title={`${periodo.cfdiTimbrados} de ${periodo.cfdiGenerados} timbrados`}>
                      <Box>
                        {periodo.cfdiGenerados > 0 ? (
                          <Badge badgeContent={periodo.cfdiTimbrados === periodo.cfdiGenerados ? <CheckIcon sx={{ fontSize: 10 }} /> : periodo.cfdiGenerados - periodo.cfdiTimbrados} color={periodo.cfdiTimbrados === periodo.cfdiGenerados ? 'success' : 'warning'} sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
                            <ReceiptIcon color={periodo.cfdiTimbrados === periodo.cfdiGenerados ? 'success' : 'action'} />
                          </Badge>
                        ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center"><EstatusPeriodo estatus={periodo.estatus} /></TableCell>
                  <TableCell align="center"><IconButton size="small" onClick={(e) => handleMenuAbrir(e, periodo)}><MoreVertIcon fontSize="small" /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Mostrando 15 de {periodosFiltrados.length} períodos</Typography>
        </Box>
      </Card>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuCerrar} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={() => periodoSeleccionado && handleVerDetalle(periodoSeleccionado)}><ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>Ver detalle</MenuItem>
        <MenuItem onClick={handleMenuCerrar}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>Editar período</MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuCerrar(); navigate(`/nomina/calculo/${periodoSeleccionado?.id}`); }}><ListItemIcon><CalculateIcon fontSize="small" /></ListItemIcon>Calcular nómina</MenuItem>
        <MenuItem onClick={handleMenuCerrar}><ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>Generar CFDI</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuCerrar}><ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>Imprimir recibos</MenuItem>
        <MenuItem onClick={handleMenuCerrar}><ListItemIcon><ExportIcon fontSize="small" /></ListItemIcon>Exportar a Excel</MenuItem>
        <Divider />
        {periodoSeleccionado?.estatus === 'Abierto' || periodoSeleccionado?.estatus === 'Calculado' ? (
          <MenuItem onClick={handleMenuCerrar}><ListItemIcon><LockIcon fontSize="small" /></ListItemIcon>Cerrar período</MenuItem>
        ) : periodoSeleccionado?.estatus === 'Cerrado' ? (
          <MenuItem onClick={handleMenuCerrar} sx={{ color: coloresImperha.estado.advertencia }}><ListItemIcon><UnlockIcon fontSize="small" sx={{ color: coloresImperha.estado.advertencia }} /></ListItemIcon>Reabrir período</MenuItem>
        ) : null}
      </Menu>

      <Dialog open={dialogoDetalle} onClose={() => setDialogoDetalle(false)} maxWidth="md" fullWidth>
        {periodoSeleccionado && (
          <>
            <DialogTitle sx={{ bgcolor: coloresImperha.guinda.principal, color: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">Semana {periodoSeleccionado.numero} - {periodoSeleccionado.anio}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>{formatearFecha(periodoSeleccionado.fechaInicio)} al {formatearFecha(periodoSeleccionado.fechaFin)}</Typography>
                </Box>
                <EstatusPeriodo estatus={periodoSeleccionado.estatus} />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity={periodoSeleccionado.estatus === 'Pagado' ? 'success' : 'info'}>
                    {periodoSeleccionado.estatus === 'Pagado' ? 'Este período ha sido completado y pagado exitosamente.' : `Estado actual: ${periodoSeleccionado.estatus}. Fecha de pago programada: ${formatearFecha(periodoSeleccionado.fechaPago)}`}
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Información del Período</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow><TableCell>Tipo de Nómina</TableCell><TableCell align="right">{periodoSeleccionado.tipoNomina}</TableCell></TableRow>
                        <TableRow><TableCell>Fecha de Pago</TableCell><TableCell align="right">{formatearFecha(periodoSeleccionado.fechaPago)}</TableCell></TableRow>
                        <TableRow><TableCell>Empleados Incluidos</TableCell><TableCell align="right">{periodoSeleccionado.empleadosIncluidos.toLocaleString('es-MX')}</TableCell></TableRow>
                        <TableRow><TableCell>Período de Zafra</TableCell><TableCell align="right">{periodoSeleccionado.esZafra ? 'Sí' : 'No'}</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Resumen Financiero</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow><TableCell>Total Percepciones</TableCell><TableCell align="right" sx={{ color: coloresImperha.estado.exito }}>{formatearMoneda(periodoSeleccionado.totalPercepciones)}</TableCell></TableRow>
                        <TableRow><TableCell>Total Deducciones</TableCell><TableCell align="right" sx={{ color: coloresImperha.estado.error }}>{formatearMoneda(periodoSeleccionado.totalDeducciones)}</TableCell></TableRow>
                        <TableRow><TableCell sx={{ fontWeight: 600 }}>Total Neto a Pagar</TableCell><TableCell align="right" sx={{ fontWeight: 700, color: coloresImperha.guinda.principal }}>{formatearMoneda(periodoSeleccionado.totalNeto)}</TableCell></TableRow>
                        <TableRow><TableCell>ISR Retenido</TableCell><TableCell align="right">{formatearMoneda(periodoSeleccionado.totalISR)}</TableCell></TableRow>
                        <TableRow><TableCell>Cuotas IMSS</TableCell><TableCell align="right">{formatearMoneda(periodoSeleccionado.totalIMSS)}</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Estado de CFDI</Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">CFDI Generados</Typography><Typography variant="h4" fontWeight={700}>{periodoSeleccionado.cfdiGenerados.toLocaleString('es-MX')}</Typography></Box>
                    <Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">CFDI Timbrados</Typography><Typography variant="h4" fontWeight={700} color={coloresImperha.estado.exito}>{periodoSeleccionado.cfdiTimbrados.toLocaleString('es-MX')}</Typography></Box>
                    <Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">Pendientes</Typography><Typography variant="h4" fontWeight={700} color={periodoSeleccionado.cfdiGenerados - periodoSeleccionado.cfdiTimbrados > 0 ? coloresImperha.estado.advertencia : coloresImperha.estado.exito}>{(periodoSeleccionado.cfdiGenerados - periodoSeleccionado.cfdiTimbrados).toLocaleString('es-MX')}</Typography></Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setDialogoDetalle(false)}>Cerrar</Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>Imprimir</Button>
              <Button variant="contained" startIcon={<CalculateIcon />} sx={{ bgcolor: coloresImperha.guinda.principal, '&:hover': { bgcolor: coloresImperha.guinda.oscuro } }} onClick={() => { setDialogoDetalle(false); navigate(`/nomina/calculo/${periodoSeleccionado.id}`); }}>Procesar Nómina</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={dialogoNuevo} onClose={() => setDialogoNuevo(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Período de Nómina</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth><InputLabel>Tipo de Nómina</InputLabel><Select label="Tipo de Nómina" defaultValue="semanal"><MenuItem value="semanal">Semanal</MenuItem><MenuItem value="quincenal">Quincenal</MenuItem><MenuItem value="mensual">Mensual</MenuItem><MenuItem value="extraordinaria">Extraordinaria</MenuItem></Select></FormControl>
              </Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Número de Período" type="number" defaultValue={periodosFiltrados[0]?.numero ? periodosFiltrados[0].numero + 1 : 1} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Fecha Inicio" type="date" InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Fecha Fin" type="date" InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Fecha de Pago" type="date" InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Observaciones" multiline rows={3} /></Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogoNuevo(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: coloresImperha.guinda.principal, '&:hover': { bgcolor: coloresImperha.guinda.oscuro } }}>Crear Período</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PeriodosNominaPage;
