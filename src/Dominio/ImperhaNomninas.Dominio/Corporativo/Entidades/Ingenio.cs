// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Ingenio Azucarero
// ===================================

using ImperhaNomninas.Dominio.Compartido.Entidades;

namespace ImperhaNomninas.Dominio.Corporativo.Entidades;

/// <summary>
/// Representa un ingenio azucarero dentro de una empresa.
/// Los ingenios son unidades operativas con su propia configuración de nómina.
/// </summary>
public class Ingenio : EntidadAuditable
{
    // ============ DATOS GENERALES ============

    /// <summary>
    /// Nombre del ingenio.
    /// </summary>
    public string Nombre { get; private set; } = string.Empty;

    /// <summary>
    /// Clave única del ingenio.
    /// </summary>
    public string Clave { get; private set; } = string.Empty;

    /// <summary>
    /// Descripción del ingenio.
    /// </summary>
    public string? Descripcion { get; private set; }

    // ============ UBICACIÓN ============

    /// <summary>
    /// Dirección del ingenio.
    /// </summary>
    public string? Direccion { get; private set; }

    /// <summary>
    /// Municipio donde se ubica.
    /// </summary>
    public string? Municipio { get; private set; }

    /// <summary>
    /// Estado donde se ubica.
    /// </summary>
    public string? Estado { get; private set; }

    /// <summary>
    /// Código postal.
    /// </summary>
    public string? CodigoPostal { get; private set; }

    /// <summary>
    /// Coordenadas GPS - Latitud.
    /// </summary>
    public decimal? Latitud { get; private set; }

    /// <summary>
    /// Coordenadas GPS - Longitud.
    /// </summary>
    public decimal? Longitud { get; private set; }

    // ============ CONFIGURACIÓN FISCAL ============

    /// <summary>
    /// Registro patronal IMSS del ingenio.
    /// </summary>
    public string RegistroPatronalImss { get; private set; } = string.Empty;

    /// <summary>
    /// Clase de riesgo IMSS (I a V).
    /// </summary>
    public int ClaseRiesgoImss { get; private set; } = 5; // Industria azucarera es clase V

    /// <summary>
    /// Prima de riesgo de trabajo.
    /// </summary>
    public decimal PrimaRiesgoTrabajo { get; private set; }

    /// <summary>
    /// Registro INFONAVIT del ingenio.
    /// </summary>
    public string? RegistroInfonavit { get; private set; }

    // ============ CONFIGURACIÓN DE ZAFRA ============

    /// <summary>
    /// Indica si actualmente está en temporada de zafra.
    /// </summary>
    public bool EnZafra { get; private set; }

    /// <summary>
    /// Fecha de inicio de la zafra actual.
    /// </summary>
    public DateTime? InicioZafraActual { get; private set; }

    /// <summary>
    /// Fecha estimada de fin de zafra.
    /// </summary>
    public DateTime? FinZafraEstimado { get; private set; }

    /// <summary>
    /// Número de la zafra actual (ej: 2024-2025).
    /// </summary>
    public string? NumeroZafra { get; private set; }

    // ============ CONFIGURACIÓN OPERATIVA ============

    /// <summary>
    /// Capacidad de molienda diaria (toneladas de caña).
    /// </summary>
    public decimal? CapacidadMoliendaDiaria { get; private set; }

    /// <summary>
    /// Número de empleados activos.
    /// </summary>
    public int NumeroEmpleadosActivos { get; private set; }

    /// <summary>
    /// Zona de salario mínimo (A, B, C - aunque ahora es única).
    /// </summary>
    public string ZonaSalarioMinimo { get; private set; } = "UNICA";

    // ============ BRANDING ============

    /// <summary>
    /// Ruta al logo del ingenio.
    /// </summary>
    public string? RutaLogo { get; private set; }

    /// <summary>
    /// Color primario del ingenio (puede diferir de la empresa).
    /// </summary>
    public string? ColorPrimario { get; private set; }

    // ============ CONTACTO ============

    /// <summary>
    /// Teléfono del ingenio.
    /// </summary>
    public string? Telefono { get; private set; }

    /// <summary>
    /// Correo electrónico del ingenio.
    /// </summary>
    public string? CorreoElectronico { get; private set; }

    /// <summary>
    /// Nombre del gerente o responsable.
    /// </summary>
    public string? NombreResponsable { get; private set; }

    // ============ CONSTRUCTORES ============

    private Ingenio() : base() { }

    /// <summary>
    /// Crea un nuevo ingenio.
    /// </summary>
    internal static Ingenio Crear(
        Guid empresaId,
        string nombre,
        string clave,
        string registroPatronalImss,
        Guid usuarioCreadorId)
    {
        var ingenio = new Ingenio
        {
            Nombre = nombre?.Trim() ?? throw new ArgumentNullException(nameof(nombre)),
            Clave = clave?.Trim().ToUpperInvariant() ?? throw new ArgumentNullException(nameof(clave)),
            RegistroPatronalImss = registroPatronalImss?.Trim() ?? throw new ArgumentNullException(nameof(registroPatronalImss)),
            ClaseRiesgoImss = 5, // Por defecto clase V para industria azucarera
            PrimaRiesgoTrabajo = 7.58875m // Prima máxima inicial
        };

        ingenio.EstablecerContextoEmpresa(empresaId);
        ingenio.EstablecerCreacion(usuarioCreadorId);
        ingenio.EstablecerOrigen("MANUAL");

        return ingenio;
    }

    // ============ MÉTODOS DE DOMINIO ============

    /// <summary>
    /// Actualiza los datos generales del ingenio.
    /// </summary>
    public void ActualizarDatosGenerales(
        string nombre,
        string? descripcion,
        Guid usuarioModificadorId)
    {
        Nombre = nombre?.Trim() ?? throw new ArgumentNullException(nameof(nombre));
        Descripcion = descripcion?.Trim();
        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Establece la ubicación del ingenio.
    /// </summary>
    public void EstablecerUbicacion(
        string? direccion,
        string? municipio,
        string? estado,
        string? codigoPostal,
        decimal? latitud,
        decimal? longitud,
        Guid usuarioModificadorId)
    {
        Direccion = direccion?.Trim();
        Municipio = municipio?.Trim();
        Estado = estado?.Trim();
        CodigoPostal = codigoPostal?.Trim();
        Latitud = latitud;
        Longitud = longitud;
        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Configura los datos fiscales del ingenio.
    /// </summary>
    public void ConfigurarDatosFiscales(
        string registroPatronalImss,
        int claseRiesgoImss,
        decimal primaRiesgoTrabajo,
        string? registroInfonavit,
        Guid usuarioModificadorId)
    {
        if (claseRiesgoImss < 1 || claseRiesgoImss > 5)
            throw new ArgumentException("La clase de riesgo debe estar entre 1 y 5", nameof(claseRiesgoImss));

        if (primaRiesgoTrabajo < 0.5m || primaRiesgoTrabajo > 15m)
            throw new ArgumentException("La prima de riesgo debe estar entre 0.50% y 15%", nameof(primaRiesgoTrabajo));

        RegistroPatronalImss = registroPatronalImss?.Trim() ?? throw new ArgumentNullException(nameof(registroPatronalImss));
        ClaseRiesgoImss = claseRiesgoImss;
        PrimaRiesgoTrabajo = primaRiesgoTrabajo;
        RegistroInfonavit = registroInfonavit?.Trim();

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Inicia la temporada de zafra.
    /// </summary>
    public void IniciarZafra(
        DateTime fechaInicio,
        DateTime? fechaFinEstimada,
        string numeroZafra,
        Guid usuarioModificadorId)
    {
        if (EnZafra)
            throw new InvalidOperationException("Ya existe una zafra activa. Debe cerrar la zafra actual primero.");

        EnZafra = true;
        InicioZafraActual = fechaInicio;
        FinZafraEstimado = fechaFinEstimada;
        NumeroZafra = numeroZafra?.Trim() ?? throw new ArgumentNullException(nameof(numeroZafra));

        MarcarComoModificado(usuarioModificadorId);
        AgregarNotaAuditoria($"Inicio de zafra {NumeroZafra}");
    }

    /// <summary>
    /// Finaliza la temporada de zafra.
    /// </summary>
    public void FinalizarZafra(Guid usuarioModificadorId)
    {
        if (!EnZafra)
            throw new InvalidOperationException("No hay una zafra activa para finalizar.");

        var zafraFinalizada = NumeroZafra;
        EnZafra = false;

        MarcarComoModificado(usuarioModificadorId);
        AgregarNotaAuditoria($"Fin de zafra {zafraFinalizada}");
    }

    /// <summary>
    /// Actualiza el contador de empleados activos.
    /// </summary>
    public void ActualizarNumeroEmpleados(int cantidad)
    {
        if (cantidad < 0)
            throw new ArgumentException("El número de empleados no puede ser negativo", nameof(cantidad));

        NumeroEmpleadosActivos = cantidad;
    }

    /// <summary>
    /// Obtiene el factor de riesgo para cálculos de IMSS.
    /// </summary>
    public decimal ObtenerFactorRiesgoImss()
    {
        return PrimaRiesgoTrabajo / 100m;
    }
}
