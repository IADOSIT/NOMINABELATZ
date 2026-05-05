-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo de Seguridad (PostgreSQL)
-- ===================================

-- ===================================
-- TABLA: Usuarios
-- ===================================
CREATE TABLE seg."Usuarios" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "NombreUsuario" VARCHAR(100) NOT NULL,
    "CorreoElectronico" VARCHAR(256) NOT NULL,
    "PasswordHash" VARCHAR(500) NOT NULL,
    "Nombres" VARCHAR(150) NOT NULL,
    "ApellidoPaterno" VARCHAR(100) NOT NULL,
    "ApellidoMaterno" VARCHAR(100) NULL,
    "Telefono" VARCHAR(20) NULL,
    "RutaFoto" VARCHAR(500) NULL,

    -- Seguridad
    "IntentosFallidos" INT NOT NULL DEFAULT 0,
    "BloqueadoHasta" TIMESTAMPTZ NULL,
    "UltimoAcceso" TIMESTAMPTZ NULL,
    "CambiarPasswordProximoLogin" BOOLEAN NOT NULL DEFAULT FALSE,
    "TokenRecuperacion" VARCHAR(500) NULL,
    "FechaExpiracionToken" TIMESTAMPTZ NULL,

    -- Multi-empresa
    "EmpresaId" UUID NULL,
    "IngenioId" UUID NULL,
    "PuedeAccederTodasEmpresas" BOOLEAN NOT NULL DEFAULT FALSE,
    "PuedeAccederTodosIngenios" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "UsuarioModificacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "FechaEliminacion" TIMESTAMPTZ NULL,
    "UsuarioEliminacionId" UUID NULL,
    "Version" INT NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX "IX_Usuarios_NombreUsuario" ON seg."Usuarios"("NombreUsuario") WHERE "Activo" = TRUE;
CREATE UNIQUE INDEX "IX_Usuarios_CorreoElectronico" ON seg."Usuarios"("CorreoElectronico") WHERE "Activo" = TRUE;
CREATE INDEX "IX_Usuarios_EmpresaId" ON seg."Usuarios"("EmpresaId");
CREATE INDEX "IX_Usuarios_Activo" ON seg."Usuarios"("Activo");

-- ===================================
-- TABLA: Roles
-- ===================================
CREATE TABLE seg."Roles" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Nombre" VARCHAR(100) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,
    "EsRolSistema" BOOLEAN NOT NULL DEFAULT FALSE,
    "EmpresaId" UUID NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "UsuarioModificacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX "IX_Roles_Nombre_Empresa" ON seg."Roles"("Nombre", "EmpresaId") WHERE "Activo" = TRUE;

-- ===================================
-- TABLA: Permisos
-- ===================================
CREATE TABLE seg."Permisos" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Modulo" VARCHAR(100) NOT NULL,
    "Accion" VARCHAR(100) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX "IX_Permisos_ModuloAccion" ON seg."Permisos"("Modulo", "Accion");

-- ===================================
-- TABLA: UsuariosRoles
-- ===================================
CREATE TABLE seg."UsuariosRoles" (
    "UsuarioId" UUID NOT NULL,
    "RolId" UUID NOT NULL,
    "FechaAsignacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "AsignadoPorId" UUID NULL,

    PRIMARY KEY ("UsuarioId", "RolId"),
    FOREIGN KEY ("UsuarioId") REFERENCES seg."Usuarios"("Id"),
    FOREIGN KEY ("RolId") REFERENCES seg."Roles"("Id")
);

-- ===================================
-- TABLA: RolesPermisos
-- ===================================
CREATE TABLE seg."RolesPermisos" (
    "RolId" UUID NOT NULL,
    "PermisoId" UUID NOT NULL,

    PRIMARY KEY ("RolId", "PermisoId"),
    FOREIGN KEY ("RolId") REFERENCES seg."Roles"("Id"),
    FOREIGN KEY ("PermisoId") REFERENCES seg."Permisos"("Id")
);

-- ===================================
-- TABLA: SesionesUsuario
-- ===================================
CREATE TABLE seg."SesionesUsuario" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UsuarioId" UUID NOT NULL,
    "Token" VARCHAR(1000) NOT NULL,
    "RefreshToken" VARCHAR(500) NULL,
    "FechaInicio" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaExpiracion" TIMESTAMPTZ NOT NULL,
    "FechaExpiracionRefresh" TIMESTAMPTZ NULL,
    "DireccionIp" VARCHAR(50) NULL,
    "AgenteUsuario" VARCHAR(500) NULL,
    "Activa" BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY ("UsuarioId") REFERENCES seg."Usuarios"("Id")
);

CREATE INDEX "IX_SesionesUsuario_UsuarioId" ON seg."SesionesUsuario"("UsuarioId");
CREATE INDEX "IX_SesionesUsuario_Token" ON seg."SesionesUsuario"("Token");

-- ===================================
-- DATOS INICIALES DE SEGURIDAD
-- ===================================

INSERT INTO seg."Roles" ("Id", "Nombre", "Descripcion", "EsRolSistema") VALUES
    (gen_random_uuid(), 'Administrador', 'Acceso completo al sistema', TRUE),
    (gen_random_uuid(), 'Nominas', 'Gestión de nóminas y cálculos', TRUE),
    (gen_random_uuid(), 'RecursosHumanos', 'Gestión de empleados y expedientes', TRUE),
    (gen_random_uuid(), 'Contabilidad', 'Acceso a módulo contable', TRUE),
    (gen_random_uuid(), 'Consulta', 'Solo lectura', TRUE),
    (gen_random_uuid(), 'Kiosko', 'Acceso al kiosko del empleado', TRUE);

INSERT INTO seg."Permisos" ("Id", "Modulo", "Accion", "Descripcion") VALUES
    (gen_random_uuid(), 'Empleados', 'Ver', 'Ver lista de empleados'),
    (gen_random_uuid(), 'Empleados', 'Crear', 'Crear nuevos empleados'),
    (gen_random_uuid(), 'Empleados', 'Editar', 'Modificar empleados'),
    (gen_random_uuid(), 'Empleados', 'Eliminar', 'Dar de baja empleados'),
    (gen_random_uuid(), 'Empleados', 'Exportar', 'Exportar información de empleados'),
    (gen_random_uuid(), 'Nomina', 'Ver', 'Ver nóminas'),
    (gen_random_uuid(), 'Nomina', 'Calcular', 'Calcular nóminas'),
    (gen_random_uuid(), 'Nomina', 'Cerrar', 'Cerrar periodos'),
    (gen_random_uuid(), 'Nomina', 'Timbrar', 'Timbrar CFDI'),
    (gen_random_uuid(), 'Nomina', 'Cancelar', 'Cancelar CFDI'),
    (gen_random_uuid(), 'Configuracion', 'Ver', 'Ver configuración'),
    (gen_random_uuid(), 'Configuracion', 'Editar', 'Modificar configuración'),
    (gen_random_uuid(), 'Auditoria', 'Ver', 'Ver bitácoras'),
    (gen_random_uuid(), 'Auditoria', 'Exportar', 'Exportar bitácoras');

DO $$ BEGIN RAISE NOTICE 'Tablas de seguridad creadas correctamente'; END $$;
