import React, { useState } from 'react';
import { Category, CategoryGroup } from '../types';
import { Tag, Target } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    category: { name: string; groupId: string; budgeted: number; targetAmount?: number },
    editingId?: string
  ) => void;
  groups: CategoryGroup[];
  editingCategory?: Category | null;
  defaultGroupId?: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groups,
  editingCategory,
  defaultGroupId,
}) => {
  const [name, setName] = useState(editingCategory?.name || '');
  const [groupId, setGroupId] = useState(
    editingCategory?.groupId || defaultGroupId || (groups[0]?.id ?? '')
  );
  const [budgeted, setBudgeted] = useState(
    editingCategory ? editingCategory.budgeted.toString() : '0'
  );
  const [targetAmount, setTargetAmount] = useState(
    editingCategory?.targetAmount ? editingCategory.targetAmount.toString() : ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !groupId) return;

    const parsedTarget = parseFloat(targetAmount);

    onSave(
      {
        name: name.trim(),
        groupId,
        budgeted: parseFloat(budgeted) || 0,
        targetAmount: !isNaN(parsedTarget) && parsedTarget > 0 ? parsedTarget : undefined,
      },
      editingCategory?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              {editingCategory ? 'Editar Categoría / Meta' : 'Nueva Categoría o Meta de Ahorro'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grupo de Pertenencia */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Grupo de Categorías
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Nombre de la Categoría o Meta
            </label>
            <input
              type="text"
              required
              placeholder="ej. 🎮 PlayStation 5, 🍕 Restaurantes, 🚗 Seguro..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Meta Total de Ahorro / Objetivo */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Target className="w-4 h-4" />
              <span>¿Tienes una Meta de Ahorro específica? (Opcional)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Define el monto total que necesitas alcanzar (ej. $2000 para tu Play).
            </p>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="Monto objetivo (ej. 2000)"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Presupuesto / Asignado Actual */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Monto Actual Asignado (USD Base)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={budgeted}
              onChange={(e) => setBudgeted(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
            >
              {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
