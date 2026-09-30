# navigation-sidebar Specification

## Purpose
Provee una barra lateral de navegación persistente, responsiva y ergonómica que unifica el acceso a todas las vistas principales de la aplicación: Presupuesto, Cuentas, Movimientos, Planes de Presupuesto y Reportes Analíticos.

## Requirements

### Requirement: Navegación Centralizada
El sistema DEBE proveer un Sidebar lateral con acceso directo e indicador visual a todas las secciones de la aplicación.

#### Scenario: Cambio de sección activa
- **WHEN** el usuario hace clic en una opción del sidebar (ej. "Planes de Presupuesto")
- **THEN** la vista principal cambia inmediatamente manteniendo el estado global y filtros

### Requirement: Responsividad y Modo Colapsable
El sistema DEBE permitir colapsar/expandir el sidebar en pantallas de escritorio y ofrecer un menú desplegable tipo cajón (drawer) en dispositivos móviles.

#### Scenario: Colapsar barra lateral en escritorio
- **WHEN** el usuario pulsa el botón de colapso
- **THEN** la barra lateral se reduce mostrando únicamente íconos y ampliando el área útil de trabajo

#### Scenario: Navegación en dispositivos móviles
- **WHEN** el usuario abre el menú hamburguesa en pantallas pequeñas
- **THEN** el sidebar se despliega como un overlay accesible
