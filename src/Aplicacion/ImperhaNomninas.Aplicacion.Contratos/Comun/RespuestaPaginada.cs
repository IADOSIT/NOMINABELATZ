// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Respuestas paginadas
// ===================================

namespace ImperhaNomninas.Aplicacion.Contratos.Comun;

/// <summary>
/// Respuesta paginada genérica para consultas.
/// </summary>
public class RespuestaPaginada<T>
{
    /// <summary>
    /// Lista de elementos de la página actual.
    /// </summary>
    public IReadOnlyList<T> Elementos { get; set; } = Array.Empty<T>();

    /// <summary>
    /// Número de página actual (base 1).
    /// </summary>
    public int PaginaActual { get; set; }

    /// <summary>
    /// Elementos por página.
    /// </summary>
    public int ElementosPorPagina { get; set; }

    /// <summary>
    /// Total de elementos disponibles.
    /// </summary>
    public int TotalElementos { get; set; }

    /// <summary>
    /// Total de páginas disponibles.
    /// </summary>
    public int TotalPaginas => (int)Math.Ceiling((double)TotalElementos / ElementosPorPagina);

    /// <summary>
    /// Indica si hay página anterior.
    /// </summary>
    public bool TienePaginaAnterior => PaginaActual > 1;

    /// <summary>
    /// Indica si hay página siguiente.
    /// </summary>
    public bool TienePaginaSiguiente => PaginaActual < TotalPaginas;

    /// <summary>
    /// Crea una respuesta paginada.
    /// </summary>
    public static RespuestaPaginada<T> Crear(
        IReadOnlyList<T> elementos,
        int paginaActual,
        int elementosPorPagina,
        int totalElementos)
    {
        return new RespuestaPaginada<T>
        {
            Elementos = elementos,
            PaginaActual = paginaActual,
            ElementosPorPagina = elementosPorPagina,
            TotalElementos = totalElementos
        };
    }
}

/// <summary>
/// Solicitud de paginación.
/// </summary>
public class SolicitudPaginacion
{
    private int _pagina = 1;
    private int _elementosPorPagina = 20;

    /// <summary>
    /// Número de página (mínimo 1).
    /// </summary>
    public int Pagina
    {
        get => _pagina;
        set => _pagina = Math.Max(1, value);
    }

    /// <summary>
    /// Elementos por página (entre 1 y 100).
    /// </summary>
    public int ElementosPorPagina
    {
        get => _elementosPorPagina;
        set => _elementosPorPagina = Math.Clamp(value, 1, 100);
    }

    /// <summary>
    /// Campo para ordenar.
    /// </summary>
    public string? OrdenarPor { get; set; }

    /// <summary>
    /// Orden descendente.
    /// </summary>
    public bool OrdenDescendente { get; set; }

    /// <summary>
    /// Término de búsqueda general.
    /// </summary>
    public string? Busqueda { get; set; }
}
