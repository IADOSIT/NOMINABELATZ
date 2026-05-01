-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo de Nómina
-- ===================================

USE ImperhaNomninas;
GO

-- ===================================
-- TABLA: PeriodosNomina
-- ===================================
CREATE TABLE nom.PeriodosNomina (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    NumeroPeriodo INT NOT NULL,
    Ejercicio INT NOT NULL,
    TipoNomina INT NOT NULL, -- 1=Ordinaria, 2=Extraordinaria, 3=Aguinaldo, etc.
    Periodicidad INT NOT NULL, -- 1=Diario, 2=Semanal, 4=Quincenal, 5=Mensual

    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    FechaPago DATE NOT NULL,
    Descripcion NVARCHAR(200) NOT NULL,

    Estatus INT NOT NULL DEFAULT 1, -- 1=Abierto, 2=EnCalculo, 3=Calculado, 4=Cerrado, 5=Timbrado
    FechaCierre DATETIME2 NULL,
    UsuarioCierreId UNIQUEIDENTIFIER NULL,
    HashCierre NVARCHAR(500) NULL,

    EsPeriodoZafra BIT NOT NULL DEFAULT 0,

    -- Totales
    TotalPercepciones DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalDeducciones DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalNeto DECIMAL(18,2) NOT NULL DEFAULT 0,
    EmpleadosProcesados INT NOT NULL DEFAULT 0,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    UsuarioModificacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,
    OrigenRegistro NVARCHAR(50) NULL,
    NotasAuditoria NVARCHAR(MAX) NULL,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id),
    FOREIGN KEY (IngenioId) REFERENCES corp.Ingenios(Id)
);
GO

CREATE UNIQUE INDEX IX_PeriodosNomina_Periodo ON nom.PeriodosNomina(EmpresaId, IngenioId, Ejercicio, NumeroPeriodo, TipoNomina) WHERE Activo = 1;
CREATE INDEX IX_PeriodosNomina_Estatus ON nom.PeriodosNomina(Estatus);
CREATE INDEX IX_PeriodosNomina_FechaPago ON nom.PeriodosNomina(FechaPago);
CREATE INDEX IX_PeriodosNomina_Ejercicio ON nom.PeriodosNomina(Ejercicio);
GO

-- ===================================
-- TABLA: NominasEmpleados
-- ===================================
CREATE TABLE nom.NominasEmpleados (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,
    IngenioId UNIQUEIDENTIFIER NULL,
    PeriodoNominaId UNIQUEIDENTIFIER NOT NULL,
    EmpleadoId UNIQUEIDENTIFIER NOT NULL,

    -- Snapshot del empleado al momento del cálculo
    NumeroEmpleado NVARCHAR(20) NOT NULL,
    NombreCompleto NVARCHAR(300) NOT NULL,
    Rfc NVARCHAR(13) NOT NULL,
    Curp NVARCHAR(18) NOT NULL,
    Nss NVARCHAR(11) NOT NULL,
    Departamento NVARCHAR(150) NULL,
    Puesto NVARCHAR(150) NULL,

    -- Salarios del periodo
    SalarioDiario DECIMAL(18,4) NOT NULL,
    SalarioDiarioIntegrado DECIMAL(18,4) NOT NULL,
    SalarioBaseCotizacion DECIMAL(18,4) NOT NULL,

    -- Días del periodo
    DiasTrabajados DECIMAL(5,2) NOT NULL DEFAULT 0,
    DiasIncapacidad DECIMAL(5,2) NOT NULL DEFAULT 0,
    DiasFaltas DECIMAL(5,2) NOT NULL DEFAULT 0,
    DiasVacaciones DECIMAL(5,2) NOT NULL DEFAULT 0,
    HorasExtraDobles DECIMAL(7,2) NOT NULL DEFAULT 0,
    HorasExtraTriples DECIMAL(7,2) NOT NULL DEFAULT 0,

    -- Totales
    TotalPercepcionesGravadas DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalPercepcionesExentas DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalPercepciones DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalDeducciones DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalOtrosPagos DECIMAL(18,2) NOT NULL DEFAULT 0,
    NetoAPagar DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- ISR
    BaseGravableIsr DECIMAL(18,2) NOT NULL DEFAULT 0,
    IsrAntesSubsidio DECIMAL(18,2) NOT NULL DEFAULT 0,
    SubsidioEmpleoAplicado DECIMAL(18,2) NOT NULL DEFAULT 0,
    IsrRetener DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- IMSS
    CuotaObreraImss DECIMAL(18,2) NOT NULL DEFAULT 0,
    CuotaPatronalImss DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- INFONAVIT
    DescuentoInfonavit DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- Estatus
    Estatus INT NOT NULL DEFAULT 1, -- 1=Pendiente, 2=EnProceso, 3=Calculado, 4=Error, 5=Validado
    FechaCalculo DATETIME2 NULL,
    ErroresCalculo NVARCHAR(2000) NULL,

    -- CFDI
    UuidCfdi NVARCHAR(50) NULL,
    FechaTimbrado DATETIME2 NULL,
    EstatusCfdi INT NOT NULL DEFAULT 1, -- 1=Pendiente, 2=EnProceso, 3=Timbrado, 4=Error, 5=Cancelado

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    UsuarioModificacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,
    OrigenRegistro NVARCHAR(50) NULL,
    NotasAuditoria NVARCHAR(MAX) NULL,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id),
    FOREIGN KEY (PeriodoNominaId) REFERENCES nom.PeriodosNomina(Id),
    FOREIGN KEY (EmpleadoId) REFERENCES rh.Empleados(Id)
);
GO

CREATE UNIQUE INDEX IX_NominasEmpleados_PeriodoEmpleado ON nom.NominasEmpleados(PeriodoNominaId, EmpleadoId);
CREATE INDEX IX_NominasEmpleados_Estatus ON nom.NominasEmpleados(Estatus);
CREATE INDEX IX_NominasEmpleados_UuidCfdi ON nom.NominasEmpleados(UuidCfdi);
CREATE INDEX IX_NominasEmpleados_EmpleadoId ON nom.NominasEmpleados(EmpleadoId);
GO

-- ===================================
-- TABLA: PercepcionesNomina
-- ===================================
CREATE TABLE nom.PercepcionesNomina (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NominaEmpleadoId UNIQUEIDENTIFIER NOT NULL,

    TipoPercepcion INT NOT NULL, -- Catálogo SAT
    Clave NVARCHAR(10) NOT NULL,
    Descripcion NVARCHAR(200) NOT NULL,
    ImporteGravado DECIMAL(18,4) NOT NULL DEFAULT 0,
    ImporteExento DECIMAL(18,4) NOT NULL DEFAULT 0,
    ConceptoId UNIQUEIDENTIFIER NULL,
    CantidadBase DECIMAL(18,4) NULL,
    ValorUnitario DECIMAL(18,4) NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Version INT NOT NULL DEFAULT 1,
    Activo BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (NominaEmpleadoId) REFERENCES nom.NominasEmpleados(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_PercepcionesNomina_NominaEmpleadoId ON nom.PercepcionesNomina(NominaEmpleadoId);
GO

-- ===================================
-- TABLA: DeduccionesNomina
-- ===================================
CREATE TABLE nom.DeduccionesNomina (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NominaEmpleadoId UNIQUEIDENTIFIER NOT NULL,

    TipoDeduccion INT NOT NULL, -- Catálogo SAT
    Clave NVARCHAR(10) NOT NULL,
    Descripcion NVARCHAR(200) NOT NULL,
    Importe DECIMAL(18,4) NOT NULL DEFAULT 0,
    ConceptoId UNIQUEIDENTIFIER NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Version INT NOT NULL DEFAULT 1,
    Activo BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (NominaEmpleadoId) REFERENCES nom.NominasEmpleados(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_DeduccionesNomina_NominaEmpleadoId ON nom.DeduccionesNomina(NominaEmpleadoId);
GO

-- ===================================
-- TABLA: OtrosPagosNomina
-- ===================================
CREATE TABLE nom.OtrosPagosNomina (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NominaEmpleadoId UNIQUEIDENTIFIER NOT NULL,

    TipoOtroPago INT NOT NULL, -- Catálogo SAT
    Clave NVARCHAR(10) NOT NULL,
    Descripcion NVARCHAR(200) NOT NULL,
    Importe DECIMAL(18,4) NOT NULL DEFAULT 0,
    SubsidioCausado DECIMAL(18,4) NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Version INT NOT NULL DEFAULT 1,
    Activo BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (NominaEmpleadoId) REFERENCES nom.NominasEmpleados(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_OtrosPagosNomina_NominaEmpleadoId ON nom.OtrosPagosNomina(NominaEmpleadoId);
GO

-- ===================================
-- TABLA: ConceptosNomina (Catálogo)
-- ===================================
CREATE TABLE nom.ConceptosNomina (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpresaId UNIQUEIDENTIFIER NOT NULL,

    Tipo INT NOT NULL, -- 1=Percepcion, 2=Deduccion, 3=OtroPago
    Clave NVARCHAR(20) NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    TipoSat INT NOT NULL,
    ClaveSat NVARCHAR(10) NOT NULL,

    -- Configuración
    EsGravado BIT NOT NULL DEFAULT 1,
    EsExento BIT NOT NULL DEFAULT 0,
    PorcentajeExento DECIMAL(5,2) NULL,
    TopesExencion NVARCHAR(500) NULL, -- JSON con configuración de topes
    Formula NVARCHAR(1000) NULL, -- Fórmula de cálculo

    -- Contabilidad
    CuentaContableDebito NVARCHAR(50) NULL,
    CuentaContableCredito NVARCHAR(50) NULL,

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1,

    FOREIGN KEY (EmpresaId) REFERENCES corp.Empresas(Id)
);
GO

CREATE UNIQUE INDEX IX_ConceptosNomina_Clave ON nom.ConceptosNomina(EmpresaId, Clave) WHERE Activo = 1;
CREATE INDEX IX_ConceptosNomina_Tipo ON nom.ConceptosNomina(Tipo);
GO

PRINT 'Tablas de Nómina creadas correctamente';
GO
