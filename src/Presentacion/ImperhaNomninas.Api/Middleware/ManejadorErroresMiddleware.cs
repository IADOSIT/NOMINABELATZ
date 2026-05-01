// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Middleware de manejo global de errores
// ===================================

using System.Net;
using System.Text.Json;
using ImperhaNomninas.Dominio.Compartido.Excepciones;

namespace ImperhaNomninas.Api.Middleware;

/// <summary>
/// Middleware para manejo centralizado de errores.
/// Convierte excepciones en respuestas HTTP apropiadas.
/// </summary>
public class ManejadorErroresMiddleware
{
    private readonly RequestDelegate _siguiente;
    private readonly ILogger<ManejadorErroresMiddleware> _logger;

    public ManejadorErroresMiddleware(
        RequestDelegate siguiente,
        ILogger<ManejadorErroresMiddleware> logger)
    {
        _siguiente = siguiente;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext contexto)
    {
        try
        {
            await _siguiente(contexto);
        }
        catch (Exception ex)
        {
            await ManejarExcepcionAsync(contexto, ex);
        }
    }

    private async Task ManejarExcepcionAsync(HttpContext contexto, Exception excepcion)
    {
        var respuesta = contexto.Response;
        respuesta.ContentType = "application/json";

        var errorRespuesta = new ErrorRespuesta();

        switch (excepcion)
        {
            case ValidacionExcepcion validacionEx:
                respuesta.StatusCode = (int)HttpStatusCode.BadRequest;
                errorRespuesta.Codigo = validacionEx.Codigo;
                errorRespuesta.Mensaje = validacionEx.Message;
                errorRespuesta.Errores = validacionEx.Errores.Select(e => new DetalleError
                {
                    Campo = e.Campo,
                    Mensaje = e.Mensaje
                }).ToList();
                _logger.LogWarning("Error de validación: {Mensaje}", validacionEx.Message);
                break;

            case EntidadNoEncontradaExcepcion noEncontradaEx:
                respuesta.StatusCode = (int)HttpStatusCode.NotFound;
                errorRespuesta.Codigo = noEncontradaEx.Codigo;
                errorRespuesta.Mensaje = noEncontradaEx.Message;
                _logger.LogWarning("Entidad no encontrada: {Tipo} - {Id}",
                    noEncontradaEx.TipoEntidad, noEncontradaEx.EntidadId);
                break;

            case ReglaDeNegocioExcepcion reglaEx:
                respuesta.StatusCode = (int)HttpStatusCode.UnprocessableEntity;
                errorRespuesta.Codigo = reglaEx.Codigo;
                errorRespuesta.Mensaje = reglaEx.Message;
                errorRespuesta.Detalles = new Dictionary<string, object> { { "Regla", reglaEx.Regla } };
                _logger.LogWarning("Regla de negocio violada: {Regla} - {Mensaje}",
                    reglaEx.Regla, reglaEx.Message);
                break;

            case NoAutorizadoExcepcion noAutorizadoEx:
                respuesta.StatusCode = (int)HttpStatusCode.Forbidden;
                errorRespuesta.Codigo = noAutorizadoEx.Codigo;
                errorRespuesta.Mensaje = noAutorizadoEx.Message;
                _logger.LogWarning("Acceso no autorizado: {Mensaje}", noAutorizadoEx.Message);
                break;

            case ConcurrenciaExcepcion concurrenciaEx:
                respuesta.StatusCode = (int)HttpStatusCode.Conflict;
                errorRespuesta.Codigo = concurrenciaEx.Codigo;
                errorRespuesta.Mensaje = concurrenciaEx.Message;
                _logger.LogWarning("Conflicto de concurrencia: {Mensaje}", concurrenciaEx.Message);
                break;

            case ExcepcionFiscal fiscalEx:
                respuesta.StatusCode = (int)HttpStatusCode.BadRequest;
                errorRespuesta.Codigo = fiscalEx.Codigo;
                errorRespuesta.Mensaje = fiscalEx.Message;
                errorRespuesta.Detalles = new Dictionary<string, object>
                {
                    { "OrganismoFiscal", fiscalEx.OrganismoFiscal }
                };
                _logger.LogError(fiscalEx, "Error fiscal: {Organismo} - {Mensaje}",
                    fiscalEx.OrganismoFiscal, fiscalEx.Message);
                break;

            case ExcepcionCfdi cfdiEx:
                respuesta.StatusCode = (int)HttpStatusCode.BadRequest;
                errorRespuesta.Codigo = cfdiEx.Codigo;
                errorRespuesta.Mensaje = cfdiEx.Message;
                errorRespuesta.Detalles = new Dictionary<string, object>
                {
                    { "TipoError", cfdiEx.TipoError }
                };
                if (!string.IsNullOrEmpty(cfdiEx.UuidCfdi))
                    errorRespuesta.Detalles.Add("UUID", cfdiEx.UuidCfdi);
                _logger.LogError(cfdiEx, "Error CFDI: {TipoError} - {Mensaje}",
                    cfdiEx.TipoError, cfdiEx.Message);
                break;

            case ExcepcionNomina nominaEx:
                respuesta.StatusCode = (int)HttpStatusCode.BadRequest;
                errorRespuesta.Codigo = nominaEx.Codigo;
                errorRespuesta.Mensaje = nominaEx.Message;
                _logger.LogError(nominaEx, "Error de nómina: {Mensaje}", nominaEx.Message);
                break;

            case ExcepcionDominio dominioEx:
                respuesta.StatusCode = (int)HttpStatusCode.BadRequest;
                errorRespuesta.Codigo = dominioEx.Codigo;
                errorRespuesta.Mensaje = dominioEx.Message;
                _logger.LogWarning("Error de dominio: {Codigo} - {Mensaje}",
                    dominioEx.Codigo, dominioEx.Message);
                break;

            default:
                respuesta.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorRespuesta.Codigo = "ERROR_INTERNO";
                errorRespuesta.Mensaje = "Ha ocurrido un error interno. Por favor contacte al administrador.";
                _logger.LogError(excepcion, "Error interno no controlado");
                break;
        }

        errorRespuesta.TraceId = contexto.TraceIdentifier;

        var opciones = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await respuesta.WriteAsync(JsonSerializer.Serialize(errorRespuesta, opciones));
    }
}

/// <summary>
/// Modelo de respuesta de error.
/// </summary>
public class ErrorRespuesta
{
    public string Codigo { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
    public string? TraceId { get; set; }
    public List<DetalleError>? Errores { get; set; }
    public Dictionary<string, object>? Detalles { get; set; }
}

/// <summary>
/// Detalle de error de validación.
/// </summary>
public class DetalleError
{
    public string Campo { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
}
