// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Enumeraciones del módulo de Nómina
// ===================================

namespace ImperhaNomninas.Dominio.Nomina.Enumeraciones;

/// <summary>
/// Tipo de nómina.
/// </summary>
public enum TipoNomina
{
    /// <summary>
    /// Nómina ordinaria.
    /// </summary>
    Ordinaria = 1,

    /// <summary>
    /// Nómina extraordinaria.
    /// </summary>
    Extraordinaria = 2,

    /// <summary>
    /// Aguinaldo.
    /// </summary>
    Aguinaldo = 3,

    /// <summary>
    /// PTU (Participación de los Trabajadores en las Utilidades).
    /// </summary>
    PTU = 4,

    /// <summary>
    /// Finiquito.
    /// </summary>
    Finiquito = 5,

    /// <summary>
    /// Liquidación.
    /// </summary>
    Liquidacion = 6,

    /// <summary>
    /// Pensión alimenticia.
    /// </summary>
    PensionAlimenticia = 7,

    /// <summary>
    /// Bono de zafra.
    /// </summary>
    BonoZafra = 8,

    /// <summary>
    /// Prima vacacional.
    /// </summary>
    PrimaVacacional = 9
}

/// <summary>
/// Periodicidad de la nómina.
/// </summary>
public enum PeriodicidadNomina
{
    Diario = 1,
    Semanal = 2,
    Catorcenal = 3,
    Quincenal = 4,
    Mensual = 5,
    Bimestral = 6,
    Decenal = 10
}

/// <summary>
/// Estatus del periodo de nómina.
/// </summary>
public enum EstatusPeriodo
{
    /// <summary>
    /// Periodo abierto para captura.
    /// </summary>
    Abierto = 1,

    /// <summary>
    /// Periodo en proceso de cálculo.
    /// </summary>
    EnCalculo = 2,

    /// <summary>
    /// Periodo calculado.
    /// </summary>
    Calculado = 3,

    /// <summary>
    /// Periodo cerrado (inmutable).
    /// </summary>
    Cerrado = 4,

    /// <summary>
    /// Periodo timbrado.
    /// </summary>
    Timbrado = 5
}

/// <summary>
/// Estatus del cálculo de nómina del empleado.
/// </summary>
public enum EstatusCalculoNomina
{
    /// <summary>
    /// Pendiente de calcular.
    /// </summary>
    Pendiente = 1,

    /// <summary>
    /// En proceso de cálculo.
    /// </summary>
    EnProceso = 2,

    /// <summary>
    /// Cálculo completado.
    /// </summary>
    Calculado = 3,

    /// <summary>
    /// Error en el cálculo.
    /// </summary>
    Error = 4,

    /// <summary>
    /// Validado para timbrado.
    /// </summary>
    Validado = 5
}

/// <summary>
/// Estatus del CFDI.
/// </summary>
public enum EstatusCfdi
{
    /// <summary>
    /// Pendiente de timbrar.
    /// </summary>
    Pendiente = 1,

    /// <summary>
    /// En proceso de timbrado.
    /// </summary>
    EnProceso = 2,

    /// <summary>
    /// CFDI timbrado exitosamente.
    /// </summary>
    Timbrado = 3,

    /// <summary>
    /// Error en el timbrado.
    /// </summary>
    Error = 4,

    /// <summary>
    /// CFDI cancelado.
    /// </summary>
    Cancelado = 5,

    /// <summary>
    /// CFDI sustituido.
    /// </summary>
    Sustituido = 6
}

/// <summary>
/// Tipo de percepción SAT (catálogo c_TipoPercepcion).
/// </summary>
public enum TipoPercepcionNomina
{
    /// <summary>
    /// 001 - Sueldos, Salarios, Rayas y Jornales.
    /// </summary>
    SueldosSalarios = 1,

    /// <summary>
    /// 002 - Gratificación Anual (Aguinaldo).
    /// </summary>
    Aguinaldo = 2,

    /// <summary>
    /// 003 - Participación de los Trabajadores en las Utilidades PTU.
    /// </summary>
    PTU = 3,

    /// <summary>
    /// 004 - Reembolso de Gastos Médicos Dentales y Hospitalarios.
    /// </summary>
    ReembolsoGastosMedicos = 4,

    /// <summary>
    /// 005 - Fondo de Ahorro.
    /// </summary>
    FondoAhorro = 5,

    /// <summary>
    /// 006 - Caja de Ahorro.
    /// </summary>
    CajaAhorro = 6,

    /// <summary>
    /// 009 - Premios por Puntualidad.
    /// </summary>
    PremiosPuntualidad = 9,

    /// <summary>
    /// 010 - Prima de Seguro de Vida.
    /// </summary>
    PrimaSeguroVida = 10,

    /// <summary>
    /// 011 - Seguro de Separación Individualizado.
    /// </summary>
    SeguroSeparacion = 11,

    /// <summary>
    /// 012 - Seguro de Retiro.
    /// </summary>
    SeguroRetiro = 12,

    /// <summary>
    /// 013 - Seguro de Gastos Médicos Mayores.
    /// </summary>
    SeguroGastosMedicos = 13,

    /// <summary>
    /// 014 - Subsidio por Incapacidad.
    /// </summary>
    SubsidioIncapacidad = 14,

    /// <summary>
    /// 015 - Becas para trabajadores y/o hijos.
    /// </summary>
    Becas = 15,

    /// <summary>
    /// 019 - Horas Extra.
    /// </summary>
    HorasExtra = 19,

    /// <summary>
    /// 020 - Prima Dominical.
    /// </summary>
    PrimaDominical = 20,

    /// <summary>
    /// 021 - Prima Vacacional.
    /// </summary>
    PrimaVacacional = 21,

    /// <summary>
    /// 022 - Prima por Antigüedad.
    /// </summary>
    PrimaAntiguedad = 22,

    /// <summary>
    /// 023 - Pagos por Separación.
    /// </summary>
    PagosSeparacion = 23,

    /// <summary>
    /// 024 - Seguro de Retiro Patronal.
    /// </summary>
    SeguroRetiroPatronal = 24,

    /// <summary>
    /// 025 - Indemnizaciones.
    /// </summary>
    Indemnizaciones = 25,

    /// <summary>
    /// 026 - Reembolso por Funeral.
    /// </summary>
    ReembolsoFuneral = 26,

    /// <summary>
    /// 027 - Cuotas de Seguridad Social Pagadas por el Patrón.
    /// </summary>
    CuotasSSPatron = 27,

    /// <summary>
    /// 028 - Comisiones.
    /// </summary>
    Comisiones = 28,

    /// <summary>
    /// 029 - Vales de Despensa.
    /// </summary>
    ValesDespensa = 29,

    /// <summary>
    /// 030 - Vales de Restaurante.
    /// </summary>
    ValesRestaurante = 30,

    /// <summary>
    /// 031 - Vales de Gasolina.
    /// </summary>
    ValesGasolina = 31,

    /// <summary>
    /// 032 - Vales de Ropa.
    /// </summary>
    ValesRopa = 32,

    /// <summary>
    /// 033 - Ayuda para Renta.
    /// </summary>
    AyudaRenta = 33,

    /// <summary>
    /// 034 - Ayuda para Artículos Escolares.
    /// </summary>
    AyudaEscolares = 34,

    /// <summary>
    /// 035 - Ayuda para Anteojos.
    /// </summary>
    AyudaAnteojos = 35,

    /// <summary>
    /// 036 - Ayuda para Transporte.
    /// </summary>
    AyudaTransporte = 36,

    /// <summary>
    /// 037 - Ayuda para Gastos de Funeral.
    /// </summary>
    AyudaFuneral = 37,

    /// <summary>
    /// 038 - Otros Ingresos por Salarios.
    /// </summary>
    OtrosIngresosSalarios = 38,

    /// <summary>
    /// 039 - Jubilaciones, Pensiones o Haberes de Retiro.
    /// </summary>
    Jubilaciones = 39,

    /// <summary>
    /// 044 - Jubilaciones, Pensiones o Haberes de Retiro en Parcialidades.
    /// </summary>
    JubilacionesParcialidades = 44,

    /// <summary>
    /// 045 - Ingresos en Acciones o Títulos Valor.
    /// </summary>
    IngresosAcciones = 45,

    /// <summary>
    /// 046 - Ingresos Asimilados a Salarios.
    /// </summary>
    IngresosAsimilados = 46,

    /// <summary>
    /// 047 - Alimentación.
    /// </summary>
    Alimentacion = 47,

    /// <summary>
    /// 048 - Habitación.
    /// </summary>
    Habitacion = 48,

    /// <summary>
    /// 049 - Premios por Asistencia.
    /// </summary>
    PremiosAsistencia = 49,

    /// <summary>
    /// 050 - Viáticos.
    /// </summary>
    Viaticos = 50,

    /// <summary>
    /// Bono de Zafra (concepto especial industria azucarera).
    /// </summary>
    BonoZafra = 99
}

/// <summary>
/// Tipo de deducción SAT (catálogo c_TipoDeduccion).
/// </summary>
public enum TipoDeduccionNomina
{
    /// <summary>
    /// 001 - Seguridad Social.
    /// </summary>
    SeguridadSocial = 1,

    /// <summary>
    /// 002 - ISR.
    /// </summary>
    ISR = 2,

    /// <summary>
    /// 003 - Aportaciones a Retiro, Cesantía en Edad Avanzada y Vejez.
    /// </summary>
    AportacionesRetiro = 3,

    /// <summary>
    /// 004 - Otros.
    /// </summary>
    Otros = 4,

    /// <summary>
    /// 005 - Aportaciones a Fondo de Vivienda.
    /// </summary>
    AportacionesVivienda = 5,

    /// <summary>
    /// 006 - Descuento por Incapacidad.
    /// </summary>
    DescuentoIncapacidad = 6,

    /// <summary>
    /// 007 - Pensión Alimenticia.
    /// </summary>
    PensionAlimenticia = 7,

    /// <summary>
    /// 008 - Renta.
    /// </summary>
    Renta = 8,

    /// <summary>
    /// 009 - Préstamos Provenientes del Fondo Nacional de la Vivienda.
    /// </summary>
    PrestamosInfonavit = 9,

    /// <summary>
    /// 010 - Pago por Crédito de Vivienda.
    /// </summary>
    CreditoVivienda = 10,

    /// <summary>
    /// 011 - Pago de Abonos INFONACOT.
    /// </summary>
    Infonacot = 11,

    /// <summary>
    /// 012 - Anticipo de Salarios.
    /// </summary>
    AnticipoSalarios = 12,

    /// <summary>
    /// 013 - Pagos Hechos con Exceso al Trabajador.
    /// </summary>
    PagosExceso = 13,

    /// <summary>
    /// 014 - Errores.
    /// </summary>
    Errores = 14,

    /// <summary>
    /// 015 - Pérdidas.
    /// </summary>
    Perdidas = 15,

    /// <summary>
    /// 016 - Averías.
    /// </summary>
    Averias = 16,

    /// <summary>
    /// 017 - Adquisición de Artículos Producidos por la Empresa.
    /// </summary>
    ArticulosEmpresa = 17,

    /// <summary>
    /// 018 - Cuotas para la Constitución y Fomento de Sociedades Cooperativas.
    /// </summary>
    CuotasCooperativas = 18,

    /// <summary>
    /// 019 - Cuota Sindical.
    /// </summary>
    CuotaSindical = 19,

    /// <summary>
    /// 020 - Ausencia (Ausentismo).
    /// </summary>
    Ausencias = 20,

    /// <summary>
    /// 021 - Cuotas Obrero Patronales.
    /// </summary>
    CuotasObreroPatronales = 21,

    /// <summary>
    /// Código especial para IMSS.
    /// </summary>
    IMSS = 100,

    /// <summary>
    /// Código especial para INFONAVIT.
    /// </summary>
    Infonavit = 101
}

/// <summary>
/// Tipo de otro pago SAT (catálogo c_TipoOtroPago).
/// </summary>
public enum TipoOtroPagoNomina
{
    /// <summary>
    /// 001 - Reintegro de ISR Pagado en Exceso.
    /// </summary>
    ReintegroIsrExceso = 1,

    /// <summary>
    /// 002 - Subsidio para el Empleo.
    /// </summary>
    SubsidioEmpleo = 2,

    /// <summary>
    /// 003 - Viáticos Entregados al Trabajador.
    /// </summary>
    ViaticosEntregados = 3,

    /// <summary>
    /// 004 - Aplicación de Saldo a Favor por Compensación Anual.
    /// </summary>
    SaldoFavor = 4,

    /// <summary>
    /// 005 - Reintegro de ISR Retenido en Exceso de Ejercicio Anterior.
    /// </summary>
    ReintegroIsrAnterior = 5,

    /// <summary>
    /// 006 - Alimentos en Bienes (Subsidio al Empleo Cobrado).
    /// </summary>
    AlimentosBienes = 6,

    /// <summary>
    /// 007 - ISR Ajustado por Subsidio.
    /// </summary>
    IsrAjustadoSubsidio = 7,

    /// <summary>
    /// 008 - Subsidio Efectivamente Entregado.
    /// </summary>
    SubsidioEntregado = 8,

    /// <summary>
    /// 009 - Diferencia de ISR a Cargo del Trabajador por Ajuste Anual.
    /// </summary>
    DiferenciaIsrAnual = 9,

    /// <summary>
    /// 999 - Pagos Distintos a los Listados.
    /// </summary>
    OtrosPagos = 999
}
