'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction, Category } from '@/lib/types'
import { deleteTransaction } from '@/hooks/useTransactions'

interface TransactionTableProps {
  transactions: Transaction[]
  categories: Category[]
  onEdit: (transaction: Transaction) => void
  onDelete?: () => void
}

export function TransactionTable({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc')

  let filtered = [...transactions]

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Filter by type
  if (filterType !== 'all') {
    filtered = filtered.filter(t => t.type === filterType)
  }

  // Filter by category
  if (filterCategory !== 'all') {
    filtered = filtered.filter(t => t.category === filterCategory)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'amount-desc':
        return b.amount - a.amount
      case 'amount-asc':
        return a.amount - b.amount
      default:
        return 0
    }
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id)
        onDelete?.()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  return (
    <Card className="p-6">
      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm">{formatDate(transaction.date)}</td>
                  <td className="py-3 px-4 text-sm font-medium">{transaction.description}</td>
                  <td className="py-3 px-4 text-sm">
                    {categories.find(c => c.name === transaction.category)?.icon} {transaction.category}
                  </td>
                  <td className={`py-3 px-4 text-sm font-semibold text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t text-sm">
          <p className="text-muted-foreground">Showing {filtered.length} transaction(s)</p>
          <div className="space-x-4">
            <span>
              Income: <span className="font-semibold text-green-600">
                {formatCurrency(filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))}
              </span>
            </span>
            <span>
              Expense: <span className="font-semibold text-red-600">
                {formatCurrency(filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
              </span>
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}
