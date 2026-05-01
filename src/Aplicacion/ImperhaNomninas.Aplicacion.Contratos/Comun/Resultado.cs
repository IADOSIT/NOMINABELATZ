// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Patrón Result para manejo de errores
// ===================================

namespace ImperhaNomninas.Aplicacion.Contratos.Comun;

/// <summary>
/// Representa el resultado de una operación (éxito o fallo).
/// </summary>
public class Resultado
{
    public bool Exitoso { get; }
    public bool Fallido => !Exitoso;
    public string? Error { get; }
    public string? CodigoError { get; }
    public IReadOnlyList<string> Errores { get; }

    protected Resultado(bool exitoso, string? error = null, string? codigoError = null, IEnumerable<string>? errores = null)
    {
        Exitoso = exitoso;
        Error = error;
        CodigoError = codigoError;
        Errores = errores?.ToList() ?? (error != null ? new List<string> { error } : new List<string>());
    }

    /// <summary>
    /// Crea un resultado exitoso.
    /// </summary>
    public static Resultado Exito() => new(true);

    /// <summary>
    /// Crea un resultado fallido.
    /// </summary>
    public static Resultado Fallo(string error, string? codigoError = null) =>
        new(false, error, codigoError);

    /// <summary>
    /// Crea un resultado fallido con múltiples errores.
    /// </summary>
    public static Resultado Fallo(IEnumerable<string> errores) =>
        new(false, errores.FirstOrDefault(), errores: errores);

    /// <summary>
    /// Crea un resultado exitoso con valor.
    /// </summary>
    public static Resultado<T> Exito<T>(T valor) => Resultado<T>.Exito(valor);

    /// <summary>
    /// Crea un resultado fallido con tipo.
    /// </summary>
    public static Resultado<T> Fallo<T>(string error, string? codigoError = null) =>
        Resultado<T>.Fallo(error, codigoError);
}

/// <summary>
/// Representa el resultado de una operación con valor de retorno.
/// </summary>
public class Resultado<T> : Resultado
{
    private readonly T? _valor;

    public T Valor => Exitoso
        ? _valor!
        : throw new InvalidOperationException("No se puede acceder al valor de un resultado fallido");

    private Resultado(bool exitoso, T? valor = default, string? error = null, string? codigoError = null)
        : base(exitoso, error, codigoError)
    {
        _valor = valor;
    }

    /// <summary>
    /// Crea un resultado exitoso con valor.
    /// </summary>
    public static Resultado<T> Exito(T valor) => new(true, valor);

    /// <summary>
    /// Crea un resultado fallido.
    /// </summary>
    public new static Resultado<T> Fallo(string error, string? codigoError = null) =>
        new(false, default, error, codigoError);

    /// <summary>
    /// Conversión implícita de valor a resultado exitoso.
    /// </summary>
    public static implicit operator Resultado<T>(T valor) => Exito(valor);
}
