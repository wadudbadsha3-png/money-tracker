'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Transaction } from '@/lib/types'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth))

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 border-l-4 border-l-green-500">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Total Income</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-blue-500">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-purple-500">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">This Month</p>
          <p className={`text-3xl font-bold ${thisMonthIncome - thisMonthExpenses >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {formatCurrency(thisMonthIncome - thisMonthExpenses)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(thisMonthIncome)} in, {formatCurrency(thisMonthExpenses)} out
          </p>
        </div>
      </Card>
    </div>
  )
}
