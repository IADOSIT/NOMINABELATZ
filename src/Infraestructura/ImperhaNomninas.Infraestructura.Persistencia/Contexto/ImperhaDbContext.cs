// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Contexto de base de datos Entity Framework
// ===================================

using Microsoft.EntityFrameworkCore;
using ImperhaNomninas.Dominio.Corporativo.Entidades;
using ImperhaNomninas.Dominio.RecursosHumanos.Entidades;
using ImperhaNomninas.Dominio.Nomina.Entidades;
using ImperhaNomninas.Dominio.Compartido.Entidades;
using ImperhaNomninas.Infraestructura.Persistencia.Configuraciones;

namespace ImperhaNomninas.Infraestructura.Persistencia.Contexto;

/// <summary>
/// Contexto principal de base de datos para IMPERHA NÓMINAS.
/// Implementa auditoría automática y soft delete.
/// </summary>
public class ImperhaDbContext : DbContext
{
    private readonly Guid _usuarioActualId;
    private readonly Guid _empresaActualId;

    public ImperhaDbContext(DbContextOptions<ImperhaDbContext> options)
        : base(options)
    {
    }

    public ImperhaDbContext(
        DbContextOptions<ImperhaDbContext> options,
        Guid usuarioActualId,
        Guid empresaActualId)
        : base(options)
    {
        _usuarioActualId = usuarioActualId;
        _empresaActualId = empresaActualId;
    }

    // ===================================
    // CORPORATIVO
    // ===================================
    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Ingenio> Ingenios => Set<Ingenio>();

    // ===================================
    // RECURSOS HUMANOS
    // ===================================
    public DbSet<Empleado> Empleados => Set<Empleado>();

    // ===================================
    // NÓMINA
    // ===================================
    public DbSet<PeriodoNomina> PeriodosNomina => Set<PeriodoNomina>();
    public DbSet<NominaEmpleado> NominasEmpleados => Set<NominaEmpleado>();
    public DbSet<PercepcionNomina> PercepcionesNomina => Set<PercepcionNomina>();
    public DbSet<DeduccionNomina> DeduccionesNomina => Set<DeduccionNomina>();
    public DbSet<OtroPagoNomina> OtrosPagosNomina => Set<OtroPagoNomina>();

    // ===================================
    // AUDITORÍA
    // ===================================
    public DbSet<RegistroAuditoria> RegistrosAuditoria => Set<RegistroAuditoria>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar configuraciones de entidades
        modelBuilder.ApplyConfiguration(new EmpresaConfiguracion());
        modelBuilder.ApplyConfiguration(new IngenioConfiguracion());
        modelBuilder.ApplyConfiguration(new EmpleadoConfiguracion());
        modelBuilder.ApplyConfiguration(new PeriodoNominaConfiguracion());
        modelBuilder.ApplyConfiguration(new NominaEmpleadoConfiguracion());
        modelBuilder.ApplyConfiguration(new RegistroAuditoriaConfiguracion());

        // Filtro global para soft delete
        ConfigurarFiltroSoftDelete(modelBuilder);

        // Configurar esquemas
        ConfigurarEsquemas(modelBuilder);
    }

    /// <summary>
    /// Configura el filtro global de soft delete.
    /// </summary>
    private static void ConfigurarFiltroSoftDelete(ModelBuilder modelBuilder)
    {
        // Aplicar filtro de soft delete a todas las entidades que heredan de EntidadBase
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(EntidadBase).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
                var property = System.Linq.Expressions.Expression.Property(parameter, nameof(EntidadBase.Activo));
                var filter = System.Linq.Expressions.Expression.Lambda(property, parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
            }
        }
    }

    /// <summary>
    /// Configura los esquemas de la base de datos.
    /// </summary>
    private static void ConfigurarEsquemas(ModelBuilder modelBuilder)
    {
        // Esquema Corporativo
        modelBuilder.Entity<Empresa>().ToTable("Empresas", "corp");
        modelBuilder.Entity<Ingenio>().ToTable("Ingenios", "corp");

        // Esquema Recursos Humanos
        modelBuilder.Entity<Empleado>().ToTable("Empleados", "rh");

        // Esquema Nómina
        modelBuilder.Entity<PeriodoNomina>().ToTable("PeriodosNomina", "nom");
        modelBuilder.Entity<NominaEmpleado>().ToTable("NominasEmpleados", "nom");
        modelBuilder.Entity<PercepcionNomina>().ToTable("PercepcionesNomina", "nom");
        modelBuilder.Entity<DeduccionNomina>().ToTable("DeduccionesNomina", "nom");
        modelBuilder.Entity<OtroPagoNomina>().ToTable("OtrosPagosNomina", "nom");

        // Esquema Auditoría
        modelBuilder.Entity<RegistroAuditoria>().ToTable("RegistrosAuditoria", "aud");
    }

    /// <summary>
    /// Guarda los cambios con auditoría automática.
    /// </summary>
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Procesar entidades antes de guardar
        ProcesarEntidadesAntesDeGuardar();

        // Generar registros de auditoría
        var registrosAuditoria = GenerarRegistrosAuditoria();

        // Guardar cambios
        var resultado = await base.SaveChangesAsync(cancellationToken);

        // Guardar registros de auditoría
        if (registrosAuditoria.Any())
        {
            RegistrosAuditoria.AddRange(registrosAuditoria);
            await base.SaveChangesAsync(cancellationToken);
        }

        return resultado;
    }

    /// <summary>
    /// Procesa las entidades antes de guardar (fechas, usuario, versión).
    /// </summary>
    private void ProcesarEntidadesAntesDeGuardar()
    {
        var entradas = ChangeTracker.Entries<EntidadBase>();

        foreach (var entrada in entradas)
        {
            switch (entrada.State)
            {
                case EntityState.Added:
                    if (entrada.Entity.UsuarioCreacionId == null || entrada.Entity.UsuarioCreacionId == Guid.Empty)
                        entrada.Entity.EstablecerCreacion(_usuarioActualId);
                    break;

                case EntityState.Modified:
                    entrada.Entity.MarcarComoModificado(_usuarioActualId);
                    break;
            }
        }
    }

    /// <summary>
    /// Genera los registros de auditoría para los cambios detectados.
    /// </summary>
    private List<RegistroAuditoria> GenerarRegistrosAuditoria()
    {
        var registros = new List<RegistroAuditoria>();
        var entradas = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added ||
                       e.State == EntityState.Modified ||
                       e.State == EntityState.Deleted);

        foreach (var entrada in entradas)
        {
            var nombreEntidad = entrada.Entity.GetType().Name;
            var entidadId = ObtenerIdEntidad(entrada);

            var registro = new RegistroAuditoria
            {
                Id = Guid.NewGuid(),
                UsuarioId = _usuarioActualId,
                EmpresaId = _empresaActualId,
                FechaHora = DateTime.UtcNow,
                TipoAccion = entrada.State.ToString(),
                NombreEntidad = nombreEntidad,
                EntidadId = entidadId,
                ValoresAnteriores = entrada.State == EntityState.Modified || entrada.State == EntityState.Deleted
                    ? ObtenerValoresOriginales(entrada)
                    : null,
                ValoresNuevos = entrada.State == EntityState.Added || entrada.State == EntityState.Modified
                    ? ObtenerValoresActuales(entrada)
                    : null
            };

            registros.Add(registro);
        }

        return registros;
    }

    private static Guid ObtenerIdEntidad(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entrada)
    {
        var propiedadId = entrada.Properties.FirstOrDefault(p => p.Metadata.Name == "Id");
        return propiedadId?.CurrentValue is Guid id ? id : Guid.Empty;
    }

    private static string? ObtenerValoresOriginales(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entrada)
    {
        var valores = new Dictionary<string, object?>();
        foreach (var propiedad in entrada.OriginalValues.Properties)
        {
            valores[propiedad.Name] = entrada.OriginalValues[propiedad];
        }
        return System.Text.Json.JsonSerializer.Serialize(valores);
    }

    private static string? ObtenerValoresActuales(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entrada)
    {
        var valores = new Dictionary<string, object?>();
        foreach (var propiedad in entrada.CurrentValues.Properties)
        {
            valores[propiedad.Name] = entrada.CurrentValues[propiedad];
        }
        return System.Text.Json.JsonSerializer.Serialize(valores);
    }
}

/// <summary>
/// Registro de auditoría del sistema.
/// </summary>
public class RegistroAuditoria
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid? EmpresaId { get; set; }
    public DateTime FechaHora { get; set; }
    public string TipoAccion { get; set; } = string.Empty;
    public string NombreEntidad { get; set; } = string.Empty;
    public Guid EntidadId { get; set; }
    public string? ValoresAnteriores { get; set; }
    public string? ValoresNuevos { get; set; }
    public string? DireccionIp { get; set; }
    public string? AgenteUsuario { get; set; }
}
