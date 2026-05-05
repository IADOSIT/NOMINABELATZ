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
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  ArrowForward as ArrowIcon,
  VerifiedUser as VerifiedIcon,
  Bolt as BoltIcon,
  BarChart as ChartIcon,
  Grass as GrassIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

// ─── Glassmorphism token helpers ───
const glass = (alpha = 0.72, blur = 40) =>
  ({
    background: `rgba(255,255,255,${alpha})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255,255,255,0.88)',
  } as const);

const glassBlue = (alpha = 0.14) =>
  ({
    background: `rgba(37,99,235,${alpha})`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.22)',
  } as const);

const features = [
  { icon: <VerifiedIcon sx={{ fontSize: 17 }} />, label: 'CFDI 4.0 · SAT', desc: 'Timbrado automático' },
  { icon: <BoltIcon sx={{ fontSize: 17 }} />, label: 'Cálculo en < 2s', desc: 'IMSS · ISR · PTU' },
  { icon: <ChartIcon sx={{ fontSize: 17 }} />, label: 'Analytics real-time', desc: 'KPIs y dashboards' },
  { icon: <GrassIcon sx={{ fontSize: 17 }} />, label: 'Zafra & Sindicato', desc: 'Contrato Ley Azucarero' },
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #EEF2FF 0%, #E0F2FE 40%, #F0FDF4 75%, #F8FAFC 100%)',
      }}
    >
      {/* ── Animated gradient blobs ── */}
      <Box sx={{
        position: 'absolute', top: '-18%', left: '-12%',
        width: { xs: 340, md: 680 }, height: { xs: 340, md: 680 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0.06) 45%, transparent 70%)',
        animation: 'blobDrift1 11s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-14%', right: '-10%',
        width: { xs: 280, md: 560 }, height: { xs: 280, md: 560 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.04) 50%, transparent 70%)',
        animation: 'blobDrift2 14s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', top: '35%', right: '8%',
        width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 55%, transparent 70%)',
        animation: 'blobDrift3 9s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', top: '10%', right: '30%',
        width: { xs: 140, md: 260 }, height: { xs: 140, md: 260 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 65%)',
        animation: 'blobDrift4 16s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* ── Dot grid pattern ── */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(37,99,235,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      {/* ── Main content ── */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
      }}>
        {/* Glass card wrapper */}
        <Box sx={{
          width: '100%', maxWidth: 960,
          borderRadius: { xs: 5, md: 6 },
          overflow: 'hidden',
          display: 'flex',
          minHeight: { xs: 'auto', md: 600 },
          ...glass(0.68, 36),
          boxShadow: '0 32px 80px rgba(37,99,235,0.1), 0 8px 32px rgba(0,0,0,0.06)',
          animation: 'fadeInUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both',
        }}>

          {/* ── Left brand panel ── */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            width: '44%', flexShrink: 0,
            flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(155deg, #1E3A8A 0%, #2563EB 52%, #4F46E5 100%)',
            p: 5,
          }}>
            {/* Glass orbs inside left panel */}
            {[
              { size: 220, top: '-60px', right: '-60px', opacity: 0.1 },
              { size: 160, bottom: '-40px', left: '-50px', opacity: 0.08 },
              { size: 100, top: '40%', left: '-20px', opacity: 0.07 },
            ].map((o, i) => (
              <Box key={i} sx={{
                position: 'absolute',
                width: o.size, height: o.size,
                borderRadius: '50%',
                top: o.top, bottom: o.bottom, left: o.left, right: o.right,
                ...glassBlue(o.opacity),
                border: '1px solid rgba(255,255,255,0.15)',
              }} />
            ))}

            {/* Brand */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
                <Box
                  component="img"
                  src="/belatz-logo.jpg"
                  alt="Belatz"
                  sx={{
                    width: 54, height: 54, borderRadius: 2.5, objectFit: 'cover',
                    boxShadow: '0 0 0 3px rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.3)',
                    flexShrink: 0,
                  }}
                  onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}
                  >
                    Nóminas Belatz
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.07em' }}>
                    SISTEMA ENTERPRISE
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  color: '#fff', mb: 1.5,
                  lineHeight: 1.15, letterSpacing: '-0.02em',
                  fontSize: { md: '1.75rem', lg: '2.1rem' },
                }}
              >
                Nómina inteligente para ingenios azucareros
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4.5, lineHeight: 1.7 }}>
                Plataforma integral con cumplimiento LFT, SAT y Contrato Ley Azucarero.
              </Typography>

              {/* Glass feature cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {features.map((f, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      ...glassBlue(0.18),
                      borderRadius: 3, px: 2, py: 1.25,
                      transition: 'background 0.2s',
                      '&:hover': { background: 'rgba(255,255,255,0.15)' },
                    }}
                  >
                    <Box sx={{
                      width: 32, height: 32, borderRadius: 2, flexShrink: 0,
                      background: 'rgba(255,255,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff',
                    }}>
                      {f.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#fff', lineHeight: 1.2 }}>
                        {f.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {f.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Stats */}
              <Box sx={{
                mt: 4.5, pt: 3,
                borderTop: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', gap: 3,
              }}>
                {[['99.9%', 'Uptime'], ['< 2s', 'Cálculo'], ['CFDI 4.0', 'Cumplimiento SAT']].map(([v, l]) => (
                  <Box key={l}>
                    <Typography
                      variant="h6" fontWeight={800}
                      sx={{ color: '#fff', lineHeight: 1, fontSize: '1.05rem' }}
                    >
                      {v}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem' }}>
                      {l}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── Right form panel ── */}
          <Box sx={{
            flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            px: { xs: 3, sm: 5, md: 5 }, py: { xs: 4, md: 5 },
          }}>
            <Box sx={{ width: '100%', maxWidth: 380 }}>

              {/* Mobile logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box
                  component="img" src="/belatz-logo.jpg" alt="Belatz"
                  sx={{ width: 38, height: 38, borderRadius: 1.5, objectFit: 'cover' }}
                  onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                />
                <Typography variant="subtitle1" fontWeight={700}>Nóminas Belatz</Typography>
              </Box>

              <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
                Bienvenido
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
                Ingresa tus credenciales para continuar
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth label="Usuario" size="medium"
                    value={usuario} onChange={(e) => setUsuario(e.target.value)}
                    autoComplete="username" autoFocus
                    placeholder="Tu nombre de usuario"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover fieldset': { borderColor: '#93C5FD' },
                        '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 2 },
                      },
                    }}
                  />

                  <TextField
                    fullWidth label="Contraseña" size="medium"
                    type={mostrarPassword ? 'text' : 'password'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Tu contraseña"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setMostrarPassword(!mostrarPassword)} edge="end" size="small">
                            {mostrarPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover fieldset': { borderColor: '#93C5FD' },
                        '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 2 },
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -0.5 }}>
                    <Typography
                      component="a" href="#" variant="caption"
                      sx={{ color: '#2563EB', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      ¿Olvidaste tu contraseña?
                    </Typography>
                  </Box>

                  <Button
                    type="submit" fullWidth variant="contained" size="large"
                    disabled={cargando}
                    endIcon={!cargando && <ArrowIcon />}
                    sx={{
                      mt: 0.5, py: 1.5, borderRadius: 2.5,
                      fontSize: '0.9375rem', fontWeight: 700,
                      background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                      boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1D4ED8 0%, #3730A3 100%)',
                        boxShadow: '0 6px 28px rgba(37,99,235,0.45)',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': { transform: 'translateY(0)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cargando ? <CircularProgress size={22} color="inherit" /> : 'Iniciar Sesión'}
                  </Button>
                </Box>
              </form>

              <Divider sx={{ my: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                  o continúa con
                </Typography>
              </Divider>

              <Button
                fullWidth variant="outlined" size="large"
                onClick={() => { loginDemo(); navigate('/seleccionar-empresa'); }}
                sx={{
                  py: 1.4, borderRadius: 2.5,
                  fontSize: '0.875rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(37,99,235,0.2)',
                  color: '#2563EB',
                  '&:hover': {
                    background: 'rgba(239,246,255,0.9)',
                    border: '1px solid #2563EB',
                    boxShadow: '0 2px 12px rgba(37,99,235,0.15)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Acceso Demo
              </Button>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {['CFDI 4.0', 'LFT', 'IMSS', 'Zafra'].map((t) => (
                  <Chip
                    key={t} label={t} size="small"
                    sx={{
                      fontSize: '0.65rem', fontWeight: 600,
                      background: 'rgba(37,99,235,0.07)',
                      color: '#3B82F6',
                      border: '1px solid rgba(37,99,235,0.15)',
                    }}
                  />
                ))}
              </Box>

              <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
                © {new Date().getFullYear()} Imperha Sistemas · Todos los derechos reservados
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
