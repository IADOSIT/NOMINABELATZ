-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Tablas del módulo Corporativo (PostgreSQL)
-- ===================================

-- ===================================
-- TABLA: Empresas
-- ===================================
CREATE TABLE corp."Empresas" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "RazonSocial" VARCHAR(250) NOT NULL,
    "NombreComercial" VARCHAR(250) NOT NULL,
    "Rfc" VARCHAR(13) NOT NULL,
    "RegimenFiscal" VARCHAR(100) NOT NULL,
    "CodigoRegimenFiscal" VARCHAR(10) NOT NULL,

    -- Dirección fiscal
    "DireccionFiscalCalle" VARCHAR(250) NULL,
    "DireccionFiscalNumeroExterior" VARCHAR(50) NULL,
    "DireccionFiscalNumeroInterior" VARCHAR(50) NULL,
    "DireccionFiscalColonia" VARCHAR(150) NULL,
    "DireccionFiscalCodigoPostal" VARCHAR(10) NULL,
    "DireccionFiscalMunicipio" VARCHAR(150) NULL,
    "DireccionFiscalEstado" VARCHAR(100) NULL,
    "DireccionFiscalPais" VARCHAR(100) DEFAULT 'México',

    -- Contacto
    "Telefono" VARCHAR(50) NULL,
    "CorreoElectronico" VARCHAR(150) NULL,
    "SitioWeb" VARCHAR(250) NULL,

    -- Branding
    "RutaLogo" VARCHAR(500) NULL,
    "ColorPrimario" VARCHAR(20) DEFAULT '#1976D2',
    "ColorSecundario" VARCHAR(20) DEFAULT '#424242',
    "ColorAcento" VARCHAR(20) DEFAULT '#FF5722',

    -- Fiscal
    "RegistroPatronalImss" VARCHAR(20) NULL,
    "RegistroInfonavit" VARCHAR(20) NULL,
    "RutaCertificadoCsd" VARCHAR(500) NULL,
    "RutaLlaveCsd" VARCHAR(500) NULL,
    "ContrasenasCsdEncriptada" VARCHAR(500) NULL,
    "VigenciaCsd" TIMESTAMPTZ NULL,

    -- Recibos
    "TextoLegalRecibos" VARCHAR(2000) NULL,
    "PiePaginaRecibos" VARCHAR(500) NULL,

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

CREATE UNIQUE INDEX "IX_Empresas_Rfc" ON corp."Empresas"("Rfc") WHERE "Activo" = TRUE;
CREATE INDEX "IX_Empresas_Activo" ON corp."Empresas"("Activo");

-- ===================================
-- TABLA: Ingenios
-- ===================================
CREATE TABLE corp."Ingenios" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,

    "Nombre" VARCHAR(150) NOT NULL,
    "Clave" VARCHAR(20) NOT NULL,
    "Descripcion" VARCHAR(500) NULL,

    -- Ubicación
    "Direccion" VARCHAR(500) NULL,
    "Municipio" VARCHAR(150) NULL,
    "Estado" VARCHAR(100) NULL,
    "CodigoPostal" VARCHAR(10) NULL,
    "Latitud" DECIMAL(18,10) NULL,
    "Longitud" DECIMAL(18,10) NULL,

    -- Fiscal
    "RegistroPatronalImss" VARCHAR(20) NOT NULL,
    "ClaseRiesgoImss" INT NOT NULL DEFAULT 5,
    "PrimaRiesgoTrabajo" DECIMAL(10,5) NOT NULL DEFAULT 7.58875,
    "RegistroInfonavit" VARCHAR(20) NULL,

    -- Zafra
    "EnZafra" BOOLEAN NOT NULL DEFAULT FALSE,
    "InicioZafraActual" TIMESTAMPTZ NULL,
    "FinZafraEstimado" TIMESTAMPTZ NULL,
    "NumeroZafra" VARCHAR(20) NULL,

    -- Operativo
    "CapacidadMoliendaDiaria" DECIMAL(18,2) NULL,
    "NumeroEmpleadosActivos" INT NOT NULL DEFAULT 0,
    "ZonaSalarioMinimo" VARCHAR(10) DEFAULT 'UNICA',

    -- Branding
    "RutaLogo" VARCHAR(500) NULL,
    "ColorPrimario" VARCHAR(20) NULL,

    -- Contacto
    "Telefono" VARCHAR(50) NULL,
    "CorreoElectronico" VARCHAR(150) NULL,
    "NombreResponsable" VARCHAR(200) NULL,

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
    "IngenioId" UUID NULL,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id")
);

CREATE UNIQUE INDEX "IX_Ingenios_EmpresaClave" ON corp."Ingenios"("EmpresaId", "Clave") WHERE "Activo" = TRUE;
CREATE INDEX "IX_Ingenios_RegistroPatronalImss" ON corp."Ingenios"("RegistroPatronalImss");
CREATE INDEX "IX_Ingenios_Activo" ON corp."Ingenios"("Activo");
CREATE INDEX "IX_Ingenios_EnZafra" ON corp."Ingenios"("EnZafra");

-- ===================================
-- TABLA: ConfiguracionEmpresa
-- ===================================
CREATE TABLE corp."ConfiguracionEmpresa" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EmpresaId" UUID NOT NULL,

    -- Nómina
    "DiasAguinaldo" INT NOT NULL DEFAULT 15,
    "PorcentajePrimaVacacional" DECIMAL(5,2) NOT NULL DEFAULT 25.00,
    "DiasGraciaFaltas" INT NOT NULL DEFAULT 0,
    "AplicaSubsidioEmpleoDefecto" BOOLEAN NOT NULL DEFAULT TRUE,

    -- CFDI
    "ProveedorTimbrado" VARCHAR(50) NULL,
    "UsuarioPac" VARCHAR(100) NULL,
    "PasswordPacEncriptado" VARCHAR(500) NULL,
    "ModoProduccionCfdi" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Correo
    "ServidorSmtp" VARCHAR(250) NULL,
    "PuertoSmtp" INT NULL,
    "UsuarioSmtp" VARCHAR(150) NULL,
    "PasswordSmtpEncriptado" VARCHAR(500) NULL,
    "UsarSsl" BOOLEAN NOT NULL DEFAULT TRUE,
    "CorreoRemitente" VARCHAR(150) NULL,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "FechaModificacion" TIMESTAMPTZ NULL,
    "UsuarioModificacionId" UUID NULL,
    "Version" INT NOT NULL DEFAULT 1,

    FOREIGN KEY ("EmpresaId") REFERENCES corp."Empresas"("Id")
);

CREATE UNIQUE INDEX "IX_ConfiguracionEmpresa_EmpresaId" ON corp."ConfiguracionEmpresa"("EmpresaId");

DO $$ BEGIN RAISE NOTICE 'Tablas corporativas creadas correctamente'; END $$;
