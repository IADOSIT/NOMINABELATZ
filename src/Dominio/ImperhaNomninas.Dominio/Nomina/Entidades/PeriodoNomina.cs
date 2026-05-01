// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Periodo de Nómina
// ===================================

using ImperhaNomninas.Dominio.Compartido.Entidades;
using ImperhaNomninas.Dominio.Nomina.Enumeraciones;

namespace ImperhaNomninas.Dominio.Nomina.Entidades;

/// <summary>
/// Representa un periodo de nómina (quincenal, semanal, etc.).
/// Contiene las fechas y el estatus del periodo.
/// </summary>
public class PeriodoNomina : EntidadAuditable
{
    /// <summary>
    /// Número del periodo (1, 2, 3... según el ejercicio).
    /// </summary>
    public int NumeroPeriodo { get; private set; }

    /// <summary>
    /// Ejercicio fiscal (año).
    /// </summary>
    public int Ejercicio { get; private set; }

    /// <summary>
    /// Tipo de nómina.
    /// </summary>
    public TipoNomina TipoNomina { get; private set; }

    /// <summary>
    /// Periodicidad del periodo.
    /// </summary>
    public PeriodicidadNomina Periodicidad { get; private set; }

    /// <summary>
    /// Fecha de inicio del periodo.
    /// </summary>
    public DateTime FechaInicio { get; private set; }

    /// <summary>
    /// Fecha de fin del periodo.
    /// </summary>
    public DateTime FechaFin { get; private set; }

    /// <summary>
    /// Fecha de pago.
    /// </summary>
    public DateTime FechaPago { get; private set; }

    /// <summary>
    /// Estatus del periodo.
    /// </summary>
    public EstatusPeriodo Estatus { get; private set; }

    /// <summary>
    /// Fecha de cierre del periodo.
    /// </summary>
    public DateTime? FechaCierre { get; private set; }

    /// <summary>
    /// Usuario que cerró el periodo.
    /// </summary>
    public Guid? UsuarioCierreId { get; private set; }

    /// <summary>
    /// Hash de integridad del cierre.
    /// </summary>
    public string? HashCierre { get; private set; }

    /// <summary>
    /// Es periodo de zafra.
    /// </summary>
    public bool EsPeriodoZafra { get; private set; }

    /// <summary>
    /// Descripción del periodo.
    /// </summary>
    public string Descripcion { get; private set; } = string.Empty;

    /// <summary>
    /// Total de percepciones del periodo.
    /// </summary>
    public decimal TotalPercepciones { get; private set; }

    /// <summary>
    /// Total de deducciones del periodo.
    /// </summary>
    public decimal TotalDeducciones { get; private set; }

    /// <summary>
    /// Total neto del periodo.
    /// </summary>
    public decimal TotalNeto { get; private set; }

    /// <summary>
    /// Número de empleados procesados.
    /// </summary>
    public int EmpleadosProcesados { get; private set; }

    // ============ CONSTRUCTOR ============

    private PeriodoNomina() : base() { }

    /// <summary>
    /// Crea un nuevo periodo de nómina.
    /// </summary>
    public static PeriodoNomina Crear(
        Guid empresaId,
        Guid ingenioId,
        int numeroPeriodo,
        int ejercicio,
        TipoNomina tipoNomina,
        PeriodicidadNomina periodicidad,
        DateTime fechaInicio,
        DateTime fechaFin,
        DateTime fechaPago,
        bool esPeriodoZafra,
        Guid usuarioCreadorId)
    {
        if (fechaFin < fechaInicio)
            throw new ArgumentException("La fecha de fin debe ser mayor o igual a la fecha de inicio");

        var periodo = new PeriodoNomina
        {
            NumeroPeriodo = numeroPeriodo,
            Ejercicio = ejercicio,
            TipoNomina = tipoNomina,
            Periodicidad = periodicidad,
            FechaInicio = fechaInicio,
            FechaFin = fechaFin,
            FechaPago = fechaPago,
            Estatus = EstatusPeriodo.Abierto,
            EsPeriodoZafra = esPeriodoZafra,
            Descripcion = $"Periodo {numeroPeriodo} - {ObtenerNombrePeriodicidad(periodicidad)} {ejercicio}"
        };

        periodo.EstablecerContextoEmpresa(empresaId, ingenioId);
        periodo.EstablecerCreacion(usuarioCreadorId);

        return periodo;
    }

    // ============ MÉTODOS DE DOMINIO ============

    /// <summary>
    /// Abre el periodo para cálculo.
    /// </summary>
    public void AbrirParaCalculo(Guid usuarioId)
    {
        if (Estatus != EstatusPeriodo.Abierto)
            throw new InvalidOperationException("Solo se puede abrir para cálculo un periodo en estado Abierto");

        Estatus = EstatusPeriodo.EnCalculo;
        MarcarComoModificado(usuarioId);
    }

    /// <summary>
    /// Marca el periodo como calculado.
    /// </summary>
    public void MarcarComoCalculado(
        decimal totalPercepciones,
        decimal totalDeducciones,
        int empleadosProcesados,
        Guid usuarioId)
    {
        if (Estatus != EstatusPeriodo.EnCalculo)
            throw new InvalidOperationException("Solo se puede marcar como calculado un periodo en cálculo");

        TotalPercepciones = totalPercepciones;
        TotalDeducciones = totalDeducciones;
        TotalNeto = totalPercepciones - totalDeducciones;
        EmpleadosProcesados = empleadosProcesados;
        Estatus = EstatusPeriodo.Calculado;

        MarcarComoModificado(usuarioId);
    }

    /// <summary>
    /// Cierra el periodo (inmutable después del cierre).
    /// </summary>
    public void CerrarPeriodo(string hashIntegridad, Guid usuarioId)
    {
        if (Estatus != EstatusPeriodo.Calculado)
            throw new InvalidOperationException("Solo se puede cerrar un periodo calculado");

        Estatus = EstatusPeriodo.Cerrado;
        FechaCierre = DateTime.UtcNow;
        UsuarioCierreId = usuarioId;
        HashCierre = hashIntegridad;

        MarcarComoModificado(usuarioId);
        AgregarNotaAuditoria($"Periodo cerrado. Hash: {hashIntegridad}");
    }

    /// <summary>
    /// Verifica si el periodo permite modificaciones.
    /// </summary>
    public bool PermiteModificaciones()
    {
        return Estatus != EstatusPeriodo.Cerrado && Estatus != EstatusPeriodo.Timbrado;
    }

    /// <summary>
    /// Obtiene el nombre de la periodicidad.
    /// </summary>
    private static string ObtenerNombrePeriodicidad(PeriodicidadNomina periodicidad)
    {
        return periodicidad switch
        {
            PeriodicidadNomina.Semanal => "Semanal",
            PeriodicidadNomina.Catorcenal => "Catorcenal",
            PeriodicidadNomina.Quincenal => "Quincenal",
            PeriodicidadNomina.Mensual => "Mensual",
            _ => periodicidad.ToString()
        };
    }
}
