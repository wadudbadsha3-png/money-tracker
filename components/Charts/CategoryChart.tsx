'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Transaction, Category } from '@/lib/types'

// প্রি-ডিফাইন্ড কালার (যদি ক্যাটাগরিতে কালার না থাকে)
const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8C471', '#A569BD', '#5DADE2', '#58D68D', '#F1948A'
]

export function CategoryChart({ transactions, categories }: CategoryChartProps) {
  // Group expenses by category (Return এবং Savings Withdraw বাদ দিয়ে)
  const categoryData: Record<string, number> = {}

  transactions
    .filter(t => t.type === 'expense' && t.category !== 'Return' && t.category !== 'Savings Withdraw')
    .forEach(tx => {
      if (!categoryData[tx.category]) {
        categoryData[tx.category] = 0
      }
      categoryData[tx.category] += tx.amount
    })

  const data = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  // ক্যাটাগরির কালার ম্যাপ তৈরি করুন
  const colorMap: Record<string, string> = {}
  categories.forEach((cat, index) => {
    colorMap[cat.name] = cat.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  })

  // যদি কোন ডাটা না থাকে
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No expense data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colorMap[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}