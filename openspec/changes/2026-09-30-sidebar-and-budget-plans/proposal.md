# Proposal: Sidebar de Navegación y Planes de Presupuesto (Estilo YNAB)

## Why
1. **Navegación Ergonómica:** La interfaz anterior dependía de pestañas horizontales superiores que limitaban el crecimiento de nuevas vistas a medida que la aplicación se expande. Una barra lateral moderna (Sidebar) mejora el flujo de trabajo, la accesibilidad y el espacio de visualización.
2. **Planes de Presupuesto (Budget Plans):** En metodologías como YNAB, los usuarios necesitan planificar con anticipación asignando plantillas de distribución ("Planes"), simulando escenarios (ej. ingresos esperados vs metas de ahorro) y aplicando asignaciones masivas al presupuesto actual con un solo clic.
3. **Estandarización:** Se definen las reglas de que toda interacción y especificación es en Español, mientras que el código fuente y tipos TypeScript se mantienen en Inglés.

## What Changes
- **Sidebar de Navegación:** Componente `Sidebar` responsivo con soporte colapsable para escritorio y móvil, con accesos a Presupuesto, Cuentas, Movimientos, Planes y Reportes.
- **Módulo de Planes de Presupuesto:**
  - Definición de tipos `BudgetPlan` en TypeScript.
  - Creación, edición, duplicación y eliminación de Planes.
  - Comparativa visual: Objetivos del Plan vs Presupuestado Actual vs Gastado Real.
  - Acción rápida "Aplicar Plan al Presupuesto": auto-rellena los montos de categorías en el mes activo.
- **Preservación Total:** Todas las funcionalidades ya creadas (Cuentas, Transacciones, Multimoneda, Reportes) se mantienen intactas.

## Non-goals
- Conexión bancaria automática real (Open Banking API).
- Autenticación remota en la nube (el proyecto se mantiene en LocalStorage).
