// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Controlador base para todos los controladores
// ===================================

using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ImperhaNomninas.Api.Controllers.Base;

/// <summary>
/// Controlador base con funcionalidad común.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public abstract class ControladorBase : ControllerBase
{
    /// <summary>
    /// Obtiene el ID del usuario actual desde el token JWT.
    /// </summary>
    protected Guid UsuarioActualId
    {
        get
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("sub");

            if (claim == null || !Guid.TryParse(claim.Value, out var userId))
                return Guid.Empty;

            return userId;
        }
    }

    /// <summary>
    /// Obtiene el nombre del usuario actual.
    /// </summary>
    protected string UsuarioActualNombre =>
        User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";

    /// <summary>
    /// Obtiene el correo del usuario actual.
    /// </summary>
    protected string? UsuarioActualCorreo =>
        User.FindFirst(ClaimTypes.Email)?.Value;

    /// <summary>
    /// Obtiene el ID de la empresa actual desde los claims.
    /// </summary>
    protected Guid EmpresaActualId
    {
        get
        {
            var claim = User.FindFirst("empresaId");

            if (claim == null || !Guid.TryParse(claim.Value, out var empresaId))
                return Guid.Empty;

            return empresaId;
        }
    }

    /// <summary>
    /// Obtiene el ID del ingenio actual desde los claims.
    /// </summary>
    protected Guid? IngenioActualId
    {
        get
        {
            var claim = User.FindFirst("ingenioId");

            if (claim == null || !Guid.TryParse(claim.Value, out var ingenioId))
                return null;

            return ingenioId;
        }
    }

    /// <summary>
    /// Obtiene los roles del usuario actual.
    /// </summary>
    protected IEnumerable<string> RolesUsuario =>
        User.FindAll(ClaimTypes.Role).Select(c => c.Value);

    /// <summary>
    /// Verifica si el usuario tiene un rol específico.
    /// </summary>
    protected bool TieneRol(string rol) =>
        User.IsInRole(rol);

    /// <summary>
    /// Obtiene la dirección IP del cliente.
    /// </summary>
    protected string? DireccionIpCliente =>
        HttpContext.Connection.RemoteIpAddress?.ToString();

    /// <summary>
    /// Obtiene el User Agent del cliente.
    /// </summary>
    protected string? AgenteUsuario =>
        Request.Headers.UserAgent.ToString();

    /// <summary>
    /// Respuesta exitosa con datos.
    /// </summary>
    protected ActionResult<T> Exitoso<T>(T datos) =>
        Ok(new RespuestaApi<T>
        {
            Exitoso = true,
            Datos = datos
        });

    /// <summary>
    /// Respuesta exitosa sin datos.
    /// </summary>
    protected ActionResult ExitosoSinContenido() =>
        NoContent();

    /// <summary>
    /// Respuesta de creación exitosa.
    /// </summary>
    protected ActionResult<T> Creado<T>(string accion, object routeValues, T datos) =>
        CreatedAtAction(accion, routeValues, new RespuestaApi<T>
        {
            Exitoso = true,
            Datos = datos
        });

    /// <summary>
    /// Respuesta de error de validación.
    /// </summary>
    protected ActionResult ErrorValidacion(string mensaje) =>
        BadRequest(new RespuestaApi<object>
        {
            Exitoso = false,
            Mensaje = mensaje
        });

    /// <summary>
    /// Respuesta de no encontrado.
    /// </summary>
    protected ActionResult NoEncontrado(string mensaje) =>
        NotFound(new RespuestaApi<object>
        {
            Exitoso = false,
            Mensaje = mensaje
        });
}

/// <summary>
/// Respuesta estándar de la API.
/// </summary>
public class RespuestaApi<T>
{
    public bool Exitoso { get; set; }
    public string? Mensaje { get; set; }
    public T? Datos { get; set; }
}
