// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Evento de dominio: Empresa Creada
// ===================================

using ImperhaNomninas.Dominio.Compartido.Eventos;

namespace ImperhaNomninas.Dominio.Corporativo.Eventos;

/// <summary>
/// Evento que se dispara cuando se crea una nueva empresa.
/// </summary>
public sealed class EmpresaCreadaEvento : EventoDominioBase
{
    public override string TipoEvento => "EmpresaCreada";

    /// <summary>
    /// Identificador de la empresa creada.
    /// </summary>
    public Guid EmpresaId { get; }

    /// <summary>
    /// Razón social de la empresa.
    /// </summary>
    public string RazonSocial { get; }

    /// <summary>
    /// RFC de la empresa.
    /// </summary>
    public string Rfc { get; }

    public EmpresaCreadaEvento(Guid empresaId, string razonSocial, string rfc)
    {
        EmpresaId = empresaId;
        RazonSocial = razonSocial;
        Rfc = rfc;
    }
}
