# IMPERHA NÓMINAS

## Sistema de Nómina Enterprise para Ingenios Azucareros en México

Sistema completo de gestión de nómina desarrollado con arquitectura moderna, cumplimiento fiscal al 100% y funcionalidades especializadas para la industria azucarera.

---

## Características Principales

- **Multi-empresa y Multi-ingenio**: Soporte corporativo completo
- **Nómina Mexicana Completa**: ISR, IMSS, INFONAVIT, Subsidio al empleo
- **CFDI Nómina 4.0**: Timbrado y cancelación según SAT
- **Contrato Ley Azucarero**: Zafra, bonos productivos, turnos industriales
- **Auditoría Total**: Bitácoras inmutables, historial de cambios
- **Asistente IA**: Popup flotante contextual con RAG
- **Dashboards y KPIs**: Visualización en tiempo real
- **Kiosko del Empleado**: Autoservicio para empleados

---

## Estructura del Proyecto

```
imperha_nominas/
├── src/                          # Código fuente Backend (.NET 8)
│   ├── Presentacion/             # API REST
│   ├── Aplicacion/               # Capa de aplicación (CQRS, DTOs)
│   ├── Dominio/                  # Entidades, Value Objects, Servicios
│   ├── Infraestructura/          # Persistencia, Seguridad, IA
│   └── Modulos/                  # Módulos de dominio
├── frontend/                     # Aplicación React + TypeScript
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── pages/                # Páginas de la aplicación
│   │   ├── layouts/              # Layouts (AppShell, Auth)
│   │   ├── stores/               # Estado global (Zustand)
│   │   ├── services/             # Servicios API
│   │   └── tema/                 # Configuración Material-UI
│   └── package.json
├── database/                     # Scripts SQL Server
│   ├── 01_CrearBaseDatos.sql
│   ├── 02_TablasSeguridad.sql
│   ├── 03_TablasCorporativo.sql
│   ├── 04_TablasRecursosHumanos.sql
│   ├── 05_TablasNomina.sql
│   └── 06_TablasAuditoria.sql
└── tests/                        # Pruebas unitarias e integración
```

---

## Stack Tecnológico

### Backend
- **.NET 8** con ASP.NET Core Web API
- **Entity Framework Core** con SQL Server
- **Arquitectura Hexagonal** + DDD + CQRS
- **MediatR** para CQRS
- **FluentValidation** para validaciones
- **JWT** para autenticación
- **Serilog** para logging

### Frontend
- **React 18** con TypeScript
- **Material-UI (MUI)** para componentes
- **React Query** para estado del servidor
- **Zustand** para estado global
- **React Router** para navegación
- **ECharts** para gráficas
- **Axios** para HTTP

### Base de Datos
- **SQL Server 2022+**
- Esquemas por dominio (corp, rh, nom, cfdi, aud, seg)
- Auditoría completa con tablas separadas
- Soft delete en todas las entidades

---

## Instalación

### Prerrequisitos

- .NET 8 SDK
- Node.js 18+
- SQL Server 2022+
- Visual Studio 2022 o VS Code

### Base de Datos

1. Ejecutar los scripts SQL en orden:
```bash
sqlcmd -S iados\IADOS -U sa -P "Temp@ral2024..." -i database/01_CrearBaseDatos.sql
sqlcmd -S iados\IADOS -U sa -P "Temp@ral2024..." -i database/02_TablasSeguridad.sql
sqlcmd -S iados\IADOS -U sa -P "Temp@ral2024..." -i database/03_TablasCorporativo.sql
sqlcmd -S iados\IADOS -U sa -P "Temp@ral2024..." -i database/04_TablasRecursosHumanos.sql
sqlcmd -S iados\IADOS -U sa -P "Temp@ral2024..." -i database/05_TablasNomina.sql
sqlcmd -S iados\IADOS -U sa -P "Temp@ral2024..." -i database/06_TablasAuditoria.sql
```

### Backend

```bash
cd src/Presentacion/ImperhaNomninas.Api
dotnet restore
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Configuración

### appsettings.json

```json
{
  "ConnectionStrings": {
    "ImperhaDb": "Server=iados\\IADOS;Database=ImperhaNomninas;User Id=sa;Password=****;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "TuClaveSecretaMuyLargaYSegura",
    "Issuer": "ImperhaNomninas",
    "Audience": "ImperhaNomninas.Usuarios"
  }
}
```

---

## Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| Seguridad | Usuarios, roles, permisos, JWT |
| Auditoría | Bitácoras, historial de cambios |
| Corporativo | Multi-empresa, ingenios, configuración |
| Recursos Humanos | Empleados, departamentos, puestos |
| Asistencias | Integración biométricos, incidencias |
| Nómina | Motor de cálculo, periodos, recibos |
| CFDI | Timbrado, cancelación, sustitución |
| Contabilidad | Pólizas automáticas, centros de costo |
| Importaciones | Carga masiva Excel/CSV |
| Dashboards | KPIs, gráficas, reportes |
| Kiosko | Autoservicio empleados |
| IA | Asistente contextual |

---

## Características Fiscales

### ISR
- Tablas mensuales, quincenales, semanales
- Subsidio al empleo
- Cálculo de extraordinarios (Art. 96 LISR)

### IMSS
- Cuotas obrero-patronales completas
- 25 UMAs como tope de SBC
- Riesgo de trabajo configurable por ingenio

### INFONAVIT
- Descuentos por porcentaje, cuota fija o VSM
- Historial de créditos

### CFDI
- Complemento Nómina 1.2
- Timbrado con PAC configurable
- Cancelación y sustitución

---

## Industria Azucarera

### Zafra
- Periodos de zafra configurables por ingenio
- Trabajadores temporales de zafra
- Bonos de productividad

### Contrato Ley
- Prestaciones según contrato ley azucarero
- Turnos industriales especiales
- Prima dominical y festivos

---

## Licencia

Software propietario. Todos los derechos reservados.

© 2024 Imperha Sistemas

---

## Soporte

- Email: soporte@imperha.com
- Documentación: [docs.imperha.com](https://docs.imperha.com)
