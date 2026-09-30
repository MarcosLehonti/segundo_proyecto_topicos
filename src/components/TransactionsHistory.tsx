import React, { useState } from 'react';
import { AppState, Transaction } from '../types';
import { TransactionModal } from './TransactionModal';
import { formatCurrency, convertToUSD } from '../utils/currency';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Plus,
  Trash2,
  Edit2,
  Receipt,
} from 'lucide-react';

interface TransactionsHistoryProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  state,
  onUpdateState,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    onUpdateState((prev) => {
      let updatedTransactions: Transaction[];
      if (editingId) {
        updatedTransactions = prev.transactions.map((tx) =>
          tx.id === editingId ? { ...tx, ...txData } : tx
        );
      } else {
        const newTx: Transaction = {
          ...txData,
          id: 'tx-' + Date.now(),
          createdAt: new Date().toISOString(),
        };
        updatedTransactions = [newTx, ...prev.transactions];
      }

      return {
        ...prev,
        transactions: updatedTransactions,
      };
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('¿Eliminar esta transacción? El saldo de la cuenta se ajustará automáticamente.')) {
      onUpdateState((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((tx) => tx.id !== id),
      }));
    }
  };

  // Filtrado de transacciones
  const filteredTransactions = state.transactions.filter((tx) => {
    // 1. Tipo
    if (filterType !== 'all' && tx.type !== filterType) return false;
    // 2. Cuenta
    if (filterAccount !== 'all' && tx.accountId !== filterAccount && tx.targetAccountId !== filterAccount) {
      return false;
    }
    // 3. Categoría
    if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;
    // 4. Búsqueda texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPayee = tx.payeeOrSource?.toLowerCase().includes(q);
      const matchNotes = tx.notes?.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      if (!matchPayee && !matchNotes && !matchAmount) return false;
    }
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header del módulo de transacciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Historial de Movimientos & Transacciones
          </h2>
          <p className="text-xs text-slate-400">
            Registro cronológico de ingresos, gastos y transferencias
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTx(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar Movimiento
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
        {/* Buscador */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por comercio, notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filtro Tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todos los Tipos</option>
          <option value="expense">Gastos (-)</option>
          <option value="income">Ingresos (+)</option>
          <option value="transfer">Transferencias (↔)</option>
        </select>

        {/* Filtro Cuenta */}
        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todas las Cuentas</option>
          {state.accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        {/* Filtro Categoría */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todas las Categorías</option>
          {state.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Transacciones */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Fecha</th>
              <th className="pb-3">Detalle / Comercio</th>
              <th className="pb-3">Cuenta</th>
              <th className="pb-3">Categoría</th>
              <th className="pb-3 text-right">Monto</th>
              <th className="pb-3 text-right pr-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                  No se encontraron movimientos registrados con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const account = state.accounts.find((a) => a.id === tx.accountId);
                const targetAccount = tx.targetAccountId
                  ? state.accounts.find((a) => a.id === tx.targetAccountId)
                  : null;
                const category = state.categories.find((c) => c.id === tx.categoryId);

                const amountUSD = convertToUSD(tx.amount, tx.currency, state.currencyConfig);

                const isIncome = tx.type === 'income';
                const isExpense = tx.type === 'expense';
                const isTransfer = tx.type === 'transfer';

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 text-slate-300 transition-colors group">
                    <td className="py-3 pl-2 text-xs text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Detalle / Beneficiario */}
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : isExpense
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {isIncome && <ArrowDownLeft className="w-3.5 h-3.5" />}
                          {isExpense && <ArrowUpRight className="w-3.5 h-3.5" />}
                          {isTransfer && <ArrowLeftRight className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white tracking-tight">
                            {tx.payeeOrSource}
                          </div>
                          {tx.notes && (
                            <div className="text-[11px] text-slate-500">{tx.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cuenta */}
                    <td className="py-3 text-xs">
                      {isTransfer ? (
                        <div className="flex items-center gap-1 text-[11px] text-slate-300">
                          <span className="font-semibold">{account?.name || 'Origen'}</span>
                          <span className="text-slate-500">→</span>
                          <span className="font-semibold">{targetAccount?.name || 'Destino'}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300">
                          {account?.name || 'Cuenta'}
                        </span>
                      )}
                    </td>

                    {/* Categoría */}
                    <td className="py-3 text-xs">
                      {category ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-semibold">
                          {category.name}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </td>

                    {/* Monto */}
                    <td className="py-3 text-right whitespace-nowrap">
                      <div
                        className={`text-xs font-extrabold ${
                          isIncome
                            ? 'text-emerald-400'
                            : isExpense
                            ? 'text-rose-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {isIncome ? '+' : isExpense ? '-' : ''}
                        {formatCurrency(amountUSD, state.currencyConfig)}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 text-right pr-2">
                      <div className="opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingTx(tx);
                            setModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-400 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        accounts={state.accounts}
        categories={state.categories}
        selectedCurrency={state.currencyConfig.selectedCurrency}
        editingTransaction={editingTx}
      />
    </div>
  );
};
