// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Value Object para CURP mexicana
// ===================================

using System.Text.RegularExpressions;

namespace ImperhaNomninas.Dominio.Compartido.ValorObjeto;

/// <summary>
/// Value Object para la Clave Única de Registro de Población (CURP).
/// Valida formato según RENAPO.
/// </summary>
public sealed class Curp : ValorObjetoBase
{
    // Patrón para validar CURP (18 caracteres)
    private static readonly Regex PatronCurp = new(
        @"^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    /// <summary>
    /// Valor de la CURP (normalizado a mayúsculas).
    /// </summary>
    public string Valor { get; }

    /// <summary>
    /// Género extraído de la CURP (H = Hombre, M = Mujer).
    /// </summary>
    public char Genero => Valor[10];

    /// <summary>
    /// Indica si es hombre según la CURP.
    /// </summary>
    public bool EsHombre => Genero == 'H';

    /// <summary>
    /// Indica si es mujer según la CURP.
    /// </summary>
    public bool EsMujer => Genero == 'M';

    /// <summary>
    /// Código de entidad federativa de nacimiento.
    /// </summary>
    public string EntidadNacimiento => Valor.Substring(11, 2);

    private Curp(string valor)
    {
        Valor = valor.ToUpperInvariant().Trim();
    }

    /// <summary>
    /// Crea una instancia de CURP validando el formato.
    /// </summary>
    public static Curp Crear(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new ArgumentException("La CURP no puede estar vacía", nameof(valor));

        var curpNormalizada = valor.ToUpperInvariant().Trim();

        if (!EsValida(curpNormalizada))
            throw new ArgumentException($"La CURP '{valor}' no tiene un formato válido", nameof(valor));

        return new Curp(curpNormalizada);
    }

    /// <summary>
    /// Intenta crear una CURP, retorna null si no es válida.
    /// </summary>
    public static Curp? CrearONula(string? valor)
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
    /// Valida si un string tiene formato de CURP válido.
    /// </summary>
    public static bool EsValida(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            return false;

        var curpNormalizada = valor.ToUpperInvariant().Trim();

        if (curpNormalizada.Length != 18)
            return false;

        return PatronCurp.IsMatch(curpNormalizada);
    }

    /// <summary>
    /// Obtiene la fecha de nacimiento de la CURP.
    /// </summary>
    public DateTime? ObtenerFechaNacimiento()
    {
        try
        {
            var fechaStr = Valor.Substring(4, 6);

            var anio = int.Parse(fechaStr[..2]);
            var mes = int.Parse(fechaStr.Substring(2, 2));
            var dia = int.Parse(fechaStr.Substring(4, 2));

            // Determinar siglo basándose en el dígito verificador
            var digitoVerificador = Valor[16];
            anio += digitoVerificador >= 'A' ? 2000 : 1900;

            return new DateTime(anio, mes, dia);
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Obtiene las iniciales del nombre.
    /// </summary>
    public string ObtenerIniciales()
    {
        return Valor[..4];
    }

    /// <summary>
    /// Obtiene el nombre de la entidad federativa de nacimiento.
    /// </summary>
    public string ObtenerNombreEntidad()
    {
        return EntidadNacimiento switch
        {
            "AS" => "Aguascalientes",
            "BC" => "Baja California",
            "BS" => "Baja California Sur",
            "CC" => "Campeche",
            "CL" => "Coahuila",
            "CM" => "Colima",
            "CS" => "Chiapas",
            "CH" => "Chihuahua",
            "DF" => "Ciudad de México",
            "DG" => "Durango",
            "GT" => "Guanajuato",
            "GR" => "Guerrero",
            "HG" => "Hidalgo",
            "JC" => "Jalisco",
            "MC" => "Estado de México",
            "MN" => "Michoacán",
            "MS" => "Morelos",
            "NT" => "Nayarit",
            "NL" => "Nuevo León",
            "OC" => "Oaxaca",
            "PL" => "Puebla",
            "QT" => "Querétaro",
            "QR" => "Quintana Roo",
            "SP" => "San Luis Potosí",
            "SL" => "Sinaloa",
            "SR" => "Sonora",
            "TC" => "Tabasco",
            "TS" => "Tamaulipas",
            "TL" => "Tlaxcala",
            "VZ" => "Veracruz",
            "YN" => "Yucatán",
            "ZS" => "Zacatecas",
            "NE" => "Nacido en el Extranjero",
            _ => "Desconocido"
        };
    }

    protected override IEnumerable<object?> ObtenerComponentesIgualdad()
    {
        yield return Valor;
    }

    public override string ToString() => Valor;

    public static implicit operator string(Curp curp) => curp.Valor;
}
