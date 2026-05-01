// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Dashboard Principal con KPIs y Gráficas
// ===================================

import { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  alpha,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Grass as GrassIcon,
  CalendarMonth as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import { useEmpresaStore } from '../../stores/empresaStore';
import { coloresImperha } from '../../tema/temaImperha';

// Datos de ejemplo para el dashboard
const datosKPI = {
  empleadosActivos: 1250,
  empleadosZafra: 485,
  costoNominaMensual: 18500000,
  costoNominaAnterior: 17800000,
  cfdiPendientes: 23,
  cfdiTimbrados: 1227,
  diasProximoPago: 5,
  incidenciasPendientes: 12,
};

const ultimasNominas = [
  { periodo: 'Qna 02 - Enero 2025', empleados: 1250, total: 9250000, estatus: 'Timbrado', fecha: '31/01/2025' },
  { periodo: 'Qna 01 - Enero 2025', empleados: 1248, total: 9180000, estatus: 'Timbrado', fecha: '15/01/2025' },
  { periodo: 'Qna 02 - Diciembre 2024', empleados: 1245, total: 9150000, estatus: 'Timbrado', fecha: '31/12/2024' },
  { periodo: 'Aguinaldo 2024', empleados: 1245, total: 4580000, estatus: 'Timbrado', fecha: '20/12/2024' },
  { periodo: 'Qna 01 - Diciembre 2024', empleados: 1242, total: 9120000, estatus: 'Timbrado', fecha: '15/12/2024' },
];

const alertas = [
  { tipo: 'warning', mensaje: '12 incidencias de asistencia pendientes de revisar', modulo: 'Asistencias' },
  { tipo: 'info', mensaje: 'Periodo de zafra activo: 85 días restantes', modulo: 'Zafra' },
  { tipo: 'error', mensaje: '3 créditos INFONAVIT por vencer este mes', modulo: 'Deducciones' },
  { tipo: 'success', mensaje: 'Nómina Qna 02 Enero timbrada exitosamente', modulo: 'CFDI' },
];

function DashboardPage() {
  const navigate = useNavigate();
  const { empresaSeleccionada, ingenioSeleccionado } = useEmpresaStore();

  const variacionCosto = useMemo(() => {
    const diff = ((datosKPI.costoNominaMensual - datosKPI.costoNominaAnterior) / datosKPI.costoNominaAnterior) * 100;
    return diff.toFixed(1);
  }, []);

  // Configuración de gráfica de costos mensuales
  const opcionesGraficaCostos = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Percepciones', 'Deducciones', 'Neto'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
    },
    series: [
      {
        name: 'Percepciones',
        type: 'bar',
        stack: 'total',
        data: [12.5, 12.8, 13.1, 13.4, 17.2, 13.8],
        itemStyle: { color: coloresImperha.guinda.principal },
      },
      {
        name: 'Deducciones',
        type: 'bar',
        stack: 'total',
        data: [-3.2, -3.3, -3.4, -3.5, -4.1, -3.6],
        itemStyle: { color: coloresImperha.rojo.claro },
      },
      {
        name: 'Neto',
        type: 'line',
        data: [9.3, 9.5, 9.7, 9.9, 13.1, 10.2],
        itemStyle: { color: coloresImperha.exito },
        lineStyle: { width: 3 },
      },
    ],
  };

  // Configuración de gráfica de distribución
  const opcionesGraficaDistribucion = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: 680, name: 'Fábrica', itemStyle: { color: coloresImperha.guinda.principal } },
          { value: 320, name: 'Campo', itemStyle: { color: coloresImperha.rojo.principal } },
          { value: 150, name: 'Administrativo', itemStyle: { color: coloresImperha.guinda.claro } },
          { value: 100, name: 'Confianza', itemStyle: { color: coloresImperha.rojo.claro } },
        ],
      },
    ],
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {empresaSeleccionada?.nombreComercial} • {ingenioSeleccionado?.nombre}
            {ingenioSeleccionado?.enZafra && (
              <Chip
                icon={<GrassIcon />}
                label="Periodo de Zafra Activo"
                size="small"
                color="success"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Actualizar datos">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/nomina/periodos')}
          >
            Ir a Nómina
          </Button>
        </Box>
      </Box>

      {/* KPIs principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Empleados Activos
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {datosKPI.empleadosActivos.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      icon={<GrassIcon />}
                      label={`${datosKPI.empleadosZafra} en zafra`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(coloresImperha.guinda.principal, 0.1), width: 48, height: 48 }}>
                  <PeopleIcon sx={{ color: coloresImperha.guinda.principal }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Costo Nómina Mensual
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {formatearMoneda(datosKPI.costoNominaMensual).replace('MX', '')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                    {Number(variacionCosto) > 0 ? (
                      <TrendingUpIcon fontSize="small" color="error" />
                    ) : (
                      <TrendingDownIcon fontSize="small" color="success" />
                    )}
                    <Typography
                      variant="body2"
                      color={Number(variacionCosto) > 0 ? 'error.main' : 'success.main'}
                      fontWeight={500}
                    >
                      {variacionCosto}% vs mes anterior
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(coloresImperha.exito, 0.1), width: 48, height: 48 }}>
                  <MoneyIcon sx={{ color: coloresImperha.exito }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                    CFDI Timbrados
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {datosKPI.cfdiTimbrados.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                    {datosKPI.cfdiPendientes > 0 ? (
                      <Chip
                        icon={<WarningIcon />}
                        label={`${datosKPI.cfdiPendientes} pendientes`}
                        size="small"
                        color="warning"
                      />
                    ) : (
                      <Chip icon={<CheckIcon />} label="Todo timbrado" size="small" color="success" />
                    )}
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(coloresImperha.info, 0.1), width: 48, height: 48 }}>
                  <ReceiptIcon sx={{ color: coloresImperha.info }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Próximo Pago
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {datosKPI.diasProximoPago} días
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Qna 01 - Febrero 2025
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(coloresImperha.advertencia, 0.1), width: 48, height: 48 }}>
                  <ScheduleIcon sx={{ color: coloresImperha.advertencia }} />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((15 - datosKPI.diasProximoPago) / 15) * 100}
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Costos de Nómina por Mes
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <ReactECharts option={opcionesGraficaCostos} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Distribución de Personal
              </Typography>
              <ReactECharts option={opcionesGraficaDistribucion} style={{ height: 280 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla y Alertas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Últimas Nóminas Procesadas
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/nomina/historico')}
                >
                  Ver todas
                </Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Periodo</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Empleados</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estatus</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ultimasNominas.map((nomina, index) => (
                    <TableRow key={index} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {nomina.periodo}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{nomina.empleados.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={500}>
                          {formatearMoneda(nomina.total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={nomina.estatus}
                          size="small"
                          color={nomina.estatus === 'Timbrado' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {nomina.fecha}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Alertas y Notificaciones
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alertas.map((alerta, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor:
                        alerta.tipo === 'error'
                          ? alpha(coloresImperha.error, 0.08)
                          : alerta.tipo === 'warning'
                          ? alpha(coloresImperha.advertencia, 0.08)
                          : alerta.tipo === 'success'
                          ? alpha(coloresImperha.exito, 0.08)
                          : alpha(coloresImperha.info, 0.08),
                      borderLeft: `4px solid ${
                        alerta.tipo === 'error'
                          ? coloresImperha.error
                          : alerta.tipo === 'warning'
                          ? coloresImperha.advertencia
                          : alerta.tipo === 'success'
                          ? coloresImperha.exito
                          : coloresImperha.info
                      }`,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {alerta.mensaje}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alerta.modulo}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Info de Zafra si está activa */}
      {ingenioSeleccionado?.enZafra && (
        <Card sx={{ mt: 3, bgcolor: alpha(coloresImperha.exito, 0.04), border: `1px solid ${coloresImperha.exito}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: coloresImperha.exito, width: 56, height: 56 }}>
                <GrassIcon fontSize="large" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  Periodo de Zafra Activo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ingenioSeleccionado.inicioZafra &&
                    `Del ${new Date(ingenioSeleccionado.inicioZafra).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} al ${new Date(ingenioSeleccionado.finZafra!).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}`}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {datosKPI.empleadosZafra}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trabajadores de Zafra
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="success"
                onClick={() => navigate('/zafra/personal')}
                endIcon={<ArrowForwardIcon />}
              >
                Ver Detalles
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default DashboardPage;
