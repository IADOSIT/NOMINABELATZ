-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo de Nómina (PostgreSQL)
-- ===================================

-- ===================================
-- TABLA: PeriodosNomina
-- ===================================
CREATE TABLE nom."PeriodosNomina" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,
    "IngenioId" UUID NULL,

    "NumeroPeriodo" INT NOT NULL,
    "Ejercicio" INT NOT NULL,
    "TipoNomina" INT NOT NULL,
    "Periodicidad" INT NOT NULL,

    "FechaInicio" DATE NOT NULL,
    "FechaFin" DATE NOT NULL,
    "FechaPago" DATE NOT NULL,
    "Descripcion" VARCHAR(200) NOT NULL,

    "Estatus" INT NOT NULL DEFAULT 1,
    "FechaCierre" TIMESTAMPTZ NULL,
    "UsuarioCierreId" UUID NULL,
    "HashCierre" VARCHAR(500) NULL,

    "EsPeriodoZafra" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Totales
    "TotalPercepciones" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "TotalDeducciones" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "TotalNeto" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "EmpleadosProcesados" INT NOT NULL DEFAULT 0,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "UsuarioModificacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,
    "OrigenRegistro" VARCHAR(50) NULL,
    "NotasAuditoria" TEXT NULL,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id"),
    FOREIGN KEY ("IngenioId") REFERENCES corp."Ingenios"("Id")
);

CREATE UNIQUE INDEX "IX_PeriodosNomina_Periodo" ON nom."PeriodosNomina"("EmpresaId", "IngenioId", "Ejercicio", "NumeroPeriodo", "TipoNomina") WHERE "Activo" = TRUE;
CREATE INDEX "IX_PeriodosNomina_Estatus" ON nom."PeriodosNomina"("Estatus");
CREATE INDEX "IX_PeriodosNomina_FechaPago" ON nom."PeriodosNomina"("FechaPago");
CREATE INDEX "IX_PeriodosNomina_Ejercicio" ON nom."PeriodosNomina"("Ejercicio");

-- ===================================
-- TABLA: NominasEmpleados
-- ===================================
CREATE TABLE nom."NominasEmpleados" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,
    "IngenioId" UUID NULL,
    "PeriodoNominaId" UUID NOT NULL,
    "EmpleadoId" UUID NOT NULL,

    -- Snapshot del empleado
    "NumeroEmpleado" VARCHAR(20) NOT NULL,
    "NombreCompleto" VARCHAR(300) NOT NULL,
    "Rfc" VARCHAR(13) NOT NULL,
    "Curp" VARCHAR(18) NOT NULL,
    "Nss" VARCHAR(11) NOT NULL,
    "Departamento" VARCHAR(150) NULL,
    "Puesto" VARCHAR(150) NULL,

    -- Salarios del periodo
    "SalarioDiario" DECIMAL(18,4) NOT NULL,
    "SalarioDiarioIntegrado" DECIMAL(18,4) NOT NULL,
    "SalarioBaseCotizacion" DECIMAL(18,4) NOT NULL,

    -- Días del periodo
    "DiasTrabajados" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "DiasIncapacidad" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "DiasFaltas" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "DiasVacaciones" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "HorasExtraDobles" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "HorasExtraTriples" DECIMAL(7,2) NOT NULL DEFAULT 0,

    -- Totales
    "TotalPercepcionesGravadas" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "TotalPercepcionesExentas" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "TotalPercepciones" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "TotalDeducciones" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "TotalOtrosPagos" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "NetoAPagar" DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- ISR
    "BaseGravableIsr" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "IsrAntesSubsidio" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "SubsidioEmpleoAplicado" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "IsrRetener" DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- IMSS
    "CuotaObreraImss" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "CuotaPatronalImss" DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- INFONAVIT
    "DescuentoInfonavit" DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- Estatus
    "Estatus" INT NOT NULL DEFAULT 1,
    "FechaCalculo" TIMESTAMPTZ NULL,
    "ErroresCalculo" VARCHAR(2000) NULL,

    -- CFDI
    "UuidCfdi" VARCHAR(50) NULL,
    "FechaTimbrado" TIMESTAMPTZ NULL,
    "EstatusCfdi" INT NOT NULL DEFAULT 1,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "UsuarioModificacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,
    "OrigenRegistro" VARCHAR(50) NULL,
    "NotasAuditoria" TEXT NULL,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id"),
    FOREIGN KEY ("PeriodoNominaId") REFERENCES nom."PeriodosNomina"("Id"),
    FOREIGN KEY ("EmpleadoId") REFERENCES rh."Empleados"("Id")
);

CREATE UNIQUE INDEX "IX_NominasEmpleados_PeriodoEmpleado" ON nom."NominasEmpleados"("PeriodoNominaId", "EmpleadoId");
CREATE INDEX "IX_NominasEmpleados_Estatus" ON nom."NominasEmpleados"("Estatus");
CREATE INDEX "IX_NominasEmpleados_UuidCfdi" ON nom."NominasEmpleados"("UuidCfdi");
CREATE INDEX "IX_NominasEmpleados_EmpleadoId" ON nom."NominasEmpleados"("EmpleadoId");

-- ===================================
-- TABLA: PercepcionesNomina
-- ===================================
CREATE TABLE nom."PercepcionesNomina" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "NominaEmpleadoId" UUID NOT NULL,

    "TipoPercepcion" INT NOT NULL,
    "Clave" VARCHAR(10) NOT NULL,
    "Descripcion" VARCHAR(200) NOT NULL,
    "ImporteGravado" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "ImporteExento" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "ConceptoId" UUID NULL,
    "CantidadBase" DECIMAL(18,4) NULL,
    "ValorUnitario" DECIMAL(18,4) NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "Version" INT NOT NULL DEFAULT 1,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY ("NominaEmpleadoId") REFERENCES nom."NominasEmpleados"("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_PercepcionesNomina_NominaEmpleadoId" ON nom."PercepcionesNomina"("NominaEmpleadoId");

-- ===================================
-- TABLA: DeduccionesNomina
-- ===================================
CREATE TABLE nom."DeduccionesNomina" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "NominaEmpleadoId" UUID NOT NULL,

    "TipoDeduccion" INT NOT NULL,
    "Clave" VARCHAR(10) NOT NULL,
    "Descripcion" VARCHAR(200) NOT NULL,
    "Importe" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "ConceptoId" UUID NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "Version" INT NOT NULL DEFAULT 1,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY ("NominaEmpleadoId") REFERENCES nom."NominasEmpleados"("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_DeduccionesNomina_NominaEmpleadoId" ON nom."DeduccionesNomina"("NominaEmpleadoId");

-- ===================================
-- TABLA: OtrosPagosNomina
-- ===================================
CREATE TABLE nom."OtrosPagosNomina" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "NominaEmpleadoId" UUID NOT NULL,

    "TipoOtroPago" INT NOT NULL,
    "Clave" VARCHAR(10) NOT NULL,
    "Descripcion" VARCHAR(200) NOT NULL,
    "Importe" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "SubsidioCausado" DECIMAL(18,4) NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "Version" INT NOT NULL DEFAULT 1,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY ("NominaEmpleadoId") REFERENCES nom."NominasEmpleados"("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_OtrosPagosNomina_NominaEmpleadoId" ON nom."OtrosPagosNomina"("NominaEmpleadoId");

-- ===================================
-- TABLA: ConceptosNomina
-- ===================================
CREATE TABLE nom."ConceptosNomina" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,

    "Tipo" INT NOT NULL,
    "Clave" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,
    "TipoSat" INT NOT NULL,
    "ClaveSat" VARCHAR(10) NOT NULL,

    -- Configuración
    "EsGravado" BOOLEAN NOT NULL DEFAULT TRUE,
    "EsExento" BOOLEAN NOT NULL DEFAULT FALSE,
    "PorcentajeExento" DECIMAL(5,2) NULL,
    "TopesExencion" TEXT NULL,
    "Formula" VARCHAR(1000) NULL,

    -- Contabilidad
    "CuentaContableDebito" VARCHAR(50) NULL,
    "CuentaContableCredito" VARCHAR(50) NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id")
);

CREATE UNIQUE INDEX "IX_ConceptosNomina_Clave" ON nom."ConceptosNomina"("EmpresaId", "Clave") WHERE "Activo" = TRUE;
CREATE INDEX "IX_ConceptosNomina_Tipo" ON nom."ConceptosNomina"("Tipo");

DO $$ BEGIN RAISE NOTICE 'Tablas de Nómina creadas correctamente'; END $$;
