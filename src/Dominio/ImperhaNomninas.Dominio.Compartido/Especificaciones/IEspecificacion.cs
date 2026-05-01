// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Patrón Specification para reglas de negocio
// ===================================

using System.Linq.Expressions;
using ImperhaNomninas.Dominio.Compartido.Entidades;

namespace ImperhaNomninas.Dominio.Compartido.Especificaciones;

/// <summary>
/// Interfaz para el patrón Specification.
/// Permite encapsular reglas de negocio reutilizables.
/// </summary>
/// <typeparam name="T">Tipo de entidad a evaluar</typeparam>
public interface IEspecificacion<T> where T : EntidadBase
{
    /// <summary>
    /// Expresión que representa la especificación.
    /// Se usa para consultas en base de datos.
    /// </summary>
    Expression<Func<T, bool>> ToExpression();

    /// <summary>
    /// Evalúa si una entidad cumple con la especificación.
    /// </summary>
    bool EsCumplidaPor(T entidad);
}

/// <summary>
/// Clase base abstracta para especificaciones.
/// </summary>
public abstract class EspecificacionBase<T> : IEspecificacion<T> where T : EntidadBase
{
    public abstract Expression<Func<T, bool>> ToExpression();

    public bool EsCumplidaPor(T entidad)
    {
        var predicado = ToExpression().Compile();
        return predicado(entidad);
    }

    /// <summary>
    /// Operador AND para combinar especificaciones.
    /// </summary>
    public static EspecificacionBase<T> operator &(EspecificacionBase<T> izquierda, EspecificacionBase<T> derecha)
    {
        return new EspecificacionAnd<T>(izquierda, derecha);
    }

    /// <summary>
    /// Operador OR para combinar especificaciones.
    /// </summary>
    public static EspecificacionBase<T> operator |(EspecificacionBase<T> izquierda, EspecificacionBase<T> derecha)
    {
        return new EspecificacionOr<T>(izquierda, derecha);
    }

    /// <summary>
    /// Operador NOT para negar una especificación.
    /// </summary>
    public static EspecificacionBase<T> operator !(EspecificacionBase<T> especificacion)
    {
        return new EspecificacionNot<T>(especificacion);
    }
}

/// <summary>
/// Especificación AND que combina dos especificaciones.
/// </summary>
internal class EspecificacionAnd<T> : EspecificacionBase<T> where T : EntidadBase
{
    private readonly EspecificacionBase<T> _izquierda;
    private readonly EspecificacionBase<T> _derecha;

    public EspecificacionAnd(EspecificacionBase<T> izquierda, EspecificacionBase<T> derecha)
    {
        _izquierda = izquierda;
        _derecha = derecha;
    }

    public override Expression<Func<T, bool>> ToExpression()
    {
        var izquierdaExpr = _izquierda.ToExpression();
        var derechaExpr = _derecha.ToExpression();

        var parametro = Expression.Parameter(typeof(T));

        var izquierdaCuerpo = Expression.Invoke(izquierdaExpr, parametro);
        var derechaCuerpo = Expression.Invoke(derechaExpr, parametro);

        var andExpr = Expression.AndAlso(izquierdaCuerpo, derechaCuerpo);

        return Expression.Lambda<Func<T, bool>>(andExpr, parametro);
    }
}

/// <summary>
/// Especificación OR que combina dos especificaciones.
/// </summary>
internal class EspecificacionOr<T> : EspecificacionBase<T> where T : EntidadBase
{
    private readonly EspecificacionBase<T> _izquierda;
    private readonly EspecificacionBase<T> _derecha;

    public EspecificacionOr(EspecificacionBase<T> izquierda, EspecificacionBase<T> derecha)
    {
        _izquierda = izquierda;
        _derecha = derecha;
    }

    public override Expression<Func<T, bool>> ToExpression()
    {
        var izquierdaExpr = _izquierda.ToExpression();
        var derechaExpr = _derecha.ToExpression();

        var parametro = Expression.Parameter(typeof(T));

        var izquierdaCuerpo = Expression.Invoke(izquierdaExpr, parametro);
        var derechaCuerpo = Expression.Invoke(derechaExpr, parametro);

        var orExpr = Expression.OrElse(izquierdaCuerpo, derechaCuerpo);

        return Expression.Lambda<Func<T, bool>>(orExpr, parametro);
    }
}

/// <summary>
/// Especificación NOT que niega una especificación.
/// </summary>
internal class EspecificacionNot<T> : EspecificacionBase<T> where T : EntidadBase
{
    private readonly EspecificacionBase<T> _especificacion;

    public EspecificacionNot(EspecificacionBase<T> especificacion)
    {
        _especificacion = especificacion;
    }

    public override Expression<Func<T, bool>> ToExpression()
    {
        var expr = _especificacion.ToExpression();
        var parametro = Expression.Parameter(typeof(T));

        var cuerpo = Expression.Invoke(expr, parametro);
        var notExpr = Expression.Not(cuerpo);

        return Expression.Lambda<Func<T, bool>>(notExpr, parametro);
    }
}
