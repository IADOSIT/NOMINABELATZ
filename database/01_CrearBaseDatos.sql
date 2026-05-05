-- ===================================
-- IMPERHA NÓMINAS - Sistema Enterprise
-- Script de inicialización PostgreSQL
-- Ejecutar conectado a: imperhanominas
-- ===================================

-- Extensión para UUID (compatible PG < 13)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================================
-- CREAR ESQUEMAS POR DOMINIO
-- ===================================

CREATE SCHEMA IF NOT EXISTS corp;
CREATE SCHEMA IF NOT EXISTS rh;
CREATE SCHEMA IF NOT EXISTS nom;
CREATE SCHEMA IF NOT EXISTS cfdi;
CREATE SCHEMA IF NOT EXISTS cont;
CREATE SCHEMA IF NOT EXISTS seg;
CREATE SCHEMA IF NOT EXISTS aud;
CREATE SCHEMA IF NOT EXISTS cat;
CREATE SCHEMA IF NOT EXISTS imp;
CREATE SCHEMA IF NOT EXISTS asis;

DO $$ BEGIN RAISE NOTICE 'Esquemas creados correctamente'; END $$;
