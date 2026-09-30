export type AccountType = 'cash' | 'bank' | 'savings' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  currency: string; // ej: 'USD', 'BOB', 'EUR'
  color: string;
  createdAt: string;
}

export interface Category {
  id: string;
  groupId: string;
  name: string;
  budgeted: number; // Monto asignado actualmente
  targetAmount?: number; // Meta total deseada (ej. $2000 para la PlayStation)
  icon?: string;
  color?: string;
}

export interface CategoryGroup {
  id: string;
  name: string; // ej: "Gastos Fijos", "Estilo de Vida", "Ahorros"
  color?: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  currency: string;
  accountId: string;          // Cuenta origen (o destino en caso de ingreso directo)
  targetAccountId?: string;    // Solo para transferencias entre cuentas
  categoryId?: string;        // Categoría de presupuesto
  payeeOrSource: string;       // Comercio / Empresa / Fuente
  notes?: string;
  createdAt: string;
}

export interface CurrencyConfig {
  baseCurrency: string;     // Moneda de cálculo interno (ej: 'USD')
  selectedCurrency: string; // Moneda de visualización activa (ej: 'BOB')
  rates: Record<string, number>; // Tasas con respecto a USD (ej: USD: 1, BOB: 6.96, EUR: 0.92)
}

export interface BudgetPlan {
  id: string;
  name: string;
  description?: string;
  targetMonthlyIncome: number;
  allocations: Record<string, number>; // categoryId -> target budgeted amount
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  accounts: Account[];
  categoryGroups: CategoryGroup[];
  categories: Category[];
  transactions: Transaction[];
  budgetPlans: BudgetPlan[];
  activePlanId?: string;
  currencyConfig: CurrencyConfig;
  selectedMonth: string; // YYYY-MM
}

