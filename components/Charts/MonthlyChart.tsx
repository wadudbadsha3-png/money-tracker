'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Transaction } from '@/lib/types'
import { getMonthYearKey } from '@/lib/utils'

interface MonthlyChartProps {
  transactions: Transaction[]
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  // Group by month
  const monthlyData: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach(tx => {
    const key = getMonthYearKey(tx.date)
    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expenses: 0 }
    }
    
    if (tx.type === 'income') {
      monthlyData[key].income += tx.amount
    } 
    // ✅ Expenses থেকে Return এবং Savings Withdraw বাদ
    else if (tx.type === 'expense' && tx.category !== 'Return' && tx.category !== 'Savings Withdraw') {
      monthlyData[key].expenses += tx.amount
    }
  })

  const data = Object.entries(monthlyData)
    .sort()
    .slice(-12) // Last 12 months
    .map(([month, amounts]) => ({
      month: month.split('-').reverse().join('/'),
      Income: amounts.income,
      Expenses: amounts.expenses,
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Income" fill="#10b981" />
        <Bar dataKey="Expenses" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}