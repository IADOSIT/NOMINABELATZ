// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Value Object Base
// ===================================

namespace ImperhaNomninas.Dominio.Compartido.ValorObjeto;

/// <summary>
/// Clase base abstracta para Value Objects.
/// Los Value Objects son inmutables y se comparan por valor.
/// </summary>
public abstract class ValorObjetoBase
{
    /// <summary>
    /// Obtiene los componentes para comparación de igualdad.
    /// </summary>
    protected abstract IEnumerable<object?> ObtenerComponentesIgualdad();

    public override bool Equals(object? obj)
    {
        if (obj == null || obj.GetType() != GetType())
            return false;

        var otro = (ValorObjetoBase)obj;

        return ObtenerComponentesIgualdad()
            .SequenceEqual(otro.ObtenerComponentesIgualdad());
    }

    public override int GetHashCode()
    {
        return ObtenerComponentesIgualdad()
            .Select(x => x?.GetHashCode() ?? 0)
            .Aggregate((x, y) => x ^ y);
    }

    public static bool operator ==(ValorObjetoBase? izquierda, ValorObjetoBase? derecha)
    {
        if (izquierda is null && derecha is null)
            return true;

        if (izquierda is null || derecha is null)
            return false;

        return izquierda.Equals(derecha);
    }

    public static bool operator !=(ValorObjetoBase? izquierda, ValorObjetoBase? derecha)
    {
        return !(izquierda == derecha);
    }
}
