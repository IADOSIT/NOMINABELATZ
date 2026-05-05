-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo Recursos Humanos (PostgreSQL)
-- ===================================

-- ===================================
-- TABLA: Departamentos
-- ===================================
CREATE TABLE rh."Departamentos" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,
    "IngenioId" UUID NULL,

    "Clave" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,
    "DepartamentoPadreId" UUID NULL,
    "ResponsableId" UUID NULL,
    "CentroCostoId" UUID NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id"),
    FOREIGN KEY ("DepartamentoPadreId") REFERENCES rh."Departamentos"("Id")
);

CREATE INDEX "IX_Departamentos_EmpresaId" ON rh."Departamentos"("EmpresaId");
CREATE UNIQUE INDEX "IX_Departamentos_Clave" ON rh."Departamentos"("EmpresaId", "Clave") WHERE "Activo" = TRUE;

-- ===================================
-- TABLA: Puestos
-- ===================================
CREATE TABLE rh."Puestos" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,

    "Clave" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" VARCHAR(1000) NULL,
    "NivelJerarquico" INT NOT NULL DEFAULT 1,
    "TabuladorSalarioMinimo" DECIMAL(18,4) NULL,
    "TabuladorSalarioMaximo" DECIMAL(18,4) NULL,
    "EsSindicalizado" BOOLEAN NOT NULL DEFAULT FALSE,
    "RequiereAprobacionEspecial" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id")
);

CREATE INDEX "IX_Puestos_EmpresaId" ON rh."Puestos"("EmpresaId");
CREATE UNIQUE INDEX "IX_Puestos_Clave" ON rh."Puestos"("EmpresaId", "Clave") WHERE "Activo" = TRUE;

-- ===================================
-- TABLA: CentrosCosto
-- ===================================
CREATE TABLE rh."CentrosCosto" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,
    "IngenioId" UUID NULL,

    "Clave" VARCHAR(30) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,
    "CuentaContable" VARCHAR(50) NULL,
    "CentroCostoPadreId" UUID NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id"),
    FOREIGN KEY ("CentroCostoPadreId") REFERENCES rh."CentrosCosto"("Id")
);

CREATE INDEX "IX_CentrosCosto_EmpresaId" ON rh."CentrosCosto"("EmpresaId");
CREATE UNIQUE INDEX "IX_CentrosCosto_Clave" ON rh."CentrosCosto"("EmpresaId", "Clave") WHERE "Activo" = TRUE;

-- ===================================
-- TABLA: Turnos
-- ===================================
CREATE TABLE rh."Turnos" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,
    "IngenioId" UUID NULL,

    "Clave" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,
    "HoraEntrada" TIME NOT NULL,
    "HoraSalida" TIME NOT NULL,
    "HorasJornada" DECIMAL(4,2) NOT NULL,
    "TipoJornada" INT NOT NULL,
    "ToleranciaEntradaMinutos" INT NOT NULL DEFAULT 15,
    "ToleranciaSalidaMinutos" INT NOT NULL DEFAULT 15,
    "EsTurnoZafra" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "Version" INT NOT NULL DEFAULT 1,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id")
);

CREATE INDEX "IX_Turnos_EmpresaId" ON rh."Turnos"("EmpresaId");

-- ===================================
-- TABLA: Empleados
-- ===================================
CREATE TABLE rh."Empleados" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,
    "IngenioId" UUID NULL,

    -- Identificación
    "NumeroEmpleado" VARCHAR(20) NOT NULL,
    "Curp" VARCHAR(18) NOT NULL,
    "Rfc" VARCHAR(13) NOT NULL,
    "Nss" VARCHAR(11) NOT NULL,

    -- Datos personales
    "Nombres" VARCHAR(150) NOT NULL,
    "ApellidoPaterno" VARCHAR(100) NOT NULL,
    "ApellidoMaterno" VARCHAR(100) NULL,
    "FechaNacimiento" DATE NOT NULL,
    "Genero" INT NOT NULL,
    "EstadoCivil" INT NOT NULL DEFAULT 1,
    "Nacionalidad" VARCHAR(50) DEFAULT 'Mexicana',
    "LugarNacimiento" VARCHAR(100) NULL,

    -- Contacto
    "CorreoPersonal" VARCHAR(150) NULL,
    "CorreoInstitucional" VARCHAR(150) NULL,
    "TelefonoCelular" VARCHAR(20) NULL,
    "TelefonoCasa" VARCHAR(20) NULL,

    -- Domicilio
    "DomicilioCalle" VARCHAR(250) NULL,
    "DomicilioNumeroExterior" VARCHAR(50) NULL,
    "DomicilioNumeroInterior" VARCHAR(50) NULL,
    "DomicilioColonia" VARCHAR(150) NULL,
    "DomicilioCodigoPostal" VARCHAR(10) NULL,
    "DomicilioMunicipio" VARCHAR(150) NULL,
    "DomicilioEstado" VARCHAR(100) NULL,

    -- Datos laborales
    "FechaIngreso" DATE NOT NULL,
    "FechaAntiguedad" DATE NOT NULL,
    "FechaAltaImss" DATE NOT NULL,
    "TipoContrato" INT NOT NULL,
    "TipoRegimen" INT NOT NULL,
    "TipoJornada" INT NOT NULL,
    "PeriodicidadPago" INT NOT NULL,
    "EstatusLaboral" INT NOT NULL DEFAULT 1,
    "TipoTrabajador" INT NOT NULL,
    "EsTrabajadorZafra" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Estructura organizacional
    "DepartamentoId" UUID NOT NULL,
    "PuestoId" UUID NOT NULL,
    "CentroCostoId" UUID NULL,
    "TurnoId" UUID NULL,
    "JefeInmediatoId" UUID NULL,

    -- Salarios
    "SalarioDiario" DECIMAL(18,4) NOT NULL,
    "MonedaSalarioDiario" VARCHAR(3) DEFAULT 'MXN',
    "SalarioDiarioIntegrado" DECIMAL(18,4) NOT NULL,
    "MonedaSdi" VARCHAR(3) DEFAULT 'MXN',
    "SalarioBaseCotizacion" DECIMAL(18,4) NOT NULL,
    "MonedaSbc" VARCHAR(3) DEFAULT 'MXN',
    "FormaPago" INT NOT NULL DEFAULT 3,
    "BancoDeposito" VARCHAR(100) NULL,
    "ClabeInterbancaria" VARCHAR(18) NULL,
    "NumeroCuentaBancaria" VARCHAR(20) NULL,

    -- Fiscales
    "AplicaSubsidioEmpleo" BOOLEAN NOT NULL DEFAULT TRUE,
    "TieneCreditoInfonavit" BOOLEAN NOT NULL DEFAULT FALSE,
    "NumeroCreditoInfonavit" VARCHAR(20) NULL,
    "TipoDescuentoInfonavit" INT NULL,
    "ValorDescuentoInfonavit" DECIMAL(18,4) NULL,
    "FechaInicioInfonavit" DATE NULL,

    -- Contacto emergencia
    "ContactoEmergenciaNombre" VARCHAR(200) NULL,
    "ContactoEmergenciaTelefono" VARCHAR(20) NULL,
    "ContactoEmergenciaParentesco" VARCHAR(50) NULL,

    -- Biométricos
    "IdBiometrico" VARCHAR(50) NULL,
    "TieneHuellaRegistrada" BOOLEAN NOT NULL DEFAULT FALSE,
    "TieneRostroRegistrado" BOOLEAN NOT NULL DEFAULT FALSE,
    "RutaFoto" VARCHAR(500) NULL,

    -- Baja
    "FechaBaja" DATE NULL,
    "MotivoBaja" INT NULL,
    "ObservacionesBaja" VARCHAR(1000) NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioCreacionId" UUID NULL,
    "UsuarioModificacionId" UUID NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "FechaEliminacion" TIMESTAMPTZ NULL,
    "UsuarioEliminacionId" UUID NULL,
    "Version" INT NOT NULL DEFAULT 1,
    "OrigenRegistro" VARCHAR(50) NULL,
    "LoteImportacionId" UUID NULL,
    "NotasAuditoria" TEXT NULL,
    "DireccionIp" VARCHAR(50) NULL,
    "AgenteUsuario" VARCHAR(500) NULL,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id"),
    FOREIGN KEY ("IngenioId") REFERENCES corp."Ingenios"("Id"),
    FOREIGN KEY ("DepartamentoId") REFERENCES rh."Departamentos"("Id"),
    FOREIGN KEY ("PuestoId") REFERENCES rh."Puestos"("Id"),
    FOREIGN KEY ("CentroCostoId") REFERENCES rh."CentrosCosto"("Id"),
    FOREIGN KEY ("TurnoId") REFERENCES rh."Turnos"("Id"),
    FOREIGN KEY ("JefeInmediatoId") REFERENCES rh."Empleados"("Id")
);

CREATE UNIQUE INDEX "IX_Empleados_NumeroEmpleado" ON rh."Empleados"("EmpresaId", "IngenioId", "NumeroEmpleado") WHERE "Activo" = TRUE;
CREATE INDEX "IX_Empleados_Curp" ON rh."Empleados"("Curp");
CREATE INDEX "IX_Empleados_Rfc" ON rh."Empleados"("Rfc");
CREATE INDEX "IX_Empleados_Nss" ON rh."Empleados"("Nss");
CREATE INDEX "IX_Empleados_DepartamentoId" ON rh."Empleados"("DepartamentoId");
CREATE INDEX "IX_Empleados_PuestoId" ON rh."Empleados"("PuestoId");
CREATE INDEX "IX_Empleados_EstatusLaboral" ON rh."Empleados"("EstatusLaboral");
CREATE INDEX "IX_Empleados_TipoTrabajador" ON rh."Empleados"("TipoTrabajador");
CREATE INDEX "IX_Empleados_Activo" ON rh."Empleados"("Activo");
CREATE INDEX "IX_Empleados_FechaIngreso" ON rh."Empleados"("FechaIngreso");

DO $$ BEGIN RAISE NOTICE 'Tablas de Recursos Humanos creadas correctamente'; END $$;
