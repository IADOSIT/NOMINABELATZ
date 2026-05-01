// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Interfaz para eventos de dominio
// ===================================

using MediatR;

namespace ImperhaNomninas.Dominio.Compartido.Eventos;

/// <summary>
/// Interfaz base para todos los eventos de dominio.
/// Los eventos representan hechos que ocurrieron en el dominio.
/// </summary>
public interface IEventoDominio : INotification
{
    /// <summary>
    /// Identificador único del evento.
    /// </summary>
    Guid EventoId { get; }

    /// <summary>
    /// Fecha y hora en que ocurrió el evento (UTC).
    /// </summary>
    DateTime FechaOcurrencia { get; }

    /// <summary>
    /// Tipo de evento (nombre descriptivo).
    /// </summary>
    string TipoEvento { get; }
}

/// <summary>
/// Clase base abstracta para eventos de dominio.
/// </summary>
public abstract class EventoDominioBase : IEventoDominio
{
    public Guid EventoId { get; }
    public DateTime FechaOcurrencia { get; }
    public abstract string TipoEvento { get; }

    protected EventoDominioBase()
    {
        EventoId = Guid.NewGuid();
        FechaOcurrencia = DateTime.UtcNow;
    }
}
