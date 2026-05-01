// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Excepciones de dominio
// ===================================

namespace ImperhaNomninas.Dominio.Compartido.Excepciones;

/// <summary>
/// Excepción base para errores de dominio.
/// </summary>
public class ExcepcionDominio : Exception
{
    /// <summary>
    /// Código de error para identificación.
    /// </summary>
    public string Codigo { get; }

    /// <summary>
    /// Detalles adicionales del error.
    /// </summary>
    public IDictionary<string, object>? Detalles { get; }

    public ExcepcionDominio(string mensaje) : base(mensaje)
    {
        Codigo = "ERROR_DOMINIO";
    }

    public ExcepcionDominio(string codigo, string mensaje) : base(mensaje)
    {
        Codigo = codigo;
    }

    public ExcepcionDominio(string codigo, string mensaje, IDictionary<string, object> detalles) : base(mensaje)
    {
        Codigo = codigo;
        Detalles = detalles;
    }

    public ExcepcionDominio(string mensaje, Exception innerException) : base(mensaje, innerException)
    {
        Codigo = "ERROR_DOMINIO";
    }
}

/// <summary>
/// Excepción cuando no se encuentra una entidad.
/// </summary>
public class EntidadNoEncontradaExcepcion : ExcepcionDominio
{
    public string TipoEntidad { get; }
    public Guid EntidadId { get; }

    public EntidadNoEncontradaExcepcion(string tipoEntidad, Guid id)
        : base("ENTIDAD_NO_ENCONTRADA", $"No se encontró {tipoEntidad} con ID: {id}")
    {
        TipoEntidad = tipoEntidad;
        EntidadId = id;
    }
}

/// <summary>
/// Excepción cuando una regla de negocio es violada.
/// </summary>
public class ReglaDeNegocioExcepcion : ExcepcionDominio
{
    public string Regla { get; }

    public ReglaDeNegocioExcepcion(string regla, string mensaje)
        : base("REGLA_NEGOCIO_VIOLADA", mensaje)
    {
        Regla = regla;
    }
}

/// <summary>
/// Excepción para errores de validación.
/// </summary>
public class ValidacionExcepcion : ExcepcionDominio
{
    public IReadOnlyList<ErrorValidacion> Errores { get; }

    public ValidacionExcepcion(IEnumerable<ErrorValidacion> errores)
        : base("VALIDACION_FALLIDA", "La validación ha fallado")
    {
        Errores = errores.ToList();
    }

    public ValidacionExcepcion(string campo, string mensaje)
        : base("VALIDACION_FALLIDA", mensaje)
    {
        Errores = new List<ErrorValidacion> { new(campo, mensaje) };
    }
}

/// <summary>
/// Representa un error de validación específico.
/// </summary>
public record ErrorValidacion(string Campo, string Mensaje);

/// <summary>
/// Excepción para conflictos de concurrencia.
/// </summary>
public class ConcurrenciaExcepcion : ExcepcionDominio
{
    public ConcurrenciaExcepcion(string mensaje)
        : base("CONFLICTO_CONCURRENCIA", mensaje)
    {
    }
}

/// <summary>
/// Excepción para operaciones no autorizadas.
/// </summary>
public class NoAutorizadoExcepcion : ExcepcionDominio
{
    public NoAutorizadoExcepcion(string mensaje)
        : base("NO_AUTORIZADO", mensaje)
    {
    }

    public NoAutorizadoExcepcion(string recurso, string accion)
        : base("NO_AUTORIZADO", $"No tiene permisos para {accion} en {recurso}")
    {
    }
}

/// <summary>
/// Excepción para operaciones fiscales (SAT, IMSS, etc.).
/// </summary>
public class ExcepcionFiscal : ExcepcionDominio
{
    public string OrganismoFiscal { get; }

    public ExcepcionFiscal(string organismoFiscal, string mensaje)
        : base("ERROR_FISCAL", mensaje)
    {
        OrganismoFiscal = organismoFiscal;
    }
}

/// <summary>
/// Excepción para errores de nómina.
/// </summary>
public class ExcepcionNomina : ExcepcionDominio
{
    public Guid? NominaId { get; }
    public int? PeriodoId { get; }

    public ExcepcionNomina(string mensaje) : base("ERROR_NOMINA", mensaje)
    {
    }

    public ExcepcionNomina(string mensaje, Guid nominaId, int periodoId)
        : base("ERROR_NOMINA", mensaje)
    {
        NominaId = nominaId;
        PeriodoId = periodoId;
    }
}

/// <summary>
/// Excepción para errores de CFDI.
/// </summary>
public class ExcepcionCfdi : ExcepcionDominio
{
    public string? UuidCfdi { get; }
    public string TipoError { get; }

    public ExcepcionCfdi(string tipoError, string mensaje)
        : base("ERROR_CFDI", mensaje)
    {
        TipoError = tipoError;
    }

    public ExcepcionCfdi(string tipoError, string mensaje, string uuid)
        : base("ERROR_CFDI", mensaje)
    {
        TipoError = tipoError;
        UuidCfdi = uuid;
    }
}
