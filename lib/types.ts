// lib/types.ts

// Transaction types - Transfer যোগ করুন
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  userId?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date string
  description: string;
  fromAccount?: string;   // ট্রান্সফারের জন্য
  toAccount?: string;     // ট্রান্সফারের জন্য
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
  fromAccount?: string;   // ট্রান্সফারের জন্য
  toAccount?: string;     // ট্রান্সফারের জন্য
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  description?: string;
  fromAccount?: string;
  toAccount?: string;
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

// Asset/Wealth types (নতুন যোগ করুন)
export interface AssetSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  netLoansGiven: number;
  bankBalance: number;
  savingsBalance: number;
  loansGiven: number;
  loansReturned: number;
  totalAsset: number;
}

export interface Account {
  id: string;
  name: string;  // 'Main Account', 'Savings Account', 'Cash'
  type: 'checking' | 'savings' | 'cash' | 'investment';
  balance: number;
  currency: string;
  createdAt: string;
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
  assetSummary: AssetSummary;  // নতুন যোগ করুন
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