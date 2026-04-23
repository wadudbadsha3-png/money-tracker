// app/reports/page.tsx - শুধু Category Summary অংশ আপডেট করা হয়েছে

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

  // বর্তমান মাসের ক্যালকুলেশন (YYYY-MM ফরম্যাটে)
  const currentDate = new Date()
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionMonthKey = getMonthYearKey(t.date)
    return transactionMonthKey === currentMonthKey
  })
  
  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // অল-টাইম স্ট্যাটস
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  // ব্যালেন্স ক্যালকুলেশন
  const thisMonthBalance = thisMonthIncome - thisMonthExpenses
  const totalBalance = totalIncome - totalExpenses

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
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
        
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Income vs Expenses Over Time */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Income vs Expenses (12 Months)
            </h2>
            <IncomeExpenseChart transactions={transactions} />
          </Card>

          {/* Monthly Comparison */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Monthly Comparison
            </h2>
            <MonthlyChart transactions={transactions} />
          </Card>

          {/* Spending by Category */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Spending by Category
            </h2>
            {transactions.filter(t => t.type === 'expense').length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No expense data available
              </p>
            ) : (
              <CategoryChart transactions={transactions} categories={categories} />
            )}
          </Card>

          {/* Category Breakdown Table - UPDATED VERSION */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Category Summary
            </h2>
            <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
              {(() => {
                // ট্রানজেকশন থেকে expense ক্যাটাগরি এবং amount বের করি
                const expenseByCategory = transactions
                  .filter(t => t.type === 'expense')
                  .reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.amount
                    return acc
                  }, {} as Record<string, number>)
                
                const categoryEntries = Object.entries(expenseByCategory)
                
                if (categoryEntries.length === 0) {
                  return (
                    <p className="text-center text-muted-foreground py-4">
                      No expense data available
                    </p>
                  )
                }
                
                return categoryEntries.map(([categoryName, amount]) => {
                  // ক্যাটাগরির আইকন খুঁজে বের করি
                  const category = categories.find(c => c.name === categoryName)
                  return (
                    <div key={categoryName} className="flex items-center justify-between pb-2 border-b last:border-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base">{category?.icon || '📝'}</span>
                        <span className="text-xs sm:text-sm font-medium">{categoryName}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  )
                })
              })()}
            </div>
          </Card>
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No transactions found. Add some transactions to see your reports!
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}