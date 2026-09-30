import { AppState } from '../types';

const STORAGE_KEY = 'mibilletera_data_v1';

export const INITIAL_STATE: AppState = {
  accounts: [
    {
      id: 'acc-1',
      name: 'Efectivo Personal',
      type: 'cash',
      initialBalance: 350,
      currentBalance: 350,
      currency: 'USD',
      color: '#10b981',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'acc-2',
      name: 'Banco Principal',
      type: 'bank',
      initialBalance: 1200,
      currentBalance: 1200,
      currency: 'USD',
      color: '#3b82f6',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'acc-3',
      name: 'Fondo de Ahorros',
      type: 'savings',
      initialBalance: 2500,
      currentBalance: 2500,
      currency: 'USD',
      color: '#8b5cf6',
      createdAt: new Date().toISOString(),
    },
  ],
  categoryGroups: [
    { id: 'grp-1', name: '🏠 Gastos Fijos Obligatorios', color: '#ef4444' },
    { id: 'grp-2', name: '🍕 Gastos Variables y Diario', color: '#f59e0b' },
    { id: 'grp-3', name: '🎯 Metas de Ahorro e Inversión', color: '#10b981' },
  ],
  categories: [
    { id: 'cat-1', groupId: 'grp-1', name: 'Alquiler / Vivienda', budgeted: 400 },
    { id: 'cat-2', groupId: 'grp-1', name: 'Servicios (Luz, Agua, Net)', budgeted: 80 },
    { id: 'cat-3', groupId: 'grp-2', name: 'Supermercado & Comida', budgeted: 250 },
    { id: 'cat-4', groupId: 'grp-2', name: 'Transporte / Gasolina', budgeted: 60 },
    { id: 'cat-5', groupId: 'grp-2', name: 'Ocio y Salidas', budgeted: 100 },
    { id: 'cat-6', groupId: 'grp-3', name: 'Fondo de Emergencia', budgeted: 150 },
  ],
  transactions: [
    {
      id: 'tx-1',
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      amount: 1500,
      currency: 'USD',
      accountId: 'acc-2',
      payeeOrSource: 'Salario Mensual',
      notes: 'Ingreso nómina del mes',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      amount: 45,
      currency: 'USD',
      accountId: 'acc-1',
      categoryId: 'cat-3',
      payeeOrSource: 'Supermercado Central',
      notes: 'Compras semanales',
      createdAt: new Date().toISOString(),
    },
  ],
  budgetPlans: [
    {
      id: 'plan-1',
      name: 'Plan Mensual Equilibrado (50/30/20)',
      description: 'Presupuesto estándar para cubrir necesidades, entretenimiento y ahorro constante.',
      targetMonthlyIncome: 1500,
      allocations: {
        'cat-1': 400,
        'cat-2': 80,
        'cat-3': 250,
        'cat-4': 60,
        'cat-5': 100,
        'cat-6': 150,
      },
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'plan-2',
      name: 'Plan de Ahorro e Inversión Acelerado',
      description: 'Escenario austero enfocado en maximizar el fondo de emergencia e inversión.',
      targetMonthlyIncome: 1500,
      allocations: {
        'cat-1': 400,
        'cat-2': 60,
        'cat-3': 180,
        'cat-4': 40,
        'cat-5': 30,
        'cat-6': 400,
      },
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  activePlanId: 'plan-1',
  currencyConfig: {
    baseCurrency: 'USD',
    selectedCurrency: 'USD',
    rates: {
      USD: 1.0,
      BOB: 6.96,
      EUR: 0.92,
      ARS: 1050.0,
    },
  },
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
};

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      budgetPlans: parsed.budgetPlans && parsed.budgetPlans.length > 0 ? parsed.budgetPlans : INITIAL_STATE.budgetPlans,
      activePlanId: parsed.activePlanId || INITIAL_STATE.activePlanId,
      currencyConfig: {
        ...INITIAL_STATE.currencyConfig,
        ...(parsed.currencyConfig || {}),
      },
    };
  } catch (error) {
    console.error('Error al cargar datos de localStorage:', error);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar datos en localStorage:', error);
  }
};

export const exportStateAsJson = (state: AppState): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `billetera_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
