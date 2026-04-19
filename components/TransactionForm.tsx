'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTransaction, updateTransaction } from '@/hooks/useTransactions'
import { Transaction, Category } from '@/lib/types'

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  categories: Category[]
  onSuccess?: () => void
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  categories,
  onSuccess,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'expense' as const,
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    fromAccount: transaction?.fromAccount || 'Main Account',
    toAccount: transaction?.toAccount || 'Savings Account',
  })

  // চেক করুন সিলেক্টেড ক্যাটাগরি Savings কিনা
  const isSavingsCategory = formData.category === 'Savings'
  const isLoanCategory = formData.category === 'Loan'

  // যখন ক্যাটাগরি পরিবর্তন হয়, টাইপ অটোমেটিক সেট করুন
  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value })
    
    // Savings এর জন্য টাইপ transfer সেট করুন
    if (value === 'Savings') {
      setFormData(prev => ({ ...prev, type: 'transfer' }))
    }
    // Loan এর জন্য টাইপ expense সেট করুন (ডিফল্ট)
    else if (value === 'Loan') {
      setFormData(prev => ({ ...prev, type: 'expense' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const basePayload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        description: formData.description,
      }

      // ট্রান্সফারের জন্য অতিরিক্ত তথ্য যোগ করুন
      const payload = formData.type === 'transfer' 
        ? { ...basePayload, fromAccount: formData.fromAccount, toAccount: formData.toAccount }
        : basePayload

      if (transaction) {
        await updateTransaction(transaction.id, payload)
      } else {
        await createTransaction(payload as any)
      }

      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        fromAccount: 'Main Account',
        toAccount: 'Savings Account',
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ক্যাটাগরি অনুযায়ী হেল্প টেক্সট
  const getCategoryHelpText = () => {
    if (formData.category === 'Savings') {
      return "💡 Savings: This will be recorded as a transfer to your savings account. Your total asset will increase."
    }
    if (formData.category === 'Loan') {
      return "💡 Loan: Select 'Income' when receiving loan, 'Expense' when paying EMI."
    }
    if (formData.category === 'Lend') {
      return "💡 Lend: Money given to someone. This will be added to your 'Loans Given' asset."
    }
    if (formData.category === 'Return') {
      return "💡 Return: Money received back from someone. This reduces your 'Loans Given' asset."
    }
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection - Savings হলে disabled */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) =>
                setFormData({ ...formData, type: value })
              }
              disabled={isSavingsCategory}
            >
              <SelectTrigger id="type" className={isSavingsCategory ? 'opacity-60' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">
                  <span className="flex items-center gap-2">
                    <span>💰</span> Income (Money coming in)
                  </span>
                </SelectItem>
                <SelectItem value="expense">
                  <span className="flex items-center gap-2">
                    <span>💸</span> Expense (Money going out)
                  </span>
                </SelectItem>
                <SelectItem value="transfer">
                  <span className="flex items-center gap-2">
                    <span>🔄</span> Transfer (Move money between accounts)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {isSavingsCategory && (
              <p className="text-xs text-blue-500">Savings automatically uses 'Transfer' type</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getCategoryHelpText() && (
              <p className="text-xs text-muted-foreground mt-1">
                {getCategoryHelpText()}
              </p>
            )}
          </div>

          {/* Transfer Fields - শুধু ট্রান্সফার টাইপের জন্য */}
          {formData.type === 'transfer' && (
            <div className="space-y-3 border-l-2 border-blue-200 pl-3">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <Select 
                  value={formData.fromAccount} 
                  onValueChange={(value) => setFormData({ ...formData, fromAccount: value })}
                >
                  <SelectTrigger id="fromAccount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Account">🏦 Main Account</SelectItem>
                    <SelectItem value="Savings Account">🐷 Savings Account</SelectItem>
                    <SelectItem value="Cash">💵 Cash</SelectItem>
                    <SelectItem value="Investment">📈 Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toAccount">To Account</Label>
                <Select 
                  value={formData.toAccount} 
                  onValueChange={(value) => setFormData({ ...formData, toAccount: value })}
                >
                  <SelectTrigger id="toAccount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Account">🏦 Main Account</SelectItem>
                    <SelectItem value="Savings Account">🐷 Savings Account</SelectItem>
                    <SelectItem value="Investment">📈 Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Quick Tips */}
          <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
            <p className="font-semibold">📌 Quick Tips:</p>
            <p>• <strong>Savings</strong> = Transfer to savings account</p>
            <p>• <strong>Loan</strong> = Income (receiving) / Expense (paying)</p>
            <p>• <strong>Lend</strong> = Expense (money given to friend)</p>
            <p>• <strong>Return</strong> = Income (money received from friend)</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : transaction ? 'Update' : 'Add'} Transaction
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}