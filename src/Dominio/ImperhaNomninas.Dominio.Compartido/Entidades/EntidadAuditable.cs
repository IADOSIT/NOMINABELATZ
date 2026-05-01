// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Auditable con tracking completo
// ===================================

namespace ImperhaNomninas.Dominio.Compartido.Entidades;

/// <summary>
/// Entidad con capacidades completas de auditoría.
/// Registra todos los cambios con valores antes/después.
/// </summary>
public abstract class EntidadAuditable : EntidadBase
{
    /// <summary>
    /// Identificador de la empresa a la que pertenece el registro.
    /// Permite multi-tenancy a nivel de empresa.
    /// </summary>
    public Guid EmpresaId { get; protected set; }

    /// <summary>
    /// Identificador del ingenio (opcional).
    /// Para registros específicos de un ingenio azucarero.
    /// </summary>
    public Guid? IngenioId { get; protected set; }

    /// <summary>
    /// Origen del registro (manual, importación, API, sistema).
    /// </summary>
    public string? OrigenRegistro { get; protected set; }

    /// <summary>
    /// Referencia al lote de importación (si aplica).
    /// </summary>
    public Guid? LoteImportacionId { get; protected set; }

    /// <summary>
    /// Notas de auditoría adicionales.
    /// </summary>
    public string? NotasAuditoria { get; protected set; }

    /// <summary>
    /// IP del cliente que realizó la operación.
    /// </summary>
    public string? DireccionIp { get; protected set; }

    /// <summary>
    /// User Agent del navegador/cliente.
    /// </summary>
    public string? AgenteUsuario { get; protected set; }

    /// <summary>
    /// Constructor protegido.
    /// </summary>
    protected EntidadAuditable() : base()
    {
    }

    /// <summary>
    /// Constructor con ID existente.
    /// </summary>
    protected EntidadAuditable(Guid id) : base(id)
    {
    }

    /// <summary>
    /// Establece el contexto de empresa/ingenio.
    /// </summary>
    public void EstablecerContextoEmpresa(Guid empresaId, Guid? ingenioId = null)
    {
        EmpresaId = empresaId;
        IngenioId = ingenioId;
    }

    /// <summary>
    /// Establece información de trazabilidad.
    /// </summary>
    public void EstablecerTrazabilidad(string? direccionIp, string? agenteUsuario)
    {
        DireccionIp = direccionIp;
        AgenteUsuario = agenteUsuario;
    }

    /// <summary>
    /// Marca el origen del registro.
    /// </summary>
    public void EstablecerOrigen(string origen, Guid? loteImportacionId = null)
    {
        OrigenRegistro = origen;
        LoteImportacionId = loteImportacionId;
    }

    /// <summary>
    /// Agrega notas de auditoría.
    /// </summary>
    public void AgregarNotaAuditoria(string nota)
    {
        if (string.IsNullOrEmpty(NotasAuditoria))
            NotasAuditoria = nota;
        else
            NotasAuditoria = $"{NotasAuditoria}\n[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] {nota}";
    }
}
