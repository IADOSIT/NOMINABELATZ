// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Componente principal con rutas completas
// ===================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEmpresaStore } from './stores/empresaStore';

// Layouts
import AppShell from './layouts/AppShell';
import AuthLayout from './layouts/AuthLayout';

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage';

// Página de selección
import SeleccionEmpresaPage from './pages/seleccion/SeleccionEmpresaPage';

// Páginas principales
import DashboardPage from './pages/dashboard/DashboardPage';

// Empleados
import EmpleadosPage from './pages/empleados/EmpleadosPage';
import EmpleadoDetallePage from './pages/empleados/EmpleadoDetallePage';

// Nómina
import NominaPage from './pages/nomina/NominaPage';
import PeriodosNominaPage from './pages/nomina/PeriodosNominaPage';
import CalculoNominaPage from './pages/nomina/CalculoNominaPage';

// CFDI
import CfdiPage from './pages/cfdi/CfdiPage';

// Auditoría
import AuditoriaPage from './pages/auditoria/AuditoriaPage';

// Configuración
import ConfiguracionPage from './pages/configuracion/ConfiguracionPage';

// Componente de ruta protegida
function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuthStore();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Componente que requiere empresa seleccionada
function RequiereEmpresa({ children }: { children: React.ReactNode }) {
  const { empresaSeleccionada, ingenioSeleccionado } = useEmpresaStore();

  if (!empresaSeleccionada || !ingenioSeleccionado) {
    return <Navigate to="/seleccionar-empresa" replace />;
  }

  return <>{children}</>;
}

// Página placeholder genérica para rutas no implementadas
function PlaceholderPage({ titulo, descripcion }: { titulo: string; descripcion?: string }) {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ margin: 0, color: '#800020' }}>{titulo}</h1>
      <p style={{ color: '#6c757d' }}>{descripcion || 'Esta funcionalidad está en desarrollo...'}</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Selección de empresa/ingenio */}
      <Route
        path="/seleccionar-empresa"
        element={
          <RutaProtegida>
            <SeleccionEmpresaPage />
          </RutaProtegida>
        }
      />

      {/* Rutas protegidas con empresa seleccionada */}
      <Route
        element={
          <RutaProtegida>
            <RequiereEmpresa>
              <AppShell />
            </RequiereEmpresa>
          </RutaProtegida>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Empleados */}
        <Route path="/empleados" element={<EmpleadosPage />} />
        <Route path="/empleados/:id" element={<EmpleadoDetallePage />} />
        <Route path="/empleados/expediente" element={<PlaceholderPage titulo="Expediente Digital" descripcion="Gestión de expedientes digitales de empleados" />} />
        <Route path="/empleados/movimientos" element={<PlaceholderPage titulo="Altas y Bajas" descripcion="Registro de movimientos de personal" />} />
        <Route path="/empleados/contratos" element={<PlaceholderPage titulo="Contratos" descripcion="Administración de contratos laborales" />} />
        <Route path="/empleados/organigrama" element={<PlaceholderPage titulo="Organigrama" descripcion="Estructura organizacional de la empresa" />} />

        {/* Estructura */}
        <Route path="/estructura/departamentos" element={<PlaceholderPage titulo="Departamentos" descripcion="Catálogo de departamentos" />} />
        <Route path="/estructura/puestos" element={<PlaceholderPage titulo="Puestos" descripcion="Catálogo de puestos" />} />
        <Route path="/estructura/centros-costo" element={<PlaceholderPage titulo="Centros de Costo" descripcion="Administración de centros de costo" />} />
        <Route path="/estructura/turnos" element={<PlaceholderPage titulo="Turnos" descripcion="Configuración de turnos de trabajo" />} />

        {/* Asistencias */}
        <Route path="/asistencias" element={<PlaceholderPage titulo="Control de Asistencia" descripcion="Registro y control de asistencias" />} />
        <Route path="/asistencias/incidencias" element={<PlaceholderPage titulo="Incidencias" descripcion="Gestión de incidencias de asistencia" />} />
        <Route path="/asistencias/vacaciones" element={<PlaceholderPage titulo="Vacaciones" descripcion="Control de vacaciones del personal" />} />
        <Route path="/asistencias/permisos" element={<PlaceholderPage titulo="Permisos y Faltas" descripcion="Registro de permisos y faltas" />} />
        <Route path="/asistencias/horas-extra" element={<PlaceholderPage titulo="Horas Extra" descripcion="Control de tiempo extra" />} />
        <Route path="/asistencias/festivos" element={<PlaceholderPage titulo="Días Festivos" descripcion="Calendario de días festivos" />} />

        {/* Nómina */}
        <Route path="/nomina" element={<NominaPage />} />
        <Route path="/nomina/periodos" element={<PeriodosNominaPage />} />
        <Route path="/nomina/calculo" element={<CalculoNominaPage />} />
        <Route path="/nomina/calcular/:periodoId" element={<CalculoNominaPage />} />
        <Route path="/nomina/pre-nomina" element={<PlaceholderPage titulo="Pre-Nómina" descripcion="Revisión previa al cálculo de nómina" />} />
        <Route path="/nomina/dispersion" element={<PlaceholderPage titulo="Dispersión Bancaria" descripcion="Generación de layouts bancarios" />} />
        <Route path="/nomina/recibos" element={<PlaceholderPage titulo="Recibos de Nómina" descripcion="Consulta e impresión de recibos" />} />
        <Route path="/nomina/historico" element={<PlaceholderPage titulo="Histórico de Nóminas" descripcion="Consulta de nóminas anteriores" />} />

        {/* Percepciones */}
        <Route path="/percepciones" element={<PlaceholderPage titulo="Catálogo de Percepciones" descripcion="Tipos de percepciones configurables" />} />
        <Route path="/percepciones/sueldo" element={<PlaceholderPage titulo="Sueldo Base" descripcion="Configuración de sueldos base" />} />
        <Route path="/percepciones/bonos" element={<PlaceholderPage titulo="Bonos y Comisiones" descripcion="Gestión de bonos y comisiones" />} />
        <Route path="/percepciones/prestaciones" element={<PlaceholderPage titulo="Prestaciones" descripcion="Prestaciones laborales" />} />
        <Route path="/percepciones/tiempo-extra" element={<PlaceholderPage titulo="Tiempo Extra" descripcion="Cálculo de tiempo extra" />} />
        <Route path="/percepciones/prima-dominical" element={<PlaceholderPage titulo="Prima Dominical" descripcion="Prima por trabajo en domingo" />} />
        <Route path="/percepciones/aguinaldo" element={<PlaceholderPage titulo="Aguinaldo" descripcion="Cálculo de aguinaldo anual" />} />
        <Route path="/percepciones/ptu" element={<PlaceholderPage titulo="PTU" descripcion="Reparto de utilidades" />} />

        {/* Deducciones */}
        <Route path="/deducciones" element={<PlaceholderPage titulo="Catálogo de Deducciones" descripcion="Tipos de deducciones configurables" />} />
        <Route path="/deducciones/isr" element={<PlaceholderPage titulo="ISR" descripcion="Impuesto sobre la Renta" />} />
        <Route path="/deducciones/imss" element={<PlaceholderPage titulo="IMSS" descripcion="Cuotas de seguridad social" />} />
        <Route path="/deducciones/infonavit" element={<PlaceholderPage titulo="INFONAVIT" descripcion="Créditos de vivienda" />} />
        <Route path="/deducciones/prestamos" element={<PlaceholderPage titulo="Préstamos" descripcion="Control de préstamos al personal" />} />
        <Route path="/deducciones/pension" element={<PlaceholderPage titulo="Pensión Alimenticia" descripcion="Descuentos por pensión alimenticia" />} />
        <Route path="/deducciones/sindicato" element={<PlaceholderPage titulo="Cuota Sindical" descripcion="Cuotas sindicales" />} />
        <Route path="/deducciones/ahorro" element={<PlaceholderPage titulo="Caja de Ahorro" descripcion="Fondo de ahorro de empleados" />} />

        {/* Zafra */}
        <Route path="/zafra/periodos" element={<PlaceholderPage titulo="Periodos de Zafra" descripcion="Configuración de periodos de zafra" />} />
        <Route path="/zafra/personal" element={<PlaceholderPage titulo="Personal de Zafra" descripcion="Trabajadores temporales de zafra" />} />
        <Route path="/zafra/bonos" element={<PlaceholderPage titulo="Bonos de Productividad" descripcion="Incentivos por productividad de zafra" />} />
        <Route path="/zafra/liquidacion" element={<PlaceholderPage titulo="Liquidación de Zafra" descripcion="Finiquitos de fin de zafra" />} />
        <Route path="/zafra/transporte" element={<PlaceholderPage titulo="Transporte de Caña" descripcion="Control de transporte cañero" />} />

        {/* Contrato Ley Azucarero */}
        <Route path="/contrato-ley/prestaciones" element={<PlaceholderPage titulo="Prestaciones de Ley" descripcion="Prestaciones según contrato ley azucarero" />} />
        <Route path="/contrato-ley/escalafon" element={<PlaceholderPage titulo="Escalafón" descripcion="Sistema de escalafón sindical" />} />
        <Route path="/contrato-ley/tabuladores" element={<PlaceholderPage titulo="Tabuladores" descripcion="Tabuladores salariales" />} />
        <Route path="/contrato-ley/categorias" element={<PlaceholderPage titulo="Categorías Sindicales" descripcion="Categorías según contrato ley" />} />
        <Route path="/contrato-ley/jornadas" element={<PlaceholderPage titulo="Jornadas Especiales" descripcion="Jornadas de trabajo industriales" />} />

        {/* Sindicato */}
        <Route path="/sindicato/registro" element={<PlaceholderPage titulo="Registro Sindical" descripcion="Afiliación sindical de empleados" />} />
        <Route path="/sindicato/cuotas" element={<PlaceholderPage titulo="Cuotas Sindicales" descripcion="Administración de cuotas sindicales" />} />
        <Route path="/sindicato/representantes" element={<PlaceholderPage titulo="Representantes" descripcion="Representantes sindicales" />} />
        <Route path="/sindicato/acuerdos" element={<PlaceholderPage titulo="Acuerdos" descripcion="Acuerdos sindicales" />} />
        <Route path="/sindicato/fondo-ahorro" element={<PlaceholderPage titulo="Fondo de Ahorro Sindical" descripcion="Fondo de ahorro del sindicato" />} />

        {/* CFDI */}
        <Route path="/cfdi" element={<CfdiPage />} />
        <Route path="/cfdi/timbrado" element={<PlaceholderPage titulo="Timbrado de Recibos" descripcion="Timbrado CFDI de nómina" />} />
        <Route path="/cfdi/cancelaciones" element={<PlaceholderPage titulo="Cancelaciones" descripcion="Cancelación de CFDI" />} />
        <Route path="/cfdi/acuses" element={<PlaceholderPage titulo="Acuses SAT" descripcion="Acuses de recepción SAT" />} />
        <Route path="/cfdi/descarga" element={<PlaceholderPage titulo="Descarga Masiva" descripcion="Descarga masiva de XML" />} />
        <Route path="/cfdi/configuracion" element={<PlaceholderPage titulo="Configuración PAC" descripcion="Configuración del proveedor de timbrado" />} />

        {/* IMSS */}
        <Route path="/imss/sua" element={<PlaceholderPage titulo="SUA / IDSE" descripcion="Integración con sistemas IMSS" />} />
        <Route path="/imss/movimientos" element={<PlaceholderPage titulo="Movimientos Afiliatorios" descripcion="Altas, bajas y modificaciones IMSS" />} />
        <Route path="/imss/cuotas" element={<PlaceholderPage titulo="Determinación de Cuotas" descripcion="Cálculo de cuotas obrero-patronales" />} />
        <Route path="/imss/sdi" element={<PlaceholderPage titulo="SDI / SBC" descripcion="Salario diario integrado" />} />
        <Route path="/imss/prima-riesgo" element={<PlaceholderPage titulo="Prima de Riesgo" descripcion="Prima de riesgo de trabajo" />} />
        <Route path="/imss/incapacidades" element={<PlaceholderPage titulo="Incapacidades" descripcion="Control de incapacidades" />} />

        {/* Contabilidad */}
        <Route path="/contabilidad/polizas" element={<PlaceholderPage titulo="Pólizas de Nómina" descripcion="Generación de pólizas contables" />} />
        <Route path="/contabilidad/cuentas" element={<PlaceholderPage titulo="Cuentas Contables" descripcion="Catálogo de cuentas" />} />
        <Route path="/contabilidad/centros-costo" element={<PlaceholderPage titulo="Centros de Costo" descripcion="Distribución por centro de costo" />} />
        <Route path="/contabilidad/provisiones" element={<PlaceholderPage titulo="Provisiones" descripcion="Provisiones laborales" />} />
        <Route path="/contabilidad/conciliacion" element={<PlaceholderPage titulo="Conciliación Bancaria" descripcion="Conciliación de pagos" />} />

        {/* Reportes */}
        <Route path="/reportes/nomina-periodo" element={<PlaceholderPage titulo="Nómina por Periodo" descripcion="Reporte detallado de nómina" />} />
        <Route path="/reportes/acumulados" element={<PlaceholderPage titulo="Acumulados Anuales" descripcion="Acumulados fiscales del año" />} />
        <Route path="/reportes/plantilla" element={<PlaceholderPage titulo="Plantilla de Personal" descripcion="Reporte de plantilla" />} />
        <Route path="/reportes/costo-nomina" element={<PlaceholderPage titulo="Costo de Nómina" descripcion="Análisis de costos" />} />
        <Route path="/reportes/rotacion" element={<PlaceholderPage titulo="Rotación de Personal" descripcion="Indicadores de rotación" />} />
        <Route path="/reportes/imss" element={<PlaceholderPage titulo="Reportes IMSS" descripcion="Reportes para IMSS" />} />
        <Route path="/reportes/isr" element={<PlaceholderPage titulo="Reportes ISR" descripcion="Reportes fiscales ISR" />} />
        <Route path="/reportes/personalizados" element={<PlaceholderPage titulo="Reportes Personalizados" descripcion="Generador de reportes" />} />

        {/* Dashboards */}
        <Route path="/dashboards/nomina" element={<PlaceholderPage titulo="KPIs de Nómina" descripcion="Indicadores de nómina" />} />
        <Route path="/dashboards/costos" element={<PlaceholderPage titulo="Análisis de Costos" descripcion="Dashboard de costos laborales" />} />
        <Route path="/dashboards/rh" element={<PlaceholderPage titulo="Indicadores de RH" descripcion="Métricas de recursos humanos" />} />
        <Route path="/dashboards/zafra" element={<PlaceholderPage titulo="Productividad Zafra" descripcion="Dashboard de productividad de zafra" />} />

        {/* Importaciones */}
        <Route path="/importar/empleados" element={<PlaceholderPage titulo="Importar Empleados" descripcion="Carga masiva de empleados" />} />
        <Route path="/importar/asistencias" element={<PlaceholderPage titulo="Importar Asistencias" descripcion="Carga de registros de asistencia" />} />
        <Route path="/importar/incidencias" element={<PlaceholderPage titulo="Importar Incidencias" descripcion="Carga de incidencias" />} />
        <Route path="/importar/movimientos" element={<PlaceholderPage titulo="Importar Movimientos" descripcion="Carga de movimientos de nómina" />} />
        <Route path="/importar/plantillas" element={<PlaceholderPage titulo="Plantillas Excel" descripcion="Descarga de plantillas" />} />

        {/* Seguridad */}
        <Route path="/seguridad/usuarios" element={<PlaceholderPage titulo="Usuarios" descripcion="Administración de usuarios" />} />
        <Route path="/seguridad/roles" element={<PlaceholderPage titulo="Roles" descripcion="Configuración de roles" />} />
        <Route path="/seguridad/permisos" element={<PlaceholderPage titulo="Permisos" descripcion="Matriz de permisos" />} />
        <Route path="/seguridad/sesiones" element={<PlaceholderPage titulo="Sesiones Activas" descripcion="Monitoreo de sesiones" />} />
        <Route path="/seguridad/politicas" element={<PlaceholderPage titulo="Políticas de Seguridad" descripcion="Configuración de políticas" />} />

        {/* Auditoría */}
        <Route path="/auditoria" element={<AuditoriaPage />} />
        <Route path="/auditoria/accesos" element={<PlaceholderPage titulo="Bitácora de Accesos" descripcion="Registro de accesos al sistema" />} />
        <Route path="/auditoria/cambios" element={<PlaceholderPage titulo="Cambios en Sistema" descripcion="Historial de cambios" />} />
        <Route path="/auditoria/nomina" element={<PlaceholderPage titulo="Historial de Nómina" descripcion="Auditoría de cálculos" />} />
        <Route path="/auditoria/exportar" element={<PlaceholderPage titulo="Exportar Auditoría" descripcion="Exportación de bitácoras" />} />

        {/* Configuración */}
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route path="/configuracion/empresa" element={<PlaceholderPage titulo="Empresa e Ingenios" descripcion="Configuración de empresas" />} />
        <Route path="/configuracion/nomina" element={<PlaceholderPage titulo="Parámetros de Nómina" descripcion="Configuración de nómina" />} />
        <Route path="/configuracion/isr" element={<PlaceholderPage titulo="Tablas ISR" descripcion="Tablas de ISR vigentes" />} />
        <Route path="/configuracion/imss" element={<PlaceholderPage titulo="Tablas IMSS" descripcion="Configuración IMSS" />} />
        <Route path="/configuracion/sat" element={<PlaceholderPage titulo="Catálogos SAT" descripcion="Catálogos del SAT" />} />
        <Route path="/configuracion/notificaciones" element={<PlaceholderPage titulo="Correo y Notificaciones" descripcion="Configuración de correos" />} />
        <Route path="/configuracion/respaldos" element={<PlaceholderPage titulo="Respaldos" descripcion="Respaldos del sistema" />} />

        {/* Perfil */}
        <Route path="/perfil" element={<PlaceholderPage titulo="Mi Perfil" descripcion="Información de usuario" />} />
      </Route>

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
