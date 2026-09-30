import React, { useState } from 'react';
import { Account, Category, Transaction, TransactionType } from '../types';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    editingId?: string
  ) => void;
  accounts: Account[];
  categories: Category[];
  selectedCurrency: string;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accounts,
  categories,
  selectedCurrency,
  editingTransaction,
}) => {
  const [type, setType] = useState<TransactionType>(editingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(
    editingTransaction ? editingTransaction.amount.toString() : ''
  );
  const [accountId, setAccountId] = useState(
    editingTransaction?.accountId || accounts[0]?.id || ''
  );
  const [targetAccountId, setTargetAccountId] = useState(
    editingTransaction?.targetAccountId ||
      accounts.find((a) => a.id !== (editingTransaction?.accountId || accounts[0]?.id))?.id ||
      ''
  );
  const [categoryId, setCategoryId] = useState(
    editingTransaction?.categoryId || categories[0]?.id || ''
  );
  const [payeeOrSource, setPayeeOrSource] = useState(
    editingTransaction?.payeeOrSource || ''
  );
  const [date, setDate] = useState(
    editingTransaction?.date || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(editingTransaction?.notes || '');
  const [currency] = useState(editingTransaction?.currency || selectedCurrency);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !accountId) return;

    if (type === 'transfer' && accountId === targetAccountId) {
      alert('La cuenta origen y destino no pueden ser la misma en una transferencia.');
      return;
    }

    onSave(
      {
        date,
        type,
        amount: parsedAmount,
        currency,
        accountId,
        targetAccountId: type === 'transfer' ? targetAccountId : undefined,
        categoryId: type === 'expense' ? categoryId : undefined,
        payeeOrSource:
          type === 'transfer'
            ? `Transferencia a ${accounts.find((a) => a.id === targetAccountId)?.name}`
            : payeeOrSource.trim() || (type === 'income' ? 'Ingreso Varios' : 'Gasto General'),
        notes: notes.trim(),
      },
      editingTransaction?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">
            {editingTransaction ? 'Editar Movimiento' : 'Registrar Nuevo Movimiento'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Tipo de Transacción */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'expense', label: 'Gasto', icon: ArrowUpRight, color: 'text-rose-400', border: 'border-rose-500/50 bg-rose-500/10' },
              { id: 'income', label: 'Ingreso', icon: ArrowDownLeft, color: 'text-emerald-400', border: 'border-emerald-500/50 bg-emerald-500/10' },
              { id: 'transfer', label: 'Transferir', icon: ArrowLeftRight, color: 'text-blue-400', border: 'border-blue-500/50 bg-blue-500/10' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as TransactionType)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? `${t.border} ${t.color}`
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Monto y Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Monto ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Cuentas Origen y Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {type === 'transfer' ? 'Cuenta de Origen' : 'Cuenta Utilizada'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Cuenta Destino
                </label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {accounts
                    .filter((a) => a.id !== accountId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency})
                      </option>
                    ))}
                </select>
              </div>
            ) : type === 'expense' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Categoría de Gasto
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* Comercio / Beneficiario / Fuente */}
          {type !== 'transfer' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {type === 'expense' ? 'Comercio o Beneficiario' : 'Fuente de Ingreso'}
              </label>
              <input
                type="text"
                placeholder={type === 'expense' ? 'ej. Supermercado, Farmacia...' : 'ej. Sueldo, Trabajo freelance...'}
                value={payeeOrSource}
                onChange={(e) => setPayeeOrSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Notas Adicionales (Opcional)
            </label>
            <input
              type="text"
              placeholder="Detalles sobre este movimiento..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              {editingTransaction ? 'Actualizar Movimiento' : 'Registrar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
