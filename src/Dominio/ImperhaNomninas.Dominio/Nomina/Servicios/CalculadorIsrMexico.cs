// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Calculador de ISR según tablas SAT México
// ===================================

namespace ImperhaNomninas.Dominio.Nomina.Servicios;

/// <summary>
/// Servicio de dominio para el cálculo de ISR según tablas SAT.
/// Incluye tablas mensuales, quincenales y semanales.
/// </summary>
public class CalculadorIsrMexico
{
    // ===================================
    // TABLAS ISR MENSUALES 2024
    // ===================================
    private static readonly TablaIsr[] TablaMensual2024 = new[]
    {
        new TablaIsr(0.01m, 746.04m, 0m, 1.92m),
        new TablaIsr(746.05m, 6332.05m, 14.32m, 6.40m),
        new TablaIsr(6332.06m, 11128.01m, 371.83m, 10.88m),
        new TablaIsr(11128.02m, 12935.82m, 893.63m, 16.00m),
        new TablaIsr(12935.83m, 15487.71m, 1182.88m, 17.92m),
        new TablaIsr(15487.72m, 31236.49m, 1640.18m, 21.36m),
        new TablaIsr(31236.50m, 49233.00m, 5004.12m, 23.52m),
        new TablaIsr(49233.01m, 93993.90m, 9236.89m, 30.00m),
        new TablaIsr(93993.91m, 125325.20m, 22665.17m, 32.00m),
        new TablaIsr(125325.21m, 375975.61m, 32691.18m, 34.00m),
        new TablaIsr(375975.62m, 500967.48m, 117912.32m, 35.00m),
        new TablaIsr(500967.49m, decimal.MaxValue, 161659.18m, 35.00m)
    };

    // ===================================
    // TABLA SUBSIDIO AL EMPLEO MENSUAL 2024
    // ===================================
    private static readonly TablaSubsidio[] TablaSubsidioMensual2024 = new[]
    {
        new TablaSubsidio(0.01m, 1768.96m, 407.02m),
        new TablaSubsidio(1768.97m, 2653.38m, 406.83m),
        new TablaSubsidio(2653.39m, 3472.84m, 406.62m),
        new TablaSubsidio(3472.85m, 3537.87m, 392.77m),
        new TablaSubsidio(3537.88m, 4446.15m, 382.46m),
        new TablaSubsidio(4446.16m, 4717.18m, 354.23m),
        new TablaSubsidio(4717.19m, 5335.42m, 324.87m),
        new TablaSubsidio(5335.43m, 6224.67m, 294.63m),
        new TablaSubsidio(6224.68m, 7113.90m, 253.54m),
        new TablaSubsidio(7113.91m, 7382.33m, 217.61m),
        new TablaSubsidio(7382.34m, decimal.MaxValue, 0m)
    };

    /// <summary>
    /// Calcula el ISR para un ingreso gravable mensual.
    /// </summary>
    /// <param name="ingresoGravableMensual">Base gravable mensual</param>
    /// <returns>Tupla con (ISR calculado, Subsidio aplicable, ISR a retener)</returns>
    public ResultadoCalculoIsr CalcularIsrMensual(decimal ingresoGravableMensual)
    {
        if (ingresoGravableMensual <= 0)
            return new ResultadoCalculoIsr(0, 0, 0);

        // Buscar el rango en la tabla de ISR
        var rangoIsr = TablaMensual2024.FirstOrDefault(t =>
            ingresoGravableMensual >= t.LimiteInferior &&
            ingresoGravableMensual <= t.LimiteSuperior);

        if (rangoIsr == null)
            rangoIsr = TablaMensual2024.Last();

        // Calcular ISR
        var excedente = ingresoGravableMensual - rangoIsr.LimiteInferior;
        var isrMarginal = excedente * (rangoIsr.PorcentajeExcedente / 100m);
        var isrCalculado = rangoIsr.CuotaFija + isrMarginal;

        // Buscar subsidio al empleo
        var rangoSubsidio = TablaSubsidioMensual2024.FirstOrDefault(t =>
            ingresoGravableMensual >= t.LimiteInferior &&
            ingresoGravableMensual <= t.LimiteSuperior);

        var subsidio = rangoSubsidio?.SubsidioMensual ?? 0;

        // Calcular ISR a retener (ISR - Subsidio, mínimo 0)
        var isrRetener = Math.Max(0, isrCalculado - subsidio);

        return new ResultadoCalculoIsr(
            Math.Round(isrCalculado, 2),
            Math.Round(subsidio, 2),
            Math.Round(isrRetener, 2));
    }

    /// <summary>
    /// Calcula el ISR para un periodo quincenal.
    /// </summary>
    public ResultadoCalculoIsr CalcularIsrQuincenal(decimal ingresoGravableQuincenal)
    {
        // Convertir a mensual, calcular y dividir
        var mensual = ingresoGravableQuincenal * 2;
        var resultadoMensual = CalcularIsrMensual(mensual);

        return new ResultadoCalculoIsr(
            Math.Round(resultadoMensual.IsrCalculado / 2, 2),
            Math.Round(resultadoMensual.SubsidioAplicable / 2, 2),
            Math.Round(resultadoMensual.IsrRetener / 2, 2));
    }

    /// <summary>
    /// Calcula el ISR para un periodo semanal.
    /// </summary>
    public ResultadoCalculoIsr CalcularIsrSemanal(decimal ingresoGravableSemanal)
    {
        // Convertir a mensual (52 semanas / 12 meses = 4.333)
        var mensual = ingresoGravableSemanal * 4.333m;
        var resultadoMensual = CalcularIsrMensual(mensual);

        return new ResultadoCalculoIsr(
            Math.Round(resultadoMensual.IsrCalculado / 4.333m, 2),
            Math.Round(resultadoMensual.SubsidioAplicable / 4.333m, 2),
            Math.Round(resultadoMensual.IsrRetener / 4.333m, 2));
    }

    /// <summary>
    /// Calcula el ISR para un periodo catorcenal.
    /// </summary>
    public ResultadoCalculoIsr CalcularIsrCatorcenal(decimal ingresoGravableCatorcenal)
    {
        // 26 catorcenas al año
        var mensual = ingresoGravableCatorcenal * (26m / 12m);
        var resultadoMensual = CalcularIsrMensual(mensual);
        var factor = 12m / 26m;

        return new ResultadoCalculoIsr(
            Math.Round(resultadoMensual.IsrCalculado * factor, 2),
            Math.Round(resultadoMensual.SubsidioAplicable * factor, 2),
            Math.Round(resultadoMensual.IsrRetener * factor, 2));
    }

    /// <summary>
    /// Calcula ISR sobre ingresos extraordinarios (aguinaldo, PTU, etc.).
    /// Usa el artículo 96 LISR para el cálculo.
    /// </summary>
    public decimal CalcularIsrExtraordinario(
        decimal ingresoExtraordinario,
        decimal salarioDiario,
        int diasDelPeriodo)
    {
        // Cálculo según Art. 96 LISR
        // 1. Determinar el ingreso ordinario del periodo
        var ingresoOrdinario = salarioDiario * diasDelPeriodo;

        // 2. Calcular ISR del ingreso ordinario
        var isrOrdinario = CalcularIsrMensual(ingresoOrdinario * (12m / diasDelPeriodo)).IsrCalculado * (diasDelPeriodo / 30m);

        // 3. Sumar el ingreso extraordinario al ordinario
        var ingresoTotal = ingresoOrdinario + ingresoExtraordinario;

        // 4. Calcular ISR del total
        var isrTotal = CalcularIsrMensual(ingresoTotal * (12m / diasDelPeriodo)).IsrCalculado * (diasDelPeriodo / 30m);

        // 5. La diferencia es el ISR del extraordinario
        return Math.Round(isrTotal - isrOrdinario, 2);
    }
}

/// <summary>
/// Representa un rango de la tabla de ISR.
/// </summary>
public record TablaIsr(
    decimal LimiteInferior,
    decimal LimiteSuperior,
    decimal CuotaFija,
    decimal PorcentajeExcedente);

/// <summary>
/// Representa un rango de la tabla de subsidio al empleo.
/// </summary>
public record TablaSubsidio(
    decimal LimiteInferior,
    decimal LimiteSuperior,
    decimal SubsidioMensual);

/// <summary>
/// Resultado del cálculo de ISR.
/// </summary>
public record ResultadoCalculoIsr(
    decimal IsrCalculado,
    decimal SubsidioAplicable,
    decimal IsrRetener)
{
    /// <summary>
    /// Indica si aplica subsidio al empleo.
    /// </summary>
    public bool AplicaSubsidio => SubsidioAplicable > 0;

    /// <summary>
    /// Indica si el subsidio es mayor que el ISR (se paga al trabajador).
    /// </summary>
    public bool SubsidioExcede => SubsidioAplicable > IsrCalculado;

    /// <summary>
    /// Monto del subsidio a entregar (cuando excede el ISR).
    /// </summary>
    public decimal SubsidioAEntregar => SubsidioExcede ? SubsidioAplicable - IsrCalculado : 0;
}
