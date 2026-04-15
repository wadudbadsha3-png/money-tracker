'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MonthlyChart } from '@/components/Charts/MonthlyChart'
import { CategoryChart } from '@/components/Charts/CategoryChart'
import { IncomeExpenseChart } from '@/components/Charts/IncomeExpenseChart'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { formatCurrency, getMonthYearKey } from '@/lib/utils'

export default function ReportsPage() {
  const { transactions, isLoading: txLoading } = useTransactions()
  const { categories, isLoading: catLoading } = useCategories()

  const isLoading = txLoading || catLoading

  // Calculate current month stats
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => getMonthYearKey(t.date) === currentMonth)
  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate all-time stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  // Calculate Balance
  const thisMonthBalance = thisMonthIncome - thisMonthExpenses
  const totalBalance = totalIncome - totalExpenses

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 sm:h-28 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Analyze your spending patterns and trends</p>
        </div>

        {/* Quick Stats - ছোট বক্স ও পাশাপাশি */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {/* This Month Income */}
          <Card className="p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">This Month Income</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-green-600 truncate">
              {formatCurrency(thisMonthIncome)}
            </p>
          </Card>

          {/* This Month Expenses */}
          <Card className="p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">This Month Expenses</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-red-600 truncate">
              {formatCurrency(thisMonthExpenses)}
            </p>
          </Card>

          {/* Total Income */}
          <Card className="p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Total Income</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-green-600 truncate">
              {formatCurrency(totalIncome)}
            </p>
          </Card>

          {/* Total Expenses */}
          <Card className="p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Total Expenses</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-red-600 truncate">
              {formatCurrency(totalExpenses)}
            </p>
          </Card>
        </div>

        {/* Balance Row (অপশনাল) - এইটা যোগ করলে আরও ভালো লাগবে */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Card className="p-2 sm:p-3 text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">This Month Balance</p>
            <p className={`text-sm sm:text-base md:text-lg font-bold ${thisMonthBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(thisMonthBalance)}
            </p>
          </Card>
          <Card className="p-2 sm:p-3 text-center bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Total Balance</p>
            <p className={`text-sm sm:text-base md:text-lg font-bold ${totalBalance >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Income vs Expenses Over Time */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Income vs Expenses (12 Months)</h2>
            <IncomeExpenseChart transactions={transactions} />
          </Card>

          {/* Monthly Comparison */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Monthly Comparison</h2>
            <MonthlyChart transactions={transactions} />
          </Card>

          {/* Spending by Category */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Spending by Category</h2>
            {transactions.filter(t => t.type === 'expense').length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No expense data available</p>
            ) : (
              <CategoryChart transactions={transactions} categories={categories} />
            )}
          </Card>

          {/* Category Breakdown Table */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Category Summary</h2>
            <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
              {categories.map(category => {
                const amount = transactions
                  .filter(t => t.category === category.name && t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
                if (amount === 0) return null
                return (
                  <div key={category.id} className="flex items-center justify-between pb-2 border-b last:border-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base">{category.icon}</span>
                      <span className="text-xs sm:text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{formatCurrency(amount)}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}