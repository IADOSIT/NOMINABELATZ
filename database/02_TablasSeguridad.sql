-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo de Seguridad
-- ===================================

USE ImperhaNomninas;
GO

-- ===================================
-- TABLA: Usuarios
-- ===================================
CREATE TABLE seg.Usuarios (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NombreUsuario NVARCHAR(100) NOT NULL,
    CorreoElectronico NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    Nombres NVARCHAR(150) NOT NULL,
    ApellidoPaterno NVARCHAR(100) NOT NULL,
    ApellidoMaterno NVARCHAR(100) NULL,
    Telefono NVARCHAR(20) NULL,
    RutaFoto NVARCHAR(500) NULL,

    -- Seguridad
    IntentosFallidos INT NOT NULL DEFAULT 0,
    BloqueadoHasta DATETIME2 NULL,
    UltimoAcceso DATETIME2 NULL,
    CambiarPasswordProximoLogin BIT NOT NULL DEFAULT 0,
    TokenRecuperacion NVARCHAR(500) NULL,
    FechaExpiracionToken DATETIME2 NULL,

    -- Multi-empresa
    EmpresaId UNIQUEIDENTIFIER NULL,
    IngenioId UNIQUEIDENTIFIER NULL,
    PuedeAccederTodasEmpresas BIT NOT NULL DEFAULT 0,
    PuedeAccederTodosIngenios BIT NOT NULL DEFAULT 0,

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

CREATE UNIQUE INDEX IX_Usuarios_NombreUsuario ON seg.Usuarios(NombreUsuario) WHERE Activo = 1;
CREATE UNIQUE INDEX IX_Usuarios_CorreoElectronico ON seg.Usuarios(CorreoElectronico) WHERE Activo = 1;
CREATE INDEX IX_Usuarios_EmpresaId ON seg.Usuarios(EmpresaId);
CREATE INDEX IX_Usuarios_Activo ON seg.Usuarios(Activo);
GO

-- ===================================
-- TABLA: Roles
-- ===================================
CREATE TABLE seg.Roles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    EsRolSistema BIT NOT NULL DEFAULT 0,
    EmpresaId UNIQUEIDENTIFIER NULL, -- NULL = rol global

    -- Auditoría
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaModificacion DATETIME2 NULL,
    UsuarioCreacionId UNIQUEIDENTIFIER NULL,
    UsuarioModificacionId UNIQUEIDENTIFIER NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Version INT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX IX_Roles_Nombre_Empresa ON seg.Roles(Nombre, EmpresaId) WHERE Activo = 1;
GO

-- ===================================
-- TABLA: Permisos
-- ===================================
CREATE TABLE seg.Permisos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Modulo NVARCHAR(100) NOT NULL,
    Accion NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX IX_Permisos_ModuloAccion ON seg.Permisos(Modulo, Accion);
GO

-- ===================================
-- TABLA: UsuariosRoles
-- ===================================
CREATE TABLE seg.UsuariosRoles (
    UsuarioId UNIQUEIDENTIFIER NOT NULL,
    RolId UNIQUEIDENTIFIER NOT NULL,
    FechaAsignacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AsignadoPorId UNIQUEIDENTIFIER NULL,

    PRIMARY KEY (UsuarioId, RolId),
    FOREIGN KEY (UsuarioId) REFERENCES seg.Usuarios(Id),
    FOREIGN KEY (RolId) REFERENCES seg.Roles(Id)
);
GO

-- ===================================
-- TABLA: RolesPermisos
-- ===================================
CREATE TABLE seg.RolesPermisos (
    RolId UNIQUEIDENTIFIER NOT NULL,
    PermisoId UNIQUEIDENTIFIER NOT NULL,

    PRIMARY KEY (RolId, PermisoId),
    FOREIGN KEY (RolId) REFERENCES seg.Roles(Id),
    FOREIGN KEY (PermisoId) REFERENCES seg.Permisos(Id)
);
GO

-- ===================================
-- TABLA: SesionesUsuario
-- ===================================
CREATE TABLE seg.SesionesUsuario (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UsuarioId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(1000) NOT NULL,
    RefreshToken NVARCHAR(500) NULL,
    FechaInicio DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FechaExpiracion DATETIME2 NOT NULL,
    FechaExpiracionRefresh DATETIME2 NULL,
    DireccionIp NVARCHAR(50) NULL,
    AgenteUsuario NVARCHAR(500) NULL,
    Activa BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (UsuarioId) REFERENCES seg.Usuarios(Id)
);
GO

CREATE INDEX IX_SesionesUsuario_UsuarioId ON seg.SesionesUsuario(UsuarioId);
CREATE INDEX IX_SesionesUsuario_Token ON seg.SesionesUsuario(Token);
GO

-- ===================================
-- DATOS INICIALES DE SEGURIDAD
-- ===================================

-- Insertar roles del sistema
INSERT INTO seg.Roles (Id, Nombre, Descripcion, EsRolSistema) VALUES
    (NEWID(), 'Administrador', 'Acceso completo al sistema', 1),
    (NEWID(), 'Nominas', 'Gestión de nóminas y cálculos', 1),
    (NEWID(), 'RecursosHumanos', 'Gestión de empleados y expedientes', 1),
    (NEWID(), 'Contabilidad', 'Acceso a módulo contable', 1),
    (NEWID(), 'Consulta', 'Solo lectura', 1),
    (NEWID(), 'Kiosko', 'Acceso al kiosko del empleado', 1);
GO

-- Insertar permisos del sistema
INSERT INTO seg.Permisos (Id, Modulo, Accion, Descripcion) VALUES
    -- Empleados
    (NEWID(), 'Empleados', 'Ver', 'Ver lista de empleados'),
    (NEWID(), 'Empleados', 'Crear', 'Crear nuevos empleados'),
    (NEWID(), 'Empleados', 'Editar', 'Modificar empleados'),
    (NEWID(), 'Empleados', 'Eliminar', 'Dar de baja empleados'),
    (NEWID(), 'Empleados', 'Exportar', 'Exportar información de empleados'),

    -- Nómina
    (NEWID(), 'Nomina', 'Ver', 'Ver nóminas'),
    (NEWID(), 'Nomina', 'Calcular', 'Calcular nóminas'),
    (NEWID(), 'Nomina', 'Cerrar', 'Cerrar periodos'),
    (NEWID(), 'Nomina', 'Timbrar', 'Timbrar CFDI'),
    (NEWID(), 'Nomina', 'Cancelar', 'Cancelar CFDI'),

    -- Configuración
    (NEWID(), 'Configuracion', 'Ver', 'Ver configuración'),
    (NEWID(), 'Configuracion', 'Editar', 'Modificar configuración'),

    -- Auditoría
    (NEWID(), 'Auditoria', 'Ver', 'Ver bitácoras'),
    (NEWID(), 'Auditoria', 'Exportar', 'Exportar bitácoras');
GO

PRINT 'Tablas de seguridad creadas correctamente';
GO
