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

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8C471', '#A569BD', '#5DADE2', '#58D68F', '#F1948A'
]

// Actual expense categories only
const actualExpenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'House Rent', 'Donate', 'Other']

interface CategoryChartProps {
  transactions: Transaction[]
  categories: Category[]
}

export function CategoryChart({ transactions, categories }: CategoryChartProps) {
  const categoryData: Record<string, number> = {}

  transactions
    .filter(t => {
      // Only include actual expense categories
      return t.type === 'expense' && actualExpenseCategories.includes(t.category)
    })
    .forEach(tx => {
      categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount
    })

  const data = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: Math.floor(amount), // Integer করে নিচ্ছি
  }))

  const colorMap: Record<string, string> = {}
  categories.forEach((cat, index) => {
    colorMap[cat.name] = cat.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  })

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
          label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colorMap[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `$${Math.floor(value).toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}