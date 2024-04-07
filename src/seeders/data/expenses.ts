import { CreateExpenseDto } from 'src/expenses/dtos/expenses';

const MOCK_EXPENSES: CreateExpenseDto[] = [];

const expenseSources = [
  'Groceries',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Dining Out',
];

for (let i = 0; i < 20; i++) {
  const expenseSourceIndex = Math.floor(Math.random() * expenseSources.length);
  const expense: CreateExpenseDto = {
    amount: parseFloat((Math.random() * 20).toFixed(2)),
    accountId: 1,
    date: new Date(2024, 3, 1 + Math.floor(Math.random() * 7)),
    expenseSourceName: expenseSources[expenseSourceIndex],
  };
  MOCK_EXPENSES.push(expense);
}

export default MOCK_EXPENSES;
