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

  fromAccount?: string;   // ট্রান্সফারের জন্য
  toAccount?: string;     // ট্রান্সফারের জন্য
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  description?: string;
  personName?: string;      // 🆕
  accountName?: string;     // 🆕

  fromAccount?: string;
  toAccount?: string;
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