import { Transaction } from "../viewModels/useTransactions/useTransactions.model";

export const setQuantityToNegative = (transactions: Transaction[]): Transaction[] => {
  return transactions.map(transaction => {
    // Crea una copia del objeto para no modificar el original
    const modifiedTransaction = { ...transaction };

    // Convertir quantity a negativo si es positivo
    if (Number(modifiedTransaction.quantity) > 0) {
      modifiedTransaction.quantity = -Math.abs(Number(modifiedTransaction.quantity));
    }

    return modifiedTransaction;
  });
}

export const setQuantityToPositive = (transactions: Transaction[]): Transaction[] => {
  return transactions.map(transaction => {
    // Crea una copia del objeto para no modificar el original
    const modifiedTransaction = { ...transaction };

    // Convertir quantity a positivo si es negativo
    if (Number(modifiedTransaction.quantity) < 0) {
      modifiedTransaction.quantity = Math.abs(Number(modifiedTransaction.quantity));
    }

    return modifiedTransaction;
  });
}