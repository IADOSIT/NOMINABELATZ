import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  alpha,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  BarChart as ChartIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { coloresImperha } from '../../tema/temaImperha';

const AZUL = coloresImperha.azul.principal;
const AZUL_OSC = coloresImperha.azul.oscuro;
const INDIGO = coloresImperha.indigo.principal;

const features = [
  { icon: <CheckIcon sx={{ fontSize: 18 }} />, text: 'Nómina conforme al Contrato Ley Azucarero' },
  { icon: <SecurityIcon sx={{ fontSize: 18 }} />, text: 'CFDI 4.0 timbrado automático SAT' },
  { icon: <SpeedIcon sx={{ fontSize: 18 }} />, text: 'Cálculo IMSS, ISR y PTU en segundos' },
  { icon: <ChartIcon sx={{ fontSize: 18 }} />, text: 'Reportes y KPIs en tiempo real' },
];

function LoginPage() {
  const navigate = useNavigate();
  const { loginDemo } = useAuthStore();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      loginDemo();
      navigate('/seleccionar-empresa');
    } catch {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/seleccionar-empresa');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* ── Left brand panel ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '44%',
          flexShrink: 0,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(155deg, ${AZUL_OSC} 0%, ${AZUL} 55%, ${INDIGO} 100%)`,
          p: 6,
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: alpha('#fff', 0.06),
        }} />
        <Box sx={{
          position: 'absolute', bottom: -100, left: -60,
          width: 280, height: 280, borderRadius: '50%',
          background: alpha('#fff', 0.05),
        }} />
        <Box sx={{
          position: 'absolute', top: '40%', left: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: alpha('#fff', 0.04),
        }} />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380 }}>
          {/* Logo */}
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/belatz-logo.jpg"
              alt="Belatz"
              sx={{
                height: 56,
                width: 56,
                borderRadius: 2,
                objectFit: 'cover',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.1 }}>
                Nóminas Belatz
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), letterSpacing: '0.05em' }}>
                Sistema Enterprise
              </Typography>
            </Box>
          </Box>

          <Typography variant="h3" fontWeight={700} sx={{ color: '#fff', mb: 1.5, lineHeight: 1.15 }}>
            Gestión de nómina para ingenios azucareros
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#fff', 0.75), mb: 5, lineHeight: 1.7 }}>
            Plataforma integral diseñada para cumplir con el Contrato Ley Azucarero, la Ley Federal del Trabajo y las obligaciones fiscales ante el SAT.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: 1.5, flexShrink: 0,
                  bgcolor: alpha('#fff', 0.15),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                }}>
                  {f.icon}
                </Box>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.85) }}>
                  {f.text}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{
            mt: 6,
            pt: 3,
            borderTop: `1px solid ${alpha('#fff', 0.15)}`,
            display: 'flex',
            gap: 3,
          }}>
            {[['99.9%', 'Disponibilidad'], ['< 2s', 'Tiempo de cálculo'], ['CFDI 4.0', 'Cumplimiento']].map(([val, lbl]) => (
              <Box key={lbl}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', lineHeight: 1 }}>{val}</Typography>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>{lbl}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: coloresImperha.neutros.fondoBase,
          px: { xs: 3, sm: 6, lg: 8 },
          py: 6,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box
              component="img"
              src="/belatz-logo.jpg"
              alt="Belatz"
              sx={{ height: 40, width: 40, borderRadius: 1.5, objectFit: 'cover' }}
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Nóminas Belatz
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.75, color: 'text.primary' }}>
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Ingresa tus credenciales para acceder al sistema
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Usuario"
                size="medium"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                autoFocus
                placeholder="Tu nombre de usuario"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fff',
                    fontSize: '0.9375rem',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                size="medium"
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        edge="end"
                        size="small"
                      >
                        {mostrarPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fff',
                    fontSize: '0.9375rem',
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  sx={{
                    color: AZUL,
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={cargando}
                endIcon={!cargando && <ArrowIcon />}
                sx={{
                  mt: 0.5,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '0.9375rem',
                }}
              >
                {cargando ? <CircularProgress size={22} color="inherit" /> : 'Iniciar Sesión'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
              acceso rápido
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleDemoLogin}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontSize: '0.875rem',
              borderColor: coloresImperha.neutros.bordeClaro,
              color: 'text.primary',
              bgcolor: '#fff',
              '&:hover': {
                borderColor: AZUL,
                bgcolor: coloresImperha.azul.palido,
                color: AZUL,
              },
            }}
          >
            Entrar con acceso demo
          </Button>

          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 4 }}>
            © {new Date().getFullYear()} Imperha Sistemas • Todos los derechos reservados
          </Typography>
          <Typography variant="caption" align="center" sx={{ display: 'block', mt: 0.5, color: AZUL }}>
            CFDI 4.0 • Ley Federal del Trabajo • Contrato Ley Azucarero
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
