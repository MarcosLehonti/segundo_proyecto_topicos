import React from 'react';
import { AppState } from '../types';
import { formatCurrency, convertToUSD } from '../utils/currency';
import { TrendingUp, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NetWorthCardProps {
  state: AppState;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ state }) => {
  // 1. Calcular saldos de cuentas en USD base
  let totalAssetsUSD = 0;
  let totalDebtsUSD = 0;

  state.accounts.forEach((acc) => {
    const balanceInUSD = convertToUSD(acc.currentBalance, acc.currency, state.currencyConfig);
    if (acc.type === 'credit' && balanceInUSD < 0) {
      totalDebtsUSD += Math.abs(balanceInUSD);
    } else {
      totalAssetsUSD += balanceInUSD;
    }
  });

  const netWorthUSD = totalAssetsUSD - totalDebtsUSD;

  // 2. Calcular "Disponible para Presupuestar" (Estilo YNAB)
  // Total Fondos Disponibles = Total Activos
  // Total Presupuestado = Suma de 'budgeted' de todas las categorías
  const totalBudgetedUSD = state.categories.reduce((acc, cat) => acc + (cat.budgeted || 0), 0);
  const toBudgetUSD = totalAssetsUSD - totalBudgetedUSD;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Patrimonio Neto Total */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Patrimonio Neto Total
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          {formatCurrency(netWorthUSD, state.currencyConfig)}
        </div>
        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          Consolidado en {state.currencyConfig.selectedCurrency}
        </p>
      </div>

      {/* 2. Disponible Para Presupuestar (YNAB To-Be-Budgeted) */}
      <div
        className={`border rounded-2xl p-5 shadow-xl relative overflow-hidden transition-all ${
          toBudgetUSD < 0
            ? 'bg-rose-950/20 border-rose-800/60 text-rose-300'
            : toBudgetUSD === 0
            ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
            : 'bg-teal-950/20 border-teal-800/60 text-teal-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
            Por Presupuestar (YNAB)
          </span>
          <div className="p-2 rounded-xl bg-slate-900/80">
            {toBudgetUSD === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toBudgetUSD < 0 ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-teal-400" />
            )}
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold tracking-tight">
          {formatCurrency(toBudgetUSD, state.currencyConfig)}
        </div>
        <p className="text-[11px] opacity-80 mt-2">
          {toBudgetUSD === 0
            ? '¡Perfecto! Todo centavo tiene su trabajo.'
            : toBudgetUSD > 0
            ? 'Asigna este saldo a tus categorías'
            : 'Presupuestaste más dinero del que tienes'}
        </p>
      </div>

      {/* 3. Total Activos en Cuentas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Activos
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
            {state.accounts.length} Cuentas
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-100">
          {formatCurrency(totalAssetsUSD, state.currencyConfig)}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Efectivo, Bancos y Ahorros
        </p>
      </div>

      {/* 4. Total Asignado a Categorías */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Presupuestado
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
            {state.categories.length} Categorías
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-100">
          {formatCurrency(totalBudgetedUSD, state.currencyConfig)}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Planificado para este mes
        </p>
      </div>
    </div>
  );
};
