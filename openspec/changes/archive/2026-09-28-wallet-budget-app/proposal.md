# Proposal: Billetera y Presupuesto Personal (Estilo YNAB)

## Why
Los usuarios necesitan una aplicación intuitiva y dinámica de finanzas personales y gestión de billetera inspirada en los principios de YNAB (presupuesto base cero y asignación consciente) para gestionar sus cuentas, organizar gastos en categorías personalizables y visualizar balances en múltiples monedas, sin la complejidad ni los riesgos de manejar transacciones bancarias reales.

## What Changes
- **Gestión de Cuentas:** Crear y monitorear múltiples cuentas (Efectivo, Banco, Ahorros, Tarjetas) con actualización en tiempo real de balances.
- **Categorías Dinámicas y Presupuestos:** Crear, editar y organizar categorías personalizadas (ej. Vivienda, Alimentación, Ocio, Emergencias) y asignarles presupuesto mensual.
- **Registro de Transacciones y Transferencias:** Registrar ingresos, gastos y transferencias entre cuentas con asignación a categorías y recálculo instantáneo de saldos.
- **Soporte Multimoneda:** Cambiar la moneda de visualización (ej. USD, BOB, EUR, ARS) con conversión de tasas de cambio.
- **Resumen Visual y Dashboard:** Panel de control interactivo con el patrimonio total neto, dinero disponible para presupuestar y gráficos de gastos por categoría.
- **Almacenamiento Local Persistente:** Guardar los datos en el navegador (LocalStorage / IndexedDB) para uso inmediato y sin necesidad de servicios externos.

## Capabilities

### New Capabilities
- `wallet-core`: Gestión de cuentas financieras (Efectivo, Banco, Tarjetas), cálculo del balance general y visualización multimoneda.
- `budget-categories`: Creación dinámica de categorías y grupos presupuestarios, asignación de fondos y seguimiento de progreso.
- `transactions`: Registro de ingresos, gastos y transferencias entre cuentas con asignación a categorías.

### Modified Capabilities
*(Ninguna - proyecto inicial)*

## Impact
- **Arquitectura:** Aplicación web moderna (SPA) interactiva, responsiva y con almacenamiento local estructurado.
- **Dependencias:** Stack web moderno (Vite + React / TypeScript con TailwindCSS y librería de gráficos).
- **Alcance y Seguridad:** Es un simulador y gestor de finanzas personales para registro y control; no realiza operaciones bancarias ni pasarelas de pago reales.
