// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Página de Selección de Empresa/Ingenio
// ===================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Avatar,
  Button,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Divider,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Factory as FactoryIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Grass as GrassIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useEmpresaStore, Empresa, Ingenio } from '../../stores/empresaStore';
import { coloresImperha } from '../../tema/temaImperha';

const pasos = ['Seleccionar Empresa', 'Seleccionar Ingenio', 'Confirmar'];

function SeleccionEmpresaPage() {
  const navigate = useNavigate();
  const {
    empresas,
    empresaSeleccionada,
    ingenioSeleccionado,
    seleccionarEmpresa,
    seleccionarIngenio,
    limpiarSeleccion,
  } = useEmpresaStore();

  const [pasoActivo, setPasoActivo] = useState(0);

  const handleSeleccionarEmpresa = (empresa: Empresa) => {
    seleccionarEmpresa(empresa);
    setPasoActivo(1);
  };

  const handleSeleccionarIngenio = (ingenio: Ingenio) => {
    seleccionarIngenio(ingenio);
    setPasoActivo(2);
  };

  const handleConfirmar = () => {
    navigate('/dashboard');
  };

  const handleVolver = () => {
    if (pasoActivo === 1) {
      limpiarSeleccion();
      setPasoActivo(0);
    } else if (pasoActivo === 2) {
      setPasoActivo(1);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${coloresImperha.guinda.oscuro} 0%, ${coloresImperha.guinda.principal} 50%, ${coloresImperha.rojo.principal} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            IMPERHA NÓMINAS
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: alpha('#fff', 0.85), fontWeight: 400 }}
          >
            Sistema de Nómina Enterprise para Ingenios Azucareros
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ py: 3 }}>
            <Stepper activeStep={pasoActivo} alternativeLabel>
              {pasos.map((label, index) => (
                <Step key={label} completed={pasoActivo > index}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-completed': { color: coloresImperha.guinda.principal },
                        '&.Mui-active': { color: coloresImperha.rojo.principal },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Paso 0: Selección de Empresa */}
        <Fade in={pasoActivo === 0} timeout={500}>
          <Box sx={{ display: pasoActivo === 0 ? 'block' : 'none' }}>
            <Typography
              variant="h5"
              sx={{ color: 'white', mb: 3, textAlign: 'center' }}
            >
              Seleccione la empresa a la que desea conectarse
            </Typography>
            <Grid container spacing={3}>
              {empresas.map((empresa) => (
                <Grid item xs={12} md={4} key={empresa.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleSeleccionarEmpresa(empresa)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: coloresImperha.guinda.principal,
                              mr: 2,
                            }}
                          >
                            <BusinessIcon fontSize="large" />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                              {empresa.nombreComercial}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              RFC: {empresa.rfc}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, minHeight: 40 }}
                        >
                          {empresa.razonSocial}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {empresa.direccion}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {empresa.telefono}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<FactoryIcon />}
                            label={`${empresa.ingenios.length} Ingenios`}
                            size="small"
                            color="primary"
                          />
                          <Chip
                            icon={<PeopleIcon />}
                            label={`${empresa.ingenios.reduce((sum, i) => sum + i.empleadosActivos, 0).toLocaleString()} empleados`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Paso 1: Selección de Ingenio */}
        <Fade in={pasoActivo === 1} timeout={500}>
          <Box sx={{ display: pasoActivo === 1 ? 'block' : 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton
                onClick={handleVolver}
                sx={{ color: 'white', mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ color: 'white' }}>
                Seleccione el ingenio - {empresaSeleccionada?.nombreComercial}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {empresaSeleccionada?.ingenios.map((ingenio) => (
                <Grid item xs={12} md={4} key={ingenio.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      border: ingenio.enZafra
                        ? `2px solid ${coloresImperha.exito}`
                        : '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleSeleccionarIngenio(ingenio)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: ingenio.enZafra
                                ? coloresImperha.exito
                                : coloresImperha.guinda.claro,
                              mr: 2,
                            }}
                          >
                            <FactoryIcon fontSize="large" />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                              {ingenio.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Clave: {ingenio.clave}
                            </Typography>
                          </Box>
                          {ingenio.enZafra && (
                            <Tooltip title="En periodo de zafra">
                              <Chip
                                icon={<GrassIcon />}
                                label="ZAFRA"
                                size="small"
                                color="success"
                              />
                            </Tooltip>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {ingenio.ubicacion}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 3.5 }}
                          >
                            {ingenio.estado}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {ingenio.telefono}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Gerente:</strong> {ingenio.gerente}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                          <Chip
                            icon={<PeopleIcon />}
                            label={`${ingenio.empleadosActivos.toLocaleString()} empleados`}
                            size="small"
                            color="primary"
                          />
                          {ingenio.enZafra && ingenio.inicioZafra && (
                            <Chip
                              label={`Zafra: ${new Date(ingenio.inicioZafra).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })} - ${new Date(ingenio.finZafra!).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}`}
                              size="small"
                              variant="outlined"
                              color="success"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Paso 2: Confirmación */}
        <Fade in={pasoActivo === 2} timeout={500}>
          <Box sx={{ display: pasoActivo === 2 ? 'block' : 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton
                onClick={handleVolver}
                sx={{ color: 'white', mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ color: 'white' }}>
                Confirmar selección
              </Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <CheckCircleIcon
                        sx={{
                          fontSize: 64,
                          color: coloresImperha.exito,
                          mb: 2,
                        }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        ¿Confirmar acceso al sistema?
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card
                          variant="outlined"
                          sx={{ bgcolor: alpha(coloresImperha.guinda.principal, 0.02) }}
                        >
                          <CardContent>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                            >
                              Empresa
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Avatar
                                sx={{
                                  bgcolor: coloresImperha.guinda.principal,
                                  mr: 2,
                                }}
                              >
                                <BusinessIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {empresaSeleccionada?.nombreComercial}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {empresaSeleccionada?.razonSocial}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Card
                          variant="outlined"
                          sx={{ bgcolor: alpha(coloresImperha.guinda.principal, 0.02) }}
                        >
                          <CardContent>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                            >
                              Ingenio
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Avatar
                                sx={{
                                  bgcolor: ingenioSeleccionado?.enZafra
                                    ? coloresImperha.exito
                                    : coloresImperha.guinda.claro,
                                  mr: 2,
                                }}
                              >
                                <FactoryIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {ingenioSeleccionado?.nombre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {ingenioSeleccionado?.ubicacion}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {ingenioSeleccionado?.enZafra && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(coloresImperha.exito, 0.1),
                          border: `1px solid ${coloresImperha.exito}`,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <GrassIcon sx={{ color: coloresImperha.exito, mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: coloresImperha.exito }}>
                            Periodo de Zafra Activo
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Del {new Date(ingenioSeleccionado.inicioZafra!).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} al{' '}
                            {new Date(ingenioSeleccionado.finZafra!).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleVolver}
                        startIcon={<ArrowBackIcon />}
                      >
                        Cambiar Ingenio
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleConfirmar}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ minWidth: 200 }}
                      >
                        Ingresar al Sistema
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
            © 2024 Imperha Sistemas - Todos los derechos reservados
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.4) }}>
            Versión 1.0.0 | Cumplimiento SAT CFDI 4.0 | Ley Federal del Trabajo | Contrato Ley de la Industria Azucarera
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default SeleccionEmpresaPage;
