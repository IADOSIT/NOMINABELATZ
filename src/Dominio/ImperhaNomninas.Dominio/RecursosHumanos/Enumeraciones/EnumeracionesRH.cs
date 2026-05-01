// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Enumeraciones del módulo de Recursos Humanos
// ===================================

namespace ImperhaNomninas.Dominio.RecursosHumanos.Enumeraciones;

/// <summary>
/// Género del empleado.
/// </summary>
public enum Genero
{
    Masculino = 1,
    Femenino = 2
}

/// <summary>
/// Estado civil del empleado.
/// </summary>
public enum EstadoCivil
{
    Soltero = 1,
    Casado = 2,
    DivorciDivorciado = 3,
    Viudo = 4,
    UnionLibre = 5
}

/// <summary>
/// Tipo de contrato laboral.
/// </summary>
public enum TipoContrato
{
    /// <summary>
    /// Contrato por tiempo indeterminado.
    /// </summary>
    Indeterminado = 1,

    /// <summary>
    /// Contrato por obra determinada.
    /// </summary>
    ObraDeterminada = 2,

    /// <summary>
    /// Contrato por tiempo determinado.
    /// </summary>
    TiempoDeterminado = 3,

    /// <summary>
    /// Contrato por temporada (zafra).
    /// </summary>
    Temporada = 4,

    /// <summary>
    /// Contrato de capacitación inicial.
    /// </summary>
    CapacitacionInicial = 5,

    /// <summary>
    /// Periodo a prueba.
    /// </summary>
    PeriodoPrueba = 6
}

/// <summary>
/// Tipo de régimen laboral.
/// </summary>
public enum TipoRegimen
{
    /// <summary>
    /// Sueldos y salarios.
    /// </summary>
    SueldosSalarios = 2,

    /// <summary>
    /// Jubilados.
    /// </summary>
    Jubilados = 3,

    /// <summary>
    /// Pensionados.
    /// </summary>
    Pensionados = 4,

    /// <summary>
    /// Asimilados a salarios.
    /// </summary>
    AsimiladosSalarios = 5,

    /// <summary>
    /// Régimen de indemnización.
    /// </summary>
    Indemnizacion = 9,

    /// <summary>
    /// Jubilación en parcialidades.
    /// </summary>
    JubilacionParcialidades = 10,

    /// <summary>
    /// Jubilación en una exhibición.
    /// </summary>
    JubilacionExhibicion = 11,

    /// <summary>
    /// Pensión en parcialidades.
    /// </summary>
    PensionParcialidades = 12,

    /// <summary>
    /// Pensión en una exhibición.
    /// </summary>
    PensionExhibicion = 13,

    /// <summary>
    /// Otro régimen.
    /// </summary>
    Otro = 99
}

/// <summary>
/// Tipo de jornada laboral.
/// </summary>
public enum TipoJornada
{
    /// <summary>
    /// Jornada diurna (6:00 - 20:00).
    /// </summary>
    Diurna = 1,

    /// <summary>
    /// Jornada nocturna (20:00 - 6:00).
    /// </summary>
    Nocturna = 2,

    /// <summary>
    /// Jornada mixta.
    /// </summary>
    Mixta = 3,

    /// <summary>
    /// Por hora.
    /// </summary>
    PorHora = 4,

    /// <summary>
    /// Reducida.
    /// </summary>
    Reducida = 5,

    /// <summary>
    /// Continuada.
    /// </summary>
    Continuada = 6,

    /// <summary>
    /// Partida.
    /// </summary>
    Partida = 7,

    /// <summary>
    /// Por turnos.
    /// </summary>
    PorTurnos = 8,

    /// <summary>
    /// Jornada especial de zafra.
    /// </summary>
    Zafra = 9
}

/// <summary>
/// Periodicidad de pago.
/// </summary>
public enum PeriodicidadPago
{
    /// <summary>
    /// Pago diario.
    /// </summary>
    Diario = 1,

    /// <summary>
    /// Pago semanal.
    /// </summary>
    Semanal = 2,

    /// <summary>
    /// Pago catorcenal.
    /// </summary>
    Catorcenal = 3,

    /// <summary>
    /// Pago quincenal.
    /// </summary>
    Quincenal = 4,

    /// <summary>
    /// Pago mensual.
    /// </summary>
    Mensual = 5,

    /// <summary>
    /// Pago bimestral.
    /// </summary>
    Bimestral = 6,

    /// <summary>
    /// Pago por unidad obra.
    /// </summary>
    UnidadObra = 7,

    /// <summary>
    /// Pago por comisión.
    /// </summary>
    Comision = 8,

    /// <summary>
    /// Precio alzado.
    /// </summary>
    PrecioAlzado = 9,

    /// <summary>
    /// Por décima parte.
    /// </summary>
    Decenal = 10
}

/// <summary>
/// Estatus laboral del empleado.
/// </summary>
public enum EstatusLaboral
{
    /// <summary>
    /// Empleado activo.
    /// </summary>
    Activo = 1,

    /// <summary>
    /// Empleado dado de baja.
    /// </summary>
    Baja = 2,

    /// <summary>
    /// Empleado con licencia temporal.
    /// </summary>
    Licencia = 3,

    /// <summary>
    /// Empleado incapacitado.
    /// </summary>
    Incapacidad = 4,

    /// <summary>
    /// Empleado suspendido.
    /// </summary>
    Suspendido = 5,

    /// <summary>
    /// Empleado en pre-alta (pendiente de activar).
    /// </summary>
    PreAlta = 6,

    /// <summary>
    /// Empleado pensionado.
    /// </summary>
    Pensionado = 7,

    /// <summary>
    /// Empleado jubilado.
    /// </summary>
    Jubilado = 8
}

/// <summary>
/// Tipo de trabajador.
/// </summary>
public enum TipoTrabajador
{
    /// <summary>
    /// Trabajador sindicalizado.
    /// </summary>
    Sindicalizado = 1,

    /// <summary>
    /// Trabajador de confianza.
    /// </summary>
    Confianza = 2,

    /// <summary>
    /// Trabajador eventual urbano.
    /// </summary>
    EventualUrbano = 3,

    /// <summary>
    /// Trabajador eventual del campo.
    /// </summary>
    EventualCampo = 4
}

/// <summary>
/// Forma de pago del salario.
/// </summary>
public enum FormaPago
{
    /// <summary>
    /// Pago en efectivo.
    /// </summary>
    Efectivo = 1,

    /// <summary>
    /// Pago mediante cheque nominativo.
    /// </summary>
    Cheque = 2,

    /// <summary>
    /// Transferencia bancaria.
    /// </summary>
    TransferenciaBancaria = 3,

    /// <summary>
    /// Tarjeta de débito.
    /// </summary>
    TarjetaDebito = 4
}

/// <summary>
/// Tipo de descuento INFONAVIT.
/// </summary>
public enum TipoDescuentoInfonavit
{
    /// <summary>
    /// Porcentaje del salario.
    /// </summary>
    Porcentaje = 1,

    /// <summary>
    /// Cantidad fija en pesos.
    /// </summary>
    CuotaFija = 2,

    /// <summary>
    /// Número de VSM (Veces Salario Mínimo).
    /// </summary>
    VecesSalarioMinimo = 3
}

/// <summary>
/// Motivo de baja del empleado.
/// </summary>
public enum MotivoBaja
{
    /// <summary>
    /// Renuncia voluntaria.
    /// </summary>
    Renuncia = 1,

    /// <summary>
    /// Rescisión de contrato (art. 47 LFT).
    /// </summary>
    Rescision = 2,

    /// <summary>
    /// Término de contrato.
    /// </summary>
    TerminoContrato = 3,

    /// <summary>
    /// Fallecimiento.
    /// </summary>
    Defuncion = 4,

    /// <summary>
    /// Jubilación.
    /// </summary>
    Jubilacion = 5,

    /// <summary>
    /// Pensión por invalidez.
    /// </summary>
    PensionInvalidez = 6,

    /// <summary>
    /// Abandono de trabajo.
    /// </summary>
    Abandono = 7,

    /// <summary>
    /// Clausura de la empresa.
    /// </summary>
    Clausura = 8,

    /// <summary>
    /// Otro motivo.
    /// </summary>
    Otro = 99
}

/// <summary>
/// Tipo de incapacidad.
/// </summary>
public enum TipoIncapacidad
{
    /// <summary>
    /// Riesgo de trabajo.
    /// </summary>
    RiesgoTrabajo = 1,

    /// <summary>
    /// Enfermedad general.
    /// </summary>
    EnfermedadGeneral = 2,

    /// <summary>
    /// Maternidad.
    /// </summary>
    Maternidad = 3,

    /// <summary>
    /// Licencia 140 bis (cuidado de hijos con cáncer).
    /// </summary>
    Licencia140Bis = 4
}

/// <summary>
/// Tipo de percepción según catálogo SAT.
/// </summary>
public enum TipoPercepcion
{
    SueldosSalariosRayadosJornales = 1,
    GratificacionAnualAguinaldo = 2,
    ParticipaciónUtilidades = 3,
    ReembolsoGastosMedicos = 4,
    FondoAhorro = 5,
    CajaAhorro = 6,
    Contribuciones = 7,
    PremiosPuntualidad = 9,
    PremioAsistencia = 10,
    HorasExtra = 19,
    PrimaVacacional = 21,
    PrimaDominical = 22,
    Vacaciones = 25,
    Ayudas = 28,
    PrimaAntiguedad = 34,
    SeparacionIndemnizacion = 35,
    SubsidioIncapacidad = 37,
    Becas = 38,
    OtrasPercepciones = 47
}

/// <summary>
/// Tipo de deducción según catálogo SAT.
/// </summary>
public enum TipoDeduccion
{
    SeguridadSocial = 1,
    ISR = 2,
    AportacionesInfonavit = 10,
    CuotaSindical = 12,
    DescuentoInfonavit = 20,
    Pensiondebido = 21,
    OtrasObligaciones = 106,
    OtrasDeducciones = 4
}
