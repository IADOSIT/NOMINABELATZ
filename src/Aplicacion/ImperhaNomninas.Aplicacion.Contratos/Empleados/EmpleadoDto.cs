// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// DTOs de Empleado
// ===================================

namespace ImperhaNomninas.Aplicacion.Contratos.Empleados;

/// <summary>
/// DTO para visualización de empleado.
/// </summary>
public class EmpleadoDto
{
    public Guid Id { get; set; }
    public string NumeroEmpleado { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string? ApellidoMaterno { get; set; }
    public string Curp { get; set; } = string.Empty;
    public string Rfc { get; set; } = string.Empty;
    public string Nss { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public int Edad { get; set; }
    public string Genero { get; set; } = string.Empty;
    public string EstadoCivil { get; set; } = string.Empty;

    // Datos de contacto
    public string? CorreoPersonal { get; set; }
    public string? CorreoInstitucional { get; set; }
    public string? TelefonoCelular { get; set; }

    // Datos laborales
    public DateTime FechaIngreso { get; set; }
    public int AniosAntiguedad { get; set; }
    public string TipoContrato { get; set; } = string.Empty;
    public string TipoRegimen { get; set; } = string.Empty;
    public string TipoJornada { get; set; } = string.Empty;
    public string PeriodicidadPago { get; set; } = string.Empty;
    public string EstatusLaboral { get; set; } = string.Empty;
    public string TipoTrabajador { get; set; } = string.Empty;
    public bool EsTrabajadorZafra { get; set; }

    // Estructura organizacional
    public Guid DepartamentoId { get; set; }
    public string NombreDepartamento { get; set; } = string.Empty;
    public Guid PuestoId { get; set; }
    public string NombrePuesto { get; set; } = string.Empty;
    public Guid? CentroCostoId { get; set; }
    public string? NombreCentroCosto { get; set; }

    // Datos salariales
    public decimal SalarioDiario { get; set; }
    public decimal SalarioDiarioIntegrado { get; set; }
    public decimal SalarioBaseCotizacion { get; set; }
    public string FormaPago { get; set; } = string.Empty;
    public string? BancoDeposito { get; set; }
    public string? ClabeOculta { get; set; }

    // INFONAVIT
    public bool TieneCreditoInfonavit { get; set; }
    public string? TipoDescuentoInfonavit { get; set; }

    // Foto
    public string? RutaFoto { get; set; }

    // Contexto
    public Guid EmpresaId { get; set; }
    public Guid IngenioId { get; set; }
    public bool Activo { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaModificacion { get; set; }
}

/// <summary>
/// DTO para lista resumida de empleados.
/// </summary>
public class EmpleadoResumenDto
{
    public Guid Id { get; set; }
    public string NumeroEmpleado { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Rfc { get; set; } = string.Empty;
    public string NombreDepartamento { get; set; } = string.Empty;
    public string NombrePuesto { get; set; } = string.Empty;
    public string EstatusLaboral { get; set; } = string.Empty;
    public decimal SalarioDiario { get; set; }
    public bool Activo { get; set; }
    public string? RutaFoto { get; set; }
}

/// <summary>
/// DTO para crear un empleado.
/// </summary>
public class CrearEmpleadoDto
{
    public string NumeroEmpleado { get; set; } = string.Empty;
    public string Curp { get; set; } = string.Empty;
    public string Rfc { get; set; } = string.Empty;
    public string Nss { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string? ApellidoMaterno { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public int Genero { get; set; }
    public DateTime FechaIngreso { get; set; }
    public int TipoContrato { get; set; }
    public int TipoRegimen { get; set; }
    public int TipoJornada { get; set; }
    public int PeriodicidadPago { get; set; }
    public int TipoTrabajador { get; set; }
    public bool EsTrabajadorZafra { get; set; }
    public Guid DepartamentoId { get; set; }
    public Guid PuestoId { get; set; }
    public Guid? CentroCostoId { get; set; }
    public decimal SalarioDiario { get; set; }
}

/// <summary>
/// DTO para actualizar un empleado.
/// </summary>
public class ActualizarEmpleadoDto
{
    public Guid Id { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string? ApellidoMaterno { get; set; }
    public int EstadoCivil { get; set; }
    public string? CorreoPersonal { get; set; }
    public string? CorreoInstitucional { get; set; }
    public string? TelefonoCelular { get; set; }
    public string? TelefonoCasa { get; set; }

    // Domicilio
    public string? DomicilioCalle { get; set; }
    public string? DomicilioNumeroExterior { get; set; }
    public string? DomicilioNumeroInterior { get; set; }
    public string? DomicilioColonia { get; set; }
    public string? DomicilioCodigoPostal { get; set; }
    public string? DomicilioMunicipio { get; set; }
    public string? DomicilioEstado { get; set; }

    // Contacto emergencia
    public string? ContactoEmergenciaNombre { get; set; }
    public string? ContactoEmergenciaTelefono { get; set; }
    public string? ContactoEmergenciaParentesco { get; set; }
}

/// <summary>
/// DTO para dar de baja un empleado.
/// </summary>
public class BajaEmpleadoDto
{
    public Guid EmpleadoId { get; set; }
    public DateTime FechaBaja { get; set; }
    public int MotivoBaja { get; set; }
    public string? Observaciones { get; set; }
}

/// <summary>
/// Filtros para búsqueda de empleados.
/// </summary>
public class FiltrosEmpleadoDto
{
    public Guid? IngenioId { get; set; }
    public Guid? DepartamentoId { get; set; }
    public Guid? PuestoId { get; set; }
    public int? EstatusLaboral { get; set; }
    public int? TipoTrabajador { get; set; }
    public bool? EsTrabajadorZafra { get; set; }
    public bool? SoloActivos { get; set; } = true;
}
