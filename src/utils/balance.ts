import { Account, Transaction, CurrencyConfig } from '../types';
import { convertToUSD, convertAmount } from './currency';

/**
 * Recalcula de forma pura y determinista el saldo actual de cada cuenta
 * a partir de su saldo inicial y todas las transacciones registradas.
 */
export const recalculateAccountBalances = (
  accounts: Account[],
  transactions: Transaction[],
  currencyConfig: CurrencyConfig
): Account[] => {
  return accounts.map((account) => {
    // 1. Iniciar con el balance inicial propio de la cuenta en su moneda nativa
    let balanceInNative = account.initialBalance;

    transactions.forEach((tx) => {
      // Convertir el monto de la transacción a USD
      const txAmountUSD = convertToUSD(tx.amount, tx.currency, currencyConfig);
      // Convertir el monto de USD a la moneda de la cuenta actual
      const txAmountInAccountCurr = convertAmount(txAmountUSD, account.currency, currencyConfig);

      if (tx.type === 'income' && tx.accountId === account.id) {
        balanceInNative += txAmountInAccountCurr;
      } else if (tx.type === 'expense' && tx.accountId === account.id) {
        balanceInNative -= txAmountInAccountCurr;
      } else if (tx.type === 'transfer') {
        if (tx.accountId === account.id) {
          // Origen: se debita
          balanceInNative -= txAmountInAccountCurr;
        } else if (tx.targetAccountId === account.id) {
          // Destino: se acredita
          balanceInNative += txAmountInAccountCurr;
        }
      }
    });

    return {
      ...account,
      currentBalance: balanceInNative,
    };
  });
};
