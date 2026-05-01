// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Entidad Empleado (Agregado Raíz)
// ===================================

using ImperhaNomninas.Dominio.Compartido.Entidades;
using ImperhaNomninas.Dominio.Compartido.ValorObjeto;
using ImperhaNomninas.Dominio.RecursosHumanos.Enumeraciones;
using ImperhaNomninas.Dominio.RecursosHumanos.Eventos;

namespace ImperhaNomninas.Dominio.RecursosHumanos.Entidades;

/// <summary>
/// Representa un empleado del ingenio azucarero.
/// Es el agregado raíz del módulo de Recursos Humanos.
/// </summary>
public class Empleado : EntidadAuditable
{
    // ============ IDENTIFICACIÓN ============

    /// <summary>
    /// Número de empleado único dentro del ingenio.
    /// </summary>
    public string NumeroEmpleado { get; private set; } = string.Empty;

    /// <summary>
    /// CURP del empleado.
    /// </summary>
    public Curp Curp { get; private set; } = null!;

    /// <summary>
    /// RFC del empleado.
    /// </summary>
    public Rfc Rfc { get; private set; } = null!;

    /// <summary>
    /// Número de Seguro Social (IMSS).
    /// </summary>
    public NumeroSeguroSocial Nss { get; private set; } = null!;

    // ============ DATOS PERSONALES ============

    /// <summary>
    /// Nombre(s) del empleado.
    /// </summary>
    public string Nombres { get; private set; } = string.Empty;

    /// <summary>
    /// Primer apellido.
    /// </summary>
    public string ApellidoPaterno { get; private set; } = string.Empty;

    /// <summary>
    /// Segundo apellido.
    /// </summary>
    public string? ApellidoMaterno { get; private set; }

    /// <summary>
    /// Fecha de nacimiento.
    /// </summary>
    public DateTime FechaNacimiento { get; private set; }

    /// <summary>
    /// Género del empleado.
    /// </summary>
    public Genero Genero { get; private set; }

    /// <summary>
    /// Estado civil.
    /// </summary>
    public EstadoCivil EstadoCivil { get; private set; }

    /// <summary>
    /// Nacionalidad.
    /// </summary>
    public string Nacionalidad { get; private set; } = "Mexicana";

    /// <summary>
    /// Lugar de nacimiento (estado).
    /// </summary>
    public string? LugarNacimiento { get; private set; }

    // ============ CONTACTO ============

    /// <summary>
    /// Correo electrónico personal.
    /// </summary>
    public string? CorreoPersonal { get; private set; }

    /// <summary>
    /// Correo electrónico institucional.
    /// </summary>
    public string? CorreoInstitucional { get; private set; }

    /// <summary>
    /// Teléfono celular.
    /// </summary>
    public string? TelefonoCelular { get; private set; }

    /// <summary>
    /// Teléfono de casa.
    /// </summary>
    public string? TelefonoCasa { get; private set; }

    // ============ DOMICILIO ============

    /// <summary>
    /// Calle del domicilio.
    /// </summary>
    public string? DomicilioCalle { get; private set; }

    /// <summary>
    /// Número exterior.
    /// </summary>
    public string? DomicilioNumeroExterior { get; private set; }

    /// <summary>
    /// Número interior.
    /// </summary>
    public string? DomicilioNumeroInterior { get; private set; }

    /// <summary>
    /// Colonia.
    /// </summary>
    public string? DomicilioColonia { get; private set; }

    /// <summary>
    /// Código postal.
    /// </summary>
    public string? DomicilioCodigoPostal { get; private set; }

    /// <summary>
    /// Municipio.
    /// </summary>
    public string? DomicilioMunicipio { get; private set; }

    /// <summary>
    /// Estado.
    /// </summary>
    public string? DomicilioEstado { get; private set; }

    // ============ DATOS LABORALES ============

    /// <summary>
    /// Fecha de ingreso a la empresa.
    /// </summary>
    public DateTime FechaIngreso { get; private set; }

    /// <summary>
    /// Fecha de antigüedad reconocida (puede diferir de ingreso).
    /// </summary>
    public DateTime FechaAntiguedad { get; private set; }

    /// <summary>
    /// Fecha de alta en el IMSS.
    /// </summary>
    public DateTime FechaAltaImss { get; private set; }

    /// <summary>
    /// Tipo de contrato.
    /// </summary>
    public TipoContrato TipoContrato { get; private set; }

    /// <summary>
    /// Tipo de régimen laboral.
    /// </summary>
    public TipoRegimen TipoRegimen { get; private set; }

    /// <summary>
    /// Tipo de jornada laboral.
    /// </summary>
    public TipoJornada TipoJornada { get; private set; }

    /// <summary>
    /// Periodicidad de pago.
    /// </summary>
    public PeriodicidadPago PeriodicidadPago { get; private set; }

    /// <summary>
    /// Estatus laboral actual.
    /// </summary>
    public EstatusLaboral EstatusLaboral { get; private set; }

    /// <summary>
    /// Sindicalizado o de confianza.
    /// </summary>
    public TipoTrabajador TipoTrabajador { get; private set; }

    /// <summary>
    /// Es trabajador de zafra (temporal).
    /// </summary>
    public bool EsTrabajadorZafra { get; private set; }

    // ============ ESTRUCTURA ORGANIZACIONAL ============

    /// <summary>
    /// ID del departamento.
    /// </summary>
    public Guid DepartamentoId { get; private set; }

    /// <summary>
    /// ID del puesto.
    /// </summary>
    public Guid PuestoId { get; private set; }

    /// <summary>
    /// ID del centro de costo.
    /// </summary>
    public Guid? CentroCostoId { get; private set; }

    /// <summary>
    /// ID del turno asignado.
    /// </summary>
    public Guid? TurnoId { get; private set; }

    /// <summary>
    /// ID del jefe inmediato.
    /// </summary>
    public Guid? JefeInmediatoId { get; private set; }

    // ============ DATOS SALARIALES ============

    /// <summary>
    /// Salario diario.
    /// </summary>
    public Dinero SalarioDiario { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Salario diario integrado (para IMSS).
    /// </summary>
    public Dinero SalarioDiarioIntegrado { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Salario base de cotización (SBC) para IMSS.
    /// </summary>
    public Dinero SalarioBaseCotizacion { get; private set; } = Dinero.Cero;

    /// <summary>
    /// Forma de pago.
    /// </summary>
    public FormaPago FormaPago { get; private set; }

    /// <summary>
    /// Banco para depósito.
    /// </summary>
    public string? BancoDeposito { get; private set; }

    /// <summary>
    /// CLABE interbancaria.
    /// </summary>
    public string? ClabeInterbancaria { get; private set; }

    /// <summary>
    /// Número de cuenta bancaria.
    /// </summary>
    public string? NumeroCuentaBancaria { get; private set; }

    // ============ DATOS FISCALES ============

    /// <summary>
    /// Subsidio al empleo aplicable.
    /// </summary>
    public bool AplicaSubsidioEmpleo { get; private set; } = true;

    /// <summary>
    /// Crédito INFONAVIT activo.
    /// </summary>
    public bool TieneCreditoInfonavit { get; private set; }

    /// <summary>
    /// Número de crédito INFONAVIT.
    /// </summary>
    public string? NumeroCreditoInfonavit { get; private set; }

    /// <summary>
    /// Tipo de descuento INFONAVIT.
    /// </summary>
    public TipoDescuentoInfonavit? TipoDescuentoInfonavit { get; private set; }

    /// <summary>
    /// Valor del descuento INFONAVIT.
    /// </summary>
    public decimal? ValorDescuentoInfonavit { get; private set; }

    /// <summary>
    /// Fecha de inicio del descuento INFONAVIT.
    /// </summary>
    public DateTime? FechaInicioInfonavit { get; private set; }

    // ============ CONTACTO DE EMERGENCIA ============

    /// <summary>
    /// Nombre del contacto de emergencia.
    /// </summary>
    public string? ContactoEmergenciaNombre { get; private set; }

    /// <summary>
    /// Teléfono del contacto de emergencia.
    /// </summary>
    public string? ContactoEmergenciaTelefono { get; private set; }

    /// <summary>
    /// Parentesco del contacto de emergencia.
    /// </summary>
    public string? ContactoEmergenciaParentesco { get; private set; }

    // ============ DATOS BIOMÉTRICOS ============

    /// <summary>
    /// ID del empleado en el sistema biométrico.
    /// </summary>
    public string? IdBiometrico { get; private set; }

    /// <summary>
    /// Huella digital registrada.
    /// </summary>
    public bool TieneHuellaRegistrada { get; private set; }

    /// <summary>
    /// Rostro registrado.
    /// </summary>
    public bool TieneRostroRegistrado { get; private set; }

    // ============ FOTO ============

    /// <summary>
    /// Ruta de la foto del empleado.
    /// </summary>
    public string? RutaFoto { get; private set; }

    // ============ BAJA ============

    /// <summary>
    /// Fecha de baja (si aplica).
    /// </summary>
    public DateTime? FechaBaja { get; private set; }

    /// <summary>
    /// Motivo de baja.
    /// </summary>
    public MotivoBaja? MotivoBaja { get; private set; }

    /// <summary>
    /// Observaciones de la baja.
    /// </summary>
    public string? ObservacionesBaja { get; private set; }

    // ============ CONSTRUCTORES ============

    private Empleado() : base() { }

    /// <summary>
    /// Crea un nuevo empleado.
    /// </summary>
    public static Empleado Crear(
        Guid empresaId,
        Guid ingenioId,
        string numeroEmpleado,
        string curp,
        string rfc,
        string nss,
        string nombres,
        string apellidoPaterno,
        string? apellidoMaterno,
        DateTime fechaNacimiento,
        Genero genero,
        DateTime fechaIngreso,
        TipoContrato tipoContrato,
        TipoRegimen tipoRegimen,
        TipoJornada tipoJornada,
        PeriodicidadPago periodicidadPago,
        TipoTrabajador tipoTrabajador,
        Guid departamentoId,
        Guid puestoId,
        decimal salarioDiario,
        Guid usuarioCreadorId)
    {
        var empleado = new Empleado
        {
            NumeroEmpleado = numeroEmpleado?.Trim() ?? throw new ArgumentNullException(nameof(numeroEmpleado)),
            Curp = Curp.Crear(curp),
            Rfc = Rfc.Crear(rfc),
            Nss = NumeroSeguroSocial.Crear(nss),
            Nombres = nombres?.Trim().ToUpperInvariant() ?? throw new ArgumentNullException(nameof(nombres)),
            ApellidoPaterno = apellidoPaterno?.Trim().ToUpperInvariant() ?? throw new ArgumentNullException(nameof(apellidoPaterno)),
            ApellidoMaterno = apellidoMaterno?.Trim().ToUpperInvariant(),
            FechaNacimiento = fechaNacimiento,
            Genero = genero,
            EstadoCivil = EstadoCivil.Soltero,
            FechaIngreso = fechaIngreso,
            FechaAntiguedad = fechaIngreso,
            FechaAltaImss = fechaIngreso,
            TipoContrato = tipoContrato,
            TipoRegimen = tipoRegimen,
            TipoJornada = tipoJornada,
            PeriodicidadPago = periodicidadPago,
            TipoTrabajador = tipoTrabajador,
            EstatusLaboral = EstatusLaboral.Activo,
            DepartamentoId = departamentoId,
            PuestoId = puestoId,
            SalarioDiario = Dinero.Pesos(salarioDiario),
            FormaPago = FormaPago.TransferenciaBancaria
        };

        empleado.EstablecerContextoEmpresa(empresaId, ingenioId);
        empleado.EstablecerCreacion(usuarioCreadorId);
        empleado.EstablecerOrigen("MANUAL");

        // Calcular SDI inicial
        empleado.RecalcularSalarioDiarioIntegrado();

        empleado.AgregarEventoDominio(new EmpleadoContratadoEvento(
            empleado.Id,
            empleado.NumeroEmpleado,
            empleado.NombreCompleto,
            empleado.FechaIngreso));

        return empleado;
    }

    // ============ PROPIEDADES CALCULADAS ============

    /// <summary>
    /// Nombre completo del empleado.
    /// </summary>
    public string NombreCompleto => string.IsNullOrEmpty(ApellidoMaterno)
        ? $"{Nombres} {ApellidoPaterno}"
        : $"{Nombres} {ApellidoPaterno} {ApellidoMaterno}";

    /// <summary>
    /// Nombre completo en formato apellidos, nombres.
    /// </summary>
    public string NombreCompletoInverso => string.IsNullOrEmpty(ApellidoMaterno)
        ? $"{ApellidoPaterno}, {Nombres}"
        : $"{ApellidoPaterno} {ApellidoMaterno}, {Nombres}";

    /// <summary>
    /// Edad actual del empleado.
    /// </summary>
    public int Edad
    {
        get
        {
            var hoy = DateTime.Today;
            var edad = hoy.Year - FechaNacimiento.Year;
            if (FechaNacimiento.Date > hoy.AddYears(-edad)) edad--;
            return edad;
        }
    }

    /// <summary>
    /// Años de antigüedad.
    /// </summary>
    public int AniosAntiguedad
    {
        get
        {
            var hoy = DateTime.Today;
            var anios = hoy.Year - FechaAntiguedad.Year;
            if (FechaAntiguedad.Date > hoy.AddYears(-anios)) anios--;
            return anios;
        }
    }

    /// <summary>
    /// Días de vacaciones correspondientes por antigüedad.
    /// </summary>
    public int DiasVacacionesCorrespondientes
    {
        get
        {
            // Tabla de vacaciones según LFT 2023
            return AniosAntiguedad switch
            {
                1 => 12,
                2 => 14,
                3 => 16,
                4 => 18,
                5 => 20,
                >= 6 and <= 10 => 22,
                >= 11 and <= 15 => 24,
                >= 16 and <= 20 => 26,
                >= 21 and <= 25 => 28,
                >= 26 and <= 30 => 30,
                >= 31 and <= 35 => 32,
                _ => 32 + (((AniosAntiguedad - 35) / 5) * 2)
            };
        }
    }

    // ============ MÉTODOS DE DOMINIO ============

    /// <summary>
    /// Recalcula el Salario Diario Integrado.
    /// Considera: salario diario + proporción de aguinaldo + proporción de vacaciones + prima vacacional.
    /// </summary>
    public void RecalcularSalarioDiarioIntegrado()
    {
        // Factor de integración según LFT
        var diasAguinaldo = 15m; // Mínimo legal
        var diasVacaciones = DiasVacacionesCorrespondientes;
        var primaVacacionalPorcentaje = 0.25m;

        // Proporción diaria de aguinaldo
        var proporcionAguinaldo = diasAguinaldo / 365m;

        // Proporción diaria de prima vacacional
        var proporcionPrimaVacacional = (diasVacaciones * primaVacacionalPorcentaje) / 365m;

        // Factor de integración
        var factorIntegracion = 1m + proporcionAguinaldo + proporcionPrimaVacacional;

        SalarioDiarioIntegrado = SalarioDiario * factorIntegracion;

        // El SBC para IMSS tiene topes
        ActualizarSalarioBaseCotizacion();
    }

    /// <summary>
    /// Actualiza el Salario Base de Cotización considerando topes IMSS.
    /// </summary>
    private void ActualizarSalarioBaseCotizacion()
    {
        // UMA 2024: $108.57 (se debe actualizar anualmente)
        const decimal umaActual = 108.57m;
        const decimal topeSbcUmas = 25m; // 25 UMAS
        var topeSbc = umaActual * topeSbcUmas;

        if (SalarioDiarioIntegrado.Cantidad > topeSbc)
            SalarioBaseCotizacion = Dinero.Pesos(topeSbc);
        else
            SalarioBaseCotizacion = SalarioDiarioIntegrado;
    }

    /// <summary>
    /// Actualiza el salario del empleado.
    /// </summary>
    public void ActualizarSalario(decimal nuevoSalarioDiario, Guid usuarioModificadorId)
    {
        if (nuevoSalarioDiario <= 0)
            throw new ArgumentException("El salario debe ser mayor a cero", nameof(nuevoSalarioDiario));

        var salarioAnterior = SalarioDiario;
        SalarioDiario = Dinero.Pesos(nuevoSalarioDiario);

        RecalcularSalarioDiarioIntegrado();
        MarcarComoModificado(usuarioModificadorId);

        AgregarNotaAuditoria($"Cambio de salario: {salarioAnterior} -> {SalarioDiario}");
    }

    /// <summary>
    /// Da de baja al empleado.
    /// </summary>
    public void DarDeBaja(
        DateTime fechaBaja,
        MotivoBaja motivoBaja,
        string? observaciones,
        Guid usuarioModificadorId)
    {
        if (EstatusLaboral == EstatusLaboral.Baja)
            throw new InvalidOperationException("El empleado ya está dado de baja");

        if (fechaBaja < FechaIngreso)
            throw new ArgumentException("La fecha de baja no puede ser anterior a la fecha de ingreso");

        FechaBaja = fechaBaja;
        MotivoBaja = motivoBaja;
        ObservacionesBaja = observaciones;
        EstatusLaboral = EstatusLaboral.Baja;

        MarcarComoModificado(usuarioModificadorId);

        AgregarEventoDominio(new EmpleadoBajaEvento(
            Id,
            NumeroEmpleado,
            fechaBaja,
            motivoBaja));
    }

    /// <summary>
    /// Reingresa a un empleado dado de baja.
    /// </summary>
    public void Reingresar(
        DateTime fechaReingreso,
        bool conservarAntiguedad,
        Guid usuarioModificadorId)
    {
        if (EstatusLaboral != EstatusLaboral.Baja)
            throw new InvalidOperationException("Solo se puede reingresar a empleados dados de baja");

        EstatusLaboral = EstatusLaboral.Activo;
        FechaBaja = null;
        MotivoBaja = null;
        ObservacionesBaja = null;

        if (!conservarAntiguedad)
            FechaAntiguedad = fechaReingreso;

        FechaAltaImss = fechaReingreso;

        MarcarComoModificado(usuarioModificadorId);
        AgregarNotaAuditoria($"Reingreso. Conserva antigüedad: {conservarAntiguedad}");
    }

    /// <summary>
    /// Configura el crédito INFONAVIT.
    /// </summary>
    public void ConfigurarCreditoInfonavit(
        string numeroCredito,
        TipoDescuentoInfonavit tipoDescuento,
        decimal valorDescuento,
        DateTime fechaInicio,
        Guid usuarioModificadorId)
    {
        TieneCreditoInfonavit = true;
        NumeroCreditoInfonavit = numeroCredito?.Trim() ?? throw new ArgumentNullException(nameof(numeroCredito));
        TipoDescuentoInfonavit = tipoDescuento;
        ValorDescuentoInfonavit = valorDescuento;
        FechaInicioInfonavit = fechaInicio;

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Finaliza el crédito INFONAVIT.
    /// </summary>
    public void FinalizarCreditoInfonavit(Guid usuarioModificadorId)
    {
        TieneCreditoInfonavit = false;
        NumeroCreditoInfonavit = null;
        TipoDescuentoInfonavit = null;
        ValorDescuentoInfonavit = null;
        FechaInicioInfonavit = null;

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Establece los datos bancarios.
    /// </summary>
    public void EstablecerDatosBancarios(
        string banco,
        string clabe,
        string? numeroCuenta,
        Guid usuarioModificadorId)
    {
        if (string.IsNullOrWhiteSpace(clabe) || clabe.Length != 18)
            throw new ArgumentException("La CLABE debe tener 18 dígitos", nameof(clabe));

        BancoDeposito = banco?.Trim() ?? throw new ArgumentNullException(nameof(banco));
        ClabeInterbancaria = clabe.Trim();
        NumeroCuentaBancaria = numeroCuenta?.Trim();
        FormaPago = FormaPago.TransferenciaBancaria;

        MarcarComoModificado(usuarioModificadorId);
    }

    /// <summary>
    /// Cambia de departamento y/o puesto.
    /// </summary>
    public void CambiarPosicion(
        Guid nuevoDepartamentoId,
        Guid nuevoPuestoId,
        Guid? nuevoCentroCostoId,
        Guid usuarioModificadorId)
    {
        var departamentoAnterior = DepartamentoId;
        var puestoAnterior = PuestoId;

        DepartamentoId = nuevoDepartamentoId;
        PuestoId = nuevoPuestoId;
        CentroCostoId = nuevoCentroCostoId;

        MarcarComoModificado(usuarioModificadorId);
        AgregarNotaAuditoria($"Cambio de posición. Depto: {departamentoAnterior} -> {nuevoDepartamentoId}, Puesto: {puestoAnterior} -> {nuevoPuestoId}");
    }
}
