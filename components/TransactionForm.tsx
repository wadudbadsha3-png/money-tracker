'use client'

import { useState, useEffect } from 'react'
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
  
  // ট্রানজেকশন থেকে selectedOption বের করার ফাংশন
  const getSelectedOptionFromTransaction = (t?: Transaction) => {
    if (!t) return 'expense'
    if (t.type === 'income') return 'income'
    if (t.category === 'Lend') return 'lend'
    if (t.category === 'Return') return 'return'
    if (t.category === 'Savings') return 'savings'
    if (t.category === 'Savings Withdraw') return 'savings_withdraw'
    return t.type || 'expense'
  }

  const [formData, setFormData] = useState({
    amount: '',
    selectedOption: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    personName: '',
    accountName: '',
  })

  // 🔄 transaction এডিট মোডে ফর্ম আপডেট করার জন্য useEffect
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        selectedOption: getSelectedOptionFromTransaction(transaction),
        category: transaction.category,
        date: transaction.date,
        description: transaction.description || '',
        personName: transaction.personName || '',
        accountName: transaction.accountName || '',
      })
    } else {
      setFormData({
        amount: '',
        selectedOption: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        personName: '',
        accountName: '',
      })
    }
  }, [transaction, open])

  const selectedOption = formData.selectedOption
  const isLendOrReturn = selectedOption === 'lend' || selectedOption === 'return'
  const isSavingsOrWithdraw = selectedOption === 'savings' || selectedOption === 'savings_withdraw'
  const isNormal = selectedOption === 'income' || selectedOption === 'expense'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let payload: any = {
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
      }

      if (selectedOption === 'income') {
        payload.type = 'income'
        payload.category = formData.category
      }
      else if (selectedOption === 'expense') {
        payload.type = 'expense'
        payload.category = formData.category
      }
      else if (selectedOption === 'lend') {
        payload.type = 'expense'
        payload.category = 'Lend'
        payload.personName = formData.personName
      }
      else if (selectedOption === 'return') {
        payload.type = 'expense'
        payload.category = 'Return'
        payload.personName = formData.personName
      }
      else if (selectedOption === 'savings') {
        payload.type = 'expense'
        payload.category = 'Savings'
        payload.accountName = formData.accountName
      }
      else if (selectedOption === 'savings_withdraw') {
        payload.type = 'expense'
        payload.category = 'Savings Withdraw'
        payload.accountName = formData.accountName
      }

      console.log('📤 Sending payload:', payload)
      console.log('✏️ Transaction prop:', transaction)
      console.log('✏️ Transaction ID:', transaction?.id)

      // 🔥 MongoDB থেকে আসা _id কে id হিসেবে ব্যবহার করুন
      const transactionId = (transaction as any)?._id || transaction?.id

      if (transactionId) {
        console.log('✏️ Updating transaction ID:', transactionId)
        await updateTransaction(transactionId, payload)
        console.log('✅ Transaction updated successfully')
      } else {
        console.log('➕ Creating new transaction')
        await createTransaction(payload)
        console.log('✅ Transaction created successfully')
      }

      setFormData({
        amount: '',
        selectedOption: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        personName: '',
        accountName: '',
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('❌ Failed to save transaction:', error)
      alert(error.message || 'Failed to save transaction')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] w-full rounded-lg p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="selectedOption" className="text-sm font-medium">Transaction Type</Label>
            <Select 
              value={formData.selectedOption} 
              onValueChange={(value: any) =>
                setFormData({ ...formData, selectedOption: value, category: '', personName: '', accountName: '' })
              }
            >
              <SelectTrigger id="selectedOption" className="w-full h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">💰 Income</SelectItem>
                <SelectItem value="expense">💸 Expense</SelectItem>
                <SelectItem value="lend">📤 Lend (Give Money)</SelectItem>
                <SelectItem value="return">📥 Return (Get Back)</SelectItem>
                <SelectItem value="savings">🏦 Savings Deposit</SelectItem>
                <SelectItem value="savings_withdraw">🏧 Savings Withdraw</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Person Name - for Lend & Return */}
          {isLendOrReturn && (
            <div className="space-y-2">
              <Label htmlFor="personName" className="text-sm font-medium">
                {selectedOption === 'lend' ? '👤 Lend to (Person Name)' : '👤 Return from (Person Name)'}
              </Label>
              <Input
                id="personName"
                type="text"
                placeholder={selectedOption === 'lend' ? 'e.g., Rahim, John' : 'e.g., Rahim'}
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                className="h-11 text-base"
                required
              />
              <p className="text-xs text-muted-foreground">
                {selectedOption === 'lend' 
                  ? '⚠️ Money will be deducted from your balance'
                  : '✅ This will adjust the previous lend record (no income added)'}
              </p>
            </div>
          )}

          {/* Account Name - for Savings & Savings Withdraw */}
          {isSavingsOrWithdraw && (
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm font-medium">
                {selectedOption === 'savings' ? '🏦 Bank / Account Name' : '🏧 Withdraw from (Bank Name)'}
              </Label>
              <Input
                id="accountName"
                type="text"
                placeholder={selectedOption === 'savings' ? 'e.g., DBBL, Brac, Nagad, Cash' : 'e.g., DBBL'}
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="h-11 text-base"
                required
              />
              <p className="text-xs text-muted-foreground">
                {selectedOption === 'savings' 
                  ? '💰 Money moved to savings (balance decreases)'
                  : '💰 Money withdrawn from savings (balance increases)'}
              </p>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="h-11 text-base"
              required
            />
          </div>

          {/* Category - for normal income/expense */}
          {isNormal && (
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select value={formData.category} onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }>
                <SelectTrigger id="category" className="w-full h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <span>{cat.icon}</span> {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Auto Category Display */}
          {!isNormal && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Input
                value={
                  selectedOption === 'lend' ? 'Lend' :
                  selectedOption === 'return' ? 'Return' :
                  selectedOption === 'savings' ? 'Savings' :
                  'Savings Withdraw'
                }
                disabled
                className="bg-muted h-11 text-base"
              />
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="h-11 text-base"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-11 text-base"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-11"
            >
              {isLoading ? 'Saving...' : transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}