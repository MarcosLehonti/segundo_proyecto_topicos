# budget-categories Specification

## Purpose
Permite estructurar, personalizar y asignar presupuesto mensual a categorías dinámicas de gastos e ingresos, siguiendo la metodología de presupuesto consciente estilo YNAB.

## Requirements

### Requirement: Gestión Dinámica de Categorías
El sistema DEBE permitir crear, editar y eliminar categorías y grupos de categorías.

#### Scenario: Agregar una categoría personalizada
- **WHEN** el usuario añade una categoría asignándola a un grupo
- **THEN** la categoría queda disponible inmediatamente para presupuestar y asociar a transacciones

### Requirement: Asignación y Control de Presupuesto Mensual
El sistema DEBE permitir definir un monto presupuestado para cada categoría y calcular el balance restante en tiempo real.

#### Scenario: Asignar dinero a una categoría
- **WHEN** el usuario asigna un monto en la casilla de presupuesto de una categoría
- **THEN** el dinero disponible general ("Por Presupuestar") se recalcula instantáneamente

#### Scenario: Seguimiento del gasto vs presupuesto
- **WHEN** se registran transacciones de gasto asociadas a esa categoría
- **THEN** la barra de progreso de la categoría se actualiza mostrando el gasto actual y el restante
