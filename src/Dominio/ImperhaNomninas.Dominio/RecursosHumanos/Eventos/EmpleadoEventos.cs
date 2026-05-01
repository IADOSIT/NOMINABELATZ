// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Eventos de dominio del módulo de Recursos Humanos
// ===================================

using ImperhaNomninas.Dominio.Compartido.Eventos;
using ImperhaNomninas.Dominio.RecursosHumanos.Enumeraciones;

namespace ImperhaNomninas.Dominio.RecursosHumanos.Eventos;

/// <summary>
/// Evento: Empleado contratado.
/// </summary>
public sealed class EmpleadoContratadoEvento : EventoDominioBase
{
    public override string TipoEvento => "EmpleadoContratado";

    public Guid EmpleadoId { get; }
    public string NumeroEmpleado { get; }
    public string NombreCompleto { get; }
    public DateTime FechaIngreso { get; }

    public EmpleadoContratadoEvento(
        Guid empleadoId,
        string numeroEmpleado,
        string nombreCompleto,
        DateTime fechaIngreso)
    {
        EmpleadoId = empleadoId;
        NumeroEmpleado = numeroEmpleado;
        NombreCompleto = nombreCompleto;
        FechaIngreso = fechaIngreso;
    }
}

/// <summary>
/// Evento: Empleado dado de baja.
/// </summary>
public sealed class EmpleadoBajaEvento : EventoDominioBase
{
    public override string TipoEvento => "EmpleadoBaja";

    public Guid EmpleadoId { get; }
    public string NumeroEmpleado { get; }
    public DateTime FechaBaja { get; }
    public MotivoBaja MotivoBaja { get; }

    public EmpleadoBajaEvento(
        Guid empleadoId,
        string numeroEmpleado,
        DateTime fechaBaja,
        MotivoBaja motivoBaja)
    {
        EmpleadoId = empleadoId;
        NumeroEmpleado = numeroEmpleado;
        FechaBaja = fechaBaja;
        MotivoBaja = motivoBaja;
    }
}

/// <summary>
/// Evento: Salario del empleado actualizado.
/// </summary>
public sealed class SalarioActualizadoEvento : EventoDominioBase
{
    public override string TipoEvento => "SalarioActualizado";

    public Guid EmpleadoId { get; }
    public decimal SalarioAnterior { get; }
    public decimal SalarioNuevo { get; }
    public DateTime FechaEfectiva { get; }

    public SalarioActualizadoEvento(
        Guid empleadoId,
        decimal salarioAnterior,
        decimal salarioNuevo,
        DateTime fechaEfectiva)
    {
        EmpleadoId = empleadoId;
        SalarioAnterior = salarioAnterior;
        SalarioNuevo = salarioNuevo;
        FechaEfectiva = fechaEfectiva;
    }
}
