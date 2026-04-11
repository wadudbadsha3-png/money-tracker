import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Transaction, Budget } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatting utilities
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatMonth(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

// Calculation utilities
export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, tx) => {
    return tx.type === 'income' ? sum + tx.amount : sum - tx.amount
  }, 0)
}

export function calculateCategoryTotal(transactions: Transaction[], category: string): number {
  return transactions
    .filter(tx => tx.category === category)
    .reduce((sum, tx) => (tx.type === 'income' ? sum + tx.amount : sum - tx.amount), 0)
}

export function getMonthYearKey(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function getYearKey(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.getFullYear()
}

export function filterTransactionsByMonth(transactions: Transaction[], yearMonth: string): Transaction[] {
  return transactions.filter(tx => getMonthYearKey(tx.date) === yearMonth)
}

export function filterTransactionsByYear(transactions: Transaction[], year: number): Transaction[] {
  return transactions.filter(tx => getYearKey(tx.date) === year)
}

export function groupTransactionsByCategory(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((acc, tx) => {
    if (!acc[tx.category]) {
      acc[tx.category] = []
    }
    acc[tx.category].push(tx)
    return acc
  }, {} as Record<string, Transaction[]>)
}

export function calculateBudgetProgress(budget: Budget, spent: number): number {
  return Math.min((spent / budget.limit) * 100, 100)
}

export function getBudgetStatus(progress: number): 'safe' | 'warning' | 'exceeded' {
  if (progress >= 100) return 'exceeded'
  if (progress >= 80) return 'warning'
  return 'safe'
}
