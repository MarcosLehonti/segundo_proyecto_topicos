# budget-plans Specification

## Purpose
Permite la creación, edición, simulación y aplicación de Planes de Presupuesto (Budget Plans) inspirados en las metas y plantillas de YNAB. Un plan define metas mensuales estimadas, asignación ideal por categoría y permite aplicar dicha plantilla al presupuesto activo con un solo clic.

## Requirements

### Requirement: Gestión de Planes de Presupuesto
El sistema DEBE permitir a los usuarios crear, editar, duplicar, listar y eliminar planes de presupuesto personalizados (ej. "Plan Mensual Base", "Plan de Austeridad", "Plan de Ahorro para Vacaciones").

#### Scenario: Crear un nuevo plan de presupuesto
- **WHEN** el usuario define el nombre del plan, ingreso proyectado y montos objetivo para cada categoría
- **THEN** el plan queda guardado y disponible para consulta y activación

#### Scenario: Duplicar un plan existente
- **WHEN** el usuario selecciona duplicar un plan
- **THEN** se genera una copia independiente para facilitar la creación de escenarios alternativos

### Requirement: Aplicación de Plan al Presupuesto Activo
El sistema DEBE permitir aplicar las asignaciones de un plan de presupuesto directamente sobre la tabla de presupuesto mensual activa.

#### Scenario: Aplicar plan a las categorías actuales
- **WHEN** el usuario pulsa "Aplicar Plan al Presupuesto Actual"
- **THEN** los montos presupuestados (`budgeted`) de las categorías se actualizan con los valores configurados en el plan

### Requirement: Comparador de Cumplimiento de Plan vs Real
El sistema DEBE presentar un análisis comparativo entre lo planificado en el plan activo, lo presupuestado en el mes y lo efectivamente gastado.

#### Scenario: Visualizar progreso del plan
- **WHEN** el usuario visualiza el detalle del plan activo
- **THEN** el sistema muestra métricas de tasa de ahorro estimada, porcentaje de cumplimiento y desvíos por categoría
