'use client'

import { useState, useMemo } from 'react'
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
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc')

  // সব ক্যাটাগরি (ইনকাম + এক্সপেন্স + স্পেশাল)
  const allCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category))
    return Array.from(cats).sort()
  }, [transactions])

  const filteredAndSorted = useMemo(() => {
    let filtered = [...transactions]

    // সার্চ
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        (t.personName && t.personName.toLowerCase().includes(term)) ||
        (t.loanPersonName && t.loanPersonName.toLowerCase().includes(term)) ||
        (t.accountName && t.accountName.toLowerCase().includes(term))
      )
    }

    // টাইপ ফিল্টার
    if (filterType !== 'all') {
      if (filterType === 'income') {
        filtered = filtered.filter(t => t.type === 'income' && t.category !== 'Return')
      } else if (filterType === 'expense') {
        filtered = filtered.filter(t => t.type === 'expense' && t.category !== 'Lend' && t.category !== 'Savings' && t.category !== 'Savings Withdraw')
      } else if (filterType === 'lend') {
        filtered = filtered.filter(t => t.category === 'Lend')
      } else if (filterType === 'return') {
        filtered = filtered.filter(t => t.category === 'Return')
      } else if (filterType === 'loan_taken') {
        filtered = filtered.filter(t => t.category === 'Loan Taken')
      } else if (filterType === 'loan_repayment') {
        filtered = filtered.filter(t => t.category === 'Loan Repayment')
      } else if (filterType === 'savings') {
        filtered = filtered.filter(t => t.category === 'Savings')
      } else if (filterType === 'savings_withdraw') {
        filtered = filtered.filter(t => t.category === 'Savings Withdraw')
      }
    }

    // ক্যাটাগরি ফিল্টার
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory)
    }

    // সোর্ট
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'amount-desc': return b.amount - a.amount
        case 'amount-asc': return a.amount - b.amount
        default: return 0
      }
    })

    return filtered
  }, [transactions, searchTerm, filterType, filterCategory, sortBy])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    try {
      await deleteTransaction(id)
      onDelete?.()
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      alert('Failed to delete the transaction!')
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.icon || '📝'
  }

  const getPersonBankDisplay = (transaction: Transaction) => {
    if (transaction.personName) {
      if (transaction.category === 'Lend') {
        return { icon: '📤', label: 'Lent to', name: transaction.personName, color: 'text-orange-600' }
      }
      if (transaction.category === 'Return') {
        return { icon: '📥', label: 'Return from', name: transaction.personName, color: 'text-green-600' }
      }
      return { icon: '👤', label: 'Person', name: transaction.personName, color: 'text-blue-600' }
    }
    
    if (transaction.loanPersonName) {
      if (transaction.category === 'Loan Taken') {
        return { icon: '🏦', label: 'Loan from', name: transaction.loanPersonName, color: 'text-orange-600' }
      }
      if (transaction.category === 'Loan Repayment') {
        return { icon: '💳', label: 'Repaid to', name: transaction.loanPersonName, color: 'text-green-600' }
      }
    }
    
    if (transaction.accountName) {
      if (transaction.category === 'Savings') {
        return { icon: '🏦', label: 'Saved in', name: transaction.accountName, color: 'text-blue-600' }
      }
      if (transaction.category === 'Savings Withdraw') {
        return { icon: '🏧', label: 'Withdrawn from', name: transaction.accountName, color: 'text-purple-600' }
      }
      return { icon: '🏦', label: 'Account', name: transaction.accountName, color: 'text-green-600' }
    }
    
    return null
  }

  return (
    <Card className="p-6">
      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <Input
            placeholder="🔍 Search transactions, person, bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Type Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📋 All Types</SelectItem>
              <SelectItem value="income">💰 Income</SelectItem>
              <SelectItem value="expense">💸 Expense</SelectItem>
              <SelectItem value="lend">📤 Lend</SelectItem>
              <SelectItem value="return">📥 Return</SelectItem>
              <SelectItem value="loan_taken">🏦 Loan Taken</SelectItem>
              <SelectItem value="loan_repayment">💳 Loan Repayment</SelectItem>
              <SelectItem value="savings">🏦 Savings</SelectItem>
              <SelectItem value="savings_withdraw">🏧 Savings Withdraw</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Category Filter - সব ক্যাটাগরি সহ */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">📋 All Categories</SelectItem>
              
              {/* Income Categories */}
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">INCOME</div>
              <SelectItem value="Salary">💰 Salary</SelectItem>
              <SelectItem value="Freelance">💻 Freelance</SelectItem>
              <SelectItem value="Business">📈 Business</SelectItem>
              
              {/* Expense Categories */}
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">EXPENSE</div>
              <SelectItem value="Food">🍔 Food</SelectItem>
              <SelectItem value="Transport">🚗 Transport</SelectItem>
              <SelectItem value="Shopping">🛍️ Shopping</SelectItem>
              <SelectItem value="Entertainment">🎬 Entertainment</SelectItem>
              <SelectItem value="Bills">💡 Bills</SelectItem>
              <SelectItem value="Health">🏥 Health</SelectItem>
              <SelectItem value="House Rent">🏠 House Rent</SelectItem>
              <SelectItem value="Other">📝 Other</SelectItem>
              
              {/* Special Categories */}
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">SPECIAL</div>
              <SelectItem value="Lend">📤 Lend</SelectItem>
              <SelectItem value="Return">📥 Return</SelectItem>
              <SelectItem value="Savings">🏦 Savings</SelectItem>
              <SelectItem value="Savings Withdraw">🏧 Savings Withdraw</SelectItem>
              <SelectItem value="Loan Taken">🏦 Loan Taken</SelectItem>
              <SelectItem value="Loan Repayment">💳 Loan Repayment</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort By */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">📅 Newest First</SelectItem>
              <SelectItem value="date-asc">📅 Oldest First</SelectItem>
              <SelectItem value="amount-desc">💰 Highest Amount</SelectItem>
              <SelectItem value="amount-asc">💰 Lowest Amount</SelectItem>
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
              <th className="text-left py-3 px-4 font-semibold text-sm">Person / Bank</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
             </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((transaction) => {
                const personBank = getPersonBankDisplay(transaction)
                return (
                  <tr key={transaction.id || transaction._id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4 text-sm font-medium">{transaction.description}</td>
                    <td className="py-3 px-4 text-sm">
                      {getCategoryIcon(transaction.category)} {transaction.category}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {personBank ? (
                        <div className={`flex items-center gap-1 ${personBank.color}`}>
                          <span>{personBank.icon}</span>
                          <span className="text-xs text-muted-foreground">{personBank.label}:</span>
                          <span className="font-medium">{personBank.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-sm font-semibold text-right ${
                      transaction.type === 'income' || transaction.category === 'Return' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' || transaction.category === 'Return' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction.id || transaction._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {filteredAndSorted.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t text-sm">
          <p className="text-muted-foreground">
            Showing {filteredAndSorted.length} of {transactions.length} transaction(s)
          </p>
          <div className="space-x-6">
            <span>
              Total Income: <span className="font-semibold text-green-600">
                {formatCurrency(
                  filteredAndSorted
                    .filter(t => t.type === 'income' || t.category === 'Return')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </span>
            <span>
              Total Expense: <span className="font-semibold text-red-600">
                {formatCurrency(
                  filteredAndSorted
                    .filter(t => (t.type === 'expense' && t.category !== 'Savings') || t.category === 'Lend')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}