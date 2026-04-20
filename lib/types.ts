// lib/types.ts

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
  
  // 🆕 লেন্ড/রিটার্ন ট্র্যাকিং
  personName?: string;      // লেন্ড/রিটার্নের ব্যক্তির নাম
  
  // 🆕 সেভিংস ট্র্যাকিং
  accountName?: string;     // ব্যাংক/সেভিংস অ্যাকাউন্টের নাম
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
  personName?: string;      // 🆕
  accountName?: string;     // 🆕
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  description?: string;
  personName?: string;      // 🆕
  accountName?: string;     // 🆕
}

// Category types (same as before)
export interface Category {
  id: string;
  userId?: string;
  name: string;
  icon: string;
  color: string;
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
  month: string;
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

// 🆕 লেন্ড সামারি টাইপ
export interface LendSummary {
  personName: string;
  totalGiven: number;
  totalReturned: number;
  pending: number;
}

// 🆕 সেভিংস সামারি টাইপ
export interface SavingsSummary {
  accountName: string;
  totalDeposit: number;
  totalWithdraw: number;
  balance: number;
}