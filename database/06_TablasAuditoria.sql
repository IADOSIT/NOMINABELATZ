-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo de Auditoría (PostgreSQL)
-- ===================================

-- ===================================
-- TABLA: RegistrosAuditoria
-- ===================================
CREATE TABLE aud."RegistrosAuditoria" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UsuarioId" UUID NOT NULL,
    "EmpresaId" UUID NULL,
    "IngenioId" UUID NULL,

    "FechaHora" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "TipoAccion" VARCHAR(50) NOT NULL,
    "NombreEntidad" VARCHAR(100) NOT NULL,
    "EntidadId" UUID NOT NULL,

    "ValoresAnteriores" TEXT NULL,
    "ValoresNuevos" TEXT NULL,

    "DireccionIp" VARCHAR(50) NULL,
    "AgenteUsuario" VARCHAR(500) NULL,

    -- Columna generada equivalente a DATEADD(HOUR, -6, FechaHora)
    "FechaHoraLocal" TIMESTAMPTZ GENERATED ALWAYS AS ("FechaHora" - INTERVAL '6 hours') STORED
);

CREATE INDEX "IX_RegistrosAuditoria_FechaHora" ON aud."RegistrosAuditoria"("FechaHora");
CREATE INDEX "IX_RegistrosAuditoria_UsuarioId" ON aud."RegistrosAuditoria"("UsuarioId");
CREATE INDEX "IX_RegistrosAuditoria_EmpresaId" ON aud."RegistrosAuditoria"("EmpresaId");
CREATE INDEX "IX_RegistrosAuditoria_NombreEntidad" ON aud."RegistrosAuditoria"("NombreEntidad");
CREATE INDEX "IX_RegistrosAuditoria_EntidadId" ON aud."RegistrosAuditoria"("NombreEntidad", "EntidadId");

-- ===================================
-- TABLA: BitacoraAccesos
-- ===================================
CREATE TABLE aud."BitacoraAccesos" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UsuarioId" UUID NULL,
    "NombreUsuario" VARCHAR(100) NOT NULL,

    "FechaHora" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "TipoEvento" VARCHAR(50) NOT NULL,
    "Exitoso" BOOLEAN NOT NULL,
    "MensajeError" VARCHAR(500) NULL,

    "DireccionIp" VARCHAR(50) NULL,
    "AgenteUsuario" VARCHAR(500) NULL,

    "EmpresaId" UUID NULL,
    "IngenioId" UUID NULL
);

CREATE INDEX "IX_BitacoraAccesos_FechaHora" ON aud."BitacoraAccesos"("FechaHora");
CREATE INDEX "IX_BitacoraAccesos_UsuarioId" ON aud."BitacoraAccesos"("UsuarioId");
CREATE INDEX "IX_BitacoraAccesos_TipoEvento" ON aud."BitacoraAccesos"("TipoEvento");
CREATE INDEX "IX_BitacoraAccesos_DireccionIp" ON aud."BitacoraAccesos"("DireccionIp");

-- ===================================
-- TABLA: HistorialCambiosSalario
-- ===================================
CREATE TABLE aud."HistorialCambiosSalario" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpleadoId" UUID NOT NULL,

    "FechaCambio" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaEfectiva" DATE NOT NULL,

    "SalarioAnterior" DECIMAL(18,4) NOT NULL,
    "SalarioNuevo" DECIMAL(18,4) NOT NULL,
    "SdiAnterior" DECIMAL(18,4) NOT NULL,
    "SdiNuevo" DECIMAL(18,4) NOT NULL,

    "MotivoCambio" VARCHAR(200) NULL,
    "Observaciones" VARCHAR(1000) NULL,

    "UsuarioId" UUID NOT NULL,
    "DireccionIp" VARCHAR(50) NULL,

    FOREIGN KEY ("EmpleadoId") REFERENCES rh."Empleados"("Id")
);

CREATE INDEX "IX_HistorialCambiosSalario_EmpleadoId" ON aud."HistorialCambiosSalario"("EmpleadoId");
CREATE INDEX "IX_HistorialCambiosSalario_FechaCambio" ON aud."HistorialCambiosSalario"("FechaCambio");

-- ===================================
-- TABLA: HistorialMovimientosEmpleado
-- ===================================
CREATE TABLE aud."HistorialMovimientosEmpleado" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpleadoId" UUID NOT NULL,

    "FechaMovimiento" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaEfectiva" DATE NOT NULL,
    "TipoMovimiento" VARCHAR(50) NOT NULL,

    "DepartamentoAnteriorId" UUID NULL,
    "PuestoAnteriorId" UUID NULL,
    "TurnoAnteriorId" UUID NULL,

    "DepartamentoNuevoId" UUID NULL,
    "PuestoNuevoId" UUID NULL,
    "TurnoNuevoId" UUID NULL,

    "Motivo" VARCHAR(200) NULL,
    "Observaciones" VARCHAR(1000) NULL,
    "DocumentoSoporte" VARCHAR(500) NULL,

    "UsuarioId" UUID NOT NULL,
    "DireccionIp" VARCHAR(50) NULL,

    FOREIGN KEY ("EmpleadoId") REFERENCES rh."Empleados"("Id")
);

CREATE INDEX "IX_HistorialMovimientosEmpleado_EmpleadoId" ON aud."HistorialMovimientosEmpleado"("EmpleadoId");
CREATE INDEX "IX_HistorialMovimientosEmpleado_FechaMovimiento" ON aud."HistorialMovimientosEmpleado"("FechaMovimiento");
CREATE INDEX "IX_HistorialMovimientosEmpleado_TipoMovimiento" ON aud."HistorialMovimientosEmpleado"("TipoMovimiento");

-- ===================================
-- TABLA: HistorialCierresNomina
-- ===================================
CREATE TABLE aud."HistorialCierresNomina" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "PeriodoNominaId" UUID NOT NULL,

    "FechaCierre" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    "TotalPercepciones" DECIMAL(18,2) NOT NULL,
    "TotalDeducciones" DECIMAL(18,2) NOT NULL,
    "TotalNeto" DECIMAL(18,2) NOT NULL,
    "EmpleadosProcesados" INT NOT NULL,

    "HashIntegridad" VARCHAR(500) NOT NULL,
    "ResumenJson" TEXT NULL,

    "UsuarioCierreId" UUID NOT NULL,
    "DireccionIp" VARCHAR(50) NULL,
    "AgenteUsuario" VARCHAR(500) NULL,

    FOREIGN KEY ("PeriodoNominaId") REFERENCES nom."PeriodosNomina"("Id")
);

CREATE INDEX "IX_HistorialCierresNomina_PeriodoNominaId" ON aud."HistorialCierresNomina"("PeriodoNominaId");
CREATE INDEX "IX_HistorialCierresNomina_FechaCierre" ON aud."HistorialCierresNomina"("FechaCierre");

-- ===================================
-- VISTA: vw_AuditoriaCompleta
-- ===================================
CREATE OR REPLACE VIEW aud."vw_AuditoriaCompleta" AS
SELECT
    ra."Id",
    ra."FechaHora",
    ra."TipoAccion",
    ra."NombreEntidad",
    ra."EntidadId",
    u."NombreUsuario",
    u."Nombres" || ' ' || u."ApellidoPaterno" AS "NombreCompletoUsuario",
    e."NombreComercial" AS "Empresa",
    i."Nombre" AS "Ingenio",
    ra."DireccionIp",
    ra."ValoresAnteriores",
    ra."ValoresNuevos"
FROM aud."RegistrosAuditoria" ra
LEFT JOIN seg."Usuarios" u ON ra."UsuarioId" = u."Id"
LEFT JOIN corp."Empresas" e ON ra."EmpresaId" = e."Id"
LEFT JOIN corp."Ingenios" i ON ra."IngenioId" = i."Id";

DO $$ BEGIN RAISE NOTICE 'Tablas de Auditoría creadas correctamente'; END $$;
