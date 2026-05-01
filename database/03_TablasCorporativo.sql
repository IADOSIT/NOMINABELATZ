-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo Corporativo
-- ===================================

USE ImperhaNomninas;
GO

-- ===================================
-- TABLA: Empresas
-- ===================================
CREATE TABLE corp.Empresas (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    -- Datos generales
    RazonSocial NVARCHAR(250) NOT NULL,
    NombreComercial NVARCHAR(250) NOT NULL,
    Rfc NVARCHAR(13) NOT NULL,
    RegimenFiscal NVARCHAR(100) NOT NULL,
    CodigoRegimenFiscal NVARCHAR(10) NOT NULL,

    -- Dirección fiscal
    DireccionFiscalCalle NVARCHAR(250) NULL,
    DireccionFiscalNumeroExterior NVARCHAR(50) NULL,
    DireccionFiscalNumeroInterior NVARCHAR(50) NULL,
    DireccionFiscalColonia NVARCHAR(150) NULL,
    DireccionFiscalCodigoPostal NVARCHAR(10) NULL,
    DireccionFiscalMunicipio NVARCHAR(150) NULL,
    DireccionFiscalEstado NVARCHAR(100) NULL,
    DireccionFiscalPais NVARCHAR(100) DEFAULT 'México',

    -- Contacto
    Telefono NVARCHAR(50) NULL,
    CorreoElectronico NVARCHAR(150) NULL,
    SitioWeb NVARCHAR(250) NULL,

    -- Branding
    RutaLogo NVARCHAR(500) NULL,
    ColorPrimario NVARCHAR(20) DEFAULT '#1976D2',
    ColorSecundario NVARCHAR(20) DEFAULT '#424242',
    ColorAcento NVARCHAR(20) DEFAULT '#FF5722',

    -- Configuración fiscal
    RegistroPatronalImss NVARCHAR(20) NULL,
    RegistroInfonavit NVARCHAR(20) NULL,
    RutaCertificadoCsd NVARCHAR(500) NULL,
    RutaLlaveCsd NVARCHAR(500) NULL,
    ContrasenasCsdEncriptada NVARCHAR(500) NULL,
    VigenciaCsd DATETIME2 NULL,

    -- Configuración recibos
    TextoLegalRecibos NVARCHAR(2000) NULL,
    PiePaginaRecibos NVARCHAR(500) NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    UsuarioModificacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaEliminacion DATETIME2 NULL,
    UsuarioEliminacionId UNIQUEIDENTIFIER NULL,
    Version INT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX IX_Empresas_Rfc ON corp.Empresas(Rfc) WHERE Activo = 1;
CREATE INDEX IX_Empresas_Activo ON corp.Empresas(Activo);
GO

-- ===================================
-- TABLA: Ingenios
-- ===================================
CREATE TABLE corp.Ingenios (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,

    -- Datos generales
    Nombre NVARCHAR(150) NOT NULL,
    Clave NVARCHAR(20) NOT NULL,
    Descripcion NVARCHAR(500) NULL,

    -- Ubicación
    Direccion NVARCHAR(500) NULL,
    Municipio NVARCHAR(150) NULL,
    Estado NVARCHAR(100) NULL,
    CodigoPostal NVARCHAR(10) NULL,
    Latitud DECIMAL(18,10) NULL,
    Longitud DECIMAL(18,10) NULL,

    -- Configuración fiscal
    RegistroPatronalImss NVARCHAR(20) NOT NULL,
    ClaseRiesgoImss INT NOT NULL DEFAULT 5,
    PrimaRiesgoTrabajo DECIMAL(10,5) NOT NULL DEFAULT 7.58875,
    RegistroInfonavit NVARCHAR(20) NULL,

    -- Zafra
    EnZafra BIT NOT NULL DEFAULT 0,
    InicioZafraActual DATETIME2 NULL,
    FinZafraEstimado DATETIME2 NULL,
    NumeroZafra NVARCHAR(20) NULL,

    -- Operativo
    CapacidadMoliendaDiaria DECIMAL(18,2) NULL,
    NumeroEmpleadosActivos INT NOT NULL DEFAULT 0,
    ZonaSalarioMinimo NVARCHAR(10) DEFAULT 'UNICA',

    -- Branding
    RutaLogo NVARCHAR(500) NULL,
    ColorPrimario NVARCHAR(20) NULL,

    -- Contacto
    Telefono NVARCHAR(50) NULL,
    CorreoElectronico NVARCHAR(150) NULL,
    NombreResponsable NVARCHAR(200) NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    UsuarioModificacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaEliminacion DATETIME2 NULL,
    UsuarioEliminacionId UNIQUEIDENTIFIER NULL,
    Version INT NOT NULL DEFAULT 1,
    OrigenRegistro NVARCHAR(50) NULL,
    LoteImportacionId UNIQUEIDENTIFIER NULL,
    NotasAuditoria NVARCHAR(MAX) NULL,
    DireccionIp NVARCHAR(50) NULL,
    AgenteUsuario NVARCHAR(500) NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id)
);
GO

CREATE UNIQUE INDEX IX_Ingenios_EmpresaClave ON corp.Ingenios(EmpresaId, Clave) WHERE Activo = 1;
CREATE INDEX IX_Ingenios_RegistroPatronalImss ON corp.Ingenios(RegistroPatronalImss);
CREATE INDEX IX_Ingenios_Activo ON corp.Ingenios(Activo);
CREATE INDEX IX_Ingenios_EnZafra ON corp.Ingenios(EnZafra);
GO

-- ===================================
-- TABLA: ConfiguracionEmpresa
-- ===================================
CREATE TABLE corp.ConfiguracionEmpresa (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,

    -- Configuración de nómina
    DiasAguinaldo INT NOT NULL DEFAULT 15,
    PorcentajePrimaVacacional DECIMAL(5,2) NOT NULL DEFAULT 25.00,
    DiasGraciaFaltas INT NOT NULL DEFAULT 0,
    AplicaSubsidioEmpleoDefecto BIT NOT NULL DEFAULT 1,

    -- Configuración CFDI
    ProveedorTimbrado NVARCHAR(50) NULL,
    UsuarioPac NVARCHAR(100) NULL,
    PasswordPacEncriptado NVARCHAR(500) NULL,
    ModoProduccionCfdi BIT NOT NULL DEFAULT 0,

    -- Configuración de correo
    ServidorSmtp NVARCHAR(250) NULL,
    PuertoSmtp INT NULL,
    UsuarioSmtp NVARCHAR(150) NULL,
    PasswordSmtpEncriptado NVARCHAR(500) NULL,
    UsarSsl BIT NOT NULL DEFAULT 1,
    CorreoRemitente NVARCHAR(150) NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioModificacionId UNIQUEIDENTIFIER NULL,
    Version INT NOT NULL DEFAULT 1,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id)
);
GO

CREATE UNIQUE INDEX IX_ConfiguracionEmpresa_EmpresaId ON corp.ConfiguracionEmpresa(EmpresaId);
GO

PRINT 'Tablas corporativas creadas correctamente';
GO
