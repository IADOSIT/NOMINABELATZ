// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// DTOs de Nómina
// ===================================

namespace ImperhaNomninas.Aplicacion.Contratos.Nomina;

/// <summary>
/// DTO para periodo de nómina.
/// </summary>
public class PeriodoNominaDto
{
    public Guid Id { get; set; }
    public int NumeroPeriodo { get; set; }
    public int Ejercicio { get; set; }
    public string TipoNomina { get; set; } = string.Empty;
    public string Periodicidad { get; set; } = string.Empty;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public DateTime FechaPago { get; set; }
    public string Estatus { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public bool EsPeriodoZafra { get; set; }
    public decimal TotalPercepciones { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal TotalNeto { get; set; }
    public int EmpleadosProcesados { get; set; }
    public DateTime? FechaCierre { get; set; }
}

/// <summary>
/// DTO para nómina de empleado.
/// </summary>
public class NominaEmpleadoDto
{
    public Guid Id { get; set; }
    public Guid PeriodoNominaId { get; set; }
    public Guid EmpleadoId { get; set; }
    public string NumeroEmpleado { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Rfc { get; set; } = string.Empty;
    public string Curp { get; set; } = string.Empty;
    public string Nss { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public string Puesto { get; set; } = string.Empty;

    // Salarios
    public decimal SalarioDiario { get; set; }
    public decimal SalarioDiarioIntegrado { get; set; }
    public decimal SalarioBaseCotizacion { get; set; }

    // Días
    public decimal DiasTrabajados { get; set; }
    public decimal DiasIncapacidad { get; set; }
    public decimal DiasFaltas { get; set; }
    public decimal DiasVacaciones { get; set; }
    public decimal HorasExtraDobles { get; set; }
    public decimal HorasExtraTriples { get; set; }

    // Totales
    public decimal TotalPercepcionesGravadas { get; set; }
    public decimal TotalPercepcionesExentas { get; set; }
    public decimal TotalPercepciones { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal TotalOtrosPagos { get; set; }
    public decimal NetoAPagar { get; set; }

    // ISR
    public decimal IsrRetener { get; set; }
    public decimal SubsidioEmpleoAplicado { get; set; }

    // IMSS
    public decimal CuotaObreraImss { get; set; }

    // INFONAVIT
    public decimal DescuentoInfonavit { get; set; }

    // Estatus
    public string Estatus { get; set; } = string.Empty;
    public DateTime? FechaCalculo { get; set; }
    public string? ErroresCalculo { get; set; }

    // CFDI
    public string? UuidCfdi { get; set; }
    public DateTime? FechaTimbrado { get; set; }
    public string EstatusCfdi { get; set; } = string.Empty;

    // Detalles
    public List<PercepcionNominaDto> Percepciones { get; set; } = new();
    public List<DeduccionNominaDto> Deducciones { get; set; } = new();
    public List<OtroPagoNominaDto> OtrosPagos { get; set; } = new();
}

/// <summary>
/// DTO para percepción de nómina.
/// </summary>
public class PercepcionNominaDto
{
    public Guid Id { get; set; }
    public string TipoPercepcion { get; set; } = string.Empty;
    public string Clave { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal ImporteGravado { get; set; }
    public decimal ImporteExento { get; set; }
    public decimal ImporteTotal { get; set; }
}

/// <summary>
/// DTO para deducción de nómina.
/// </summary>
public class DeduccionNominaDto
{
    public Guid Id { get; set; }
    public string TipoDeduccion { get; set; } = string.Empty;
    public string Clave { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Importe { get; set; }
}

/// <summary>
/// DTO para otro pago de nómina.
/// </summary>
public class OtroPagoNominaDto
{
    public Guid Id { get; set; }
    public string TipoOtroPago { get; set; } = string.Empty;
    public string Clave { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Importe { get; set; }
    public decimal? SubsidioCausado { get; set; }
}

/// <summary>
/// DTO para solicitar cálculo de nómina.
/// </summary>
public class SolicitudCalculoNominaDto
{
    public Guid PeriodoNominaId { get; set; }
    public List<Guid>? EmpleadosIds { get; set; }
    public bool CalcularTodos { get; set; }
    public bool Recalcular { get; set; }
}

/// <summary>
/// DTO para crear un periodo de nómina.
/// </summary>
public class CrearPeriodoNominaDto
{
    public int Ejercicio { get; set; }
    public int TipoNomina { get; set; }
    public int Periodicidad { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public DateTime FechaPago { get; set; }
    public bool EsPeriodoZafra { get; set; }
}

/// <summary>
/// DTO para resumen de nómina del periodo.
/// </summary>
public class ResumenNominaPeriodoDto
{
    public Guid PeriodoId { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int TotalEmpleados { get; set; }
    public int EmpleadosCalculados { get; set; }
    public int EmpleadosConError { get; set; }
    public int EmpleadosPendientes { get; set; }
    public decimal TotalPercepciones { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal TotalNetoPagar { get; set; }
    public decimal TotalIsrRetenido { get; set; }
    public decimal TotalImssObrero { get; set; }
    public decimal TotalInfonavit { get; set; }
}

/// <summary>
/// DTO para simulación de nómina.
/// </summary>
public class SimulacionNominaDto
{
    public Guid EmpleadoId { get; set; }
    public decimal? SalarioDiarioSimulado { get; set; }
    public decimal? DiasTrabajar { get; set; }
    public decimal? HorasExtraDobles { get; set; }
    public decimal? HorasExtraTriples { get; set; }
    public List<PercepcionAdicionalDto>? PercepcionesAdicionales { get; set; }
}

/// <summary>
/// DTO para percepción adicional en simulación.
/// </summary>
public class PercepcionAdicionalDto
{
    public int TipoPercepcion { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public decimal ImporteGravado { get; set; }
    public decimal ImporteExento { get; set; }
}
