// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Calculador de cuotas IMSS
// ===================================

namespace ImperhaNomninas.Dominio.Nomina.Servicios;

/// <summary>
/// Servicio de dominio para el cálculo de cuotas IMSS.
/// Implementa las cuotas obrero-patronales según la Ley del Seguro Social.
/// </summary>
public class CalculadorImss
{
    // ===================================
    // CONSTANTES IMSS 2024
    // ===================================

    /// <summary>
    /// UMA diaria 2024.
    /// </summary>
    public const decimal UMA_DIARIA = 108.57m;

    /// <summary>
    /// Salario mínimo general 2024.
    /// </summary>
    public const decimal SALARIO_MINIMO = 248.93m;

    /// <summary>
    /// Tope superior SBC (25 UMAs).
    /// </summary>
    public const decimal TOPE_SBC_UMAS = 25m;

    /// <summary>
    /// Tope de SBC diario.
    /// </summary>
    public decimal TopeSbcDiario => UMA_DIARIA * TOPE_SBC_UMAS;

    // ===================================
    // CUOTAS ENFERMEDAD Y MATERNIDAD
    // ===================================

    /// <summary>
    /// Cuota patronal en especie (cuota fija) - 20.40%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_ESPECIE_FIJA = 20.40m;

    /// <summary>
    /// Cuota patronal en especie excedente - 1.10%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_ESPECIE_EXCEDENTE = 1.10m;

    /// <summary>
    /// Cuota obrera en especie excedente - 0.40%.
    /// </summary>
    private const decimal CUOTA_OBRERA_ESPECIE_EXCEDENTE = 0.40m;

    /// <summary>
    /// Cuota patronal prestaciones en dinero - 0.70%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_DINERO = 0.70m;

    /// <summary>
    /// Cuota obrera prestaciones en dinero - 0.25%.
    /// </summary>
    private const decimal CUOTA_OBRERA_DINERO = 0.25m;

    /// <summary>
    /// Cuota patronal gastos médicos pensionados - 1.05%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_PENSIONADOS = 1.05m;

    /// <summary>
    /// Cuota obrera gastos médicos pensionados - 0.375%.
    /// </summary>
    private const decimal CUOTA_OBRERA_PENSIONADOS = 0.375m;

    // ===================================
    // CUOTAS INVALIDEZ Y VIDA
    // ===================================

    /// <summary>
    /// Cuota patronal invalidez y vida - 1.75%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_INVALIDEZ = 1.75m;

    /// <summary>
    /// Cuota obrera invalidez y vida - 0.625%.
    /// </summary>
    private const decimal CUOTA_OBRERA_INVALIDEZ = 0.625m;

    // ===================================
    // CUOTAS RETIRO, CESANTÍA Y VEJEZ
    // ===================================

    /// <summary>
    /// Cuota patronal retiro - 2.00%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_RETIRO = 2.00m;

    /// <summary>
    /// Cuota patronal cesantía y vejez 2024 - 4.241%.
    /// (Incremento gradual hasta 2030)
    /// </summary>
    private const decimal CUOTA_PATRONAL_CESANTIA = 4.241m;

    /// <summary>
    /// Cuota obrera cesantía y vejez - 1.125%.
    /// </summary>
    private const decimal CUOTA_OBRERA_CESANTIA = 1.125m;

    // ===================================
    // CUOTAS GUARDERÍAS Y PRESTACIONES SOCIALES
    // ===================================

    /// <summary>
    /// Cuota patronal guarderías - 1.00%.
    /// </summary>
    private const decimal CUOTA_PATRONAL_GUARDERIAS = 1.00m;

    // ===================================
    // CUOTAS INFONAVIT
    // ===================================

    /// <summary>
    /// Aportación patronal INFONAVIT - 5.00%.
    /// </summary>
    private const decimal APORTACION_INFONAVIT = 5.00m;

    /// <summary>
    /// Calcula las cuotas IMSS para un periodo.
    /// </summary>
    /// <param name="salarioBaseCotizacion">Salario base de cotización diario</param>
    /// <param name="diasCotizados">Días cotizados en el periodo</param>
    /// <param name="primaRiesgoTrabajo">Prima de riesgo de trabajo (%)</param>
    /// <returns>Resultado con cuotas obrero y patronal desglosadas</returns>
    public ResultadoCalculoImss Calcular(
        decimal salarioBaseCotizacion,
        int diasCotizados,
        decimal primaRiesgoTrabajo)
    {
        // Aplicar tope de SBC
        var sbcAplicable = Math.Min(salarioBaseCotizacion, TopeSbcDiario);
        var sbcPeriodo = sbcAplicable * diasCotizados;

        // Base para excedente de 3 UMAs
        var tresSalarioMinimo = SALARIO_MINIMO * 3 * diasCotizados;
        var excedente = Math.Max(0, sbcPeriodo - tresSalarioMinimo);

        // ===================================
        // CUOTAS OBRERO
        // ===================================

        // Enfermedad y Maternidad - Especie (excedente)
        var obreraEspecieExcedente = excedente * (CUOTA_OBRERA_ESPECIE_EXCEDENTE / 100m);

        // Enfermedad y Maternidad - Dinero
        var obreraDinero = sbcPeriodo * (CUOTA_OBRERA_DINERO / 100m);

        // Gastos médicos pensionados
        var obreraPensionados = sbcPeriodo * (CUOTA_OBRERA_PENSIONADOS / 100m);

        // Invalidez y Vida
        var obreraInvalidez = sbcPeriodo * (CUOTA_OBRERA_INVALIDEZ / 100m);

        // Cesantía y Vejez
        var obreraCesantia = sbcPeriodo * (CUOTA_OBRERA_CESANTIA / 100m);

        var totalCuotaObrera =
            obreraEspecieExcedente +
            obreraDinero +
            obreraPensionados +
            obreraInvalidez +
            obreraCesantia;

        // ===================================
        // CUOTAS PATRONAL
        // ===================================

        // Enfermedad y Maternidad - Especie (cuota fija)
        var patronalEspecieFija = (SALARIO_MINIMO * diasCotizados) * (CUOTA_PATRONAL_ESPECIE_FIJA / 100m);

        // Enfermedad y Maternidad - Especie (excedente)
        var patronalEspecieExcedente = excedente * (CUOTA_PATRONAL_ESPECIE_EXCEDENTE / 100m);

        // Enfermedad y Maternidad - Dinero
        var patronalDinero = sbcPeriodo * (CUOTA_PATRONAL_DINERO / 100m);

        // Gastos médicos pensionados
        var patronalPensionados = sbcPeriodo * (CUOTA_PATRONAL_PENSIONADOS / 100m);

        // Riesgo de Trabajo
        var patronalRiesgoTrabajo = sbcPeriodo * (primaRiesgoTrabajo / 100m);

        // Invalidez y Vida
        var patronalInvalidez = sbcPeriodo * (CUOTA_PATRONAL_INVALIDEZ / 100m);

        // Retiro
        var patronalRetiro = sbcPeriodo * (CUOTA_PATRONAL_RETIRO / 100m);

        // Cesantía y Vejez
        var patronalCesantia = sbcPeriodo * (CUOTA_PATRONAL_CESANTIA / 100m);

        // Guarderías y Prestaciones Sociales
        var patronalGuarderias = sbcPeriodo * (CUOTA_PATRONAL_GUARDERIAS / 100m);

        // INFONAVIT
        var patronalInfonavit = sbcPeriodo * (APORTACION_INFONAVIT / 100m);

        var totalCuotaPatronal =
            patronalEspecieFija +
            patronalEspecieExcedente +
            patronalDinero +
            patronalPensionados +
            patronalRiesgoTrabajo +
            patronalInvalidez +
            patronalRetiro +
            patronalCesantia +
            patronalGuarderias +
            patronalInfonavit;

        return new ResultadoCalculoImss
        {
            SbcAplicable = sbcAplicable,
            DiasCotizados = diasCotizados,

            // Cuotas obrero
            ObreraEnfermedadMaternidad = Math.Round(obreraEspecieExcedente + obreraDinero + obreraPensionados, 2),
            ObreraInvalidezVida = Math.Round(obreraInvalidez, 2),
            ObreraCesantiaVejez = Math.Round(obreraCesantia, 2),
            TotalCuotaObrera = Math.Round(totalCuotaObrera, 2),

            // Cuotas patronal
            PatronalEnfermedadMaternidad = Math.Round(patronalEspecieFija + patronalEspecieExcedente + patronalDinero + patronalPensionados, 2),
            PatronalRiesgoTrabajo = Math.Round(patronalRiesgoTrabajo, 2),
            PatronalInvalidezVida = Math.Round(patronalInvalidez, 2),
            PatronalRetiro = Math.Round(patronalRetiro, 2),
            PatronalCesantiaVejez = Math.Round(patronalCesantia, 2),
            PatronalGuarderias = Math.Round(patronalGuarderias, 2),
            PatronalInfonavit = Math.Round(patronalInfonavit, 2),
            TotalCuotaPatronal = Math.Round(totalCuotaPatronal, 2)
        };
    }

    /// <summary>
    /// Calcula el descuento INFONAVIT según el tipo de descuento.
    /// </summary>
    public decimal CalcularDescuentoInfonavit(
        decimal sbcDiario,
        int diasPeriodo,
        TipoDescuentoInfonavit tipo,
        decimal valorDescuento)
    {
        return tipo switch
        {
            TipoDescuentoInfonavit.Porcentaje =>
                Math.Round(sbcDiario * diasPeriodo * (valorDescuento / 100m), 2),

            TipoDescuentoInfonavit.CuotaFija =>
                Math.Round(valorDescuento, 2),

            TipoDescuentoInfonavit.VecesSalarioMinimo =>
                Math.Round(SALARIO_MINIMO * valorDescuento, 2),

            _ => 0
        };
    }
}

/// <summary>
/// Tipo de descuento INFONAVIT.
/// </summary>
public enum TipoDescuentoInfonavit
{
    Porcentaje = 1,
    CuotaFija = 2,
    VecesSalarioMinimo = 3
}

/// <summary>
/// Resultado del cálculo de cuotas IMSS.
/// </summary>
public class ResultadoCalculoImss
{
    public decimal SbcAplicable { get; set; }
    public int DiasCotizados { get; set; }

    // Cuotas Obrero
    public decimal ObreraEnfermedadMaternidad { get; set; }
    public decimal ObreraInvalidezVida { get; set; }
    public decimal ObreraCesantiaVejez { get; set; }
    public decimal TotalCuotaObrera { get; set; }

    // Cuotas Patronal
    public decimal PatronalEnfermedadMaternidad { get; set; }
    public decimal PatronalRiesgoTrabajo { get; set; }
    public decimal PatronalInvalidezVida { get; set; }
    public decimal PatronalRetiro { get; set; }
    public decimal PatronalCesantiaVejez { get; set; }
    public decimal PatronalGuarderias { get; set; }
    public decimal PatronalInfonavit { get; set; }
    public decimal TotalCuotaPatronal { get; set; }

    /// <summary>
    /// Costo total de seguridad social (obrero + patronal).
    /// </summary>
    public decimal CostoTotalSeguridadSocial => TotalCuotaObrera + TotalCuotaPatronal;
}
