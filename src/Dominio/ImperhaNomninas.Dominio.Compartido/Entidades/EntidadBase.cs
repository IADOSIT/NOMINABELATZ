// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Base para todas las entidades del dominio
// ===================================

using ImperhaNomninas.Dominio.Compartido.Eventos;

namespace ImperhaNomninas.Dominio.Compartido.Entidades;

/// <summary>
/// Clase base abstracta para todas las entidades del dominio.
/// Implementa el patrón Entity con soporte para eventos de dominio.
/// Todas las entidades utilizan GUID como identificador único.
/// </summary>
public abstract class EntidadBase
{
    private readonly List<IEventoDominio> _eventosDominio = new();

    /// <summary>
    /// Identificador único de la entidad (GUID).
    /// Generado automáticamente al crear una nueva entidad.
    /// </summary>
    public Guid Id { get; protected set; }

    /// <summary>
    /// Fecha y hora de creación del registro (UTC).
    /// Se establece automáticamente al crear la entidad.
    /// </summary>
    public DateTime FechaCreacion { get; protected set; }

    /// <summary>
    /// Fecha y hora de la última modificación (UTC).
    /// Se actualiza automáticamente en cada cambio.
    /// </summary>
    public DateTime? FechaModificacion { get; protected set; }

    /// <summary>
    /// Identificador del usuario que creó el registro.
    /// </summary>
    public Guid? UsuarioCreacionId { get; protected set; }

    /// <summary>
    /// Identificador del usuario que realizó la última modificación.
    /// </summary>
    public Guid? UsuarioModificacionId { get; protected set; }

    /// <summary>
    /// Indica si el registro está activo (soft delete).
    /// Nunca se eliminan registros físicamente.
    /// </summary>
    public bool Activo { get; protected set; } = true;

    /// <summary>
    /// Fecha y hora de eliminación lógica (soft delete).
    /// </summary>
    public DateTime? FechaEliminacion { get; protected set; }

    /// <summary>
    /// Identificador del usuario que eliminó el registro.
    /// </summary>
    public Guid? UsuarioEliminacionId { get; protected set; }

    /// <summary>
    /// Versión del registro para control de concurrencia optimista.
    /// </summary>
    public int Version { get; protected set; } = 1;

    /// <summary>
    /// Eventos de dominio pendientes de publicar.
    /// Se procesan después de persistir la entidad.
    /// </summary>
    public IReadOnlyCollection<IEventoDominio> EventosDominio => _eventosDominio.AsReadOnly();

    /// <summary>
    /// Constructor protegido para uso exclusivo de clases derivadas.
    /// </summary>
    protected EntidadBase()
    {
        Id = Guid.NewGuid();
        FechaCreacion = DateTime.UtcNow;
    }

    /// <summary>
    /// Constructor con ID existente (para reconstrucción desde persistencia).
    /// </summary>
    protected EntidadBase(Guid id)
    {
        Id = id;
        FechaCreacion = DateTime.UtcNow;
    }

    /// <summary>
    /// Agrega un evento de dominio para ser publicado.
    /// </summary>
    protected void AgregarEventoDominio(IEventoDominio evento)
    {
        _eventosDominio.Add(evento);
    }

    /// <summary>
    /// Elimina un evento de dominio específico.
    /// </summary>
    protected void EliminarEventoDominio(IEventoDominio evento)
    {
        _eventosDominio.Remove(evento);
    }

    /// <summary>
    /// Limpia todos los eventos de dominio pendientes.
    /// Se llama después de publicar los eventos.
    /// </summary>
    public void LimpiarEventosDominio()
    {
        _eventosDominio.Clear();
    }

    /// <summary>
    /// Marca el registro como modificado.
    /// </summary>
    public virtual void MarcarComoModificado(Guid usuarioId)
    {
        FechaModificacion = DateTime.UtcNow;
        UsuarioModificacionId = usuarioId;
        Version++;
    }

    /// <summary>
    /// Realiza eliminación lógica del registro (soft delete).
    /// </summary>
    public virtual void Eliminar(Guid usuarioId)
    {
        Activo = false;
        FechaEliminacion = DateTime.UtcNow;
        UsuarioEliminacionId = usuarioId;
        Version++;
    }

    /// <summary>
    /// Restaura un registro eliminado lógicamente.
    /// </summary>
    public virtual void Restaurar(Guid usuarioId)
    {
        Activo = true;
        FechaEliminacion = null;
        UsuarioEliminacionId = null;
        MarcarComoModificado(usuarioId);
    }

    /// <summary>
    /// Establece la información de creación.
    /// </summary>
    public void EstablecerCreacion(Guid usuarioId)
    {
        UsuarioCreacionId = usuarioId;
        FechaCreacion = DateTime.UtcNow;
    }

    /// <summary>
    /// Comparación de igualdad basada en el identificador.
    /// </summary>
    public override bool Equals(object? obj)
    {
        if (obj is not EntidadBase otra)
            return false;

        if (ReferenceEquals(this, otra))
            return true;

        if (GetType() != otra.GetType())
            return false;

        return Id == otra.Id;
    }

    /// <summary>
    /// Hash code basado en el identificador.
    /// </summary>
    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }

    /// <summary>
    /// Operador de igualdad.
    /// </summary>
    public static bool operator ==(EntidadBase? izquierda, EntidadBase? derecha)
    {
        if (izquierda is null && derecha is null)
            return true;

        if (izquierda is null || derecha is null)
            return false;

        return izquierda.Equals(derecha);
    }

    /// <summary>
    /// Operador de desigualdad.
    /// </summary>
    public static bool operator !=(EntidadBase? izquierda, EntidadBase? derecha)
    {
        return !(izquierda == derecha);
    }
}
