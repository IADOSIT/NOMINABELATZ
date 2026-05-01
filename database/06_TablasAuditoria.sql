-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo de Auditoría
-- ===================================

USE ImperhaNomninas;
GO

-- ===================================
-- TABLA: RegistrosAuditoria
-- ===================================
CREATE TABLE aud.RegistrosAuditoria (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UsuarioId UNIQUEIDENTIFIER NOT NULL,
    EmpresaId UNIQUEIDENTIFIER NULL,
    IngenioId UNIQUEIDENTIFIER NULL,

    FechaHora DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    TipoAccion NVARCHAR(50) NOT NULL, -- Added, Modified, Deleted
    NombreEntidad NVARCHAR(100) NOT NULL,
    EntidadId UNIQUEIDENTIFIER NOT NULL,

    ValoresAnteriores NVARCHAR(MAX) NULL, -- JSON
    ValoresNuevos NVARCHAR(MAX) NULL, -- JSON

    DireccionIp NVARCHAR(50) NULL,
    AgenteUsuario NVARCHAR(500) NULL,

    -- Índice para búsquedas por fecha
    FechaHoraLocal AS DATEADD(HOUR, -6, FechaHora) PERSISTED
);
GO

CREATE INDEX IX_RegistrosAuditoria_FechaHora ON aud.RegistrosAuditoria(FechaHora);
CREATE INDEX IX_RegistrosAuditoria_UsuarioId ON aud.RegistrosAuditoria(UsuarioId);
CREATE INDEX IX_RegistrosAuditoria_EmpresaId ON aud.RegistrosAuditoria(EmpresaId);
CREATE INDEX IX_RegistrosAuditoria_NombreEntidad ON aud.RegistrosAuditoria(NombreEntidad);
CREATE INDEX IX_RegistrosAuditoria_EntidadId ON aud.RegistrosAuditoria(NombreEntidad, EntidadId);
GO

-- ===================================
-- TABLA: BitacoraAccesos
-- ===================================
CREATE TABLE aud.BitacoraAccesos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UsuarioId UNIQUEIDENTIFIER NULL,
    NombreUsuario NVARCHAR(100) NOT NULL,

    FechaHora DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    TipoEvento NVARCHAR(50) NOT NULL, -- Login, Logout, LoginFallido, CambioPassword, etc.
    Exitoso BIT NOT NULL,
    MensajeError NVARCHAR(500) NULL,

    DireccionIp NVARCHAR(50) NULL,
    AgenteUsuario NVARCHAR(500) NULL,

    EmpresaId UNIQUEIDENTIFIER NULL,
    IngenioId UNIQUEIDENTIFIER NULL
);
GO

CREATE INDEX IX_BitacoraAccesos_FechaHora ON aud.BitacoraAccesos(FechaHora);
CREATE INDEX IX_BitacoraAccesos_UsuarioId ON aud.BitacoraAccesos(UsuarioId);
CREATE INDEX IX_BitacoraAccesos_TipoEvento ON aud.BitacoraAccesos(TipoEvento);
CREATE INDEX IX_BitacoraAccesos_DireccionIp ON aud.BitacoraAccesos(DireccionIp);
GO

-- ===================================
-- TABLA: HistorialCambiosSalario
-- ===================================
CREATE TABLE aud.HistorialCambiosSalario (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpleadoId UNIQUEIDENTIFIER NOT NULL,

    FechaCambio DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaEfectiva DATE NOT NULL,

    SalarioAnterior DECIMAL(18,4) NOT NULL,
    SalarioNuevo DECIMAL(18,4) NOT NULL,
    SdiAnterior DECIMAL(18,4) NOT NULL,
    SdiNuevo DECIMAL(18,4) NOT NULL,

    MotivoCambio NVARCHAR(200) NULL,
    Observaciones NVARCHAR(1000) NULL,

    UsuarioId UNIQUEIDENTIFIER NOT NULL,
    DireccionIp NVARCHAR(50) NULL,

    FOREIGN KEY (EmpleadoId) REFERENCES rh.Empleados(Id)
);
GO

CREATE INDEX IX_HistorialCambiosSalario_EmpleadoId ON aud.HistorialCambiosSalario(EmpleadoId);
CREATE INDEX IX_HistorialCambiosSalario_FechaCambio ON aud.HistorialCambiosSalario(FechaCambio);
GO

-- ===================================
-- TABLA: HistorialMovimientosEmpleado
-- ===================================
CREATE TABLE aud.HistorialMovimientosEmpleado (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmpleadoId UNIQUEIDENTIFIER NOT NULL,

    FechaMovimiento DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaEfectiva DATE NOT NULL,
    TipoMovimiento NVARCHAR(50) NOT NULL, -- Alta, Baja, Reingreso, CambioPuesto, CambioDepartamento, etc.

    -- Valores anteriores
    DepartamentoAnteriorId UNIQUEIDENTIFIER NULL,
    PuestoAnteriorId UNIQUEIDENTIFIER NULL,
    TurnoAnteriorId UNIQUEIDENTIFIER NULL,

    -- Valores nuevos
    DepartamentoNuevoId UNIQUEIDENTIFIER NULL,
    PuestoNuevoId UNIQUEIDENTIFIER NULL,
    TurnoNuevoId UNIQUEIDENTIFIER NULL,

    Motivo NVARCHAR(200) NULL,
    Observaciones NVARCHAR(1000) NULL,
    DocumentoSoporte NVARCHAR(500) NULL,

    UsuarioId UNIQUEIDENTIFIER NOT NULL,
    DireccionIp NVARCHAR(50) NULL,

    FOREIGN KEY (EmpleadoId) REFERENCES rh.Empleados(Id)
);
GO

CREATE INDEX IX_HistorialMovimientosEmpleado_EmpleadoId ON aud.HistorialMovimientosEmpleado(EmpleadoId);
CREATE INDEX IX_HistorialMovimientosEmpleado_FechaMovimiento ON aud.HistorialMovimientosEmpleado(FechaMovimiento);
CREATE INDEX IX_HistorialMovimientosEmpleado_TipoMovimiento ON aud.HistorialMovimientosEmpleado(TipoMovimiento);
GO

-- ===================================
-- TABLA: HistorialCierresNomina
-- ===================================
CREATE TABLE aud.HistorialCierresNomina (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PeriodoNominaId UNIQUEIDENTIFIER NOT NULL,

    FechaCierre DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    TotalPercepciones DECIMAL(18,2) NOT NULL,
    TotalDeducciones DECIMAL(18,2) NOT NULL,
    TotalNeto DECIMAL(18,2) NOT NULL,
    EmpleadosProcesados INT NOT NULL,

    HashIntegridad NVARCHAR(500) NOT NULL,
    ResumenJson NVARCHAR(MAX) NULL, -- JSON con resumen detallado

    UsuarioCierreId UNIQUEIDENTIFIER NOT NULL,
    DireccionIp NVARCHAR(50) NULL,
    AgenteUsuario NVARCHAR(500) NULL,

    FOREIGN KEY (PeriodoNominaId) REFERENCES nom.PeriodosNomina(Id)
);
GO

CREATE INDEX IX_HistorialCierresNomina_PeriodoNominaId ON aud.HistorialCierresNomina(PeriodoNominaId);
CREATE INDEX IX_HistorialCierresNomina_FechaCierre ON aud.HistorialCierresNomina(FechaCierre);
GO

-- ===================================
-- VISTA: vw_AuditoriaCompleta
-- ===================================
CREATE VIEW aud.vw_AuditoriaCompleta AS
SELECT
    ra.Id,
    ra.FechaHora,
    ra.TipoAccion,
    ra.NombreEntidad,
    ra.EntidadId,
    u.NombreUsuario,
    u.Nombres + ' ' + u.ApellidoPaterno AS NombreCompletoUsuario,
    e.NombreComercial AS Empresa,
    i.Nombre AS Ingenio,
    ra.DireccionIp,
    ra.ValoresAnteriores,
    ra.ValoresNuevos
FROM aud.RegistrosAuditoria ra
LEFT JOIN seg.Usuarios u ON ra.UsuarioId = u.Id
LEFT JOIN corp.Empresas e ON ra.EmpresaId = e.Id
LEFT JOIN corp.Ingenios i ON ra.IngenioId = i.Id;
GO

PRINT 'Tablas de Auditoría creadas correctamente';
GO
