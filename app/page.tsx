// app/page.tsx (Dashboard)
'use client'

import { useTransactions } from '@/hooks/useTransactions'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const { transactions, isLoading } = useTransactions()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back to your money tracker</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 sm:h-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back to your money tracker</p>
        </div>

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  )
}