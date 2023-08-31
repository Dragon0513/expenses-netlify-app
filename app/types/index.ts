export interface Expense {
  id: string;
  title: string;
  amount: number;
  date?: string;
}

export type Expenses = {
  expenses: Expense[];
};
