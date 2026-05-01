// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Value Object para NSS del IMSS
// ===================================

using System.Text.RegularExpressions;

namespace ImperhaNomninas.Dominio.Compartido.ValorObjeto;

/// <summary>
/// Value Object para el Número de Seguro Social (NSS) del IMSS.
/// Valida formato y dígito verificador.
/// </summary>
public sealed class NumeroSeguroSocial : ValorObjetoBase
{
    // Patrón para NSS (11 dígitos)
    private static readonly Regex PatronNss = new(
        @"^\d{11}$",
        RegexOptions.Compiled);

    /// <summary>
    /// Valor del NSS (solo dígitos).
    /// </summary>
    public string Valor { get; }

    /// <summary>
    /// Subdelegación IMSS.
    /// </summary>
    public string Subdelegacion => Valor[..2];

    /// <summary>
    /// Año de alta (últimos 2 dígitos).
    /// </summary>
    public string AnioAlta => Valor.Substring(2, 2);

    /// <summary>
    /// Año de nacimiento (últimos 2 dígitos).
    /// </summary>
    public string AnioNacimiento => Valor.Substring(4, 2);

    /// <summary>
    /// Número consecutivo.
    /// </summary>
    public string Consecutivo => Valor.Substring(6, 4);

    /// <summary>
    /// Dígito verificador.
    /// </summary>
    public char DigitoVerificador => Valor[10];

    private NumeroSeguroSocial(string valor)
    {
        Valor = valor.Trim();
    }

    /// <summary>
    /// Crea una instancia de NSS validando el formato.
    /// </summary>
    public static NumeroSeguroSocial Crear(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new ArgumentException("El NSS no puede estar vacío", nameof(valor));

        // Remover espacios y guiones
        var nssLimpio = valor.Replace(" ", "").Replace("-", "").Trim();

        if (!EsValido(nssLimpio))
            throw new ArgumentException($"El NSS '{valor}' no tiene un formato válido", nameof(valor));

        return new NumeroSeguroSocial(nssLimpio);
    }

    /// <summary>
    /// Intenta crear un NSS, retorna null si no es válido.
    /// </summary>
    public static NumeroSeguroSocial? CrearONulo(string? valor)
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
    /// Valida si un string tiene formato de NSS válido.
    /// </summary>
    public static bool EsValido(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            return false;

        var nssLimpio = valor.Replace(" ", "").Replace("-", "").Trim();

        if (!PatronNss.IsMatch(nssLimpio))
            return false;

        // Validar dígito verificador usando algoritmo LUHN modificado
        return ValidarDigitoVerificador(nssLimpio);
    }

    /// <summary>
    /// Valida el dígito verificador del NSS usando algoritmo LUHN modificado.
    /// </summary>
    private static bool ValidarDigitoVerificador(string nss)
    {
        try
        {
            var suma = 0;
            var multiplicadores = new[] { 1, 2, 1, 2, 1, 2, 1, 2, 1, 2 };

            for (int i = 0; i < 10; i++)
            {
                var digito = int.Parse(nss[i].ToString());
                var producto = digito * multiplicadores[i];

                if (producto > 9)
                    producto -= 9;

                suma += producto;
            }

            var residuo = suma % 10;
            var digitoCalculado = residuo == 0 ? 0 : 10 - residuo;
            var digitoActual = int.Parse(nss[10].ToString());

            return digitoCalculado == digitoActual;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Formato con guiones para visualización.
    /// </summary>
    public string FormatoConGuiones()
    {
        return $"{Subdelegacion}-{AnioAlta}-{AnioNacimiento}-{Consecutivo}-{DigitoVerificador}";
    }

    protected override IEnumerable<object?> ObtenerComponentesIgualdad()
    {
        yield return Valor;
    }

    public override string ToString() => Valor;

    public static implicit operator string(NumeroSeguroSocial nss) => nss.Valor;
}
