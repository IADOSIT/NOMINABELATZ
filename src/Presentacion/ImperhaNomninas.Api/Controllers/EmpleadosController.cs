// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Controlador de Empleados
// ===================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ImperhaNomninas.Api.Controllers.Base;
using ImperhaNomninas.Aplicacion.Contratos.Empleados;
using ImperhaNomninas.Aplicacion.Contratos.Comun;
using ImperhaNomninas.Infraestructura.Persistencia.Contexto;
using ImperhaNomninas.Dominio.RecursosHumanos.Entidades;
using ImperhaNomninas.Dominio.RecursosHumanos.Enumeraciones;

namespace ImperhaNomninas.Api.Controllers;

/// <summary>
/// Controlador para gestión de empleados.
/// </summary>
[Authorize]
public class EmpleadosController : ControladorBase
{
    private readonly ImperhaDbContext _contexto;
    private readonly ILogger<EmpleadosController> _logger;

    public EmpleadosController(
        ImperhaDbContext contexto,
        ILogger<EmpleadosController> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene la lista de empleados con paginación y filtros.
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "Consulta")]
    [ProducesResponseType(typeof(RespuestaApi<RespuestaPaginada<EmpleadoResumenDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaPaginada<EmpleadoResumenDto>>> ObtenerEmpleados(
        [FromQuery] SolicitudPaginacion paginacion,
        [FromQuery] FiltrosEmpleadoDto? filtros = null,
        CancellationToken cancellationToken = default)
    {
        var query = _contexto.Empleados
            .Where(e => e.EmpresaId == EmpresaActualId);

        // Aplicar filtros
        if (filtros != null)
        {
            if (filtros.IngenioId.HasValue)
                query = query.Where(e => e.IngenioId == filtros.IngenioId.Value);

            if (filtros.DepartamentoId.HasValue)
                query = query.Where(e => e.DepartamentoId == filtros.DepartamentoId.Value);

            if (filtros.PuestoId.HasValue)
                query = query.Where(e => e.PuestoId == filtros.PuestoId.Value);

            if (filtros.EstatusLaboral.HasValue)
                query = query.Where(e => (int)e.EstatusLaboral == filtros.EstatusLaboral.Value);

            if (filtros.TipoTrabajador.HasValue)
                query = query.Where(e => (int)e.TipoTrabajador == filtros.TipoTrabajador.Value);

            if (filtros.EsTrabajadorZafra.HasValue)
                query = query.Where(e => e.EsTrabajadorZafra == filtros.EsTrabajadorZafra.Value);
        }

        // Búsqueda general
        if (!string.IsNullOrWhiteSpace(paginacion.Busqueda))
        {
            var busqueda = paginacion.Busqueda.ToUpper();
            query = query.Where(e =>
                e.NumeroEmpleado.Contains(busqueda) ||
                e.Nombres.Contains(busqueda) ||
                e.ApellidoPaterno.Contains(busqueda) ||
                (e.ApellidoMaterno != null && e.ApellidoMaterno.Contains(busqueda)));
        }

        var total = await query.CountAsync(cancellationToken);

        var empleados = await query
            .OrderBy(e => e.ApellidoPaterno)
            .ThenBy(e => e.ApellidoMaterno)
            .ThenBy(e => e.Nombres)
            .Skip((paginacion.Pagina - 1) * paginacion.ElementosPorPagina)
            .Take(paginacion.ElementosPorPagina)
            .Select(e => new EmpleadoResumenDto
            {
                Id = e.Id,
                NumeroEmpleado = e.NumeroEmpleado,
                NombreCompleto = e.NombreCompleto,
                Rfc = e.Rfc.Valor,
                NombreDepartamento = "", // Se completaría con Join
                NombrePuesto = "", // Se completaría con Join
                EstatusLaboral = e.EstatusLaboral.ToString(),
                SalarioDiario = e.SalarioDiario.Cantidad,
                Activo = e.Activo,
                RutaFoto = e.RutaFoto
            })
            .ToListAsync(cancellationToken);

        var respuesta = RespuestaPaginada<EmpleadoResumenDto>.Crear(
            empleados,
            paginacion.Pagina,
            paginacion.ElementosPorPagina,
            total);

        return Exitoso(respuesta);
    }

    /// <summary>
    /// Obtiene un empleado por su ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "Consulta")]
    [ProducesResponseType(typeof(RespuestaApi<EmpleadoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EmpleadoDto>> ObtenerEmpleado(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var empleado = await _contexto.Empleados
            .FirstOrDefaultAsync(e => e.Id == id && e.EmpresaId == EmpresaActualId, cancellationToken);

        if (empleado == null)
            return NoEncontrado($"No se encontró el empleado con ID: {id}");

        var dto = MapearADto(empleado);

        return Exitoso(dto);
    }

    /// <summary>
    /// Crea un nuevo empleado.
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "RecursosHumanos")]
    [ProducesResponseType(typeof(RespuestaApi<EmpleadoDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EmpleadoDto>> CrearEmpleado(
        [FromBody] CrearEmpleadoDto dto,
        CancellationToken cancellationToken = default)
    {
        // Validar que no exista el número de empleado
        var existe = await _contexto.Empleados
            .AnyAsync(e => e.NumeroEmpleado == dto.NumeroEmpleado &&
                          e.EmpresaId == EmpresaActualId &&
                          e.IngenioId == IngenioActualId,
                      cancellationToken);

        if (existe)
            return ErrorValidacion($"Ya existe un empleado con el número: {dto.NumeroEmpleado}");

        var empleado = Empleado.Crear(
            empresaId: EmpresaActualId,
            ingenioId: IngenioActualId ?? EmpresaActualId,
            numeroEmpleado: dto.NumeroEmpleado,
            curp: dto.Curp,
            rfc: dto.Rfc,
            nss: dto.Nss,
            nombres: dto.Nombres,
            apellidoPaterno: dto.ApellidoPaterno,
            apellidoMaterno: dto.ApellidoMaterno,
            fechaNacimiento: dto.FechaNacimiento,
            genero: (Genero)dto.Genero,
            fechaIngreso: dto.FechaIngreso,
            tipoContrato: (TipoContrato)dto.TipoContrato,
            tipoRegimen: (TipoRegimen)dto.TipoRegimen,
            tipoJornada: (TipoJornada)dto.TipoJornada,
            periodicidadPago: (PeriodicidadPago)dto.PeriodicidadPago,
            tipoTrabajador: (TipoTrabajador)dto.TipoTrabajador,
            departamentoId: dto.DepartamentoId,
            puestoId: dto.PuestoId,
            salarioDiario: dto.SalarioDiario,
            usuarioCreadorId: UsuarioActualId);

        _contexto.Empleados.Add(empleado);
        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado creado: {NumeroEmpleado} - {Nombre}",
            empleado.NumeroEmpleado, empleado.NombreCompleto);

        var respuestaDto = MapearADto(empleado);

        return Creado(nameof(ObtenerEmpleado), new { id = empleado.Id }, respuestaDto);
    }

    /// <summary>
    /// Actualiza un empleado existente.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RecursosHumanos")]
    [ProducesResponseType(typeof(RespuestaApi<EmpleadoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EmpleadoDto>> ActualizarEmpleado(
        Guid id,
        [FromBody] ActualizarEmpleadoDto dto,
        CancellationToken cancellationToken = default)
    {
        var empleado = await _contexto.Empleados
            .FirstOrDefaultAsync(e => e.Id == id && e.EmpresaId == EmpresaActualId, cancellationToken);

        if (empleado == null)
            return NoEncontrado($"No se encontró el empleado con ID: {id}");

        // Actualizar campos permitidos
        empleado.MarcarComoModificado(UsuarioActualId);

        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado actualizado: {NumeroEmpleado}", empleado.NumeroEmpleado);

        var respuestaDto = MapearADto(empleado);

        return Exitoso(respuestaDto);
    }

    /// <summary>
    /// Da de baja a un empleado.
    /// </summary>
    [HttpPost("{id:guid}/baja")]
    [Authorize(Policy = "RecursosHumanos")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DarDeBajaEmpleado(
        Guid id,
        [FromBody] BajaEmpleadoDto dto,
        CancellationToken cancellationToken = default)
    {
        var empleado = await _contexto.Empleados
            .FirstOrDefaultAsync(e => e.Id == id && e.EmpresaId == EmpresaActualId, cancellationToken);

        if (empleado == null)
            return NoEncontrado($"No se encontró el empleado con ID: {id}");

        empleado.DarDeBaja(
            dto.FechaBaja,
            (MotivoBaja)dto.MotivoBaja,
            dto.Observaciones,
            UsuarioActualId);

        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado dado de baja: {NumeroEmpleado} - Motivo: {Motivo}",
            empleado.NumeroEmpleado, dto.MotivoBaja);

        return ExitosoSinContenido();
    }

    /// <summary>
    /// Actualiza el salario de un empleado.
    /// </summary>
    [HttpPut("{id:guid}/salario")]
    [Authorize(Policy = "Nominas")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ActualizarSalario(
        Guid id,
        [FromBody] decimal nuevoSalario,
        CancellationToken cancellationToken = default)
    {
        var empleado = await _contexto.Empleados
            .FirstOrDefaultAsync(e => e.Id == id && e.EmpresaId == EmpresaActualId, cancellationToken);

        if (empleado == null)
            return NoEncontrado($"No se encontró el empleado con ID: {id}");

        empleado.ActualizarSalario(nuevoSalario, UsuarioActualId);

        await _contexto.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Salario actualizado para empleado: {NumeroEmpleado} - Nuevo salario: {Salario}",
            empleado.NumeroEmpleado, nuevoSalario);

        return ExitosoSinContenido();
    }

    /// <summary>
    /// Mapea una entidad Empleado a DTO.
    /// </summary>
    private static EmpleadoDto MapearADto(Empleado empleado)
    {
        return new EmpleadoDto
        {
            Id = empleado.Id,
            NumeroEmpleado = empleado.NumeroEmpleado,
            NombreCompleto = empleado.NombreCompleto,
            Nombres = empleado.Nombres,
            ApellidoPaterno = empleado.ApellidoPaterno,
            ApellidoMaterno = empleado.ApellidoMaterno,
            Curp = empleado.Curp.Valor,
            Rfc = empleado.Rfc.Valor,
            Nss = empleado.Nss.Valor,
            FechaNacimiento = empleado.FechaNacimiento,
            Edad = empleado.Edad,
            Genero = empleado.Genero.ToString(),
            EstadoCivil = empleado.EstadoCivil.ToString(),
            CorreoPersonal = empleado.CorreoPersonal,
            CorreoInstitucional = empleado.CorreoInstitucional,
            TelefonoCelular = empleado.TelefonoCelular,
            FechaIngreso = empleado.FechaIngreso,
            AniosAntiguedad = empleado.AniosAntiguedad,
            TipoContrato = empleado.TipoContrato.ToString(),
            TipoRegimen = empleado.TipoRegimen.ToString(),
            TipoJornada = empleado.TipoJornada.ToString(),
            PeriodicidadPago = empleado.PeriodicidadPago.ToString(),
            EstatusLaboral = empleado.EstatusLaboral.ToString(),
            TipoTrabajador = empleado.TipoTrabajador.ToString(),
            EsTrabajadorZafra = empleado.EsTrabajadorZafra,
            DepartamentoId = empleado.DepartamentoId,
            PuestoId = empleado.PuestoId,
            CentroCostoId = empleado.CentroCostoId,
            SalarioDiario = empleado.SalarioDiario.Cantidad,
            SalarioDiarioIntegrado = empleado.SalarioDiarioIntegrado.Cantidad,
            SalarioBaseCotizacion = empleado.SalarioBaseCotizacion.Cantidad,
            FormaPago = empleado.FormaPago.ToString(),
            BancoDeposito = empleado.BancoDeposito,
            TieneCreditoInfonavit = empleado.TieneCreditoInfonavit,
            TipoDescuentoInfonavit = empleado.TipoDescuentoInfonavit?.ToString(),
            RutaFoto = empleado.RutaFoto,
            EmpresaId = empleado.EmpresaId,
            IngenioId = empleado.IngenioId ?? Guid.Empty,
            Activo = empleado.Activo,
            FechaCreacion = empleado.FechaCreacion,
            FechaModificacion = empleado.FechaModificacion
        };
    }
}
