import React, { useState } from 'react';
import { AppState, Category, CategoryGroup } from '../types';
import { CategoryModal } from './CategoryModal';
import { GroupModal } from './GroupModal';
import { formatCurrency, convertToUSD } from '../utils/currency';
import {
  PieChart,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  AlertTriangle,
  CheckCircle2,
  Target,
  Sparkles,
} from 'lucide-react';

interface BudgetTableProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ state, onUpdateState }) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [defaultGroupId, setDefaultGroupId] = useState<string | undefined>(undefined);

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CategoryGroup | null>(null);

  // Modal rápido de asignación
  const [assignModalCat, setAssignModalCat] = useState<Category | null>(null);
  const [assignAmount, setAssignAmount] = useState<string>('');

  // Calcular gastos por categoría en USD desde las transacciones
  const spentByCategoryUSD: Record<string, number> = {};
  state.transactions.forEach((tx) => {
    if (tx.type === 'expense' && tx.categoryId) {
      const amountUSD = convertToUSD(tx.amount, tx.currency, state.currencyConfig);
      spentByCategoryUSD[tx.categoryId] = (spentByCategoryUSD[tx.categoryId] || 0) + amountUSD;
    }
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleSaveCategory = (
    catData: { name: string; groupId: string; budgeted: number; targetAmount?: number },
    editingId?: string
  ) => {
    if (editingId) {
      onUpdateState((prev) => ({
        ...prev,
        categories: prev.categories.map((c) => (c.id === editingId ? { ...c, ...catData } : c)),
      }));
    } else {
      const newCat: Category = {
        ...catData,
        id: 'cat-' + Date.now(),
      };
      onUpdateState((prev) => ({
        ...prev,
        categories: [...prev.categories, newCat],
      }));
    }
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('¿Eliminar esta categoría?')) {
      onUpdateState((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== catId),
      }));
    }
  };

  const handleSaveGroup = (groupData: { name: string }, editingId?: string) => {
    if (editingId) {
      onUpdateState((prev) => ({
        ...prev,
        categoryGroups: prev.categoryGroups.map((g) =>
          g.id === editingId ? { ...g, ...groupData } : g
        ),
      }));
    } else {
      const newGroup: CategoryGroup = {
        id: 'grp-' + Date.now(),
        name: groupData.name,
      };
      onUpdateState((prev) => ({
        ...prev,
        categoryGroups: [...prev.categoryGroups, newGroup],
      }));
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('¿Eliminar este grupo y todas sus categorías?')) {
      onUpdateState((prev) => ({
        ...prev,
        categoryGroups: prev.categoryGroups.filter((g) => g.id !== groupId),
        categories: prev.categories.filter((c) => c.groupId !== groupId),
      }));
    }
  };

  const handleUpdateBudgetInline = (catId: string, newBudgetStr: string) => {
    const val = parseFloat(newBudgetStr);
    const validVal = isNaN(val) || val < 0 ? 0 : val;
    onUpdateState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === catId ? { ...c, budgeted: validVal } : c)),
    }));
  };

  const handleQuickAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalCat) return;

    const extra = parseFloat(assignAmount);
    if (isNaN(extra) || extra <= 0) return;

    onUpdateState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === assignModalCat.id
          ? { ...c, budgeted: (c.budgeted || 0) + extra }
          : c
      ),
    }));

    setAssignModalCat(null);
    setAssignAmount('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header del módulo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            Presupuesto & Metas de Ahorro (Estilo YNAB)
          </h2>
          <p className="text-xs text-slate-400">
            Asigna fondos a tus gastos cotidianos o acumula ahorros para tus metas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingGroup(null);
              setGroupModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
            Nuevo Grupo
          </button>
          <button
            onClick={() => {
              setEditingCategory(null);
              setDefaultGroupId(state.categoryGroups[0]?.id);
              setCategoryModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva Categoría / Meta
          </button>
        </div>
      </div>

      {/* Tabla de Grupos y Categorías */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Categoría / Meta</th>
              <th className="pb-3 text-right">Asignado</th>
              <th className="pb-3 text-right">Gastado</th>
              <th className="pb-3 text-right">Disponible / Ahorrado</th>
              <th className="pb-3 text-center w-40">Progreso</th>
              <th className="pb-3 text-right pr-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {state.categoryGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.id];
              const groupCategories = state.categories.filter((c) => c.groupId === group.id);

              const groupBudgeted = groupCategories.reduce((acc, c) => acc + (c.budgeted || 0), 0);
              const groupSpent = groupCategories.reduce(
                (acc, c) => acc + (spentByCategoryUSD[c.id] || 0),
                0
              );
              const groupAvailable = groupBudgeted - groupSpent;

              return (
                <React.Fragment key={group.id}>
                  {/* Fila del Grupo */}
                  <tr className="bg-slate-950/60 font-semibold text-slate-200">
                    <td className="py-2.5 pl-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <span>{group.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({groupCategories.length})
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-300">
                      {formatCurrency(groupBudgeted, state.currencyConfig)}
                    </td>
                    <td className="py-2.5 text-right text-slate-400">
                      {formatCurrency(groupSpent, state.currencyConfig)}
                    </td>
                    <td
                      className={`py-2.5 text-right font-bold ${
                        groupAvailable < 0
                          ? 'text-rose-400'
                          : groupAvailable === 0
                          ? 'text-slate-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(groupAvailable, state.currencyConfig)}
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            groupSpent > groupBudgeted ? 'bg-rose-500' : 'bg-purple-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              groupBudgeted > 0 ? (groupSpent / groupBudgeted) * 100 : 0
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setDefaultGroupId(group.id);
                            setCategoryModalOpen(true);
                          }}
                          title="Añadir categoría a este grupo"
                          className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingGroup(group);
                            setGroupModalOpen(true);
                          }}
                          title="Editar grupo"
                          className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          title="Eliminar grupo"
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Categorías dentro del grupo */}
                  {!isCollapsed &&
                    groupCategories.map((cat) => {
                      const spent = spentByCategoryUSD[cat.id] || 0;
                      const available = (cat.budgeted || 0) - spent;
                      const isOverspent = spent > cat.budgeted;

                      // Si tiene meta de ahorro (Target Goal)
                      const hasTarget = cat.targetAmount && cat.targetAmount > 0;
                      const targetPct = hasTarget
                        ? Math.min(100, (available / (cat.targetAmount || 1)) * 100)
                        : 0;
                      const expensePct = cat.budgeted > 0 ? (spent / cat.budgeted) * 100 : 0;

                      return (
                        <tr
                          key={cat.id}
                          className="hover:bg-slate-800/30 text-slate-300 transition-colors group"
                        >
                          <td className="py-2.5 pl-8">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-200">
                                {cat.name}
                              </span>
                              {hasTarget && (
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                                  <Target className="w-3 h-3" />
                                  Meta: {formatCurrency(cat.targetAmount || 0, state.currencyConfig)}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Input inline de Asignado */}
                          <td className="py-2.5 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              <span className="text-[11px] text-slate-500">$</span>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={cat.budgeted}
                                onChange={(e) => handleUpdateBudgetInline(cat.id, e.target.value)}
                                className="w-20 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-md px-1.5 py-0.5 text-xs text-right font-semibold text-white focus:outline-none transition-colors"
                              />
                            </div>
                          </td>

                          {/* Gastado */}
                          <td className="py-2.5 text-right text-xs text-slate-400">
                            {formatCurrency(spent, state.currencyConfig)}
                          </td>

                          {/* Disponible / Ahorrado */}
                          <td className="py-2.5 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                isOverspent
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : available === 0
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}
                            >
                              {isOverspent && <AlertTriangle className="w-3 h-3" />}
                              {available > 0 && <CheckCircle2 className="w-3 h-3" />}
                              {formatCurrency(available, state.currencyConfig)}
                            </span>
                          </td>

                          {/* Barra de progreso */}
                          <td className="py-2.5 text-center">
                            {hasTarget ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                                  <span>Meta: {targetPct.toFixed(0)}%</span>
                                  {targetPct >= 100 && (
                                    <span className="text-emerald-400 font-bold">¡Cumplida! 🎉</span>
                                  )}
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                                    style={{ width: `${targetPct}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      isOverspent
                                        ? 'bg-rose-500'
                                        : expensePct > 85
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(100, expensePct)}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-500 w-8 text-right">
                                  {expensePct.toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Acciones & Botón Rápido + Asignar */}
                          <td className="py-2.5 text-right pr-2">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Botón Asignar Fondos */}
                              <button
                                onClick={() => {
                                  setAssignModalCat(cat);
                                  setAssignAmount('');
                                }}
                                title="Sumar fondos a esta categoría"
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-[11px] font-bold border border-emerald-500/30 transition-all"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span className="hidden sm:inline">+ Asignar</span>
                              </button>

                              <button
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setDefaultGroupId(group.id);
                                  setCategoryModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-400 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

      {/* Modal Rápido de Inyección/Asignación de Dinero */}
      {assignModalCat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Asignar Dinero</h3>
                  <p className="text-xs text-slate-400 font-medium">{assignModalCat.name}</p>
                </div>
              </div>
              <button
                onClick={() => setAssignModalCat(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddFunds} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  ¿Cuánto dinero deseas SUMAR a esta meta? (USD)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  autoFocus
                  placeholder="ej. 100, 300, 500..."
                  value={assignAmount}
                  onChange={(e) => setAssignAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Botones de sugerencia rápida */}
              <div className="flex items-center gap-2">
                {[50, 100, 200, 500].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAssignAmount(quick.toString())}
                    className="flex-1 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    +${quick}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignModalCat(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        groups={state.categoryGroups}
        editingCategory={editingCategory}
        defaultGroupId={defaultGroupId}
      />

      <GroupModal
        isOpen={groupModalOpen}
        onClose={() => {
          setGroupModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
      />
    </div>
  );
};
