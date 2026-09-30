# 💰 MiBilletera Inteligente — Presupuesto Personal (Estilo YNAB)

> Aplicación web moderna de finanzas personales, gestión de billeteras y presupuesto base cero (*Zero-Based Budgeting*) inspirada en los principios de **YNAB (You Need A Budget)**, desarrollada bajo la metodología **Spec-Driven Development (SDD)** con **OpenSpec** y asistencia de Inteligencia Artificial.

---

## 📑 Tabla de Contenidos
1. [Descripción General](#-descripción-general)
2. [Metodología: Spec-Driven Development (SDD) & OpenSpec](#-metodología-spec-driven-development-sdd--openspec)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Módulos Implementados](#-módulos-implementados)
5. [Guía de Uso Paso a Paso](#-guía-de-uso-paso-a-paso)
6. [Instalación y Comandos de Ejecución](#-instalación-y-comandos-de-ejecución)
7. [Próximas Implementaciones (Roadmap)](#-próximas-implementaciones-roadmap)
8. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🌟 Descripción General

**MiBilletera Inteligente** ayuda a los usuarios a tomar el control total de su dinero siguiendo la regla de oro de YNAB: **"Dale a cada centavo un trabajo"**. 

Permite organizar cuentas financieras (efectivo, bancos, ahorros, tarjetas de crédito), proyectar escenarios con **Planes de Presupuesto**, registrar gastos e ingresos en tiempo real, visualizar el patrimonio neto consolidado y convertir divisas en tiempo real (USD, BOB, EUR, ARS).

---

## 📐 Metodología: Spec-Driven Development (SDD) & OpenSpec

Este proyecto fue concebido, diseñado y construido siguiendo el enfoque **Spec-Driven Development (SDD)** con la herramienta **OpenSpec**, asistido por agentes de Inteligencia Artificial (**Antigravity / Gemini**).

### ¿Qué es SDD y OpenSpec?
En SDD, **ningún código se escribe sin antes definir formalmente la especificación y los criterios de aceptación**. OpenSpec estructura el ciclo de vida del software en:

1. **`openspec/specs/` (Especificaciones del Sistema):**
   - [`wallet-core/spec.md`](openspec/specs/wallet-core/spec.md): Especificación de cuentas, saldos y multimoneda.
   - [`budget-categories/spec.md`](openspec/specs/budget-categories/spec.md): Reglas de asignación de presupuesto base cero.
   - [`budget-plans/spec.md`](openspec/specs/budget-plans/spec.md): Creación, duplicación y aplicación de planes estratégicos.
   - [`transactions/spec.md`](openspec/specs/transactions/spec.md): Registro, validación y filtros de movimientos.
   - [`navigation-sidebar/spec.md`](openspec/specs/navigation-sidebar/spec.md): Navegación responsiva y layout.

2. **`openspec/changes/` (Propuestas de Cambio Controladas):**
   - Cada cambio cuenta con su triada:
     - `proposal.md`: Justificación, motivación (*Why*) y alcance (*What Changes*).
     - `design.md`: Diagramas de arquitectura, modelos de datos y esquemas.
     - `tasks.md`: Lista de verificación de tareas ejecutables (`[x]` completadas, `[ ]` pendientes).

3. **Rol de la Inteligencia Artificial:**
   - La IA colabora en modalidad *Pair Programming*, validando que cada componente, interfaz TypeScript y hook cumpla estrictamente con los contratos especificados en los documentos Markdown antes de proceder a la codificación.

---

## 🛠️ Tecnologías Utilizadas

- **Core & Lenguaje:** [React 18](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/) para tipado estricto y seguro.
- **Herramienta de Construcción:** [Vite](https://vitejs.dev/) para compilación ultra rápida y Hot Module Replacement (HMR).
- **Estilos & UI:** [TailwindCSS](https://tailwindcss.com/) con diseño moderno en modo oscuro (*slate/emerald palette*).
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Gráficos y Visualización:** [Recharts](https://recharts.org/) para reportes analíticos dinámicos.
- **Persistencia Actual:** `LocalStorage` del navegador con soporte para importación y exportación de respaldos en formato `JSON`.
- **Persistencia Futura:** Base de datos relacional [PostgreSQL](https://www.postgresql.org/) con arquitectura API REST.

---

## 📦 Módulos Implementados

### 1. 🧭 Barra Lateral de Navegación (`Sidebar.tsx`)
- **Descripción:** Panel de navegación persistente y responsivo.
- **Funcionalidades:**
  - Acceso directo a las vistas: *Presupuesto*, *Cuentas*, *Movimientos*, *Planes de Presupuesto* y *Reportes*.
  - Modo colapsable en pantallas de escritorio (solo íconos para maximizar espacio).
  - Menú lateral tipo cajón (*drawer*) accesible en teléfonos móviles.
  - Indicador rápido del Plan Activo, botón de exportación de respaldo y reinicio de demostración.

### 2. 💳 Cuentas y Multimoneda (`AccountsList.tsx`, `NetWorthCard.tsx`, `wallet-core`)
- **Descripción:** Gestión central de todas las cuentas y fondos disponibles.
- **Funcionalidades:**
  - Tipos de cuenta soportados: Efectivo, Banco, Ahorros y Tarjeta de Crédito.
  - Creación, edición y eliminación de cuentas con colores personalizados.
  - Soporte Multimoneda con tasas de cambio editables (USD, BOB, EUR, ARS).
  - Cálculo automático en tiempo real del **Patrimonio Neto** consolidado.

### 3. 📊 Presupuesto Base Cero YNAB (`BudgetTable.tsx`, `budget-categories`)
- **Descripción:** Asignación mensual consciente del dinero disponible.
- **Funcionalidades:**
  - Indicador superior de **"Dinero por Presupuestar"** (*To be Budgeted*).
  - Agrupación dinámica de categorías (ej. *Gastos Fijos*, *Gastos Diarios*, *Metas de Ahorro*).
  - Creación, edición y eliminación de grupos y categorías.
  - Barras de progreso de gasto vs monto asignado con alertas de sobregiro.

### 4. 🎯 Planes de Presupuesto YNAB (`BudgetPlansView.tsx`, `PlanModal.tsx`, `budget-plans`)
- **Descripción:** Plantillas de planificación financiera y simulación de escenarios.
- **Funcionalidades:**
  - Creación de planes con meta de ingreso mensual estimado y distribución ideal por categoría.
  - Duplicación de planes para evaluar escenarios alternativos (ej. *Plan Austero* vs *Plan de Vacaciones*).
  - **Botón "⚡ Aplicar al Presupuesto Actual":** Con un solo clic transfiere la asignación del plan a la tabla de presupuesto del mes activo.
  - **Comparativa Plan vs Real:** Tabla analítica que compara lo planificado vs lo presupuestado vs lo gastado.

### 5. 💸 Registro e Historial de Movimientos (`TransactionsHistory.tsx`, `TransactionModal.tsx`)
- **Descripción:** Libro mayor de todas las transacciones financieras.
- **Funcionalidades:**
  - Registro de **Ingresos (+)**, **Gastos (-)** y **Transferencias entre Cuentas (↔)**.
  - Las transferencias debitan de la cuenta origen y acreditan en la cuenta destino sin alterar el gasto presupuestario.
  - Búsqueda en tiempo real por texto (comercio, notas, monto) y filtros combinables por tipo, cuenta y categoría.

### 6. 📈 Reportes & Gráficos Analíticos (`AnalyticsCharts.tsx`)
- **Descripción:** Centro de inteligencia visual sobre los hábitos financieros.
- **Funcionalidades:**
  - Gráfico circular de distribución de gastos por categoría.
  - Comparativa de ingresos vs gastos del período.
  - Indicadores clave de rendimiento financiero (tasa de ahorro efectiva).

### 7. 💾 Respaldo y Migración (`storage.ts`)
- **Descripción:** Capa de almacenamiento y portabilidad de datos.
- **Funcionalidades:**
  - Guardado automático en `LocalStorage`.
  - Descarga instantánea de copia de seguridad en archivo `.json`.
  - Importación y restauración de datos desde cualquier archivo de respaldo.

---

## 🚀 Guía de Uso Paso a Paso

1. **Configurar Cuentas:** Dirígete a la pestaña **Cuentas** o **Presupuesto** y agrega tus cuentas iniciales (ej. Efectivo, Cuenta de Banco) con sus saldos actuales.
2. **Definir un Plan Estratégico:** Ve a **Planes de Presupuesto**, crea o edita un plan (ej. *Plan 50/30/20*) asignando los montos deseados a cada categoría y presiona **"Aplicar al Presupuesto Actual"**.
3. **Registrar Movimientos:** Haz clic en **"Registrar Movimiento"** cada vez que gastes, recibas dinero o transfieras entre tus cuentas.
4. **Supervisar en Tiempo Real:** Observa cómo las barras de progreso en **Presupuesto** y los gráficos en **Reportes** se actualizan al instante.

---

## 💻 Instalación y Comandos de Ejecución

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18.0 o superior recomendada).
- Gestor de paquetes `npm`.

### Comandos

```bash
# 1. Clonar o acceder a la carpeta del proyecto
cd segundo_proyecto

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo local
npm run dev

# 4. Construir la aplicación para producción
npm run build

# 5. Previsualizar la compilación de producción localmente
npm run preview
```

> La aplicación estará disponible en tu navegador en: `http://localhost:5173` (o el puerto asignado por Vite).

---

## 🔮 Próximas Implementaciones (Roadmap)

Las siguientes tareas ya se encuentran formalizadas en [`openspec/changes/2026-09-30-sidebar-and-budget-plans/tasks.md`](openspec/changes/2026-09-30-sidebar-and-budget-plans/tasks.md):

- [ ] **Ordenamiento Determinista en Historial:** Ordenar movimientos estrictamente por fecha y marca temporal descendente (`date` DESC, `createdAt` DESC).
- [ ] **Backend con API REST:** Creación de un servidor Node.js/Express para procesar transacciones financieras seguras.
- [ ] **Persistencia en PostgreSQL:** Migración de LocalStorage hacia una base de datos relacional PostgreSQL con esquema normalizado (`accounts`, `categories`, `transactions`, `budget_plans`).
- [ ] **Sincronización Offline-First:** Soporte para operar sin conexión y sincronizar cambios automáticamente al recuperar internet.

---

## 📁 Estructura del Proyecto

```text
segundo_proyecto/
├── openspec/                         # Especificaciones y Cambios SDD
│   ├── config.yaml                   # Configuración y reglas de idioma de OpenSpec
│   ├── specs/                        # Especificaciones formales por módulo
│   │   ├── wallet-core/              # Gestión de cuentas y multimoneda
│   │   ├── budget-categories/        # Categorías y presupuesto YNAB
│   │   ├── budget-plans/             # Planes de presupuesto y plantillas
│   │   ├── transactions/             # Registro y validación de transacciones
│   │   └── navigation-sidebar/       # Barra lateral de navegación
│   └── changes/                      # Historial y propuestas de cambio
├── src/
│   ├── components/                   # Componentes visuales de React
│   │   ├── Sidebar.tsx               # Barra lateral de navegación responsiva
│   │   ├── Header.tsx                # Encabezado con selector de moneda y respaldo
│   │   ├── NetWorthCard.tsx          # Tarjetas métricas de patrimonio neto
│   │   ├── AccountsList.tsx          # Listado y administración de cuentas
│   │   ├── AccountModal.tsx          # Modal de creación/edición de cuentas
│   │   ├── BudgetTable.tsx           # Tabla interactiva de presupuesto YNAB
│   │   ├── BudgetPlansView.tsx       # Módulo de Planes de Presupuesto
│   │   ├── PlanModal.tsx             # Modal para crear y editar planes
│   │   ├── TransactionsHistory.tsx   # Tabla de historial y filtros de movimientos
│   │   ├── TransactionModal.tsx      # Modal para ingresos, gastos y transferencias
│   │   ├── AnalyticsCharts.tsx       # Gráficos y analíticas financieras
│   │   ├── CategoryModal.tsx         # Modal de categorías
│   │   └── GroupModal.tsx            # Modal de grupos de categorías
│   ├── services/
│   │   └── storage.ts                # Persistencia LocalStorage y exportación JSON
│   ├── types/
│   │   └── index.ts                  # Modelos de datos TypeScript (Account, Plan, etc.)
│   ├── utils/
│   │   ├── balance.ts                # Motor de cálculo y balance de saldos
│   │   └── currency.ts               # Utilidades de conversión y formateo de monedas
│   ├── App.tsx                       # Layout principal y orquestador de estado
│   └── main.tsx                      # Punto de entrada de la aplicación
├── package.json                      # Dependencias y scripts del proyecto
├── tailwind.config.js                # Configuración de estilos TailwindCSS
├── tsconfig.json                     # Configuración de compilación TypeScript
└── vite.config.ts                    # Configuración del empaquetador Vite
```
