# Spec Delta: transactions

## Purpose
Permite el registro, filtrado, edición y categorización de transacciones financieras (Ingresos, Gastos y Transferencias), actualizando automáticamente los balances de las cuentas y presupuestos.

## ADDED Requirements

### Requirement: Registro de Transacciones
El sistema DEBE permitir registrar transacciones de tipo Ingreso, Gasto y Transferencia entre cuentas.

#### Scenario: Registrar un Gasto
- **WHEN** el usuario registra un monto, cuenta de origen y categoría
- **THEN** el saldo de la cuenta disminuye y el gasto de la categoría aumenta

#### Scenario: Registrar un Ingreso
- **WHEN** el usuario registra un monto y cuenta destino
- **THEN** el saldo de la cuenta aumenta y el dinero disponible general se incrementa

#### Scenario: Transferencia entre Cuentas
- **WHEN** el usuario transfiere dinero entre dos cuentas propias
- **THEN** se debita de la cuenta origen y se acredita en la cuenta destino sin alterar el gasto presupuestario

### Requirement: Historial y Filtros de Transacciones
El sistema DEBE permitir buscar y filtrar transacciones por cuenta, categoría y tipo.

#### Scenario: Filtrar transacciones
- **WHEN** el usuario selecciona un filtro o escribe en el buscador
- **THEN** la tabla muestra únicamente los movimientos que coinciden con los criterios
