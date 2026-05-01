// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Empresa (Agregado Raíz)
// ===================================

using ImperhaNomninas.Dominio.Compartido.Entidades;
using ImperhaNomninas.Dominio.Compartido.ValorObjeto;
using ImperhaNomninas.Dominio.Corporativo.Eventos;

namespace ImperhaNomninas.Dominio.Corporativo.Entidades;

/// <summary>
/// Representa una empresa dentro del sistema multi-empresa.
/// Es un agregado raíz que contiene ingenios y configuraciones.
/// </summary>
public class Empresa : EntidadBase
{
    // ============ DATOS GENERALES ============

    /// <summary>
    /// Razón social de la empresa (nombre legal).
    /// </summary>
    public string RazonSocial { get; private set; } = string.Empty;

    /// <summary>
    /// Nombre comercial de la empresa.
    /// </summary>
    public string NombreComercial { get; private set; } = string.Empty;

    /// <summary>
    /// RFC de la empresa.
    /// </summary>
    public Rfc Rfc { get; private set; } = null!;

    /// <summary>
    /// Régimen fiscal de la empresa.
    /// </summary>
    public string RegimenFiscal { get; private set; } = string.Empty;

    /// <summary>
    /// Código del régimen fiscal SAT.
    /// </summary>
    public string CodigoRegimenFiscal { get; private set; } = string.Empty;

    // ============ DIRECCIÓN FISCAL ============

    /// <summary>
    /// Calle y número de la dirección fiscal.
    /// </summary>
    public string DireccionFiscalCalle { get; private set; } = string.Empty;

    /// <summary>
    /// Número exterior.
    /// </summary>
    public string? DireccionFiscalNumeroExterior { get; private set; }

    /// <summary>
    /// Número interior.
    /// </summary>
    public string? DireccionFiscalNumeroInterior { get; private set; }

    /// <summary>
    /// Colonia.
    /// </summary>
    public string DireccionFiscalColonia { get; private set; } = string.Empty;

    /// <summary>
    /// Código postal.
    /// </summary>
    public string DireccionFiscalCodigoPostal { get; private set; } = string.Empty;

    /// <summary>
    /// Municipio o delegación.
    /// </summary>
    public string DireccionFiscalMunicipio { get; private set; } = string.Empty;

    /// <summary>
    /// Estado.
    /// </summary>
    public string DireccionFiscalEstado { get; private set; } = string.Empty;

    /// <summary>
    /// País (México por defecto).
    /// </summary>
    public string DireccionFiscalPais { get; private set; } = "México";

    // ============ CONTACTO ============

    /// <summary>
    /// Teléfono principal.
    /// </summary>
    public string? Telefono { get; private set; }

    /// <summary>
    /// Correo electrónico de la empresa.
    /// </summary>
    public string? CorreoElectronico { get; private set; }

    /// <summary>
    /// Sitio web de la empresa.
    /// </summary>
    public string? SitioWeb { get; private set; }

    // ============ BRANDING ============

    /// <summary>
    /// Ruta al logo de la empresa (PNG/SVG).
    /// </summary>
    public string? RutaLogo { get; private set; }

    /// <summary>
    /// Color primario corporativo (hexadecimal).
    /// </summary>
    public string ColorPrimario { get; private set; } = "#1976D2";

    /// <summary>
    /// Color secundario corporativo (hexadecimal).
    /// </summary>
    public string ColorSecundario { get; private set; } = "#424242";

    /// <summary>
    /// Color de acento corporativo (hexadecimal).
    /// </summary>
    public string ColorAcento { get; private set; } = "#FF5722";

    // ============ CONFIGURACIÓN FISCAL ============

    /// <summary>
    /// Registro patronal IMSS principal.
    /// </summary>
    public string? RegistroPatronalImss { get; private set; }

    /// <summary>
    /// Número de registro INFONAVIT.
    /// </summary>
    public string? RegistroInfonavit { get; private set; }

    /// <summary>
    /// Certificado de sello digital (CSD) - Ruta archivo .cer.
    /// </summary>
    public string? RutaCertificadoCsd { get; private set; }

    /// <summary>
    /// Llave privada del CSD - Ruta archivo .key.
    /// </summary>
    public string? RutaLlaveCsd { get; private set; }

    /// <summary>
    /// Contraseña del CSD (encriptada).
    /// </summary>
    public string? ContrasenasCsdEncriptada { get; private set; }

    /// <summary>
    /// Fecha de vigencia del CSD.
    /// </summary>
    public DateTime? VigenciaCsd { get; private set; }

    // ============ CONFIGURACIÓN DE RECIBOS ============

    /// <summary>
    /// Texto legal para recibos de nómina.
    /// </summary>
    public string? TextoLegalRecibos { get; private set; }

    /// <summary>
    /// Pie de página para recibos de nómina.
    /// </summary>
    public string? PiePaginaRecibos { get; private set; }

    // ============ RELACIONES ============

    private readonly List<Ingenio> _ingenios = new();

    /// <summary>
    /// Ingenios azucareros de la empresa.
    /// </summary>
    public IReadOnlyCollection<Ingenio> Ingenios => _ingenios.AsReadOnly();

    // ============ CONSTRUCTORES ============

    private Empresa() : base() { }

    /// <summary>
    /// Crea una nueva empresa.
    /// </summary>
    public static Empresa Crear(
        string razonSocial,
        string nombreComercial,
        string rfc,
        string regimenFiscal,
        string codigoRegimenFiscal,
        Guid usuarioCreadorId)
    {
        var empresa = new Empresa
        {
            RazonSocial = razonSocial?.Trim() ?? throw new ArgumentNullException(nameof(razonSocial)),
            NombreComercial = nombreComercial?.Trim() ?? throw new ArgumentNullException(nameof(nombreComercial)),
            Rfc = Rfc.Crear(rfc),
            RegimenFiscal = regimenFiscal?.Trim() ?? throw new ArgumentNullException(nameof(regimenFiscal)),
            CodigoRegimenFiscal = codigoRegimenFiscal?.Trim() ?? throw new ArgumentNullException(nameof(codigoRegimenFiscal))
        };

        empresa.EstablecerCreacion(usuarioCreadorId);
        empresa.AgregarEventoDominio(new EmpresaCreadaEvento(empresa.Id, empresa.RazonSocial, empresa.Rfc.Valor));

        return empresa;
    }

    // ============ MÉTODOS DE DOMINIO ============

    /// <summary>
    /// Actualiza los datos generales de la empresa.
    /// </summary>
    public void ActualizarDatosGenerales(
        string razonSocial,
        string nombreComercial,
        string regimenFiscal,
        string codigoRegimenFiscal,
        Guid usuarioModificadorId)
    {
        RazonSocial = razonSocial?.Trim() ?? throw new ArgumentNullException(nameof(razonSocial));
        NombreComercial = nombreComercial?.Trim() ?? throw new ArgumentNullException(nameof(nombreComercial));
        RegimenFiscal = regimenFiscal?.Trim() ?? throw new ArgumentNullException(nameof(regimenFiscal));
        CodigoRegimenFiscal = codigoRegimenFiscal?.Trim() ?? throw new ArgumentNullException(nameof(codigoRegimenFiscal));

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Establece la dirección fiscal.
    /// </summary>
    public void EstablecerDireccionFiscal(
        string calle,
        string? numeroExterior,
        string? numeroInterior,
        string colonia,
        string codigoPostal,
        string municipio,
        string estado,
        Guid usuarioModificadorId)
    {
        DireccionFiscalCalle = calle?.Trim() ?? throw new ArgumentNullException(nameof(calle));
        DireccionFiscalNumeroExterior = numeroExterior?.Trim();
        DireccionFiscalNumeroInterior = numeroInterior?.Trim();
        DireccionFiscalColonia = colonia?.Trim() ?? throw new ArgumentNullException(nameof(colonia));
        DireccionFiscalCodigoPostal = codigoPostal?.Trim() ?? throw new ArgumentNullException(nameof(codigoPostal));
        DireccionFiscalMunicipio = municipio?.Trim() ?? throw new ArgumentNullException(nameof(municipio));
        DireccionFiscalEstado = estado?.Trim() ?? throw new ArgumentNullException(nameof(estado));

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Establece el branding corporativo.
    /// </summary>
    public void EstablecerBranding(
        string? rutaLogo,
        string colorPrimario,
        string colorSecundario,
        string colorAcento,
        Guid usuarioModificadorId)
    {
        RutaLogo = rutaLogo;
        ColorPrimario = colorPrimario ?? "#1976D2";
        ColorSecundario = colorSecundario ?? "#424242";
        ColorAcento = colorAcento ?? "#FF5722";

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Configura el certificado de sello digital.
    /// </summary>
    public void ConfigurarCertificadoSelloDigital(
        string rutaCertificado,
        string rutaLlave,
        string contrasenaEncriptada,
        DateTime vigencia,
        Guid usuarioModificadorId)
    {
        RutaCertificadoCsd = rutaCertificado ?? throw new ArgumentNullException(nameof(rutaCertificado));
        RutaLlaveCsd = rutaLlave ?? throw new ArgumentNullException(nameof(rutaLlave));
        ContrasenasCsdEncriptada = contrasenaEncriptada ?? throw new ArgumentNullException(nameof(contrasenaEncriptada));
        VigenciaCsd = vigencia;

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Agrega un nuevo ingenio a la empresa.
    /// </summary>
    public Ingenio AgregarIngenio(
        string nombre,
        string clave,
        string registroPatronalImss,
        Guid usuarioCreadorId)
    {
        // Validar que no exista un ingenio con la misma clave
        if (_ingenios.Any(i => i.Clave.Equals(clave, StringComparison.OrdinalIgnoreCase) && i.Activo))
            throw new InvalidOperationException($"Ya existe un ingenio con la clave '{clave}'");

        var ingenio = Ingenio.Crear(Id, nombre, clave, registroPatronalImss, usuarioCreadorId);
        _ingenios.Add(ingenio);

        return ingenio;
    }

    /// <summary>
    /// Obtiene la dirección fiscal formateada.
    /// </summary>
    public string ObtenerDireccionFiscalCompleta()
    {
        var partes = new List<string>();

        if (!string.IsNullOrEmpty(DireccionFiscalCalle))
        {
            var direccion = DireccionFiscalCalle;
            if (!string.IsNullOrEmpty(DireccionFiscalNumeroExterior))
                direccion += $" No. {DireccionFiscalNumeroExterior}";
            if (!string.IsNullOrEmpty(DireccionFiscalNumeroInterior))
                direccion += $" Int. {DireccionFiscalNumeroInterior}";
            partes.Add(direccion);
        }

        if (!string.IsNullOrEmpty(DireccionFiscalColonia))
            partes.Add($"Col. {DireccionFiscalColonia}");

        if (!string.IsNullOrEmpty(DireccionFiscalCodigoPostal))
            partes.Add($"C.P. {DireccionFiscalCodigoPostal}");

        if (!string.IsNullOrEmpty(DireccionFiscalMunicipio))
            partes.Add(DireccionFiscalMunicipio);

        if (!string.IsNullOrEmpty(DireccionFiscalEstado))
            partes.Add(DireccionFiscalEstado);

        return string.Join(", ", partes);
    }

    /// <summary>
    /// Verifica si el CSD está vigente.
    /// </summary>
    public bool TieneCsdVigente()
    {
        return VigenciaCsd.HasValue && VigenciaCsd.Value > DateTime.UtcNow;
    }
}
