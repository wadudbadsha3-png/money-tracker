'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Transaction } from '@/lib/types'
import { getMonthYearKey } from '@/lib/utils'

// Actual expense categories only
const actualExpenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'House Rent', 'Donate', 'Other']

interface IncomeExpenseChartProps {
  transactions: Transaction[]
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  // Group by month
  const monthlyData: Record<string, { income: number; expenses: number; loan: number }> = {}

  transactions.forEach(tx => {
    const key = getMonthYearKey(tx.date)
    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expenses: 0, loan: 0 }
    }
    
    if (tx.type === 'income') {
      monthlyData[key].income += tx.amount
    } 
    else if (tx.type === 'expense' && actualExpenseCategories.includes(tx.category)) {
      // Only include actual expense categories
      monthlyData[key].expenses += tx.amount
    }
    else if (tx.category === 'Loan Taken') {
      // লোন নিলে সেটা ব্যালেন্সে যোগ হবে
      monthlyData[key].loan += tx.amount
    }
  })

  const data = Object.entries(monthlyData)
    .sort()
    .slice(-12) // Last 12 months
    .map(([month, amounts]) => ({
      month: month.split('-').reverse().join('/'),
      Income: amounts.income,
      Expenses: amounts.expenses,
      // ✅ সঠিক ব্যালেন্স = আয় - খরচ + লোন
      Balance: amounts.income - amounts.expenses + amounts.loan,
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="Balance" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}