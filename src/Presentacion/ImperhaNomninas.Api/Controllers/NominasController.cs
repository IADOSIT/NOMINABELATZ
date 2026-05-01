// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Controlador de Nóminas
// ===================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ImperhaNomninas.Api.Controllers.Base;
using ImperhaNomninas.Aplicacion.Contratos.Nomina;
using ImperhaNomninas.Aplicacion.Contratos.Comun;
using ImperhaNomninas.Infraestructura.Persistencia.Contexto;
using ImperhaNomninas.Dominio.Nomina.Entidades;
using ImperhaNomninas.Dominio.Nomina.Enumeraciones;
using ImperhaNomninas.Dominio.Nomina.Servicios;

namespace ImperhaNomninas.Api.Controllers;

/// <summary>
/// Controlador para gestión de nóminas.
/// </summary>
[Authorize]
public class NominasController : ControladorBase
{
    private readonly ImperhaDbContext _contexto;
    private readonly ILogger<NominasController> _logger;
    private readonly MotorCalculoNomina _motorCalculo;

    public NominasController(
        ImperhaDbContext contexto,
        ILogger<NominasController> logger)
    {
        _contexto = contexto;
        _logger = logger;
        _motorCalculo = new MotorCalculoNomina();
    }

    // ===================================
    // PERIODOS DE NÓMINA
    // ===================================

    /// <summary>
    /// Obtiene la lista de periodos de nómina.
    /// </summary>
    [HttpGet("periodos")]
    [Authorize(Policy = "Consulta")]
    [ProducesResponseType(typeof(RespuestaApi<RespuestaPaginada<PeriodoNominaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaPaginada<PeriodoNominaDto>>> ObtenerPeriodos(
        [FromQuery] int? ejercicio = null,
        [FromQuery] int? tipoNomina = null,
        [FromQuery] SolicitudPaginacion? paginacion = null,
        CancellationToken cancellationToken = default)
    {
        paginacion ??= new SolicitudPaginacion();

        var query = _contexto.PeriodosNomina
            .Where(p => p.EmpresaId == EmpresaActualId);

        if (IngenioActualId.HasValue)
            query = query.Where(p => p.IngenioId == IngenioActualId.Value);

        if (ejercicio.HasValue)
            query = query.Where(p => p.Ejercicio == ejercicio.Value);

        if (tipoNomina.HasValue)
            query = query.Where(p => (int)p.TipoNomina == tipoNomina.Value);

        var total = await query.CountAsync(cancellationToken);

        var periodos = await query
            .OrderByDescending(p => p.Ejercicio)
            .ThenByDescending(p => p.NumeroPeriodo)
            .Skip((paginacion.Pagina - 1) * paginacion.ElementosPorPagina)
            .Take(paginacion.ElementosPorPagina)
            .Select(p => new PeriodoNominaDto
            {
                Id = p.Id,
                NumeroPeriodo = p.NumeroPeriodo,
                Ejercicio = p.Ejercicio,
                TipoNomina = p.TipoNomina.ToString(),
                Periodicidad = p.Periodicidad.ToString(),
                FechaInicio = p.FechaInicio,
                FechaFin = p.FechaFin,
                FechaPago = p.FechaPago,
                Estatus = p.Estatus.ToString(),
                Descripcion = p.Descripcion,
                EsPeriodoZafra = p.EsPeriodoZafra,
                TotalPercepciones = p.TotalPercepciones,
                TotalDeducciones = p.TotalDeducciones,
                TotalNeto = p.TotalNeto,
                EmpleadosProcesados = p.EmpleadosProcesados,
                FechaCierre = p.FechaCierre
            })
            .ToListAsync(cancellationToken);

        var respuesta = RespuestaPaginada<PeriodoNominaDto>.Crear(
            periodos,
            paginacion.Pagina,
            paginacion.ElementosPorPagina,
            total);

        return Exitoso(respuesta);
    }

    /// <summary>
    /// Obtiene un periodo de nómina por ID.
    /// </summary>
    [HttpGet("periodos/{id:guid}")]
    [Authorize(Policy = "Consulta")]
    [ProducesResponseType(typeof(RespuestaApi<PeriodoNominaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PeriodoNominaDto>> ObtenerPeriodo(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var periodo = await _contexto.PeriodosNomina
            .FirstOrDefaultAsync(p => p.Id == id && p.EmpresaId == EmpresaActualId, cancellationToken);

        if (periodo == null)
            return NoEncontrado($"No se encontró el periodo con ID: {id}");

        var dto = new PeriodoNominaDto
        {
            Id = periodo.Id,
            NumeroPeriodo = periodo.NumeroPeriodo,
            Ejercicio = periodo.Ejercicio,
            TipoNomina = periodo.TipoNomina.ToString(),
            Periodicidad = periodo.Periodicidad.ToString(),
            FechaInicio = periodo.FechaInicio,
            FechaFin = periodo.FechaFin,
            FechaPago = periodo.FechaPago,
            Estatus = periodo.Estatus.ToString(),
            Descripcion = periodo.Descripcion,
            EsPeriodoZafra = periodo.EsPeriodoZafra,
            TotalPercepciones = periodo.TotalPercepciones,
            TotalDeducciones = periodo.TotalDeducciones,
            TotalNeto = periodo.TotalNeto,
            EmpleadosProcesados = periodo.EmpleadosProcesados,
            FechaCierre = periodo.FechaCierre
        };

        return Exitoso(dto);
    }

    /// <summary>
    /// Crea un nuevo periodo de nómina.
    /// </summary>
    [HttpPost("periodos")]
    [Authorize(Policy = "Nominas")]
    [ProducesResponseType(typeof(RespuestaApi<PeriodoNominaDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PeriodoNominaDto>> CrearPeriodo(
        [FromBody] CrearPeriodoNominaDto dto,
        CancellationToken cancellationToken = default)
    {
        // Obtener el siguiente número de periodo
        var ultimoPeriodo = await _contexto.PeriodosNomina
            .Where(p => p.EmpresaId == EmpresaActualId &&
                       p.IngenioId == IngenioActualId &&
                       p.Ejercicio == dto.Ejercicio &&
                       p.TipoNomina == (TipoNomina)dto.TipoNomina)
            .OrderByDescending(p => p.NumeroPeriodo)
            .FirstOrDefaultAsync(cancellationToken);

        var numeroPeriodo = (ultimoPeriodo?.NumeroPeriodo ?? 0) + 1;

        var periodo = PeriodoNomina.Crear(
            empresaId: EmpresaActualId,
            ingenioId: IngenioActualId ?? EmpresaActualId,
            numeroPeriodo: numeroPeriodo,
            ejercicio: dto.Ejercicio,
            tipoNomina: (TipoNomina)dto.TipoNomina,
            periodicidad: (PeriodicidadNomina)dto.Periodicidad,
            fechaInicio: dto.FechaInicio,
            fechaFin: dto.FechaFin,
            fechaPago: dto.FechaPago,
            esPeriodoZafra: dto.EsPeriodoZafra,
            usuarioCreadorId: UsuarioActualId);

        _contexto.PeriodosNomina.Add(periodo);
        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Periodo de nómina creado: {Descripcion}", periodo.Descripcion);

        var respuestaDto = new PeriodoNominaDto
        {
            Id = periodo.Id,
            NumeroPeriodo = periodo.NumeroPeriodo,
            Ejercicio = periodo.Ejercicio,
            TipoNomina = periodo.TipoNomina.ToString(),
            Periodicidad = periodo.Periodicidad.ToString(),
            FechaInicio = periodo.FechaInicio,
            FechaFin = periodo.FechaFin,
            FechaPago = periodo.FechaPago,
            Estatus = periodo.Estatus.ToString(),
            Descripcion = periodo.Descripcion,
            EsPeriodoZafra = periodo.EsPeriodoZafra
        };

        return Creado(nameof(ObtenerPeriodo), new { id = periodo.Id }, respuestaDto);
    }

    // ===================================
    // CÁLCULO DE NÓMINA
    // ===================================

    /// <summary>
    /// Calcula la nómina para un periodo.
    /// </summary>
    [HttpPost("periodos/{periodoId:guid}/calcular")]
    [Authorize(Policy = "Nominas")]
    [ProducesResponseType(typeof(RespuestaApi<ResumenNominaPeriodoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ResumenNominaPeriodoDto>> CalcularNomina(
        Guid periodoId,
        [FromBody] SolicitudCalculoNominaDto solicitud,
        CancellationToken cancellationToken = default)
    {
        var periodo = await _contexto.PeriodosNomina
            .FirstOrDefaultAsync(p => p.Id == periodoId && p.EmpresaId == EmpresaActualId, cancellationToken);

        if (periodo == null)
            return NoEncontrado($"No se encontró el periodo con ID: {periodoId}");

        if (!periodo.PermiteModificaciones())
            return ErrorValidacion("El periodo no permite modificaciones. Ya está cerrado o timbrado.");

        // Abrir periodo para cálculo
        periodo.AbrirParaCalculo(UsuarioActualId);

        // Obtener empleados a calcular
        var queryEmpleados = _contexto.Empleados
            .Where(e => e.EmpresaId == EmpresaActualId &&
                       e.IngenioId == periodo.IngenioId &&
                       e.EstatusLaboral == Dominio.RecursosHumanos.Enumeraciones.EstatusLaboral.Activo);

        if (solicitud.EmpleadosIds != null && solicitud.EmpleadosIds.Any())
            queryEmpleados = queryEmpleados.Where(e => solicitud.EmpleadosIds.Contains(e.Id));

        var empleados = await queryEmpleados.ToListAsync(cancellationToken);

        var totalPercepciones = 0m;
        var totalDeducciones = 0m;
        var empleadosProcesados = 0;
        var empleadosConError = 0;

        foreach (var empleado in empleados)
        {
            try
            {
                var parametros = new ParametrosCalculoNomina
                {
                    NombreDepartamento = "Departamento", // Obtener de catálogo
                    NombrePuesto = "Puesto", // Obtener de catálogo
                    PrimaRiesgoTrabajo = 7.58875m // Obtener del ingenio
                };

                var nominaEmpleado = _motorCalculo.CalcularNomina(
                    empleado,
                    periodo,
                    parametros,
                    UsuarioActualId);

                _contexto.NominasEmpleados.Add(nominaEmpleado);

                totalPercepciones += nominaEmpleado.TotalPercepciones.Cantidad;
                totalDeducciones += nominaEmpleado.TotalDeducciones.Cantidad;
                empleadosProcesados++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al calcular nómina del empleado {NumeroEmpleado}",
                    empleado.NumeroEmpleado);
                empleadosConError++;
            }
        }

        // Marcar periodo como calculado
        periodo.MarcarComoCalculado(totalPercepciones, totalDeducciones, empleadosProcesados, UsuarioActualId);

        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Nómina calculada: {Periodo} - {Empleados} empleados procesados",
            periodo.Descripcion, empleadosProcesados);

        var resumen = new ResumenNominaPeriodoDto
        {
            PeriodoId = periodo.Id,
            Descripcion = periodo.Descripcion,
            TotalEmpleados = empleados.Count,
            EmpleadosCalculados = empleadosProcesados,
            EmpleadosConError = empleadosConError,
            EmpleadosPendientes = 0,
            TotalPercepciones = totalPercepciones,
            TotalDeducciones = totalDeducciones,
            TotalNetoPagar = totalPercepciones - totalDeducciones
        };

        return Exitoso(resumen);
    }

    /// <summary>
    /// Obtiene las nóminas de empleados de un periodo.
    /// </summary>
    [HttpGet("periodos/{periodoId:guid}/empleados")]
    [Authorize(Policy = "Consulta")]
    [ProducesResponseType(typeof(RespuestaApi<RespuestaPaginada<NominaEmpleadoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaPaginada<NominaEmpleadoDto>>> ObtenerNominasEmpleados(
        Guid periodoId,
        [FromQuery] SolicitudPaginacion? paginacion = null,
        CancellationToken cancellationToken = default)
    {
        paginacion ??= new SolicitudPaginacion();

        var query = _contexto.NominasEmpleados
            .Where(n => n.PeriodoNominaId == periodoId && n.EmpresaId == EmpresaActualId);

        var total = await query.CountAsync(cancellationToken);

        var nominas = await query
            .OrderBy(n => n.NumeroEmpleado)
            .Skip((paginacion.Pagina - 1) * paginacion.ElementosPorPagina)
            .Take(paginacion.ElementosPorPagina)
            .Select(n => new NominaEmpleadoDto
            {
                Id = n.Id,
                PeriodoNominaId = n.PeriodoNominaId,
                EmpleadoId = n.EmpleadoId,
                NumeroEmpleado = n.NumeroEmpleado,
                NombreCompleto = n.NombreCompleto,
                Rfc = n.Rfc,
                Curp = n.Curp,
                Nss = n.Nss,
                Departamento = n.Departamento,
                Puesto = n.Puesto,
                SalarioDiario = n.SalarioDiario.Cantidad,
                SalarioDiarioIntegrado = n.SalarioDiarioIntegrado.Cantidad,
                DiasTrabajados = n.DiasTrabajados,
                TotalPercepciones = n.TotalPercepciones.Cantidad,
                TotalDeducciones = n.TotalDeducciones.Cantidad,
                NetoAPagar = n.NetoAPagar.Cantidad,
                IsrRetener = n.IsrRetener.Cantidad,
                CuotaObreraImss = n.CuotaObreraImss.Cantidad,
                Estatus = n.Estatus.ToString(),
                FechaCalculo = n.FechaCalculo,
                UuidCfdi = n.UuidCfdi,
                FechaTimbrado = n.FechaTimbrado,
                EstatusCfdi = n.EstatusCfdi.ToString()
            })
            .ToListAsync(cancellationToken);

        var respuesta = RespuestaPaginada<NominaEmpleadoDto>.Crear(
            nominas,
            paginacion.Pagina,
            paginacion.ElementosPorPagina,
            total);

        return Exitoso(respuesta);
    }

    /// <summary>
    /// Cierra un periodo de nómina.
    /// </summary>
    [HttpPost("periodos/{periodoId:guid}/cerrar")]
    [Authorize(Policy = "Nominas")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> CerrarPeriodo(
        Guid periodoId,
        CancellationToken cancellationToken = default)
    {
        var periodo = await _contexto.PeriodosNomina
            .FirstOrDefaultAsync(p => p.Id == periodoId && p.EmpresaId == EmpresaActualId, cancellationToken);

        if (periodo == null)
            return NoEncontrado($"No se encontró el periodo con ID: {periodoId}");

        // Generar hash de integridad
        var hashIntegridad = GenerarHashCierre(periodo);

        periodo.CerrarPeriodo(hashIntegridad, UsuarioActualId);

        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Periodo cerrado: {Descripcion} - Hash: {Hash}",
            periodo.Descripcion, hashIntegridad);

        return ExitosoSinContenido();
    }

    /// <summary>
    /// Genera un hash de integridad para el cierre del periodo.
    /// </summary>
    private static string GenerarHashCierre(PeriodoNomina periodo)
    {
        var datos = $"{periodo.Id}|{periodo.TotalPercepciones}|{periodo.TotalDeducciones}|{periodo.EmpleadosProcesados}|{DateTime.UtcNow:O}";
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(datos));
        return Convert.ToBase64String(hash);
    }
}
