// components/dashboard/SummaryCards.tsx (আইকন সহ ভার্সন - .00 বাদ)
'use client'

import { Card } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle, Briefcase, HandCoins, PiggyBank } from 'lucide-react'

interface SummaryCardsProps {
  transactions: Transaction[]
}

// নতুন ফাংশন - .00 ছাড়া কারেন্সি ফরম্যাট
const formatCurrencyNoDecimal = (amount: number) => {
  const roundedAmount = Math.floor(amount)
  return `$${roundedAmount.toLocaleString()}`
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  // মোট আয়
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  // মোট খরচ (Return এবং Savings Withdraw বাদ দিয়ে)
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.category !== 'Return' && t.category !== 'Savings Withdraw')
    .reduce((sum, t) => sum + t.amount, 0)
    
  // ব্যালেন্স
  const balance = totalIncome - totalExpenses

  // 🔥 সরাসরি Lend (Return বিয়োগ করবেন না)
  const totalLend = transactions
    .filter(t => t.category === 'Lend')
    .reduce((sum, t) => sum + t.amount, 0)

  // 🔥 সরাসরি Savings (Withdraw বিয়োগ করবেন না)
  const totalSavings = transactions
    .filter(t => t.category === 'Savings')
    .reduce((sum, t) => sum + t.amount, 0)

  // 🎯 Total Asset = Balance + Lend + Savings
  const totalAsset = balance + totalLend + totalSavings

  // বর্তমান মাসের পরিসংখ্যান
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth))
  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense' && t.category !== 'Return' && t.category !== 'Savings Withdraw')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Stats Cards - 4 cards in first row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        
        {/* Total Income */}
        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Income</p>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm sm:text-base md:text-xl font-bold text-green-600 dark:text-green-400 truncate">
            {formatCurrencyNoDecimal(totalIncome)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">All time</p>
        </Card>

        {/* Total Expenses */}
        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Expenses</p>
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm sm:text-base md:text-xl font-bold text-red-600 dark:text-red-400 truncate">
            {formatCurrencyNoDecimal(totalExpenses)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">All time</p>
        </Card>

        {/* Balance */}
        <Card className={`p-2 sm:p-3 md:p-4 bg-gradient-to-br ${
          balance >= 0 
            ? 'from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800'
            : 'from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800'
        }`}>
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Balance</p>
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <p className={`text-sm sm:text-base md:text-xl font-bold truncate ${
            balance >= 0 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            {formatCurrencyNoDecimal(balance)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Cash in hand</p>
        </Card>

        {/* Total Asset */}
        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Asset</p>
            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm sm:text-base md:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">
            {formatCurrency(totalAsset)}
          </p>
          <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-1">
            Balance + Lend + Savings
          </p>
        </Card>
      </div>

      {/* Lend and Savings Cards - Second row */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        
        {/* Total Lend Card */}
        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-900/50 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Lend</p>
            <HandCoins className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-sm sm:text-base md:text-xl font-bold text-orange-600 dark:text-orange-400 truncate">
            {formatCurrencyNoDecimal(totalLend)}
          </p>
          <p className="text-[10px] text-orange-500 dark:text-orange-400 mt-1">
            To be returned
          </p>
        </Card>

        {/* Total Savings Card */}
        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-900/50 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Savings</p>
            <PiggyBank className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm sm:text-base md:text-xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrencyNoDecimal(totalSavings)}
          </p>
          <p className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-1">
            Saved amount
          </p>
        </Card>
      </div>

      {/* This Month Summary */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        
        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">
              This Month Income
            </p>
            <ArrowUpCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrencyNoDecimal(thisMonthIncome)}
          </p>
        </Card>

        <Card className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300">
              This Month Expenses
            </p>
            <ArrowDownCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrencyNoDecimal(thisMonthExpenses)}
          </p>
        </Card>
      </div>
    </div>
  )
}