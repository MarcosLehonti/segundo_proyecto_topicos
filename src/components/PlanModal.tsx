import React, { useState, useEffect } from 'react';
import { BudgetPlan, AppState } from '../types';
import { X, Target, Copy, RotateCcw, Check } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Omit<BudgetPlan, 'id' | 'createdAt' | 'updatedAt'>, editingId?: string) => void;
  editingPlan?: BudgetPlan | null;
  state: AppState;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlan,
  state,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<number>(1500);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (editingPlan) {
      setName(editingPlan.name);
      setDescription(editingPlan.description || '');
      setTargetMonthlyIncome(editingPlan.targetMonthlyIncome);
      setAllocations(editingPlan.allocations || {});
      setIsDefault(editingPlan.isDefault || false);
    } else {
      setName('');
      setDescription('');
      setTargetMonthlyIncome(1500);
      // Pre-fill with current budgeted amounts as a convenient baseline
      const initialAlloc: Record<string, number> = {};
      state.categories.forEach((cat) => {
        initialAlloc[cat.id] = cat.budgeted || 0;
      });
      setAllocations(initialAlloc);
      setIsDefault(false);
    }
  }, [editingPlan, isOpen, state.categories]);

  if (!isOpen) return null;

  const handleAllocationChange = (categoryId: string, val: number) => {
    setAllocations((prev) => ({
      ...prev,
      [categoryId]: Math.max(0, isNaN(val) ? 0 : val),
    }));
  };

  const handleCopyCurrentBudget = () => {
    const currentAlloc: Record<string, number> = {};
    state.categories.forEach((cat) => {
      currentAlloc[cat.id] = cat.budgeted || 0;
    });
    setAllocations(currentAlloc);
  };

  const handleClearAllocations = () => {
    const emptyAlloc: Record<string, number> = {};
    state.categories.forEach((cat) => {
      emptyAlloc[cat.id] = 0;
    });
    setAllocations(emptyAlloc);
  };

  const totalAllocated = Object.values(allocations).reduce((acc, val) => acc + (val || 0), 0);
  const remainingToPlan = targetMonthlyIncome - totalAllocated;
  const plannedSavingsRate = targetMonthlyIncome > 0 ? Math.max(0, (remainingToPlan / targetMonthlyIncome) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        description: description.trim(),
        targetMonthlyIncome: Math.max(0, targetMonthlyIncome),
        allocations,
        isDefault,
      },
      editingPlan?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingPlan ? 'Editar Plan de Presupuesto' : 'Crear Nuevo Plan de Presupuesto'}
              </h2>
              <p className="text-xs text-slate-400">
                Define metas de ingreso y asignaciones por categoría inspiradas en YNAB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* General Plan Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Nombre del Plan *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Plan Mensual Base, Plan de Austeridad, Plan Vacaciones"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Descripción o Propósito</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. 50% necesidades básicas, 30% estilo de vida, 20% ahorro"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Ingreso Proyectado ({state.currencyConfig.baseCurrency}) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={targetMonthlyIncome}
                onChange={(e) => setTargetMonthlyIncome(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="text-xs font-medium text-slate-300">
                  Establecer como Plan Predeterminado
                </span>
              </label>
            </div>
          </div>

          {/* Metric banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Ingreso Proyectado</p>
              <p className="text-sm font-bold text-white font-mono">
                {formatCurrency(targetMonthlyIncome, state.currencyConfig)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Total Asignado</p>
              <p className="text-sm font-bold text-emerald-400 font-mono">
                {formatCurrency(totalAllocated, state.currencyConfig)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Margen / Ahorro</p>
              <p
                className={`text-sm font-bold font-mono ${
                  remainingToPlan >= 0 ? 'text-teal-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(remainingToPlan, state.currencyConfig)}
              </p>
              <span className="text-[10px] text-slate-500">({plannedSavingsRate.toFixed(1)}% margen)</span>
            </div>
          </div>

          {/* Category Allocations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Asignación de Objetivos por Categoría
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCurrentBudget}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors border border-emerald-500/20"
                >
                  <Copy className="w-3 h-3" />
                  Copiar del Presupuesto Actual
                </button>
                <button
                  type="button"
                  onClick={handleClearAllocations}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {state.categoryGroups.map((group) => {
                const groupCategories = state.categories.filter((cat) => cat.groupId === group.id);
                if (groupCategories.length === 0) return null;

                const groupTotal = groupCategories.reduce(
                  (sum, cat) => sum + (allocations[cat.id] || 0),
                  0
                );

                return (
                  <div
                    key={group.id}
                    className="bg-slate-950/50 border border-slate-800/80 rounded-xl overflow-hidden"
                  >
                    <div className="bg-slate-800/40 px-3.5 py-2 flex items-center justify-between border-b border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: group.color || '#10b981' }}
                        />
                        <span className="text-xs font-bold text-slate-200">{group.name}</span>
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-400">
                        Total Grupo: {formatCurrency(groupTotal, state.currencyConfig)}
                      </span>
                    </div>

                    <div className="p-3 space-y-2.5">
                      {groupCategories.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="text-slate-300 font-medium truncate flex-1">
                            {cat.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-[11px]">
                              {state.currencyConfig.baseCurrency}
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={allocations[cat.id] ?? 0}
                              onChange={(e) =>
                                handleAllocationChange(cat.id, parseFloat(e.target.value) || 0)
                              }
                              className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white font-mono text-xs text-right focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              Guardar Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
