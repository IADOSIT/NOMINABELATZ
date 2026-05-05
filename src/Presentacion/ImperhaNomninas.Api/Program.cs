// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Punto de entrada de la API REST
// ===================================

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using ImperhaNomninas.Infraestructura.Persistencia.Contexto;
using ImperhaNomninas.Api.Middleware;

// ===================================
// CONFIGURACIÓN DE SERILOG
// ===================================
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/imperha-nominas-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("===========================================");
    Log.Information("   IMPERHA NÓMINAS - Iniciando servidor   ");
    Log.Information("   Sistema de Nómina Enterprise           ");
    Log.Information("===========================================");

    var builder = WebApplication.CreateBuilder(args);

    // Usar Serilog
    builder.Host.UseSerilog();

    // ===================================
    // CONFIGURACIÓN DE SERVICIOS
    // ===================================

    // Base de datos
    builder.Services.AddDbContext<ImperhaDbContext>(options =>
    {
        options.UseNpgsql(
            builder.Configuration.GetConnectionString("ImperhaDb"),
            npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(3);
                npgsqlOptions.CommandTimeout(60);
            });
    });

    // Autenticación JWT
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurada");

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

    // Autorización
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("Administrador", policy => policy.RequireRole("Administrador"));
        options.AddPolicy("Nominas", policy => policy.RequireRole("Administrador", "Nominas"));
        options.AddPolicy("RecursosHumanos", policy => policy.RequireRole("Administrador", "RecursosHumanos"));
        options.AddPolicy("Consulta", policy => policy.RequireRole("Administrador", "Nominas", "RecursosHumanos", "Consulta"));
    });

    // Controladores
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        });

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("PermitirFrontend", policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3000",
                    "https://localhost:3000",
                    builder.Configuration["FrontendUrl"] ?? "http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });

    // Swagger
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "IMPERHA NÓMINAS API",
            Version = "v1",
            Description = "API REST del Sistema de Nómina Enterprise para Ingenios Azucareros",
            Contact = new OpenApiContact
            {
                Name = "Imperha Sistemas",
                Email = "soporte@imperha.com"
            }
        });

        // Configurar autenticación en Swagger
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Ingrese el token JWT en el formato: Bearer {token}",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    // Health Checks
    builder.Services.AddHealthChecks()
        .AddDbContextCheck<ImperhaDbContext>("BaseDatos");

    // MediatR
    builder.Services.AddMediatR(cfg =>
        cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

    // AutoMapper
    builder.Services.AddAutoMapper(typeof(Program).Assembly);

    // HttpContextAccessor
    builder.Services.AddHttpContextAccessor();

    // ===================================
    // CONSTRUCCIÓN DE LA APLICACIÓN
    // ===================================

    var app = builder.Build();

    // Middleware de manejo de errores global
    app.UseMiddleware<ManejadorErroresMiddleware>();

    // Swagger en desarrollo
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "IMPERHA NÓMINAS API v1");
            options.RoutePrefix = "swagger";
        });
    }

    // HTTPS
    app.UseHttpsRedirection();

    // Archivos estáticos
    app.UseStaticFiles();

    // CORS
    app.UseCors("PermitirFrontend");

    // Autenticación y autorización
    app.UseAuthentication();
    app.UseAuthorization();

    // Health checks
    app.MapHealthChecks("/health");

    // Controladores
    app.MapControllers();

    // Endpoint raíz
    app.MapGet("/", () => Results.Ok(new
    {
        Sistema = "IMPERHA NÓMINAS",
        Version = "1.0.0",
        Descripcion = "Sistema de Nómina Enterprise para Ingenios Azucareros",
        Documentacion = "/swagger"
    }));

    Log.Information("Servidor iniciado exitosamente en {Urls}", string.Join(", ", app.Urls));

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Error fatal al iniciar el servidor");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
