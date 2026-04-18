import { Transaction, Category, Budget } from './types'

// Mock categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    icon: '🍔',
    color: '#FF6B6B',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Transport',
    icon: '🚗',
    color: '#4ECDC4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Entertainment',
    icon: '🎬',
    color: '#95E1D3',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Shopping',
    icon: '🛍️',
    color: '#FFB6B9',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Utilities',
    icon: '💡',
    color: '#FEC8D8',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Salary',
    icon: '💼',
    color: '#47b84b',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'House Rent',
    icon: '🏠',
    color: '#A8E6CF',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Lend',
    icon: '💸',
    color: '#FFD3B6',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Return',
    icon: '🔄',
    color: '#FFAAA5',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Others',
    icon: '📦',
    color: '#C7CEE6',
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Loan',
    icon: '💰',
    color: '#FF9800',
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Donate',
    icon: '🎁',
    color: '#4CAF50',
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Savings',
    icon: '🏦',
    color: '#2196F3',
    createdAt: new Date().toISOString(),
  },
]

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3500,
    type: 'income',
    category: 'Salary',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    description: 'Monthly salary',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    amount: 45.50,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 3).toISOString().split('T')[0],
    description: 'Lunch at restaurant',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    amount: 85.00,
    type: 'expense',
    category: 'Transport',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
    description: 'Gas',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    amount: 120.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 7).toISOString().split('T')[0],
    description: 'Movie tickets and popcorn',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    amount: 250.00,
    type: 'expense',
    category: 'Shopping',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
    description: 'Clothing',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    amount: 120.00,
    type: 'expense',
    category: 'Utilities',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString().split('T')[0],
    description: 'Electricity bill',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    amount: 35.99,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
    description: 'Groceries',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    amount: 500.00,
    type: 'income',
    category: 'Salary',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 16).toISOString().split('T')[0],
    description: 'Freelance project',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    amount: 75.00,
    type: 'expense',
    category: 'Transport',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString().split('T')[0],
    description: 'Uber rides',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    amount: 200.00,
    type: 'expense',
    category: 'Shopping',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().split('T')[0],
    description: 'Shoes and accessories',
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    amount: 65.00,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().split('T')[0],
    description: 'Coffee and brunch',
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    amount: 180.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString().split('T')[0],
    description: 'Concert tickets',
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    amount: 15000,
    type: 'expense',
    category: 'House Rent',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
    description: 'Monthly house rent',
    createdAt: new Date().toISOString(),
  },
  {
    id: '14',
    amount: 3000,
    type: 'expense',
    category: 'Lend',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
    description: 'Lent money to friend',
    createdAt: new Date().toISOString(),
  },
  {
    id: '15',
    amount: 3000,
    type: 'income',
    category: 'Return',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().split('T')[0],
    description: 'Friend returned money',
    createdAt: new Date().toISOString(),
  },
  {
    id: '16',
    amount: 500,
    type: 'expense',
    category: 'Others',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
    description: 'Miscellaneous expenses',
    createdAt: new Date().toISOString(),
  },
  // নতুন ক্যাটাগরির জন্য ট্রানজ্যাকশন
  {
    id: '17',
    amount: 10000,
    type: 'expense',
    category: 'Loan',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString().split('T')[0],
    description: 'Monthly loan payment',
    createdAt: new Date().toISOString(),
  },
  {
    id: '18',
    amount: 500,
    type: 'expense',
    category: 'Donate',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString().split('T')[0],
    description: 'Charity donation',
    createdAt: new Date().toISOString(),
  },
  {
    id: '19',
    amount: 5000,
    type: 'income',
    category: 'Savings',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString().split('T')[0],
    description: 'Savings deposit',
    createdAt: new Date().toISOString(),
  },
]

// Mock budgets
export const mockBudgets: Budget[] = [
  {
    id: '1',
    categoryId: '1',
    categoryName: 'Food',
    limit: 500,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    categoryId: '2',
    categoryName: 'Transport',
    limit: 300,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    categoryId: '3',
    categoryName: 'Entertainment',
    limit: 400,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    categoryId: '4',
    categoryName: 'Shopping',
    limit: 600,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    categoryId: '7',
    categoryName: 'House Rent',
    limit: 20000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    categoryId: '10',
    categoryName: 'Others',
    limit: 1000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    categoryId: '11',
    categoryName: 'Loan',
    limit: 15000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    categoryId: '12',
    categoryName: 'Donate',
    limit: 1000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    categoryId: '13',
    categoryName: 'Savings',
    limit: 10000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
]

// In-memory storage (will be replaced with database)
let transactions = [...mockTransactions]
let categories = [...mockCategories]
let budgets = [...mockBudgets]

// Helper functions to manage data
export function getAllTransactions(): Transaction[] {
  return [...transactions]
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find(t => t.id === id)
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  return newTransaction
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | undefined {
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) return undefined
  transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date().toISOString() }
  return transactions[index]
}

export function deleteTransaction(id: string): boolean {
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) return false
  transactions.splice(index, 1)
  return true
}

export function getAllCategories(): Category[] {
  return [...categories]
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

export function addCategory(category: Omit<Category, 'id' | 'createdAt'>): Category {
  // ডুপ্লিকেট ক্যাটাগরি চেক করুন
  const exists = categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())
  if (exists) {
    throw new Error(`Category "${category.name}" already exists`)
  }
  
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  categories.push(newCategory)
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>): Category | undefined {
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return undefined
  categories[index] = { ...categories[index], ...updates }
  return categories[index]
}

export function deleteCategory(id: string): boolean {
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return false
  categories.splice(index, 1)
  return true
}

export function getAllBudgets(): Budget[] {
  return [...budgets]
}

export function getBudgetById(id: string): Budget | undefined {
  return budgets.find(b => b.id === id)
}

export function addBudget(budget: Omit<Budget, 'id' | 'createdAt'>): Budget {
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  budgets.push(newBudget)
  return newBudget
}

export function updateBudget(id: string, updates: Partial<Budget>): Budget | undefined {
  const index = budgets.findIndex(b => b.id === id)
  if (index === -1) return undefined
  budgets[index] = { ...budgets[index], ...updates, updatedAt: new Date().toISOString() }
  return budgets[index]
}

export function deleteBudget(id: string): boolean {
  const index = budgets.findIndex(b => b.id === id)
  if (index === -1) return false
  budgets.splice(index, 1)
  return true
}

// Reset to mock data (useful for testing)
export function resetToMockData(): void {
  transactions = [...mockTransactions]
  categories = [...mockCategories]
  budgets = [...mockBudgets]
}