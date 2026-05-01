// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Motor de Cálculo de Nómina
// ===================================

using ImperhaNomninas.Dominio.Nomina.Entidades;
using ImperhaNomninas.Dominio.Nomina.Enumeraciones;
using ImperhaNomninas.Dominio.RecursosHumanos.Entidades;

namespace ImperhaNomninas.Dominio.Nomina.Servicios;

/// <summary>
/// Motor principal de cálculo de nómina.
/// Orquesta los cálculos de ISR, IMSS y genera el recibo de nómina.
/// </summary>
public class MotorCalculoNomina
{
    private readonly CalculadorIsrMexico _calculadorIsr;
    private readonly CalculadorImss _calculadorImss;

    public MotorCalculoNomina()
    {
        _calculadorIsr = new CalculadorIsrMexico();
        _calculadorImss = new CalculadorImss();
    }

    /// <summary>
    /// Calcula la nómina de un empleado para un periodo.
    /// </summary>
    public NominaEmpleado CalcularNomina(
        Empleado empleado,
        PeriodoNomina periodo,
        ParametrosCalculoNomina parametros,
        Guid usuarioCalculoId)
    {
        // Crear el registro de nómina
        var nomina = NominaEmpleado.Crear(
            empresaId: empleado.EmpresaId,
            ingenioId: empleado.IngenioId!.Value,
            periodoNominaId: periodo.Id,
            empleadoId: empleado.Id,
            numeroEmpleado: empleado.NumeroEmpleado,
            nombreCompleto: empleado.NombreCompleto,
            rfc: empleado.Rfc.Valor,
            curp: empleado.Curp.Valor,
            nss: empleado.Nss.Valor,
            departamento: parametros.NombreDepartamento,
            puesto: parametros.NombrePuesto,
            salarioDiario: empleado.SalarioDiario.Cantidad,
            salarioDiarioIntegrado: empleado.SalarioDiarioIntegrado.Cantidad,
            salarioBaseCotizacion: empleado.SalarioBaseCotizacion.Cantidad,
            usuarioCreadorId: usuarioCalculoId);

        try
        {
            // Establecer días del periodo
            var diasPeriodo = ObtenerDiasPeriodo(periodo.Periodicidad);
            var diasTrabajados = diasPeriodo - parametros.DiasIncapacidad - parametros.DiasFaltas;

            nomina.EstablecerDiasPeriodo(
                diasTrabajados: diasTrabajados,
                diasIncapacidad: parametros.DiasIncapacidad,
                diasFaltas: parametros.DiasFaltas,
                diasVacaciones: parametros.DiasVacaciones);

            nomina.EstablecerHorasExtra(
                parametros.HorasExtraDobles,
                parametros.HorasExtraTriples);

            // ===================================
            // PERCEPCIONES
            // ===================================

            // Sueldo base
            var sueldoBase = empleado.SalarioDiario.Cantidad * diasTrabajados;
            if (sueldoBase > 0)
            {
                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    TipoPercepcionNomina.SueldosSalarios,
                    "001",
                    "Sueldo",
                    importeGravado: sueldoBase,
                    importeExento: 0,
                    cantidadBase: diasTrabajados,
                    valorUnitario: empleado.SalarioDiario.Cantidad));
            }

            // Horas extra dobles
            if (parametros.HorasExtraDobles > 0)
            {
                var valorHoraDoble = (empleado.SalarioDiario.Cantidad / 8) * 2;
                var importeHorasDobles = valorHoraDoble * parametros.HorasExtraDobles;

                // Las primeras 9 horas semanales son exentas
                var horasExentasDisponibles = 9m * (diasPeriodo / 7m);
                var horasExentas = Math.Min(parametros.HorasExtraDobles, horasExentasDisponibles);
                var horasGravadas = parametros.HorasExtraDobles - horasExentas;

                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    TipoPercepcionNomina.HorasExtra,
                    "019",
                    "Horas Extra Dobles",
                    importeGravado: valorHoraDoble * horasGravadas,
                    importeExento: valorHoraDoble * horasExentas,
                    cantidadBase: parametros.HorasExtraDobles,
                    valorUnitario: valorHoraDoble));
            }

            // Horas extra triples
            if (parametros.HorasExtraTriples > 0)
            {
                var valorHoraTriple = (empleado.SalarioDiario.Cantidad / 8) * 3;
                var importeHorasTriples = valorHoraTriple * parametros.HorasExtraTriples;

                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    TipoPercepcionNomina.HorasExtra,
                    "019",
                    "Horas Extra Triples",
                    importeGravado: importeHorasTriples,
                    importeExento: 0,
                    cantidadBase: parametros.HorasExtraTriples,
                    valorUnitario: valorHoraTriple));
            }

            // Prima dominical
            if (parametros.DominicalesTrabajados > 0)
            {
                var primaDominical = empleado.SalarioDiario.Cantidad * 0.25m * parametros.DominicalesTrabajados;
                var exentoDominical = CalculadorImss.SALARIO_MINIMO * parametros.DominicalesTrabajados;

                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    TipoPercepcionNomina.PrimaDominical,
                    "020",
                    "Prima Dominical",
                    importeGravado: Math.Max(0, primaDominical - exentoDominical),
                    importeExento: Math.Min(primaDominical, exentoDominical)));
            }

            // Vacaciones
            if (parametros.DiasVacaciones > 0)
            {
                var pagoVacaciones = empleado.SalarioDiario.Cantidad * parametros.DiasVacaciones;

                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    TipoPercepcionNomina.SueldosSalarios,
                    "001",
                    "Vacaciones",
                    importeGravado: pagoVacaciones,
                    importeExento: 0,
                    cantidadBase: parametros.DiasVacaciones,
                    valorUnitario: empleado.SalarioDiario.Cantidad));
            }

            // Prima vacacional
            if (parametros.DiasVacaciones > 0 && parametros.AplicaPrimaVacacional)
            {
                var primaVacacional = empleado.SalarioDiario.Cantidad * parametros.DiasVacaciones * 0.25m;
                var exentoPrima = CalculadorImss.SALARIO_MINIMO * 15; // 15 días SMG exentos

                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    TipoPercepcionNomina.PrimaVacacional,
                    "021",
                    "Prima Vacacional",
                    importeGravado: Math.Max(0, primaVacacional - exentoPrima),
                    importeExento: Math.Min(primaVacacional, exentoPrima)));
            }

            // Percepciones adicionales configuradas
            foreach (var percepcionAdicional in parametros.PercepcionesAdicionales)
            {
                nomina.AgregarPercepcion(PercepcionNomina.Crear(
                    nomina.Id,
                    percepcionAdicional.Tipo,
                    percepcionAdicional.Clave,
                    percepcionAdicional.Descripcion,
                    importeGravado: percepcionAdicional.ImporteGravado,
                    importeExento: percepcionAdicional.ImporteExento));
            }

            // ===================================
            // CÁLCULOS FISCALES
            // ===================================

            // Calcular totales de percepciones
            var totalGravado = nomina.Percepciones.Sum(p => p.ImporteGravado);
            var totalExento = nomina.Percepciones.Sum(p => p.ImporteExento);

            // Calcular ISR
            var resultadoIsr = periodo.Periodicidad switch
            {
                PeriodicidadNomina.Semanal => _calculadorIsr.CalcularIsrSemanal(totalGravado),
                PeriodicidadNomina.Catorcenal => _calculadorIsr.CalcularIsrCatorcenal(totalGravado),
                PeriodicidadNomina.Quincenal => _calculadorIsr.CalcularIsrQuincenal(totalGravado),
                PeriodicidadNomina.Mensual => _calculadorIsr.CalcularIsrMensual(totalGravado),
                _ => _calculadorIsr.CalcularIsrQuincenal(totalGravado)
            };

            // Calcular IMSS
            var diasCotizar = (int)(diasTrabajados + parametros.DiasVacaciones);
            var resultadoImss = _calculadorImss.Calcular(
                empleado.SalarioBaseCotizacion.Cantidad,
                diasCotizar,
                parametros.PrimaRiesgoTrabajo);

            // ===================================
            // DEDUCCIONES
            // ===================================

            // IMSS (cuota obrera)
            if (resultadoImss.TotalCuotaObrera > 0)
            {
                nomina.AgregarDeduccion(DeduccionNomina.Crear(
                    nomina.Id,
                    TipoDeduccionNomina.IMSS,
                    "001",
                    "IMSS (Cuota Obrera)",
                    resultadoImss.TotalCuotaObrera));
            }

            // ISR
            if (resultadoIsr.IsrRetener > 0)
            {
                nomina.AgregarDeduccion(DeduccionNomina.Crear(
                    nomina.Id,
                    TipoDeduccionNomina.ISR,
                    "002",
                    "ISR",
                    resultadoIsr.IsrRetener));
            }

            // INFONAVIT
            if (empleado.TieneCreditoInfonavit && empleado.TipoDescuentoInfonavit.HasValue)
            {
                var descuentoInfonavit = _calculadorImss.CalcularDescuentoInfonavit(
                    empleado.SalarioBaseCotizacion.Cantidad,
                    diasPeriodo,
                    (TipoDescuentoInfonavit)(int)empleado.TipoDescuentoInfonavit.Value,
                    empleado.ValorDescuentoInfonavit ?? 0);

                if (descuentoInfonavit > 0)
                {
                    nomina.AgregarDeduccion(DeduccionNomina.Crear(
                        nomina.Id,
                        TipoDeduccionNomina.Infonavit,
                        "010",
                        "Crédito INFONAVIT",
                        descuentoInfonavit));
                }
            }

            // Deducciones adicionales configuradas
            foreach (var deduccionAdicional in parametros.DeduccionesAdicionales)
            {
                nomina.AgregarDeduccion(DeduccionNomina.Crear(
                    nomina.Id,
                    deduccionAdicional.Tipo,
                    deduccionAdicional.Clave,
                    deduccionAdicional.Descripcion,
                    deduccionAdicional.Importe));
            }

            // ===================================
            // OTROS PAGOS
            // ===================================

            // Subsidio al empleo (si aplica)
            if (empleado.AplicaSubsidioEmpleo && resultadoIsr.SubsidioAplicable > 0)
            {
                if (resultadoIsr.SubsidioExcede)
                {
                    // El subsidio se paga al trabajador
                    nomina.AgregarOtroPago(OtroPagoNomina.Crear(
                        nomina.Id,
                        TipoOtroPagoNomina.SubsidioEmpleo,
                        "002",
                        "Subsidio para el empleo",
                        resultadoIsr.SubsidioAEntregar,
                        subsidioCausado: resultadoIsr.SubsidioAplicable));
                }
                else
                {
                    // Solo se registra el subsidio causado
                    nomina.AgregarOtroPago(OtroPagoNomina.Crear(
                        nomina.Id,
                        TipoOtroPagoNomina.SubsidioEmpleo,
                        "002",
                        "Subsidio para el empleo (aplicado a ISR)",
                        0,
                        subsidioCausado: resultadoIsr.SubsidioAplicable));
                }
            }

            // Finalizar cálculo
            nomina.MarcarCalculoCompletado(usuarioCalculoId);
        }
        catch (Exception ex)
        {
            nomina.MarcarCalculoError($"Error en cálculo: {ex.Message}", usuarioCalculoId);
        }

        return nomina;
    }

    /// <summary>
    /// Obtiene los días del periodo según la periodicidad.
    /// </summary>
    private static int ObtenerDiasPeriodo(PeriodicidadNomina periodicidad)
    {
        return periodicidad switch
        {
            PeriodicidadNomina.Diario => 1,
            PeriodicidadNomina.Semanal => 7,
            PeriodicidadNomina.Catorcenal => 14,
            PeriodicidadNomina.Quincenal => 15,
            PeriodicidadNomina.Mensual => 30,
            PeriodicidadNomina.Decenal => 10,
            _ => 15
        };
    }
}

/// <summary>
/// Parámetros para el cálculo de nómina.
/// </summary>
public class ParametrosCalculoNomina
{
    public string NombreDepartamento { get; set; } = string.Empty;
    public string NombrePuesto { get; set; } = string.Empty;
    public decimal PrimaRiesgoTrabajo { get; set; } = 7.58875m;

    public decimal DiasIncapacidad { get; set; }
    public decimal DiasFaltas { get; set; }
    public decimal DiasVacaciones { get; set; }
    public bool AplicaPrimaVacacional { get; set; }

    public decimal HorasExtraDobles { get; set; }
    public decimal HorasExtraTriples { get; set; }
    public int DominicalesTrabajados { get; set; }

    public List<PercepcionAdicional> PercepcionesAdicionales { get; set; } = new();
    public List<DeduccionAdicional> DeduccionesAdicionales { get; set; } = new();
}

/// <summary>
/// Percepción adicional para el cálculo.
/// </summary>
public class PercepcionAdicional
{
    public TipoPercepcionNomina Tipo { get; set; }
    public string Clave { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal ImporteGravado { get; set; }
    public decimal ImporteExento { get; set; }
}

/// <summary>
/// Deducción adicional para el cálculo.
/// </summary>
public class DeduccionAdicional
{
    public TipoDeduccionNomina Tipo { get; set; }
    public string Clave { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Importe { get; set; }
}
