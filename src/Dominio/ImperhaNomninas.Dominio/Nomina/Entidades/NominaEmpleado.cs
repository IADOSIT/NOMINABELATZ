// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Nómina del Empleado
// ===================================

using ImperhaNomninas.Dominio.Compartido.Entidades;
using ImperhaNomninas.Dominio.Compartido.ValorObjeto;
using ImperhaNomninas.Dominio.Nomina.Enumeraciones;

namespace ImperhaNomninas.Dominio.Nomina.Entidades;

/// <summary>
/// Representa el cálculo de nómina de un empleado para un periodo específico.
/// </summary>
public class NominaEmpleado : EntidadAuditable
{
    /// <summary>
    /// ID del periodo de nómina.
    /// </summary>
    public Guid PeriodoNominaId { get; private set; }

    /// <summary>
    /// ID del empleado.
    /// </summary>
    public Guid EmpleadoId { get; private set; }

    /// <summary>
    /// Número de empleado (snapshot).
    /// </summary>
    public string NumeroEmpleado { get; private set; } = string.Empty;

    /// <summary>
    /// Nombre completo del empleado (snapshot).
    /// </summary>
    public string NombreCompleto { get; private set; } = string.Empty;

    /// <summary>
    /// RFC del empleado (snapshot).
    /// </summary>
    public string Rfc { get; private set; } = string.Empty;

    /// <summary>
    /// CURP del empleado (snapshot).
    /// </summary>
    public string Curp { get; private set; } = string.Empty;

    /// <summary>
    /// NSS del empleado (snapshot).
    /// </summary>
    public string Nss { get; private set; } = string.Empty;

    /// <summary>
    /// Departamento del empleado (snapshot).
    /// </summary>
    public string Departamento { get; private set; } = string.Empty;

    /// <summary>
    /// Puesto del empleado (snapshot).
    /// </summary>
    public string Puesto { get; private set; } = string.Empty;

    // ============ DATOS SALARIALES DEL PERIODO ============

    /// <summary>
    /// Salario diario del periodo.
    /// </summary>
    public Dinero SalarioDiario { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Salario diario integrado del periodo.
    /// </summary>
    public Dinero SalarioDiarioIntegrado { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Salario base de cotización del periodo.
    /// </summary>
    public Dinero SalarioBaseCotizacion { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Días trabajados en el periodo.
    /// </summary>
    public decimal DiasTrabajados { get; private set; }

    /// <summary>
    /// Días de incapacidad en el periodo.
    /// </summary>
    public decimal DiasIncapacidad { get; private set; }

    /// <summary>
    /// Días de faltas en el periodo.
    /// </summary>
    public decimal DiasFaltas { get; private set; }

    /// <summary>
    /// Días de vacaciones en el periodo.
    /// </summary>
    public decimal DiasVacaciones { get; private set; }

    /// <summary>
    /// Horas extra dobles del periodo.
    /// </summary>
    public decimal HorasExtraDobles { get; private set; }

    /// <summary>
    /// Horas extra triples del periodo.
    /// </summary>
    public decimal HorasExtraTriples { get; private set; }

    // ============ TOTALES ============

    /// <summary>
    /// Total de percepciones gravadas.
    /// </summary>
    public Dinero TotalPercepcionesGravadas { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Total de percepciones exentas.
    /// </summary>
    public Dinero TotalPercepcionesExentas { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Total de percepciones (gravadas + exentas).
    /// </summary>
    public Dinero TotalPercepciones { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Total de deducciones.
    /// </summary>
    public Dinero TotalDeducciones { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Total de otros pagos (subsidio al empleo, etc.).
    /// </summary>
    public Dinero TotalOtrosPagos { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Neto a pagar.
    /// </summary>
    public Dinero NetoAPagar { get; private set; } = Dinero.Cero;

    // ============ ISR ============

    /// <summary>
    /// Base gravable para ISR.
    /// </summary>
    public Dinero BaseGravableIsr { get; private set; } = Dinero.Cero;

    /// <summary>
    /// ISR antes de subsidio.
    /// </summary>
    public Dinero IsrAntesSubsidio { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Subsidio al empleo aplicado.
    /// </summary>
    public Dinero SubsidioEmpleoAplicado { get; private set; } = Dinero.Cero;

    /// <summary>
    /// ISR a retener.
    /// </summary>
    public Dinero IsrRetener { get; private set; } = Dinero.Cero;

    // ============ IMSS ============

    /// <summary>
    /// Cuota obrera IMSS.
    /// </summary>
    public Dinero CuotaObreraImss { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Cuota patronal IMSS (informativo).
    /// </summary>
    public Dinero CuotaPatronalImss { get; private set; } = Dinero.Cero;

    // ============ INFONAVIT ============

    /// <summary>
    /// Descuento INFONAVIT del periodo.
    /// </summary>
    public Dinero DescuentoInfonavit { get; private set; } = Dinero.Cero;

    // ============ ESTATUS ============

    /// <summary>
    /// Estatus del cálculo.
    /// </summary>
    public EstatusCalculoNomina Estatus { get; private set; }

    /// <summary>
    /// Fecha del cálculo.
    /// </summary>
    public DateTime? FechaCalculo { get; private set; }

    /// <summary>
    /// Errores de cálculo (si los hay).
    /// </summary>
    public string? ErroresCalculo { get; private set; }

    // ============ CFDI ============

    /// <summary>
    /// UUID del CFDI timbrado.
    /// </summary>
    public string? UuidCfdi { get; private set; }

    /// <summary>
    /// Fecha de timbrado.
    /// </summary>
    public DateTime? FechaTimbrado { get; private set; }

    /// <summary>
    /// Estatus del CFDI.
    /// </summary>
    public EstatusCfdi EstatusCfdi { get; private set; }

    // ============ RELACIONES ============

    private readonly List<PercepcionNomina> _percepciones = new();
    private readonly List<DeduccionNomina> _deducciones = new();
    private readonly List<OtroPagoNomina> _otrosPagos = new();

    public IReadOnlyCollection<PercepcionNomina> Percepciones => _percepciones.AsReadOnly();
    public IReadOnlyCollection<DeduccionNomina> Deducciones => _deducciones.AsReadOnly();
    public IReadOnlyCollection<OtroPagoNomina> OtrosPagos => _otrosPagos.AsReadOnly();

    // ============ CONSTRUCTOR ============

    private NominaEmpleado() : base() { }

    /// <summary>
    /// Crea una nueva nómina de empleado para calcular.
    /// </summary>
    public static NominaEmpleado Crear(
        Guid empresaId,
        Guid ingenioId,
        Guid periodoNominaId,
        Guid empleadoId,
        string numeroEmpleado,
        string nombreCompleto,
        string rfc,
        string curp,
        string nss,
        string departamento,
        string puesto,
        decimal salarioDiario,
        decimal salarioDiarioIntegrado,
        decimal salarioBaseCotizacion,
        Guid usuarioCreadorId)
    {
        var nomina = new NominaEmpleado
        {
            PeriodoNominaId = periodoNominaId,
            EmpleadoId = empleadoId,
            NumeroEmpleado = numeroEmpleado,
            NombreCompleto = nombreCompleto,
            Rfc = rfc,
            Curp = curp,
            Nss = nss,
            Departamento = departamento,
            Puesto = puesto,
            SalarioDiario = Dinero.Pesos(salarioDiario),
            SalarioDiarioIntegrado = Dinero.Pesos(salarioDiarioIntegrado),
            SalarioBaseCotizacion = Dinero.Pesos(salarioBaseCotizacion),
            Estatus = EstatusCalculoNomina.Pendiente,
            EstatusCfdi = EstatusCfdi.Pendiente
        };

        nomina.EstablecerContextoEmpresa(empresaId, ingenioId);
        nomina.EstablecerCreacion(usuarioCreadorId);

        return nomina;
    }

    // ============ MÉTODOS DE CÁLCULO ============

    /// <summary>
    /// Establece los días del periodo.
    /// </summary>
    public void EstablecerDiasPeriodo(
        decimal diasTrabajados,
        decimal diasIncapacidad,
        decimal diasFaltas,
        decimal diasVacaciones)
    {
        DiasTrabajados = diasTrabajados;
        DiasIncapacidad = diasIncapacidad;
        DiasFaltas = diasFaltas;
        DiasVacaciones = diasVacaciones;
    }

    /// <summary>
    /// Establece las horas extra del periodo.
    /// </summary>
    public void EstablecerHorasExtra(decimal horasDobles, decimal horasTriples)
    {
        HorasExtraDobles = horasDobles;
        HorasExtraTriples = horasTriples;
    }

    /// <summary>
    /// Agrega una percepción al cálculo.
    /// </summary>
    public void AgregarPercepcion(PercepcionNomina percepcion)
    {
        _percepciones.Add(percepcion);
    }

    /// <summary>
    /// Agrega una deducción al cálculo.
    /// </summary>
    public void AgregarDeduccion(DeduccionNomina deduccion)
    {
        _deducciones.Add(deduccion);
    }

    /// <summary>
    /// Agrega un otro pago al cálculo.
    /// </summary>
    public void AgregarOtroPago(OtroPagoNomina otroPago)
    {
        _otrosPagos.Add(otroPago);
    }

    /// <summary>
    /// Calcula los totales de la nómina.
    /// </summary>
    public void CalcularTotales()
    {
        // Calcular percepciones
        TotalPercepcionesGravadas = Dinero.Pesos(_percepciones.Sum(p => p.ImporteGravado));
        TotalPercepcionesExentas = Dinero.Pesos(_percepciones.Sum(p => p.ImporteExento));
        TotalPercepciones = TotalPercepcionesGravadas + TotalPercepcionesExentas;

        // Calcular deducciones
        TotalDeducciones = Dinero.Pesos(_deducciones.Sum(d => d.Importe));

        // Calcular otros pagos
        TotalOtrosPagos = Dinero.Pesos(_otrosPagos.Sum(o => o.Importe));

        // Calcular neto
        NetoAPagar = TotalPercepciones - TotalDeducciones + TotalOtrosPagos;

        // Extraer ISR e IMSS de las deducciones
        var deduccionIsr = _deducciones.FirstOrDefault(d => d.TipoDeduccion == TipoDeduccionNomina.ISR);
        var deduccionImss = _deducciones.FirstOrDefault(d => d.TipoDeduccion == TipoDeduccionNomina.IMSS);
        var deduccionInfonavit = _deducciones.FirstOrDefault(d => d.TipoDeduccion == TipoDeduccionNomina.Infonavit);

        if (deduccionIsr != null)
            IsrRetener = Dinero.Pesos(deduccionIsr.Importe);

        if (deduccionImss != null)
            CuotaObreraImss = Dinero.Pesos(deduccionImss.Importe);

        if (deduccionInfonavit != null)
            DescuentoInfonavit = Dinero.Pesos(deduccionInfonavit.Importe);

        // Extraer subsidio de otros pagos
        var subsidio = _otrosPagos.FirstOrDefault(o => o.TipoOtroPago == TipoOtroPagoNomina.SubsidioEmpleo);
        if (subsidio != null)
            SubsidioEmpleoAplicado = Dinero.Pesos(subsidio.Importe);
    }

    /// <summary>
    /// Marca el cálculo como completado.
    /// </summary>
    public void MarcarCalculoCompletado(Guid usuarioId)
    {
        CalcularTotales();
        Estatus = EstatusCalculoNomina.Calculado;
        FechaCalculo = DateTime.UtcNow;
        ErroresCalculo = null;
        MarcarComoModificado(usuarioId);
    }

    /// <summary>
    /// Marca el cálculo con error.
    /// </summary>
    public void MarcarCalculoError(string errores, Guid usuarioId)
    {
        Estatus = EstatusCalculoNomina.Error;
        ErroresCalculo = errores;
        MarcarComoModificado(usuarioId);
    }

    /// <summary>
    /// Registra el timbrado del CFDI.
    /// </summary>
    public void RegistrarTimbrado(string uuid, DateTime fechaTimbrado, Guid usuarioId)
    {
        UuidCfdi = uuid;
        FechaTimbrado = fechaTimbrado;
        EstatusCfdi = EstatusCfdi.Timbrado;
        MarcarComoModificado(usuarioId);
    }

    /// <summary>
    /// Registra la cancelación del CFDI.
    /// </summary>
    public void RegistrarCancelacion(Guid usuarioId)
    {
        EstatusCfdi = EstatusCfdi.Cancelado;
        MarcarComoModificado(usuarioId);
        AgregarNotaAuditoria($"CFDI cancelado: {UuidCfdi}");
    }
}
