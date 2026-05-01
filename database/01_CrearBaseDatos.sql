-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Script de creación de base de datos
-- ===================================

USE master;
GO

-- Eliminar base de datos si existe
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ImperhaNomninas')
BEGIN
    ALTER DATABASE ImperhaNomninas SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ImperhaNomninas;
END
GO

-- Crear base de datos
CREATE DATABASE ImperhaNomninas
ON PRIMARY (
    NAME = 'ImperhaNomninas_Data',
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL17.IADOS\MSSQL\DATA\ImperhaNomninas_Data.mdf',
    SIZE = 100MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 50MB
)
LOG ON (
    NAME = 'ImperhaNomninas_Log',
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL17.IADOS\MSSQL\DATA\ImperhaNomninas_Log.ldf',
    SIZE = 50MB,
    MAXSIZE = 2GB,
    FILEGROWTH = 25MB
)
COLLATE Modern_Spanish_CI_AS;
GO

USE ImperhaNomninas;
GO

-- ===================================
-- CREAR ESQUEMAS POR DOMINIO
-- ===================================

-- Esquema Corporativo (multi-empresa, ingenios)
CREATE SCHEMA corp AUTHORIZATION dbo;
GO

-- Esquema Recursos Humanos (empleados, expedientes)
CREATE SCHEMA rh AUTHORIZATION dbo;
GO

-- Esquema Nómina (cálculos, periodos)
CREATE SCHEMA nom AUTHORIZATION dbo;
GO

-- Esquema CFDI (timbrado fiscal)
CREATE SCHEMA cfdi AUTHORIZATION dbo;
GO

-- Esquema Contabilidad (pólizas, cuentas)
CREATE SCHEMA cont AUTHORIZATION dbo;
GO

-- Esquema Seguridad (usuarios, roles, permisos)
CREATE SCHEMA seg AUTHORIZATION dbo;
GO

-- Esquema Auditoría (bitácoras, historial)
CREATE SCHEMA aud AUTHORIZATION dbo;
GO

-- Esquema Catálogos (tablas de referencia)
CREATE SCHEMA cat AUTHORIZATION dbo;
GO

-- Esquema Importaciones
CREATE SCHEMA imp AUTHORIZATION dbo;
GO

-- Esquema Asistencias
CREATE SCHEMA asis AUTHORIZATION dbo;
GO

PRINT 'Esquemas creados correctamente';
GO
