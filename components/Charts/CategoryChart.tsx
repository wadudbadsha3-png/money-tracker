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

interface CategoryChartProps {
  transactions: Transaction[]
  categories: Category[]
}

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

  const COLORS = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.color
    return acc
  }, {} as Record<string, string>)

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
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}