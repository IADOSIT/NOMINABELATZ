// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Configuraciones de Entity Framework
// ===================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ImperhaNomninas.Dominio.Corporativo.Entidades;
using ImperhaNomninas.Dominio.RecursosHumanos.Entidades;
using ImperhaNomninas.Dominio.Nomina.Entidades;
using ImperhaNomninas.Infraestructura.Persistencia.Contexto;

namespace ImperhaNomninas.Infraestructura.Persistencia.Configuraciones;

/// <summary>
/// Configuración de la entidad Empresa.
/// </summary>
public class EmpresaConfiguracion : IEntityTypeConfiguration<Empresa>
{
    public void Configure(EntityTypeBuilder<Empresa> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.RazonSocial)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(e => e.NombreComercial)
            .IsRequired()
            .HasMaxLength(250);

        // Configurar Value Object RFC
        builder.OwnsOne(e => e.Rfc, rfc =>
        {
            rfc.Property(r => r.Valor)
                .HasColumnName("Rfc")
                .IsRequired()
                .HasMaxLength(13);
        });

        builder.Property(e => e.RegimenFiscal)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.CodigoRegimenFiscal)
            .IsRequired()
            .HasMaxLength(10);

        // Dirección fiscal
        builder.Property(e => e.DireccionFiscalCalle).HasMaxLength(250);
        builder.Property(e => e.DireccionFiscalNumeroExterior).HasMaxLength(50);
        builder.Property(e => e.DireccionFiscalNumeroInterior).HasMaxLength(50);
        builder.Property(e => e.DireccionFiscalColonia).HasMaxLength(150);
        builder.Property(e => e.DireccionFiscalCodigoPostal).HasMaxLength(10);
        builder.Property(e => e.DireccionFiscalMunicipio).HasMaxLength(150);
        builder.Property(e => e.DireccionFiscalEstado).HasMaxLength(100);
        builder.Property(e => e.DireccionFiscalPais).HasMaxLength(100);

        // Contacto
        builder.Property(e => e.Telefono).HasMaxLength(50);
        builder.Property(e => e.CorreoElectronico).HasMaxLength(150);
        builder.Property(e => e.SitioWeb).HasMaxLength(250);

        // Branding
        builder.Property(e => e.RutaLogo).HasMaxLength(500);
        builder.Property(e => e.ColorPrimario).HasMaxLength(20);
        builder.Property(e => e.ColorSecundario).HasMaxLength(20);
        builder.Property(e => e.ColorAcento).HasMaxLength(20);

        // Fiscal
        builder.Property(e => e.RegistroPatronalImss).HasMaxLength(20);
        builder.Property(e => e.RegistroInfonavit).HasMaxLength(20);
        builder.Property(e => e.RutaCertificadoCsd).HasMaxLength(500);
        builder.Property(e => e.RutaLlaveCsd).HasMaxLength(500);
        builder.Property(e => e.ContrasenasCsdEncriptada).HasMaxLength(500);

        // Recibos
        builder.Property(e => e.TextoLegalRecibos).HasMaxLength(2000);
        builder.Property(e => e.PiePaginaRecibos).HasMaxLength(500);

        // Relación con Ingenios
        builder.HasMany(e => e.Ingenios)
            .WithOne()
            .HasForeignKey(i => i.EmpresaId)
            .OnDelete(DeleteBehavior.Restrict);

        // Índices
        builder.HasIndex(e => e.Activo);
    }
}

/// <summary>
/// Configuración de la entidad Ingenio.
/// </summary>
public class IngenioConfiguracion : IEntityTypeConfiguration<Ingenio>
{
    public void Configure(EntityTypeBuilder<Ingenio> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Nombre)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(i => i.Clave)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(i => i.Descripcion).HasMaxLength(500);
        builder.Property(i => i.Direccion).HasMaxLength(500);
        builder.Property(i => i.Municipio).HasMaxLength(150);
        builder.Property(i => i.Estado).HasMaxLength(100);
        builder.Property(i => i.CodigoPostal).HasMaxLength(10);

        builder.Property(i => i.RegistroPatronalImss)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(i => i.RegistroInfonavit).HasMaxLength(20);
        builder.Property(i => i.NumeroZafra).HasMaxLength(20);
        builder.Property(i => i.ZonaSalarioMinimo).HasMaxLength(10);
        builder.Property(i => i.RutaLogo).HasMaxLength(500);
        builder.Property(i => i.ColorPrimario).HasMaxLength(20);
        builder.Property(i => i.Telefono).HasMaxLength(50);
        builder.Property(i => i.CorreoElectronico).HasMaxLength(150);
        builder.Property(i => i.NombreResponsable).HasMaxLength(200);

        builder.Property(i => i.PrimaRiesgoTrabajo)
            .HasPrecision(10, 5);

        builder.Property(i => i.CapacidadMoliendaDiaria)
            .HasPrecision(18, 2);

        builder.Property(i => i.Latitud).HasPrecision(18, 10);
        builder.Property(i => i.Longitud).HasPrecision(18, 10);

        // Índices
        builder.HasIndex(i => new { i.EmpresaId, i.Clave })
            .IsUnique()
            .HasFilter("[Activo] = 1");
        builder.HasIndex(i => i.RegistroPatronalImss);
        builder.HasIndex(i => i.Activo);
    }
}

/// <summary>
/// Configuración de la entidad Empleado.
/// </summary>
public class EmpleadoConfiguracion : IEntityTypeConfiguration<Empleado>
{
    public void Configure(EntityTypeBuilder<Empleado> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.NumeroEmpleado)
            .IsRequired()
            .HasMaxLength(20);

        // Value Objects
        builder.OwnsOne(e => e.Curp, curp =>
        {
            curp.Property(c => c.Valor)
                .HasColumnName("Curp")
                .IsRequired()
                .HasMaxLength(18);
        });

        builder.OwnsOne(e => e.Rfc, rfc =>
        {
            rfc.Property(r => r.Valor)
                .HasColumnName("Rfc")
                .IsRequired()
                .HasMaxLength(13);
        });

        builder.OwnsOne(e => e.Nss, nss =>
        {
            nss.Property(n => n.Valor)
                .HasColumnName("Nss")
                .IsRequired()
                .HasMaxLength(11);
        });

        // Datos personales
        builder.Property(e => e.Nombres).IsRequired().HasMaxLength(150);
        builder.Property(e => e.ApellidoPaterno).IsRequired().HasMaxLength(100);
        builder.Property(e => e.ApellidoMaterno).HasMaxLength(100);
        builder.Property(e => e.Nacionalidad).HasMaxLength(50);
        builder.Property(e => e.LugarNacimiento).HasMaxLength(100);

        // Contacto
        builder.Property(e => e.CorreoPersonal).HasMaxLength(150);
        builder.Property(e => e.CorreoInstitucional).HasMaxLength(150);
        builder.Property(e => e.TelefonoCelular).HasMaxLength(20);
        builder.Property(e => e.TelefonoCasa).HasMaxLength(20);

        // Domicilio
        builder.Property(e => e.DomicilioCalle).HasMaxLength(250);
        builder.Property(e => e.DomicilioNumeroExterior).HasMaxLength(50);
        builder.Property(e => e.DomicilioNumeroInterior).HasMaxLength(50);
        builder.Property(e => e.DomicilioColonia).HasMaxLength(150);
        builder.Property(e => e.DomicilioCodigoPostal).HasMaxLength(10);
        builder.Property(e => e.DomicilioMunicipio).HasMaxLength(150);
        builder.Property(e => e.DomicilioEstado).HasMaxLength(100);

        // Salarios (Value Objects)
        builder.OwnsOne(e => e.SalarioDiario, sd =>
        {
            sd.Property(s => s.Cantidad)
                .HasColumnName("SalarioDiario")
                .HasPrecision(18, 4);
            sd.Property(s => s.Moneda)
                .HasColumnName("MonedaSalarioDiario")
                .HasMaxLength(3);
        });

        builder.OwnsOne(e => e.SalarioDiarioIntegrado, sdi =>
        {
            sdi.Property(s => s.Cantidad)
                .HasColumnName("SalarioDiarioIntegrado")
                .HasPrecision(18, 4);
            sdi.Property(s => s.Moneda)
                .HasColumnName("MonedaSdi")
                .HasMaxLength(3);
        });

        builder.OwnsOne(e => e.SalarioBaseCotizacion, sbc =>
        {
            sbc.Property(s => s.Cantidad)
                .HasColumnName("SalarioBaseCotizacion")
                .HasPrecision(18, 4);
            sbc.Property(s => s.Moneda)
                .HasColumnName("MonedaSbc")
                .HasMaxLength(3);
        });

        // Bancarios
        builder.Property(e => e.BancoDeposito).HasMaxLength(100);
        builder.Property(e => e.ClabeInterbancaria).HasMaxLength(18);
        builder.Property(e => e.NumeroCuentaBancaria).HasMaxLength(20);

        // INFONAVIT
        builder.Property(e => e.NumeroCreditoInfonavit).HasMaxLength(20);
        builder.Property(e => e.ValorDescuentoInfonavit).HasPrecision(18, 4);

        // Contacto emergencia
        builder.Property(e => e.ContactoEmergenciaNombre).HasMaxLength(200);
        builder.Property(e => e.ContactoEmergenciaTelefono).HasMaxLength(20);
        builder.Property(e => e.ContactoEmergenciaParentesco).HasMaxLength(50);

        // Biométricos
        builder.Property(e => e.IdBiometrico).HasMaxLength(50);
        builder.Property(e => e.RutaFoto).HasMaxLength(500);

        // Baja
        builder.Property(e => e.ObservacionesBaja).HasMaxLength(1000);

        // Índices
        builder.HasIndex(e => new { e.EmpresaId, e.IngenioId, e.NumeroEmpleado })
            .IsUnique()
            .HasFilter("[Activo] = 1");
        builder.HasIndex(e => e.DepartamentoId);
        builder.HasIndex(e => e.PuestoId);
        builder.HasIndex(e => e.EstatusLaboral);
        builder.HasIndex(e => e.Activo);
    }
}

/// <summary>
/// Configuración de PeriodoNomina.
/// </summary>
public class PeriodoNominaConfiguracion : IEntityTypeConfiguration<PeriodoNomina>
{
    public void Configure(EntityTypeBuilder<PeriodoNomina> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Descripcion).HasMaxLength(200);
        builder.Property(p => p.HashCierre).HasMaxLength(500);

        builder.Property(p => p.TotalPercepciones).HasPrecision(18, 2);
        builder.Property(p => p.TotalDeducciones).HasPrecision(18, 2);
        builder.Property(p => p.TotalNeto).HasPrecision(18, 2);

        // Índices
        builder.HasIndex(p => new { p.EmpresaId, p.IngenioId, p.Ejercicio, p.NumeroPeriodo, p.TipoNomina })
            .IsUnique()
            .HasFilter("[Activo] = 1");
        builder.HasIndex(p => p.Estatus);
        builder.HasIndex(p => p.FechaPago);
    }
}

/// <summary>
/// Configuración de NominaEmpleado.
/// </summary>
public class NominaEmpleadoConfiguracion : IEntityTypeConfiguration<NominaEmpleado>
{
    public void Configure(EntityTypeBuilder<NominaEmpleado> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.NumeroEmpleado).IsRequired().HasMaxLength(20);
        builder.Property(n => n.NombreCompleto).IsRequired().HasMaxLength(300);
        builder.Property(n => n.Rfc).IsRequired().HasMaxLength(13);
        builder.Property(n => n.Curp).IsRequired().HasMaxLength(18);
        builder.Property(n => n.Nss).IsRequired().HasMaxLength(11);
        builder.Property(n => n.Departamento).HasMaxLength(150);
        builder.Property(n => n.Puesto).HasMaxLength(150);

        // Value Objects Dinero
        builder.OwnsOne(n => n.SalarioDiario, s => s.Property(x => x.Cantidad).HasColumnName("SalarioDiario").HasPrecision(18, 4));
        builder.OwnsOne(n => n.SalarioDiarioIntegrado, s => s.Property(x => x.Cantidad).HasColumnName("SalarioDiarioIntegrado").HasPrecision(18, 4));
        builder.OwnsOne(n => n.SalarioBaseCotizacion, s => s.Property(x => x.Cantidad).HasColumnName("SalarioBaseCotizacion").HasPrecision(18, 4));

        builder.OwnsOne(n => n.TotalPercepcionesGravadas, s => s.Property(x => x.Cantidad).HasColumnName("TotalPercepcionesGravadas").HasPrecision(18, 2));
        builder.OwnsOne(n => n.TotalPercepcionesExentas, s => s.Property(x => x.Cantidad).HasColumnName("TotalPercepcionesExentas").HasPrecision(18, 2));
        builder.OwnsOne(n => n.TotalPercepciones, s => s.Property(x => x.Cantidad).HasColumnName("TotalPercepciones").HasPrecision(18, 2));
        builder.OwnsOne(n => n.TotalDeducciones, s => s.Property(x => x.Cantidad).HasColumnName("TotalDeducciones").HasPrecision(18, 2));
        builder.OwnsOne(n => n.TotalOtrosPagos, s => s.Property(x => x.Cantidad).HasColumnName("TotalOtrosPagos").HasPrecision(18, 2));
        builder.OwnsOne(n => n.NetoAPagar, s => s.Property(x => x.Cantidad).HasColumnName("NetoAPagar").HasPrecision(18, 2));

        builder.OwnsOne(n => n.BaseGravableIsr, s => s.Property(x => x.Cantidad).HasColumnName("BaseGravableIsr").HasPrecision(18, 2));
        builder.OwnsOne(n => n.IsrAntesSubsidio, s => s.Property(x => x.Cantidad).HasColumnName("IsrAntesSubsidio").HasPrecision(18, 2));
        builder.OwnsOne(n => n.SubsidioEmpleoAplicado, s => s.Property(x => x.Cantidad).HasColumnName("SubsidioEmpleoAplicado").HasPrecision(18, 2));
        builder.OwnsOne(n => n.IsrRetener, s => s.Property(x => x.Cantidad).HasColumnName("IsrRetener").HasPrecision(18, 2));
        builder.OwnsOne(n => n.CuotaObreraImss, s => s.Property(x => x.Cantidad).HasColumnName("CuotaObreraImss").HasPrecision(18, 2));
        builder.OwnsOne(n => n.CuotaPatronalImss, s => s.Property(x => x.Cantidad).HasColumnName("CuotaPatronalImss").HasPrecision(18, 2));
        builder.OwnsOne(n => n.DescuentoInfonavit, s => s.Property(x => x.Cantidad).HasColumnName("DescuentoInfonavit").HasPrecision(18, 2));

        builder.Property(n => n.DiasTrabajados).HasPrecision(5, 2);
        builder.Property(n => n.DiasIncapacidad).HasPrecision(5, 2);
        builder.Property(n => n.DiasFaltas).HasPrecision(5, 2);
        builder.Property(n => n.DiasVacaciones).HasPrecision(5, 2);
        builder.Property(n => n.HorasExtraDobles).HasPrecision(7, 2);
        builder.Property(n => n.HorasExtraTriples).HasPrecision(7, 2);

        builder.Property(n => n.UuidCfdi).HasMaxLength(50);
        builder.Property(n => n.ErroresCalculo).HasMaxLength(2000);

        // Relaciones
        builder.HasMany(n => n.Percepciones)
            .WithOne()
            .HasForeignKey(p => p.NominaEmpleadoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(n => n.Deducciones)
            .WithOne()
            .HasForeignKey(d => d.NominaEmpleadoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(n => n.OtrosPagos)
            .WithOne()
            .HasForeignKey(o => o.NominaEmpleadoId)
            .OnDelete(DeleteBehavior.Cascade);

        // Índices
        builder.HasIndex(n => new { n.PeriodoNominaId, n.EmpleadoId }).IsUnique();
        builder.HasIndex(n => n.Estatus);
        builder.HasIndex(n => n.UuidCfdi);
    }
}

/// <summary>
/// Configuración de RegistroAuditoria.
/// </summary>
public class RegistroAuditoriaConfiguracion : IEntityTypeConfiguration<RegistroAuditoria>
{
    public void Configure(EntityTypeBuilder<RegistroAuditoria> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.TipoAccion).IsRequired().HasMaxLength(50);
        builder.Property(r => r.NombreEntidad).IsRequired().HasMaxLength(100);
        builder.Property(r => r.DireccionIp).HasMaxLength(50);
        builder.Property(r => r.AgenteUsuario).HasMaxLength(500);

        // Índices
        builder.HasIndex(r => r.FechaHora);
        builder.HasIndex(r => r.UsuarioId);
        builder.HasIndex(r => r.EmpresaId);
        builder.HasIndex(r => r.NombreEntidad);
        builder.HasIndex(r => new { r.NombreEntidad, r.EntidadId });
    }
}
