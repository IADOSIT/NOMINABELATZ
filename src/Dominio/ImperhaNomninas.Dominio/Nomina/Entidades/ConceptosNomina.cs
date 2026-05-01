// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidades de conceptos de nómina
// ===================================

using ImperhaNomninas.Dominio.Compartido.Entidades;
using ImperhaNomninas.Dominio.Nomina.Enumeraciones;

namespace ImperhaNomninas.Dominio.Nomina.Entidades;

/// <summary>
/// Representa una percepción en el cálculo de nómina.
/// </summary>
public class PercepcionNomina : EntidadBase
{
    /// <summary>
    /// ID de la nómina del empleado.
    /// </summary>
    public Guid NominaEmpleadoId { get; private set; }

    /// <summary>
    /// Tipo de percepción SAT.
    /// </summary>
    public TipoPercepcionNomina TipoPercepcion { get; private set; }

    /// <summary>
    /// Clave de percepción.
    /// </summary>
    public string Clave { get; private set; } = string.Empty;

    /// <summary>
    /// Descripción de la percepción.
    /// </summary>
    public string Descripcion { get; private set; } = string.Empty;

    /// <summary>
    /// Importe gravado.
    /// </summary>
    public decimal ImporteGravado { get; private set; }

    /// <summary>
    /// Importe exento.
    /// </summary>
    public decimal ImporteExento { get; private set; }

    /// <summary>
    /// Importe total (gravado + exento).
    /// </summary>
    public decimal ImporteTotal => ImporteGravado + ImporteExento;

    /// <summary>
    /// Concepto ID de catálogo (si aplica).
    /// </summary>
    public Guid? ConceptoId { get; private set; }

    /// <summary>
    /// Cantidad base para cálculo.
    /// </summary>
    public decimal? CantidadBase { get; private set; }

    /// <summary>
    /// Valor unitario para cálculo.
    /// </summary>
    public decimal? ValorUnitario { get; private set; }

    private PercepcionNomina() : base() { }

    /// <summary>
    /// Crea una nueva percepción.
    /// </summary>
    public static PercepcionNomina Crear(
        Guid nominaEmpleadoId,
        TipoPercepcionNomina tipoPercepcion,
        string clave,
        string descripcion,
        decimal importeGravado,
        decimal importeExento,
        Guid? conceptoId = null,
        decimal? cantidadBase = null,
        decimal? valorUnitario = null)
    {
        return new PercepcionNomina
        {
            NominaEmpleadoId = nominaEmpleadoId,
            TipoPercepcion = tipoPercepcion,
            Clave = clave,
            Descripcion = descripcion,
            ImporteGravado = importeGravado,
            ImporteExento = importeExento,
            ConceptoId = conceptoId,
            CantidadBase = cantidadBase,
            ValorUnitario = valorUnitario
        };
    }
}

/// <summary>
/// Representa una deducción en el cálculo de nómina.
/// </summary>
public class DeduccionNomina : EntidadBase
{
    /// <summary>
    /// ID de la nómina del empleado.
    /// </summary>
    public Guid NominaEmpleadoId { get; private set; }

    /// <summary>
    /// Tipo de deducción SAT.
    /// </summary>
    public TipoDeduccionNomina TipoDeduccion { get; private set; }

    /// <summary>
    /// Clave de deducción.
    /// </summary>
    public string Clave { get; private set; } = string.Empty;

    /// <summary>
    /// Descripción de la deducción.
    /// </summary>
    public string Descripcion { get; private set; } = string.Empty;

    /// <summary>
    /// Importe de la deducción.
    /// </summary>
    public decimal Importe { get; private set; }

    /// <summary>
    /// Concepto ID de catálogo (si aplica).
    /// </summary>
    public Guid? ConceptoId { get; private set; }

    private DeduccionNomina() : base() { }

    /// <summary>
    /// Crea una nueva deducción.
    /// </summary>
    public static DeduccionNomina Crear(
        Guid nominaEmpleadoId,
        TipoDeduccionNomina tipoDeduccion,
        string clave,
        string descripcion,
        decimal importe,
        Guid? conceptoId = null)
    {
        return new DeduccionNomina
        {
            NominaEmpleadoId = nominaEmpleadoId,
            TipoDeduccion = tipoDeduccion,
            Clave = clave,
            Descripcion = descripcion,
            Importe = importe,
            ConceptoId = conceptoId
        };
    }
}

/// <summary>
/// Representa un "otro pago" en el cálculo de nómina (subsidio al empleo, etc.).
/// </summary>
public class OtroPagoNomina : EntidadBase
{
    /// <summary>
    /// ID de la nómina del empleado.
    /// </summary>
    public Guid NominaEmpleadoId { get; private set; }

    /// <summary>
    /// Tipo de otro pago SAT.
    /// </summary>
    public TipoOtroPagoNomina TipoOtroPago { get; private set; }

    /// <summary>
    /// Clave del otro pago.
    /// </summary>
    public string Clave { get; private set; } = string.Empty;

    /// <summary>
    /// Descripción del otro pago.
    /// </summary>
    public string Descripcion { get; private set; } = string.Empty;

    /// <summary>
    /// Importe del otro pago.
    /// </summary>
    public decimal Importe { get; private set; }

    /// <summary>
    /// Subsidio causado (para subsidio al empleo).
    /// </summary>
    public decimal? SubsidioCausado { get; private set; }

    private OtroPagoNomina() : base() { }

    /// <summary>
    /// Crea un nuevo otro pago.
    /// </summary>
    public static OtroPagoNomina Crear(
        Guid nominaEmpleadoId,
        TipoOtroPagoNomina tipoOtroPago,
        string clave,
        string descripcion,
        decimal importe,
        decimal? subsidioCausado = null)
    {
        return new OtroPagoNomina
        {
            NominaEmpleadoId = nominaEmpleadoId,
            TipoOtroPago = tipoOtroPago,
            Clave = clave,
            Descripcion = descripcion,
            Importe = importe,
            SubsidioCausado = subsidioCausado
        };
    }
}
