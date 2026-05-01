// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Value Object para manejo de dinero
// ===================================

namespace ImperhaNomninas.Dominio.Compartido.ValorObjeto;

/// <summary>
/// Value Object para representar cantidades monetarias.
/// Maneja precisión decimal y moneda (MXN por defecto).
/// </summary>
public sealed class Dinero : ValorObjetoBase
{
    /// <summary>
    /// Cantidad monetaria.
    /// </summary>
    public decimal Cantidad { get; }

    /// <summary>
    /// Código de moneda ISO 4217 (MXN por defecto).
    /// </summary>
    public string Moneda { get; }

    /// <summary>
    /// Precisión decimal para cálculos.
    /// </summary>
    public int Precision { get; }

    private Dinero(decimal cantidad, string moneda = "MXN", int precision = 2)
    {
        Cantidad = Math.Round(cantidad, precision);
        Moneda = moneda;
        Precision = precision;
    }

    /// <summary>
    /// Crea una instancia de Dinero en pesos mexicanos.
    /// </summary>
    public static Dinero Pesos(decimal cantidad)
    {
        return new Dinero(cantidad, "MXN", 2);
    }

    /// <summary>
    /// Crea una instancia de Dinero con moneda específica.
    /// </summary>
    public static Dinero Crear(decimal cantidad, string moneda, int precision = 2)
    {
        if (string.IsNullOrWhiteSpace(moneda))
            throw new ArgumentException("La moneda es requerida", nameof(moneda));

        return new Dinero(cantidad, moneda.ToUpperInvariant(), precision);
    }

    /// <summary>
    /// Valor cero en pesos mexicanos.
    /// </summary>
    public static Dinero Cero => new(0, "MXN", 2);

    /// <summary>
    /// Suma de dos cantidades monetarias.
    /// </summary>
    public static Dinero operator +(Dinero a, Dinero b)
    {
        ValidarMismaMoneda(a, b);
        return new Dinero(a.Cantidad + b.Cantidad, a.Moneda, a.Precision);
    }

    /// <summary>
    /// Resta de dos cantidades monetarias.
    /// </summary>
    public static Dinero operator -(Dinero a, Dinero b)
    {
        ValidarMismaMoneda(a, b);
        return new Dinero(a.Cantidad - b.Cantidad, a.Moneda, a.Precision);
    }

    /// <summary>
    /// Multiplicación por un factor.
    /// </summary>
    public static Dinero operator *(Dinero a, decimal factor)
    {
        return new Dinero(a.Cantidad * factor, a.Moneda, a.Precision);
    }

    /// <summary>
    /// División por un factor.
    /// </summary>
    public static Dinero operator /(Dinero a, decimal divisor)
    {
        if (divisor == 0)
            throw new DivideByZeroException("No se puede dividir entre cero");

        return new Dinero(a.Cantidad / divisor, a.Moneda, a.Precision);
    }

    /// <summary>
    /// Comparación mayor que.
    /// </summary>
    public static bool operator >(Dinero a, Dinero b)
    {
        ValidarMismaMoneda(a, b);
        return a.Cantidad > b.Cantidad;
    }

    /// <summary>
    /// Comparación menor que.
    /// </summary>
    public static bool operator <(Dinero a, Dinero b)
    {
        ValidarMismaMoneda(a, b);
        return a.Cantidad < b.Cantidad;
    }

    /// <summary>
    /// Comparación mayor o igual.
    /// </summary>
    public static bool operator >=(Dinero a, Dinero b)
    {
        ValidarMismaMoneda(a, b);
        return a.Cantidad >= b.Cantidad;
    }

    /// <summary>
    /// Comparación menor o igual.
    /// </summary>
    public static bool operator <=(Dinero a, Dinero b)
    {
        ValidarMismaMoneda(a, b);
        return a.Cantidad <= b.Cantidad;
    }

    /// <summary>
    /// Indica si la cantidad es positiva.
    /// </summary>
    public bool EsPositivo => Cantidad > 0;

    /// <summary>
    /// Indica si la cantidad es negativa.
    /// </summary>
    public bool EsNegativo => Cantidad < 0;

    /// <summary>
    /// Indica si la cantidad es cero.
    /// </summary>
    public bool EsCero => Cantidad == 0;

    /// <summary>
    /// Obtiene el valor absoluto.
    /// </summary>
    public Dinero ValorAbsoluto()
    {
        return new Dinero(Math.Abs(Cantidad), Moneda, Precision);
    }

    /// <summary>
    /// Redondea la cantidad.
    /// </summary>
    public Dinero Redondear(int decimales)
    {
        return new Dinero(Math.Round(Cantidad, decimales), Moneda, decimales);
    }

    private static void ValidarMismaMoneda(Dinero a, Dinero b)
    {
        if (a.Moneda != b.Moneda)
            throw new InvalidOperationException($"No se pueden operar monedas diferentes: {a.Moneda} vs {b.Moneda}");
    }

    protected override IEnumerable<object?> ObtenerComponentesIgualdad()
    {
        yield return Cantidad;
        yield return Moneda;
    }

    public override string ToString()
    {
        return $"${Cantidad:N2} {Moneda}";
    }

    /// <summary>
    /// Formato para recibos de nómina.
    /// </summary>
    public string FormatoNomina()
    {
        return Cantidad.ToString("C2", new System.Globalization.CultureInfo("es-MX"));
    }
}
