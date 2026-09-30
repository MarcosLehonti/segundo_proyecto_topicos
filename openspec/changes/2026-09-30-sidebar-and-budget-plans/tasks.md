# Tareas de Implementación

## 1. Actualización de Modelos y Tipos
- [x] 1.1 Definir la interfaz `BudgetPlan` y actualizar `AppState` en `src/types/index.ts`.
- [x] 1.2 Actualizar `storage.ts` con planes de presupuesto de demostración y retrocompatibilidad de datos.

## 2. Componente de Navegación Lateral (Sidebar)
- [x] 2.1 Crear `src/components/Sidebar.tsx` con diseño moderno, soporte colapsable y navegación responsiva.
- [x] 2.2 Integrar el Sidebar en `src/App.tsx` y conectar las rutas de vista ('budget', 'accounts', 'transactions', 'plans', 'analytics').

## 3. Módulo de Planes de Presupuesto
- [x] 3.1 Crear `src/components/PlanModal.tsx` para crear y editar planes con asignación por categoría y grupo.
- [x] 3.2 Crear `src/components/BudgetPlansView.tsx` con tarjetas de planes, métricas de tasa de ahorro y comparativa plan vs real.
- [x] 3.3 Implementar la funcionalidad "Aplicar Plan al Presupuesto Actual" con actualización en tiempo real de `budgeted`.

## 5. Refinamiento de Movimientos y Ordenamiento Cronológico
- [ ] 5.1 Implementar ordenamiento determinista descendente por fecha y hora de creación (`date` DESC, `createdAt` DESC) en el listado de [`TransactionsHistory.tsx`](file:///c:/Users/HP/Desktop/Universidad/Topicos/segundo_proyecto/src/components/TransactionsHistory.tsx).
- [ ] 5.2 Validar visualización diferenciada y badges para transferencias entre cuentas vs ingresos y egresos.

## 6. Arquitectura y Persistencia con Base de Datos PostgreSQL
- [ ] 6.1 Diseñar el modelo entidad-relación relacional en PostgreSQL (tablas `accounts`, `category_groups`, `categories`, `transactions`, `budget_plans`, `currency_config`).
- [ ] 6.2 Definir la API REST / Backend para sincronización y persistencia de operaciones financieras ACID en PostgreSQL.
- [ ] 6.3 Crear el adaptador de datos en el cliente frontend con soporte dual: LocalStorage (modo offline/local) y API PostgreSQL (modo servidor conectado).
