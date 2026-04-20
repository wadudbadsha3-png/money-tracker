// app/page.tsx (Dashboard)
'use client'

import { useTransactions } from '@/hooks/useTransactions'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HandCoins, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'

// অ্যাসেট ক্যালকুলেটর ফাংশন
function calculateAssetSummary(transactions: any[]) {
  let totalIncome = 0
  let totalExpense = 0
  let totalSavings = 0
  let loansGiven = 0
  let loansReturned = 0
  
  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount
    }
    if (t.type === 'expense') {
      totalExpense += t.amount
      if (t.category === 'Lend') {
        loansGiven += t.amount
      }
    }
    if (t.type === 'transfer' && t.category === 'Savings') {
      totalSavings += t.amount
    }
    if (t.category === 'Return' && t.type === 'income') {
      loansReturned += t.amount
    }
  }
  
  const netLoansGiven = loansGiven - loansReturned
  const bankBalance = totalIncome - totalExpense - totalSavings - loansGiven
  const savingsBalance = totalSavings
  const totalAsset = bankBalance + savingsBalance + netLoansGiven
  
  return { 
    totalIncome, 
    totalExpense, 
    netLoansGiven, 
    totalAsset 
  }
}

// সংখ্যা ফরম্যাট (.00 বাদে)
function formatAmount(amount: number): string {
  const roundedAmount = Math.floor(amount)
  
  if (roundedAmount >= 10000000) {
    const value = (roundedAmount / 10000000).toFixed(2)
    const cleanValue = value.endsWith('.00') ? Math.floor(parseFloat(value)) : value
    return `$${cleanValue}Cr`
  } else if (roundedAmount >= 100000) {
    const value = (roundedAmount / 100000).toFixed(2)
    const cleanValue = value.endsWith('.00') ? Math.floor(parseFloat(value)) : value
    return `$${cleanValue}L`
  } else if (roundedAmount >= 1000) {
    const value = (roundedAmount / 1000).toFixed(2)
    const cleanValue = value.endsWith('.00') ? Math.floor(parseFloat(value)) : value
    return `$${cleanValue}K`
  }
  return `$${roundedAmount}`
}

export default function Dashboard() {
  const { transactions, isLoading } = useTransactions()
  
  const assetSummary = useMemo(() => {
    if (!transactions.length) return null
    return calculateAssetSummary(transactions)
  }, [transactions])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back to your money tracker</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
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

        {/* Asset Summary Cards - Total Asset এবং Total Lend */}
        {assetSummary && (
          <div className="grid grid-cols-2 gap-4">
            {/* Total Asset Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Asset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{formatAmount(assetSummary.totalAsset)}</div>
                <p className="text-xs opacity-90 mt-1">Your net worth</p>
              </CardContent>
            </Card>

            {/* Total Lend Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <HandCoins className="h-4 w-4" />
                  Total Lend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{formatAmount(assetSummary.netLoansGiven)}</div>
                <p className="text-xs opacity-90 mt-1">To be returned</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regular Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  )
}