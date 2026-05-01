// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Componente de Asistente IA (Popup flotante)
// ===================================

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Zoom,
  alpha,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon,
  ContentCopy as CopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  OpenInFull as ExpandIcon,
} from '@mui/icons-material';
import { coloresImperha } from '../../tema/temaImperha';

interface AsistenteIAProps {
  onCerrar: () => void;
}

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
}

const sugerenciasIniciales = [
  '¿Cómo calculo las horas extra?',
  '¿Cuántos días de vacaciones corresponden?',
  'Explicar el cálculo de ISR',
  '¿Qué es el SDI?',
  '¿Qué es la prima de zafra?',
  'Contrato ley azucarero',
];

function AsistenteIA({ onCerrar }: AsistenteIAProps) {
  const [minimizado, setMinimizado] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      tipo: 'asistente',
      contenido: '¡Hola! Soy el asistente de IMPERHA NÓMINAS. Puedo ayudarte con dudas sobre nómina, cálculos fiscales, empleados, zafra y más. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const enviarMensaje = async (mensaje: string) => {
    if (!mensaje.trim()) return;

    const nuevoMensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      contenido: mensaje,
      timestamp: new Date(),
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    setInputMensaje('');
    setCargando(true);

    setTimeout(() => {
      const respuesta = generarRespuestaSimulada(mensaje);
      const mensajeAsistente: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'asistente',
        contenido: respuesta,
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeAsistente]);
      setCargando(false);
    }, 1500);
  };

  const generarRespuestaSimulada = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();

    if (preguntaLower.includes('horas extra')) {
      return `Las horas extra se calculan de la siguiente manera:

**Horas extra dobles:** Las primeras 9 horas semanales se pagan al 200% del salario por hora.

**Horas extra triples:** Las horas que excedan las 9 horas semanales se pagan al 300%.

**Fórmula:**
- Valor hora = Salario Diario / 8
- Hora doble = Valor hora × 2
- Hora triple = Valor hora × 3

**Exención fiscal:** Las primeras 9 horas semanales están exentas de ISR hasta el 50%.`;
    }

    if (preguntaLower.includes('vacaciones')) {
      return `Según la LFT reformada (2023), los días de vacaciones son:

| Años | Días |
|------|------|
| 1 año | 12 días |
| 2 años | 14 días |
| 3 años | 16 días |
| 4 años | 18 días |
| 5 años | 20 días |
| 6-10 años | 22 días |
| 11-15 años | 24 días |

La **prima vacacional** es del 25% sobre los días de vacaciones.`;
    }

    if (preguntaLower.includes('isr')) {
      return `El ISR se calcula con la **tabla de tarifas del SAT**:

1. Se determina la base gravable
2. Se ubica el rango en la tabla
3. **ISR = Cuota fija + (Excedente × % marginal)**
4. Se aplica el subsidio al empleo
5. ISR a retener = ISR calculado - Subsidio

El sistema calcula esto automáticamente con las tablas vigentes 2024.`;
    }

    if (preguntaLower.includes('sdi')) {
      return `El **Salario Diario Integrado (SDI)** es la base para IMSS e INFONAVIT.

**Se integra con:**
- Salario diario
- Proporción de aguinaldo (mín. 15 días / 365)
- Prima vacacional (días vac × 25% / 365)

**Fórmula:** SDI = Salario Diario × Factor de Integración

El factor mínimo es aprox. **1.0452** para el primer año.

**Tope:** 25 UMAs para efectos del IMSS.`;
    }

    if (preguntaLower.includes('zafra')) {
      return `La **prima de zafra** es una prestación especial del Contrato Ley de la Industria Azucarera:

**Características:**
- Se paga durante el periodo de molienda
- Es adicional al salario ordinario
- Varía según la categoría del trabajador
- Se calcula sobre días efectivamente laborados

**Periodo típico:** Noviembre a Mayo/Junio

El sistema IMPERHA maneja automáticamente los periodos de zafra por ingenio.`;
    }

    if (preguntaLower.includes('contrato ley')) {
      return `El **Contrato Ley de la Industria Azucarera** establece:

**Prestaciones especiales:**
- Prima de zafra
- Bonos de productividad
- Canasta básica
- Servicio médico adicional

**Jornadas:**
- 8 horas diarias máximo
- Turnos rotativos permitidos
- Prima dominical obligatoria

**Categorías sindicales:**
- Trabajadores de campo
- Trabajadores de fábrica
- Empleados de confianza

El sistema está configurado para cumplir todas estas disposiciones.`;
    }

    return `Entiendo tu pregunta sobre "${pregunta}".

Para darte una respuesta más precisa, ¿podrías especificar:
- ¿Es sobre un empleado en particular?
- ¿Se relaciona con algún periodo de nómina específico?
- ¿Necesitas el detalle del cálculo?

También puedo ayudarte a navegar por el sistema.`;
  };

  const handleSugerencia = (sugerencia: string) => {
    enviarMensaje(sugerencia);
  };

  return (
    <Zoom in={true}>
      <Paper
        elevation={12}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: minimizado ? 320 : 420,
          height: minimizado ? 56 : 550,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          borderRadius: 3,
          border: `1px solid ${alpha(coloresImperha.guinda.principal, 0.2)}`,
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${coloresImperha.guinda.principal} 0%, ${coloresImperha.rojo.principal} 100%)`,
            color: 'white',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha('#fff', 0.2),
              }}
            >
              <SmartToyIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Asistente IA
              </Typography>
              {!minimizado && (
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  IMPERHA NÓMINAS • En línea
                </Typography>
              )}
            </Box>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => setMinimizado(!minimizado)}
              sx={{ color: 'white' }}
            >
              {minimizado ? <ExpandIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={onCerrar} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {!minimizado && (
          <>
            {/* Área de mensajes */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: coloresImperha.neutros.fondoGris,
              }}
            >
              {mensajes.map((mensaje) => (
                <Box
                  key={mensaje.id}
                  sx={{
                    display: 'flex',
                    justifyContent: mensaje.tipo === 'usuario' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: '85%',
                      bgcolor:
                        mensaje.tipo === 'usuario'
                          ? coloresImperha.guinda.principal
                          : coloresImperha.neutros.blanco,
                      color: mensaje.tipo === 'usuario' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      border:
                        mensaje.tipo === 'asistente'
                          ? `1px solid ${coloresImperha.neutros.bordeClaro}`
                          : 'none',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.8125rem' }}>
                      {mensaje.contenido}
                    </Typography>
                    {mensaje.tipo === 'asistente' && (
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}>
                          <CopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}>
                          <ThumbUpIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}>
                          <ThumbDownIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    )}
                  </Paper>
                </Box>
              ))}

              {cargando && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} sx={{ color: coloresImperha.guinda.principal }} />
                  <Typography variant="body2" color="text.secondary">
                    Escribiendo...
                  </Typography>
                </Box>
              )}

              <div ref={mensajesEndRef} />
            </Box>

            {/* Sugerencias */}
            {mensajes.length === 1 && (
              <Box sx={{ p: 1.5, borderTop: `1px solid ${coloresImperha.neutros.bordeClaro}`, bgcolor: 'white' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Preguntas frecuentes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {sugerenciasIniciales.map((sugerencia, index) => (
                    <Chip
                      key={index}
                      label={sugerencia}
                      size="small"
                      variant="outlined"
                      onClick={() => handleSugerencia(sugerencia)}
                      sx={{
                        cursor: 'pointer',
                        borderColor: coloresImperha.guinda.claro,
                        color: coloresImperha.guinda.principal,
                        fontSize: '0.7rem',
                        '&:hover': {
                          bgcolor: alpha(coloresImperha.guinda.principal, 0.08),
                          borderColor: coloresImperha.guinda.principal,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider />

            {/* Input de mensaje */}
            <Box sx={{ p: 1.5, bgcolor: 'white' }}>
              <TextField
                fullWidth
                placeholder="Escribe tu pregunta..."
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    enviarMensaje(inputMensaje);
                  }
                }}
                disabled={cargando}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => enviarMensaje(inputMensaje)}
                        disabled={!inputMensaje.trim() || cargando}
                        sx={{
                          bgcolor: inputMensaje.trim()
                            ? coloresImperha.guinda.principal
                            : 'transparent',
                          color: inputMensaje.trim() ? 'white' : 'text.secondary',
                          '&:hover': {
                            bgcolor: inputMensaje.trim()
                              ? coloresImperha.guinda.oscuro
                              : 'transparent',
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'transparent',
                          },
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </Zoom>
  );
}

export default AsistenteIA;
