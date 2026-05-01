// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Value Object para RFC mexicano
// ===================================

using System.Text.RegularExpressions;

namespace ImperhaNomninas.Dominio.Compartido.ValorObjeto;

/// <summary>
/// Value Object para el Registro Federal de Contribuyentes (RFC).
/// Valida formato según SAT para personas físicas y morales.
/// </summary>
public sealed class Rfc : ValorObjetoBase
{
    // Patrón para RFC de persona física (13 caracteres)
    private static readonly Regex PatronPersonaFisica = new(
        @"^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    // Patrón para RFC de persona moral (12 caracteres)
    private static readonly Regex PatronPersonaMoral = new(
        @"^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    /// <summary>
    /// Valor del RFC (normalizado a mayúsculas).
    /// </summary>
    public string Valor { get; }

    /// <summary>
    /// Indica si es RFC de persona física.
    /// </summary>
    public bool EsPersonaFisica => Valor.Length == 13;

    /// <summary>
    /// Indica si es RFC de persona moral.
    /// </summary>
    public bool EsPersonaMoral => Valor.Length == 12;

    /// <summary>
    /// Indica si es RFC genérico nacional.
    /// </summary>
    public bool EsGenericoNacional => Valor == "XAXX010101000";

    /// <summary>
    /// Indica si es RFC genérico extranjero.
    /// </summary>
    public bool EsGenericoExtranjero => Valor == "XEXX010101000";

    private Rfc(string valor)
    {
        Valor = valor.ToUpperInvariant().Trim();
    }

    /// <summary>
    /// Crea una instancia de RFC validando el formato.
    /// </summary>
    public static Rfc Crear(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new ArgumentException("El RFC no puede estar vacío", nameof(valor));

        var rfcNormalizado = valor.ToUpperInvariant().Trim();

        if (!EsValido(rfcNormalizado))
            throw new ArgumentException($"El RFC '{valor}' no tiene un formato válido", nameof(valor));

        return new Rfc(rfcNormalizado);
    }

    /// <summary>
    /// Intenta crear un RFC, retorna null si no es válido.
    /// </summary>
    public static Rfc? CrearONulo(string? valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            return null;

        try
        {
            return Crear(valor);
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Valida si un string tiene formato de RFC válido.
    /// </summary>
    public static bool EsValido(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            return false;

        var rfcNormalizado = valor.ToUpperInvariant().Trim();

        return PatronPersonaFisica.IsMatch(rfcNormalizado) ||
               PatronPersonaMoral.IsMatch(rfcNormalizado);
    }

    /// <summary>
    /// RFC genérico para público en general nacional.
    /// </summary>
    public static Rfc GenericoNacional => new("XAXX010101000");

    /// <summary>
    /// RFC genérico para extranjeros.
    /// </summary>
    public static Rfc GenericoExtranjero => new("XEXX010101000");

    /// <summary>
    /// Obtiene las primeras letras del RFC (nombre/razón social codificado).
    /// </summary>
    public string ObtenerIniciales()
    {
        return EsPersonaFisica ? Valor[..4] : Valor[..3];
    }

    /// <summary>
    /// Obtiene la fecha de nacimiento/constitución del RFC.
    /// </summary>
    public DateTime? ObtenerFechaRegistro()
    {
        try
        {
            var inicio = EsPersonaFisica ? 4 : 3;
            var fechaStr = Valor.Substring(inicio, 6);

            var anio = int.Parse(fechaStr[..2]);
            var mes = int.Parse(fechaStr.Substring(2, 2));
            var dia = int.Parse(fechaStr.Substring(4, 2));

            // Asumir siglo XX para años >= 30, siglo XXI para < 30
            anio += anio >= 30 ? 1900 : 2000;

            return new DateTime(anio, mes, dia);
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Obtiene la homoclave del RFC.
    /// </summary>
    public string ObtenerHomoclave()
    {
        return Valor[^3..];
    }

    protected override IEnumerable<object?> ObtenerComponentesIgualdad()
    {
        yield return Valor;
    }

    public override string ToString() => Valor;

    /// <summary>
    /// Conversión implícita a string.
    /// </summary>
    public static implicit operator string(Rfc rfc) => rfc.Valor;
}
