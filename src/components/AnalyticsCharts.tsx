import React from 'react';
import { AppState } from '../types';
import { formatCurrency, convertToUSD } from '../utils/currency';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Award } from 'lucide-react';

interface AnalyticsChartsProps {
  state: AppState;
}

const CATEGORY_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#6366f1', '#14b8a6',
];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ state }) => {
  // 1. Calcular gastos e ingresos totales en USD
  let totalIncomeUSD = 0;
  let totalExpenseUSD = 0;
  const expenseByCategoryUSD: Record<string, number> = {};

  state.transactions.forEach((tx) => {
    const amountUSD = convertToUSD(tx.amount, tx.currency, state.currencyConfig);
    if (tx.type === 'income') {
      totalIncomeUSD += amountUSD;
    } else if (tx.type === 'expense') {
      totalExpenseUSD += amountUSD;
      if (tx.categoryId) {
        expenseByCategoryUSD[tx.categoryId] = (expenseByCategoryUSD[tx.categoryId] || 0) + amountUSD;
      }
    }
  });

  const netSavingsUSD = totalIncomeUSD - totalExpenseUSD;
  const savingsRate = totalIncomeUSD > 0 ? Math.max(0, (netSavingsUSD / totalIncomeUSD) * 100) : 0;

  // Ordenar categorías por gasto descendente
  const categorySpendingList = Object.entries(expenseByCategoryUSD)
    .map(([catId, amountUSD]) => {
      const category = state.categories.find((c) => c.id === catId);
      return {
        id: catId,
        name: category?.name || 'Otras compras',
        amountUSD,
        percentage: totalExpenseUSD > 0 ? (amountUSD / totalExpenseUSD) * 100 : 0,
      };
    })
    .sort((a, b) => b.amountUSD - a.amountUSD);

  return (
    <div className="space-y-6">
      {/* 3 Tarjetas de Resumen Financiero del Período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ingresos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ingresos</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {formatCurrency(totalIncomeUSD, state.currencyConfig)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Fondos ingresados en todas las cuentas</p>
        </div>

        {/* Gastos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Gastos</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {formatCurrency(totalExpenseUSD, state.currencyConfig)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Consumo registrado en el período</p>
        </div>

        {/* Capacidad de Ahorro */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Flujo Neto / Ahorro</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold ${netSavingsUSD >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {formatCurrency(netSavingsUSD, state.currencyConfig)}
          </div>
          <p className="text-[11px] text-purple-400 mt-2 font-medium">
            Tasa de ahorro: {savingsRate.toFixed(1)}% de tus ingresos
          </p>
        </div>
      </div>

      {/* Gráficos y Desglose Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose de Gastos por Categoría */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Distribución de Gastos por Categoría
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {categorySpendingList.length} categorías con gasto
            </span>
          </div>

          {categorySpendingList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No hay gastos registrados en las categorías para graficar.
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Barra segmentada horizontal multicromática */}
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                {categorySpendingList.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                    }}
                    title={`${item.name}: ${item.percentage.toFixed(1)}%`}
                    className="h-full transition-all hover:opacity-80"
                  />
                ))}
              </div>

              {/* Lista rankeada */}
              <div className="space-y-2.5 pt-2 max-h-72 overflow-y-auto pr-1">
                {categorySpendingList.map((item, idx) => {
                  const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                  return (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                        <span className="font-semibold text-slate-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-medium">{item.percentage.toFixed(1)}%</span>
                        <span className="font-bold text-white">
                          {formatCurrency(item.amountUSD, state.currencyConfig)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Comparativa Ingresos vs Gastos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              Comparativa de Flujo de Efectivo
            </h3>
          </div>

          <div className="space-y-5 pt-4">
            {/* Barra de Ingresos */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-400">Ingresos Totales</span>
                <span className="text-white">{formatCurrency(totalIncomeUSD, state.currencyConfig)}</span>
              </div>
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full shadow-sm shadow-emerald-500/30" />
              </div>
            </div>

            {/* Barra de Gastos */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-400">Gastos Totales</span>
                <span className="text-white">{formatCurrency(totalExpenseUSD, state.currencyConfig)}</span>
              </div>
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all shadow-sm shadow-rose-500/30"
                  style={{
                    width: `${Math.min(100, totalIncomeUSD > 0 ? (totalExpenseUSD / totalIncomeUSD) * 100 : 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Consejo de presupuesto YNAB */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                💡 Principio YNAB: Dale un trabajo a cada centavo
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                En el método de presupuesto base cero, tu meta es que tus ingresos se distribuyan completamente entre gastos presentes, ahorros e inversiones hasta que el dinero «Por Presupuestar» llegue a cero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
