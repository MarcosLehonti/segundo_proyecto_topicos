import React, { useState } from 'react';
import { Account, AccountType, AppState } from '../types';
import { AccountModal } from './AccountModal';
import { formatCurrency, convertToUSD } from '../utils/currency';
import { Landmark, Banknote, PiggyBank, CreditCard, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface AccountsListProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case 'bank':
      return Landmark;
    case 'cash':
      return Banknote;
    case 'savings':
      return PiggyBank;
    case 'credit':
      return CreditCard;
    default:
      return Banknote;
  }
};

export const AccountsList: React.FC<AccountsListProps> = ({ state, onUpdateState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleSaveAccount = (
    accountData: Omit<Account, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      onUpdateState((prev) => ({
        ...prev,
        accounts: prev.accounts.map((acc) =>
          acc.id === editingId ? { ...acc, ...accountData } : acc
        ),
      }));
    } else {
      const newAccount: Account = {
        ...accountData,
        id: 'acc-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      onUpdateState((prev) => ({
        ...prev,
        accounts: [...prev.accounts, newAccount],
      }));
    }
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
      onUpdateState((prev) => ({
        ...prev,
        accounts: prev.accounts.filter((a) => a.id !== id),
        transactions: prev.transactions.filter((t) => t.accountId !== id && t.targetAccountId !== id),
      }));
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            Mis Cuentas & Billeteras
          </h2>
          <p className="text-xs text-slate-400">Fondos disponibles y fuentes de pago</p>
        </div>
        <button
          onClick={() => {
            setEditingAccount(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva Cuenta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.accounts.map((account) => {
          const Icon = getAccountIcon(account.type);
          const balanceInUSD = convertToUSD(account.currentBalance, account.currency, state.currencyConfig);

          return (
            <div
              key={account.id}
              className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: account.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{account.name}</h4>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {account.type === 'bank'
                        ? 'Banco'
                        : account.type === 'cash'
                        ? 'Efectivo'
                        : account.type === 'savings'
                        ? 'Ahorros'
                        : 'Crédito'}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === account.id ? null : account.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {menuOpenId === account.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => {
                          setEditingAccount(account);
                          setIsModalOpen(true);
                          setMenuOpenId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Edit2 className="w-3 h-3 text-blue-400" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteAccount(account.id);
                          setMenuOpenId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-slate-800 hover:text-rose-300"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Saldo de la cuenta */}
              <div className="mt-3 pt-3 border-t border-slate-900 flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-medium">Saldo Actual</span>
                <div className="text-right">
                  <div className="text-base font-extrabold text-white">
                    {formatCurrency(balanceInUSD, state.currencyConfig)}
                  </div>
                  {state.currencyConfig.selectedCurrency !== account.currency && (
                    <div className="text-[10px] text-slate-500">
                      Nativo: {account.currency} {account.currentBalance.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={handleSaveAccount}
        editingAccount={editingAccount}
      />
    </div>
  );
};
