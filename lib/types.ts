// Transaction types
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date string
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  description?: string;
}

// Category types
export interface Category {
  id: string;
  userId?: string;
  name: string;
  icon: string; // emoji or icon name
  color: string; // hex color or color name
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
}

// Budget types
export type BudgetPeriod = 'monthly' | 'yearly';

export interface Budget {
  id: string;
  userId?: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  period: BudgetPeriod;
  currentSpending?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBudgetInput {
  categoryId: string;
  limit: number;
  period: BudgetPeriod;
}

export interface UpdateBudgetInput {
  limit?: number;
  period?: BudgetPeriod;
}

// Summary/Dashboard types
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  recentTransactions: Transaction[];
  topCategories: { category: string; amount: number }[];
}

// Report types
export interface MonthlyReport {
  month: string; // YYYY-MM format
  income: number;
  expenses: number;
  balance: number;
  byCategory: { category: string; amount: number }[];
}

export interface YearlyReport {
  year: number;
  byMonth: MonthlyReport[];
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}
