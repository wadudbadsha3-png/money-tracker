'use client'

import { Card } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Briefcase, 
  HandCoins, 
  PiggyBank,
  Landmark,
  Receipt,
  Calendar
} from 'lucide-react'

interface SummaryCardsProps {
  transactions: Transaction[]
}

const formatInteger = (amount: number) => {
  const integerAmount = Math.floor(amount)
  return `$${integerAmount.toLocaleString()}`
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  // মোট আয়
  const totalIncome = Math.floor(transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0))
    
  // মোট খরচ
  const totalExpenses = Math.floor(transactions
    .filter(t => t.type === 'expense' && t.category !== 'Return' && t.category !== 'Savings Withdraw')
    .reduce((sum, t) => sum + t.amount, 0))
  
  // Actual Expense ক্যাটাগরিগুলো
  const actualExpenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'House Rent', 'Donate', 'Other']

  // Total Actual Expense (শুধু উপরিউক্ত ক্যাটাগরিগুলো)
  const totalActualExpense = Math.floor(transactions
    .filter(t => t.type === 'expense' && actualExpenseCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0))

  // বাকি লোন = Loan Taken
  const loanTaken = Math.floor(transactions
    .filter(t => t.category === 'Loan Taken')
    .reduce((sum, t) => sum + t.amount, 0))

  // Balance = Income - Expense + Loan Taken
  const balance = Math.floor(totalIncome - totalExpenses + loanTaken)

  // Lend
  const totalLend = Math.floor(transactions
    .filter(t => t.category === 'Lend')
    .reduce((sum, t) => sum + t.amount, 0))

  // Savings
  const totalSavings = Math.floor(transactions
    .filter(t => t.category === 'Savings')
    .reduce((sum, t) => sum + t.amount, 0))

  // 🎯 Total Asset = Balance + Lend + Savings - Loan Taken
  const totalAsset = Math.floor(balance + totalLend + totalSavings - loanTaken)

  // This Month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth))
  const thisMonthIncome = Math.floor(thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0))
  const thisMonthExpenses = Math.floor(thisMonthTransactions
    .filter(t => t.type === 'expense' && t.category !== 'Return' && t.category !== 'Savings Withdraw')
    .reduce((sum, t) => sum + t.amount, 0))

  // This Month Actual Expense (শুধু উপরিউক্ত ক্যাটাগরিগুলো)
  const thisMonthActualExpense = Math.floor(thisMonthTransactions
    .filter(t => t.type === 'expense' && actualExpenseCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0))

  return (
    <div className="space-y-3">
      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Total Income</p>
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-green-600 dark:text-green-400">
            {formatInteger(totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Total Expenses</p>
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-red-600 dark:text-red-400">
            {formatInteger(totalExpenses)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950/50 dark:to-gray-900/50 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Total Actual Expense</p>
            <Receipt className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-slate-700 dark:text-slate-300">
            {formatInteger(totalActualExpense)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Actual spending
          </p>
        </Card>
      </div>

      {/* Second Row - 3 Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Balance</p>
            <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatInteger(balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Income - Expense + Loan
          </p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Total Asset</p>
            <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-purple-600 dark:text-purple-400">
            {formatInteger(totalAsset)}
          </p>
          <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
            Balance + Lend + Savings - Loan
          </p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-900/50 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Total Lend</p>
            <HandCoins className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-orange-600 dark:text-orange-400">
            {formatInteger(totalLend)}
          </p>
          <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
            To be returned
          </p>
        </Card>
      </div>

      {/* Third Row - 2 Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-900/50 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Total Savings</p>
            <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatInteger(totalSavings)}
          </p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
            Saved amount
          </p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-900/50 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Remaining Loan</p>
            <Landmark className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm md:text-xl font-bold text-red-600 dark:text-red-400">
            {formatInteger(loanTaken)}
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {loanTaken > 0 ? 'Need to repay' : 'No loan pending'}
          </p>
        </Card>
      </div>

      {/* Fourth Row - 3 Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
              This Month Income
            </p>
            <ArrowUpCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm md:text-lg font-bold text-green-600 dark:text-green-400">
            {formatInteger(thisMonthIncome)}
          </p>
        </Card>

        <Card className="p-3 bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
              This Month Expenses
            </p>
            <ArrowDownCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm md:text-lg font-bold text-red-600 dark:text-red-400">
            {formatInteger(thisMonthExpenses)}
          </p>
        </Card>

        <Card className="p-3 bg-gradient-to-r from-slate-50/50 to-gray-100/50 dark:from-slate-950/30 dark:to-gray-900/30 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              This Month Actual Expense
            </p>
            <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <p className="text-sm md:text-lg font-bold text-slate-700 dark:text-slate-300">
            {formatInteger(thisMonthActualExpense)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Actual spending
          </p>
        </Card>
      </div>
    </div>
  )
}