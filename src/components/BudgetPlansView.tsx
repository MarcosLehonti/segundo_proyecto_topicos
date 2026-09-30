import React, { useState } from 'react';
import { BudgetPlan, AppState } from '../types';
import { PlanModal } from './PlanModal';
import { formatCurrency } from '../utils/currency';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Copy, 
  Zap, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface BudgetPlansViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onNavigateToBudget?: () => void;
}

export const BudgetPlansView: React.FC<BudgetPlansViewProps> = ({
  state,
  onUpdateState,
  onNavigateToBudget,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<BudgetPlan | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const plans = state.budgetPlans || [];
  const activePlanId = state.activePlanId || plans[0]?.id;
  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSavePlan = (
    planData: Omit<BudgetPlan, 'id' | 'createdAt' | 'updatedAt'>,
    editingId?: string
  ) => {
    const now = new Date().toISOString();

    if (editingId) {
      onUpdateState((prev) => {
        const updatedPlans = (prev.budgetPlans || []).map((p) =>
          p.id === editingId
            ? { ...p, ...planData, updatedAt: now }
            : planData.isDefault
            ? { ...p, isDefault: false }
            : p
        );
        return {
          ...prev,
          budgetPlans: updatedPlans,
          activePlanId: planData.isDefault ? editingId : prev.activePlanId,
        };
      });
      showNotification('Plan actualizado exitosamente.');
    } else {
      const newId = 'plan-' + Date.now();
      const newPlan: BudgetPlan = {
        ...planData,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };

      onUpdateState((prev) => {
        const existingPlans = (prev.budgetPlans || []).map((p) =>
          planData.isDefault ? { ...p, isDefault: false } : p
        );
        return {
          ...prev,
          budgetPlans: [...existingPlans, newPlan],
          activePlanId: planData.isDefault ? newId : prev.activePlanId || newId,
        };
      });
      showNotification('Nuevo plan de presupuesto creado.');
    }
  };

  const handleSetActivePlan = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      activePlanId: id,
    }));
    showNotification('Plan activo actualizado.');
  };

  const handleDuplicatePlan = (plan: BudgetPlan) => {
    const newPlan: BudgetPlan = {
      ...plan,
      id: 'plan-' + Date.now(),
      name: `${plan.name} (Copia)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateState((prev) => ({
      ...prev,
      budgetPlans: [...(prev.budgetPlans || []), newPlan],
    }));
    showNotification('Plan duplicado con éxito.');
  };

  const handleDeletePlan = (id: string) => {
    if (plans.length <= 1) {
      alert('Debes mantener al menos un plan de presupuesto.');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este plan de presupuesto?')) {
      onUpdateState((prev) => {
        const remaining = (prev.budgetPlans || []).filter((p) => p.id !== id);
        return {
          ...prev,
          budgetPlans: remaining,
          activePlanId: prev.activePlanId === id ? remaining[0]?.id : prev.activePlanId,
        };
      });
      showNotification('Plan eliminado.');
    }
  };

  // Apply Plan allocations directly to the current month's categories budgeted amounts!
  const handleApplyPlanToBudget = (plan: BudgetPlan) => {
    if (
      confirm(
        `¿Deseas aplicar las asignaciones del plan "${plan.name}" a tu presupuesto actual? Esto sobreescribirá los montos presupuestados actuales.`
      )
    ) {
      onUpdateState((prev) => ({
        ...prev,
        activePlanId: plan.id,
        categories: prev.categories.map((cat) => ({
          ...cat,
          budgeted: plan.allocations[cat.id] ?? cat.budgeted,
        })),
      }));
      showNotification(`¡Plan "${plan.name}" aplicado a las categorías del mes!`);
    }
  };

  // Calculate stats for a given plan
  const getPlanMetrics = (plan: BudgetPlan) => {
    const totalAllocated = Object.values(plan.allocations || {}).reduce(
      (sum, val) => sum + (val || 0),
      0
    );
    const savingsMargin = plan.targetMonthlyIncome - totalAllocated;
    const savingsRate =
      plan.targetMonthlyIncome > 0
        ? Math.max(0, (savingsMargin / plan.targetMonthlyIncome) * 100)
        : 0;

    return { totalAllocated, savingsMargin, savingsRate };
  };

  // Calculate actual spending per category from transactions
  const getSpentForCategory = (categoryId: string) => {
    return state.transactions
      .filter((t) => t.type === 'expense' && t.categoryId === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Top Section / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white">Planes de Presupuesto</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                Estrategia YNAB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Crea escenarios de gastos, define metas mensuales y aplica plantillas a tu presupuesto con 1 clic.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Crear Nuevo Plan
        </button>
      </div>

      {/* Active Plan Spotlight Banner */}
      {activePlan && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Plan Activo de Referencia
                </span>
                <span className="text-xs text-slate-400">
                  Actualizado: {new Date(activePlan.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">{activePlan.name}</h2>
              <p className="text-xs text-slate-300 max-w-xl">
                {activePlan.description || 'Estrategia de asignación financiera consciente.'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Ingreso Proyectado</p>
                <p className="text-sm font-bold text-white font-mono">
                  {formatCurrency(activePlan.targetMonthlyIncome, state.currencyConfig)}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Asignado a Gastos</p>
                <p className="text-sm font-bold text-emerald-400 font-mono">
                  {formatCurrency(getPlanMetrics(activePlan).totalAllocated, state.currencyConfig)}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Margen / Ahorro</p>
                <p className="text-sm font-bold text-teal-300 font-mono">
                  {getPlanMetrics(activePlan).savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Quick Actions for Active Plan */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApplyPlanToBudget(activePlan)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
                title="Aplica las asignaciones de este plan al presupuesto de categorías del mes actual"
              >
                <Zap className="w-4 h-4 fill-current" />
                Aplicar al Presupuesto Actual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Plans */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Tus Planes de Presupuesto ({plans.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isActive = plan.id === activePlanId;
            const { totalAllocated, savingsMargin, savingsRate } = getPlanMetrics(plan);

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between bg-slate-900/90 border rounded-2xl p-5 transition-all relative ${
                  isActive
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-emerald-400'
                        }`}
                      >
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{plan.name}</h4>
                        {isActive && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Activo
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Editar plan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicatePlan(plan)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Duplicar plan"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Eliminar plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {plan.description || 'Sin descripción adicional.'}
                  </p>

                  {/* Metrics Box */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Ingreso Estimado:</span>
                      <span className="text-white font-mono font-bold">
                        {formatCurrency(plan.targetMonthlyIncome, state.currencyConfig)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Asignado:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {formatCurrency(totalAllocated, state.currencyConfig)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Margen de Ahorro:</span>
                      <span className="text-teal-300 font-mono font-bold">
                        {savingsRate.toFixed(1)}% ({formatCurrency(savingsMargin, state.currencyConfig)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  {!isActive && (
                    <button
                      onClick={() => handleSetActivePlan(plan.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Activar
                    </button>
                  )}
                  <button
                    onClick={() => handleApplyPlanToBudget(plan)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Aplicar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan vs Actual Comparison Table */}
      {activePlan && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Comparativa de Ejecución: Plan Activo vs Presupuesto Actual vs Gastos
              </h3>
              <p className="text-xs text-slate-400">
                Monitorea si tu asignación mensual y gastos reales están alineados con los objetivos de tu plan "{activePlan.name}".
              </p>
            </div>
            {onNavigateToBudget && (
              <button
                onClick={onNavigateToBudget}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Ir a Tabla de Presupuesto <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3 text-right">Objetivo del Plan</th>
                  <th className="py-2.5 px-3 text-right">Presupuestado Real</th>
                  <th className="py-2.5 px-3 text-right">Gastado Real</th>
                  <th className="py-2.5 px-3 text-right">Diferencia vs Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {state.categoryGroups.map((group) => {
                  const groupCats = state.categories.filter((c) => c.groupId === group.id);
                  if (groupCats.length === 0) return null;

                  return (
                    <React.Fragment key={group.id}>
                      <tr className="bg-slate-950/40">
                        <td colSpan={5} className="py-2 px-3 font-sans font-bold text-slate-300">
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: group.color || '#10b981' }}
                          />
                          {group.name}
                        </td>
                      </tr>
                      {groupCats.map((cat) => {
                        const planTarget = activePlan.allocations[cat.id] || 0;
                        const budgetedReal = cat.budgeted || 0;
                        const spentReal = getSpentForCategory(cat.id);
                        const diff = budgetedReal - planTarget;

                        return (
                          <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 font-sans text-slate-300 font-medium pl-6">
                              {cat.name}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-200">
                              {formatCurrency(planTarget, state.currencyConfig)}
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                              {formatCurrency(budgetedReal, state.currencyConfig)}
                            </td>
                            <td className="py-2.5 px-3 text-right text-rose-400">
                              {formatCurrency(spentReal, state.currencyConfig)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] ${
                                  diff === 0
                                    ? 'bg-slate-800 text-slate-400'
                                    : diff > 0
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan Modal Component */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
        state={state}
      />
    </div>
  );
};
