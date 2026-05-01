// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Página de Login con colores Guinda/Rojo
// ===================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Factory as FactoryIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { coloresImperha } from '../../tema/temaImperha';

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
      // Simular validación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Login de demostración
      loginDemo();
      navigate('/seleccionar-empresa');
    } catch (err) {
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${coloresImperha.guinda.oscuro} 0%, ${coloresImperha.guinda.principal} 50%, ${coloresImperha.rojo.principal} 100%)`,
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        {/* Header decorativo */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${coloresImperha.guinda.principal} 0%, ${coloresImperha.rojo.principal} 100%)`,
            py: 4,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <FactoryIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight={800} color="white" sx={{ letterSpacing: 2 }}>
            IMPERHA
          </Typography>
          <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.85), letterSpacing: 4 }}>
            NÓMINAS
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sistema de Nómina Enterprise para Ingenios Azucareros
          </Typography>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              margin="normal"
              placeholder="Ingresa tu usuario"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: coloresImperha.guinda.claro }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={mostrarPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              placeholder="Ingresa tu contraseña"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: coloresImperha.guinda.claro }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarPassword(!mostrarPassword)} edge="end">
                      {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={cargando}
              sx={{ mt: 3, py: 1.5 }}
            >
              {cargando ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              o
            </Typography>
          </Divider>

          {/* Botón Demo */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleDemoLogin}
            sx={{ py: 1.5 }}
          >
            Acceso Demo (Sin Contraseña)
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            ¿Olvidaste tu contraseña?{' '}
            <Typography
              component="a"
              href="#"
              variant="body2"
              sx={{
                textDecoration: 'none',
                color: coloresImperha.guinda.principal,
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Recuperar acceso
            </Typography>
          </Typography>
        </CardContent>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: coloresImperha.guinda.palido,
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2024 Imperha Sistemas. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: coloresImperha.guinda.claro, mt: 0.5 }}>
            Cumplimiento SAT • CFDI 4.0 • Ley Federal del Trabajo
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default LoginPage;
