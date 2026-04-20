<<<<<<< HEAD
// lib/mockData.ts

import { 
  Transaction, 
  Category, 
  Budget, 
  CreateTransactionInput,
  LendSummary,
  SavingsSummary
} from './types'
=======
// lib/mock-data.ts
import { Transaction, Category, Budget, AssetSummary } from './types'
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f

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
    name: 'Savings Withdraw',
    icon: '🏧',
    color: '#FF5722',
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
  {
    id: '14',
    name: 'Others',
    icon: '📦',
    color: '#C7CEE6',
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
    description: 'Movie tickets',
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
    description: 'Shoes',
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    amount: 65.00,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().split('T')[0],
    description: 'Coffee',
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    amount: 180.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString().split('T')[0],
    description: 'Concert',
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    amount: 15000,
    type: 'expense',
    category: 'House Rent',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
    description: 'Monthly rent',
    createdAt: new Date().toISOString(),
  },
  {
    id: '14',
    amount: 3000,
    type: 'expense',
    category: 'Lend',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
    description: 'Lent to friend',
    personName: 'Rahim',
    createdAt: new Date().toISOString(),
  },
  {
    id: '15',
    amount: 3000,
    type: 'expense',
    category: 'Return',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().split('T')[0],
    description: 'Friend returned',
    personName: 'Rahim',
    createdAt: new Date().toISOString(),
  },
  {
    id: '16',
    amount: 500,
    type: 'expense',
    category: 'Others',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
    description: 'Misc',
    createdAt: new Date().toISOString(),
  },
  {
    id: '17',
    amount: 10000,
    type: 'expense',
    category: 'Loan',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString().split('T')[0],
<<<<<<< HEAD
    description: 'Loan payment',
=======
    description: 'Monthly loan payment (EMI)',
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
    createdAt: new Date().toISOString(),
  },
  {
    id: '18',
    amount: 500,
    type: 'expense',
    category: 'Donate',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString().split('T')[0],
    description: 'Charity',
    createdAt: new Date().toISOString(),
  },
  {
    id: '19',
    amount: 5000,
<<<<<<< HEAD
    type: 'expense',
=======
    type: 'transfer',
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
    category: 'Savings',
    fromAccount: 'Main Account',
    toAccount: 'Savings Account',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString().split('T')[0],
<<<<<<< HEAD
    description: 'Savings deposit',
    accountName: 'DBBL',
=======
    description: 'Monthly savings transfer',
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
    createdAt: new Date().toISOString(),
  },
  {
    id: '20',
<<<<<<< HEAD
    amount: 2000,
    type: 'expense',
    category: 'Savings Withdraw',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString().split('T')[0],
    description: 'Emergency withdraw',
    accountName: 'DBBL',
=======
    amount: 500000,
    type: 'income',
    category: 'Loan',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
    description: 'Car loan received from bank',
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
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
    categoryId: '14',
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

// In-memory storage
let transactions = [...mockTransactions]
let categories = [...mockCategories]
let budgets = [...mockBudgets]

<<<<<<< HEAD
// =============================================
// TRANSACTION FUNCTIONS
// =============================================

=======
// ============= CATEGORY FUNCTIONS =============
export function getAllCategories(): Category[] {
  return [...categories]
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

export function addCategory(category: Omit<Category, 'id' | 'createdAt'>): Category {
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

// ============= TRANSACTION FUNCTIONS =============
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
export function getAllTransactions(): Transaction[] {
  return [...transactions]
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find(t => t.id === id)
}

export function addTransaction(input: CreateTransactionInput): Transaction {
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    userId: undefined,
    amount: input.amount,
    type: input.type,
    category: input.category,
    date: input.date,
    description: input.description,
    createdAt: new Date().toISOString(),
    personName: input.personName,
    accountName: input.accountName,
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

<<<<<<< HEAD
// =============================================
// LEND SUMMARY FUNCTIONS
// =============================================

export function getLendSummary(): LendSummary[] {
  const summary = new Map<string, { given: number, returned: number }>()
  
  for (const t of transactions) {
    if (t.category === 'Lend' && t.type === 'expense' && t.personName) {
      const current = summary.get(t.personName) || { given: 0, returned: 0 }
      current.given += t.amount
      summary.set(t.personName, current)
    }
    
    if (t.category === 'Return' && t.type === 'expense' && t.personName) {
      const current = summary.get(t.personName) || { given: 0, returned: 0 }
      current.returned += t.amount
      summary.set(t.personName, current)
    }
  }
  
  return Array.from(summary.entries()).map(([personName, data]) => ({
    personName,
    totalGiven: data.given,
    totalReturned: data.returned,
    pending: data.given - data.returned
  }))
}

export function getPendingLends(): Transaction[] {
  const allLends = transactions.filter(t => t.category === 'Lend' && t.type === 'expense')
  const returns = transactions.filter(t => t.category === 'Return' && t.type === 'expense')
  
  // Simple pending calculation
  return allLends.filter(lend => {
    const totalReturned = returns
      .filter(r => r.personName === lend.personName)
      .reduce((sum, r) => sum + r.amount, 0)
    return lend.amount > totalReturned
  })
}

// =============================================
// SAVINGS SUMMARY FUNCTIONS
// =============================================

export function getSavingsSummary(): SavingsSummary[] {
  const summary = new Map<string, { deposit: number, withdraw: number }>()
  
  for (const t of transactions) {
    if (t.category === 'Savings' && t.type === 'expense' && t.accountName) {
      const current = summary.get(t.accountName) || { deposit: 0, withdraw: 0 }
      current.deposit += t.amount
      summary.set(t.accountName, current)
    }
    
    if (t.category === 'Savings Withdraw' && t.type === 'expense' && t.accountName) {
      const current = summary.get(t.accountName) || { deposit: 0, withdraw: 0 }
      current.withdraw += t.amount
      summary.set(t.accountName, current)
    }
  }
  
  return Array.from(summary.entries()).map(([accountName, data]) => ({
    accountName,
    totalDeposit: data.deposit,
    totalWithdraw: data.withdraw,
    balance: data.deposit - data.withdraw
  }))
}

export function getTotalSavingsBalance(): number {
  const summaries = getSavingsSummary()
  return summaries.reduce((total, s) => total + s.balance, 0)
}

// =============================================
// BALANCE FUNCTIONS
// =============================================

export function getBalance(): number {
  let totalIncome = 0
  let totalExpense = 0
  
  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount
    } else if (t.type === 'expense') {
      totalExpense += t.amount
    }
  }
  
  return totalIncome - totalExpense
}

export function getTotalIncome(): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalExpense(): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

// =============================================
// CATEGORY FUNCTIONS
// =============================================

export function getAllCategories(): Category[] {
  return [...categories]
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

export function addCategory(name: string, icon: string, color: string): Category {
  const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase())
  if (exists) {
    throw new Error(`Category "${name}" already exists`)
  }
  
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    icon,
    color,
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

// =============================================
// BUDGET FUNCTIONS
// =============================================

=======
// ============= BUDGET FUNCTIONS =============
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
export function getAllBudgets(): Budget[] {
  return [...budgets]
}

export function getBudgetById(id: string): Budget | undefined {
  return budgets.find(b => b.id === id)
}

export function addBudget(categoryId: string, limit: number, period: 'monthly' | 'yearly'): Budget {
  const category = getCategoryById(categoryId)
  if (!category) {
    throw new Error('Category not found')
  }
  
  const newBudget: Budget = {
    id: Date.now().toString(),
    categoryId,
    categoryName: category.name,
    limit,
    period,
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

<<<<<<< HEAD
// Reset to mock data
=======
// ============= ASSET CALCULATOR =============
export function calculateAssetSummary(): AssetSummary {
  let totalIncome = 0
  let totalExpense = 0
  let totalSavings = 0
  let loansGiven = 0
  let loansReturned = 0
  
  for (const transaction of transactions) {
    if (transaction.type === 'income' && transaction.category !== 'Loan') {
      totalIncome += transaction.amount
    }
    else if (transaction.type === 'expense') {
      if (transaction.category !== 'Savings') {
        totalExpense += transaction.amount
      }
      if (transaction.category === 'Lend') {
        loansGiven += transaction.amount
      }
    }
    else if (transaction.type === 'transfer' && transaction.category === 'Savings') {
      totalSavings += transaction.amount
    }
    
    if (transaction.category === 'Return' && transaction.type === 'income') {
      loansReturned += transaction.amount
    }
  }
  
  const netLoansGiven = loansGiven - loansReturned
  const bankBalance = totalIncome - totalExpense - totalSavings - loansGiven
  const savingsBalance = totalSavings
  const totalAsset = bankBalance + savingsBalance + netLoansGiven
  
  return {
    totalIncome,
    totalExpense,
    totalSavings,
    netLoansGiven,
    bankBalance,
    savingsBalance,
    loansGiven,
    loansReturned,
    totalAsset
  }
}

// ============= RESET FUNCTION =============
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
export function resetToMockData(): void {
  transactions = [...mockTransactions]
  categories = [...mockCategories]
  budgets = [...mockBudgets]
}