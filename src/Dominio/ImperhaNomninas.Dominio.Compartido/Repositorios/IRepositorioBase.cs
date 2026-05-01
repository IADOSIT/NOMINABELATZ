// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Interfaz base para repositorios
// ===================================

using System.Linq.Expressions;
using ImperhaNomninas.Dominio.Compartido.Entidades;

namespace ImperhaNomninas.Dominio.Compartido.Repositorios;

/// <summary>
/// Interfaz base para todos los repositorios del dominio.
/// Implementa el patrón Repository con soporte para CQRS.
/// </summary>
/// <typeparam name="TEntidad">Tipo de entidad del repositorio</typeparam>
public interface IRepositorioBase<TEntidad> where TEntidad : EntidadBase
{
    // ============ CONSULTAS (QUERIES) ============

    /// <summary>
    /// Obtiene una entidad por su identificador.
    /// </summary>
    Task<TEntidad?> ObtenerPorIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene todas las entidades activas.
    /// </summary>
    Task<IReadOnlyList<TEntidad>> ObtenerTodosAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene entidades que cumplen con un predicado.
    /// </summary>
    Task<IReadOnlyList<TEntidad>> ObtenerPorCondicionAsync(
        Expression<Func<TEntidad, bool>> predicado,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene entidades paginadas.
    /// </summary>
    Task<(IReadOnlyList<TEntidad> Elementos, int Total)> ObtenerPaginadoAsync(
        int pagina,
        int elementosPorPagina,
        Expression<Func<TEntidad, bool>>? predicado = null,
        Expression<Func<TEntidad, object>>? ordenarPor = null,
        bool ordenDescendente = false,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifica si existe una entidad que cumple con el predicado.
    /// </summary>
    Task<bool> ExisteAsync(Expression<Func<TEntidad, bool>> predicado, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cuenta las entidades que cumplen con el predicado.
    /// </summary>
    Task<int> ContarAsync(Expression<Func<TEntidad, bool>>? predicado = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene la primera entidad que cumple con el predicado.
    /// </summary>
    Task<TEntidad?> ObtenerPrimeroAsync(
        Expression<Func<TEntidad, bool>> predicado,
        CancellationToken cancellationToken = default);

    // ============ COMANDOS (COMMANDS) ============

    /// <summary>
    /// Agrega una nueva entidad.
    /// </summary>
    Task<TEntidad> AgregarAsync(TEntidad entidad, CancellationToken cancellationToken = default);

    /// <summary>
    /// Agrega múltiples entidades.
    /// </summary>
    Task AgregarRangoAsync(IEnumerable<TEntidad> entidades, CancellationToken cancellationToken = default);

    /// <summary>
    /// Actualiza una entidad existente.
    /// </summary>
    Task ActualizarAsync(TEntidad entidad, CancellationToken cancellationToken = default);

    /// <summary>
    /// Actualiza múltiples entidades.
    /// </summary>
    Task ActualizarRangoAsync(IEnumerable<TEntidad> entidades, CancellationToken cancellationToken = default);

    /// <summary>
    /// Elimina lógicamente una entidad (soft delete).
    /// </summary>
    Task EliminarAsync(Guid id, Guid usuarioId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Elimina lógicamente múltiples entidades.
    /// </summary>
    Task EliminarRangoAsync(IEnumerable<Guid> ids, Guid usuarioId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Restaura una entidad eliminada lógicamente.
    /// </summary>
    Task RestaurarAsync(Guid id, Guid usuarioId, CancellationToken cancellationToken = default);
}

/// <summary>
/// Interfaz para repositorios con soporte multi-tenant (empresa/ingenio).
/// </summary>
public interface IRepositorioMultiTenant<TEntidad> : IRepositorioBase<TEntidad>
    where TEntidad : EntidadAuditable
{
    /// <summary>
    /// Obtiene entidades filtradas por empresa.
    /// </summary>
    Task<IReadOnlyList<TEntidad>> ObtenerPorEmpresaAsync(Guid empresaId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene entidades filtradas por ingenio.
    /// </summary>
    Task<IReadOnlyList<TEntidad>> ObtenerPorIngenioAsync(Guid ingenioId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene entidades filtradas por empresa e ingenio.
    /// </summary>
    Task<IReadOnlyList<TEntidad>> ObtenerPorEmpresaIngenioAsync(
        Guid empresaId,
        Guid ingenioId,
        CancellationToken cancellationToken = default);
}
