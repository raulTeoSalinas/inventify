// React

// External Dependencies

// Internal Dependencies

export interface Transaction {
  quantity: number;
  description: string;
  id: string;
}

export const calculateAvailableUnits = (transactions?: Transaction[]): number => {
  if (!transactions?.length) return 0;
  return transactions.reduce((total, transaction) =>
    total + transaction.quantity, 0);
};
