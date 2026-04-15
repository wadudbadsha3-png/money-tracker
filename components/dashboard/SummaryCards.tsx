// components/dashboard/SummaryCards.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const balance = totalIncome - totalExpenses

  // Current month stats
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth))
  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-4">
      {/* Main Stats Cards - সবগুলো পাশাপাশি */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {/* Total Income */}
        <Card className="p-2 sm:p-3 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Total Income</p>
          <p className="text-sm sm:text-base md:text-xl font-bold text-green-600 truncate">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-[10px] text-muted-foreground">All time</p>
        </Card>

        {/* Total Expenses */}
        <Card className="p-2 sm:p-3 text-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Total Expenses</p>
          <p className="text-sm sm:text-base md:text-xl font-bold text-red-600 truncate">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-[10px] text-muted-foreground">All time</p>
        </Card>

        {/* Balance */}
        <Card className="p-2 sm:p-3 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Balance</p>
          <p className={`text-sm sm:text-base md:text-xl font-bold truncate ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-[10px] text-muted-foreground">All time</p>
        </Card>
      </div>

      {/* This Month Summary - অতিরিক্ত তথ্য */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Card className="p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">This Month Income</p>
          <p className="text-sm sm:text-base font-bold text-green-600">{formatCurrency(thisMonthIncome)}</p>
        </Card>
        <Card className="p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">This Month Expenses</p>
          <p className="text-sm sm:text-base font-bold text-red-600">{formatCurrency(thisMonthExpenses)}</p>
        </Card>
      </div>
    </div>
  )
}