-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo Recursos Humanos
-- ===================================

USE ImperhaNomninas;
GO

-- ===================================
-- TABLA: Departamentos
-- ===================================
CREATE TABLE rh.Departamentos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    Clave NVARCHAR(20) NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    DepartamentoPadreId UNIQUEIDENTIFIER NULL,
    ResponsableId UNIQUEIDENTIFIER NULL,
    CentroCostoId UNIQUEIDENTIFIER NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id),
    FOREIGN KEY (DepartamentoPadreId) REFERENCES rh.Departamentos(Id)
);
GO

CREATE INDEX IX_Departamentos_EmpresaId ON rh.Departamentos(EmpresaId);
CREATE UNIQUE INDEX IX_Departamentos_Clave ON rh.Departamentos(EmpresaId, Clave) WHERE Activo = 1;
GO

-- ===================================
-- TABLA: Puestos
-- ===================================
CREATE TABLE rh.Puestos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,

    Clave NVARCHAR(20) NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(1000) NULL,
    NivelJerarquico INT NOT NULL DEFAULT 1,
    TabuladorSalarioMinimo DECIMAL(18,4) NULL,
    TabuladorSalarioMaximo DECIMAL(18,4) NULL,
    EsSindicalizado BIT NOT NULL DEFAULT 0,
    RequiereAprobacionEspecial BIT NOT NULL DEFAULT 0,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id)
);
GO

CREATE INDEX IX_Puestos_EmpresaId ON rh.Puestos(EmpresaId);
CREATE UNIQUE INDEX IX_Puestos_Clave ON rh.Puestos(EmpresaId, Clave) WHERE Activo = 1;
GO

-- ===================================
-- TABLA: CentrosCosto
-- ===================================
CREATE TABLE rh.CentrosCosto (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    Clave NVARCHAR(30) NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    CuentaContable NVARCHAR(50) NULL,
    CentroCostoPadreId UNIQUEIDENTIFIER NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id),
    FOREIGN KEY (CentroCostoPadreId) REFERENCES rh.CentrosCosto(Id)
);
GO

CREATE INDEX IX_CentrosCosto_EmpresaId ON rh.CentrosCosto(EmpresaId);
CREATE UNIQUE INDEX IX_CentrosCosto_Clave ON rh.CentrosCosto(EmpresaId, Clave) WHERE Activo = 1;
GO

-- ===================================
-- TABLA: Turnos
-- ===================================
CREATE TABLE rh.Turnos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    Clave NVARCHAR(20) NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    HoraEntrada TIME NOT NULL,
    HoraSalida TIME NOT NULL,
    HorasJornada DECIMAL(4,2) NOT NULL,
    TipoJornada INT NOT NULL, -- 1=Diurna, 2=Nocturna, 3=Mixta
    ToleranciaEntradaMinutos INT NOT NULL DEFAULT 15,
    ToleranciaSalidaMinutos INT NOT NULL DEFAULT 15,
    EsTurnoZafra BIT NOT NULL DEFAULT 0,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id)
);
GO

CREATE INDEX IX_Turnos_EmpresaId ON rh.Turnos(EmpresaId);
GO

-- ===================================
-- TABLA: Empleados
-- ===================================
CREATE TABLE rh.Empleados (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    -- Identificación
    NumeroEmpleado NVARCHAR(20) NOT NULL,
    Curp NVARCHAR(18) NOT NULL,
    Rfc NVARCHAR(13) NOT NULL,
    Nss NVARCHAR(11) NOT NULL,

    -- Datos personales
    Nombres NVARCHAR(150) NOT NULL,
    ApellidoPaterno NVARCHAR(100) NOT NULL,
    ApellidoMaterno NVARCHAR(100) NULL,
    FechaNacimiento DATE NOT NULL,
    Genero INT NOT NULL, -- 1=Masculino, 2=Femenino
    EstadoCivil INT NOT NULL DEFAULT 1,
    Nacionalidad NVARCHAR(50) DEFAULT 'Mexicana',
    LugarNacimiento NVARCHAR(100) NULL,

    -- Contacto
    CorreoPersonal NVARCHAR(150) NULL,
    CorreoInstitucional NVARCHAR(150) NULL,
    TelefonoCelular NVARCHAR(20) NULL,
    TelefonoCasa NVARCHAR(20) NULL,

    -- Domicilio
    DomicilioCalle NVARCHAR(250) NULL,
    DomicilioNumeroExterior NVARCHAR(50) NULL,
    DomicilioNumeroInterior NVARCHAR(50) NULL,
    DomicilioColonia NVARCHAR(150) NULL,
    DomicilioCodigoPostal NVARCHAR(10) NULL,
    DomicilioMunicipio NVARCHAR(150) NULL,
    DomicilioEstado NVARCHAR(100) NULL,

    -- Datos laborales
    FechaIngreso DATE NOT NULL,
    FechaAntiguedad DATE NOT NULL,
    FechaAltaImss DATE NOT NULL,
    TipoContrato INT NOT NULL,
    TipoRegimen INT NOT NULL,
    TipoJornada INT NOT NULL,
    PeriodicidadPago INT NOT NULL,
    EstatusLaboral INT NOT NULL DEFAULT 1,
    TipoTrabajador INT NOT NULL,
    EsTrabajadorZafra BIT NOT NULL DEFAULT 0,

    -- Estructura organizacional
    DepartamentoId UNIQUEIDENTIFIER NOT NULL,
    PuestoId UNIQUEIDENTIFIER NOT NULL,
    CentroCostoId UNIQUEIDENTIFIER NULL,
    TurnoId UNIQUEIDENTIFIER NULL,
    JefeInmediatoId UNIQUEIDENTIFIER NULL,

    -- Salarios
    SalarioDiario DECIMAL(18,4) NOT NULL,
    MonedaSalarioDiario NVARCHAR(3) DEFAULT 'MXN',
    SalarioDiarioIntegrado DECIMAL(18,4) NOT NULL,
    MonedaSdi NVARCHAR(3) DEFAULT 'MXN',
    SalarioBaseCotizacion DECIMAL(18,4) NOT NULL,
    MonedaSbc NVARCHAR(3) DEFAULT 'MXN',
    FormaPago INT NOT NULL DEFAULT 3,
    BancoDeposito NVARCHAR(100) NULL,
    ClabeInterbancaria NVARCHAR(18) NULL,
    NumeroCuentaBancaria NVARCHAR(20) NULL,

    -- Fiscales
    AplicaSubsidioEmpleo BIT NOT NULL DEFAULT 1,
    TieneCreditoInfonavit BIT NOT NULL DEFAULT 0,
    NumeroCreditoInfonavit NVARCHAR(20) NULL,
    TipoDescuentoInfonavit INT NULL,
    ValorDescuentoInfonavit DECIMAL(18,4) NULL,
    FechaInicioInfonavit DATE NULL,

    -- Contacto emergencia
    ContactoEmergenciaNombre NVARCHAR(200) NULL,
    ContactoEmergenciaTelefono NVARCHAR(20) NULL,
    ContactoEmergenciaParentesco NVARCHAR(50) NULL,

    -- Biométricos
    IdBiometrico NVARCHAR(50) NULL,
    TieneHuellaRegistrada BIT NOT NULL DEFAULT 0,
    TieneRostroRegistrado BIT NOT NULL DEFAULT 0,
    RutaFoto NVARCHAR(500) NULL,

    -- Baja
    FechaBaja DATE NULL,
    MotivoBaja INT NULL,
    ObservacionesBaja NVARCHAR(1000) NULL,

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

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id),
    FOREIGN KEY (IngenioId) REFERENCES corp.Ingenios(Id),
    FOREIGN KEY (DepartamentoId) REFERENCES rh.Departamentos(Id),
    FOREIGN KEY (PuestoId) REFERENCES rh.Puestos(Id),
    FOREIGN KEY (CentroCostoId) REFERENCES rh.CentrosCosto(Id),
    FOREIGN KEY (TurnoId) REFERENCES rh.Turnos(Id),
    FOREIGN KEY (JefeInmediatoId) REFERENCES rh.Empleados(Id)
);
GO

CREATE UNIQUE INDEX IX_Empleados_NumeroEmpleado ON rh.Empleados(EmpresaId, IngenioId, NumeroEmpleado) WHERE Activo = 1;
CREATE INDEX IX_Empleados_Curp ON rh.Empleados(Curp);
CREATE INDEX IX_Empleados_Rfc ON rh.Empleados(Rfc);
CREATE INDEX IX_Empleados_Nss ON rh.Empleados(Nss);
CREATE INDEX IX_Empleados_DepartamentoId ON rh.Empleados(DepartamentoId);
CREATE INDEX IX_Empleados_PuestoId ON rh.Empleados(PuestoId);
CREATE INDEX IX_Empleados_EstatusLaboral ON rh.Empleados(EstatusLaboral);
CREATE INDEX IX_Empleados_TipoTrabajador ON rh.Empleados(TipoTrabajador);
CREATE INDEX IX_Empleados_Activo ON rh.Empleados(Activo);
CREATE INDEX IX_Empleados_FechaIngreso ON rh.Empleados(FechaIngreso);
GO

PRINT 'Tablas de Recursos Humanos creadas correctamente';
GO
