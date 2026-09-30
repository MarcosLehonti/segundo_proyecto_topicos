# Spec Delta: wallet-core

## Purpose
Proporciona la gestión central de cuentas financieras (Efectivo, Banco, Ahorros, Tarjeta de Crédito), cálculo del patrimonio neto y soporte dinámico de múltiples monedas con tasas de conversión.

## ADDED Requirements

### Requirement: Gestión de Cuentas Financieras
El sistema DEBE permitir al usuario crear, editar, listar y eliminar cuentas financieras simuladas con soporte de saldo y color.

#### Scenario: Crear una nueva cuenta
- **WHEN** el usuario ingresa un nombre, tipo de cuenta, balance inicial y moneda
- **THEN** la cuenta se crea y se refleja inmediatamente en el balance total de activos

#### Scenario: Listar cuentas y saldos
- **WHEN** el usuario accede al panel principal
- **THEN** el sistema muestra cada cuenta con su saldo actual y el patrimonio neto consolidado

### Requirement: Soporte Multimoneda y Conversión
El sistema DEBE permitir cambiar la moneda global de visualización y convertir los valores de las cuentas y transacciones según tasas de cambio ajustables.

#### Scenario: Cambio de moneda global
- **WHEN** el usuario selecciona una moneda diferente en el selector superior (USD, BOB, EUR, ARS)
- **THEN** todos los balances y categorías se muestran convertidos a la moneda seleccionada
