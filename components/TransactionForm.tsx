'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTransaction, updateTransaction } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { Transaction, Category } from '@/lib/types'

// ডিফল্ট ক্যাটাগরি (API না আসলে ব্যবহার হবে)
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary', icon: '💰', type: 'income', color: '#4CAF50' },
  { id: '2', name: 'Freelance', icon: '💻', type: 'income', color: '#2196F3' },
  { id: '3', name: 'Business', icon: '📈', type: 'income', color: '#FF9800' },
  { id: '4', name: 'Food', icon: '🍔', type: 'expense', color: '#F44336' },
  { id: '5', name: 'Transport', icon: '🚗', type: 'expense', color: '#FF5722' },
  { id: '6', name: 'Shopping', icon: '🛍️', type: 'expense', color: '#FFC107' },
  { id: '7', name: 'Entertainment', icon: '🎬', type: 'expense', color: '#9C27B0' },
  { id: '8', name: 'Bills', icon: '💡', type: 'expense', color: '#607D8B' },
  { id: '9', name: 'Health', icon: '🏥', type: 'expense', color: '#E91E63' },
  { id: '10', name: 'Lend', icon: '📤', type: 'expense', color: '#FF9800' },
  { id: '11', name: 'Return', icon: '📥', type: 'expense', color: '#4CAF50' },
  { id: '12', name: 'Savings', icon: '🏦', type: 'transfer', color: '#2196F3' },
  { id: '13', name: 'Loan Taken', icon: '🏦', type: 'liability', color: '#FF6B00' },
  { id: '14', name: 'Loan Repayment', icon: '💳', type: 'liability', color: '#00ACC1' },
  { id: '15', name: 'Other', icon: '📝', type: 'expense', color: '#9E9E9E' },
]

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  onSuccess?: () => void
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // সরাসরি useCategories হুক ব্যবহার করছি
  const { categories: apiCategories, isLoading: categoriesLoading } = useCategories()
  
  // API থেকে আসা ক্যাটাগরি বা ডিফল্ট ক্যাটাগরি ব্যবহার করব
  // এবং duplicate entries সরিয়ে ফেলব
  const rawCategories = apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORIES
  
  // unique ক্যাটাগরি নিশ্চিত করছি (name এবং type এর ভিত্তিতে)
  const categories = Array.from(
    new Map(rawCategories.map(cat => [`${cat.name}-${cat.type}`, cat])).values()
  )
  
  // ডিবাগ করার জন্য কনসোল লগ
  console.log('API Categories:', apiCategories)
  console.log('Final Categories:', categories)
  
  // ট্রানজেকশন থেকে selectedOption বের করার ফাংশন
  const getSelectedOptionFromTransaction = (t?: Transaction) => {
    if (!t) return 'expense'
    if (t.type === 'income') return 'income'
    if (t.category === 'Lend') return 'lend'
    if (t.category === 'Return') return 'return'
    if (t.category === 'Loan Taken') return 'loan_taken'
    if (t.category === 'Loan Repayment') return 'loan_repayment'
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
    loanPersonName: '', // জন্য loan neoa & porishod এর জন্য
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
        loanPersonName: transaction.loanPersonName || '',
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
        loanPersonName: '',
      })
    }
  }, [transaction, open])

  const selectedOption = formData.selectedOption
  const isLendOrReturn = selectedOption === 'lend' || selectedOption === 'return'
  const isLoanTakenOrRepayment = selectedOption === 'loan_taken' || selectedOption === 'loan_repayment'
  const isSavingsOrWithdraw = selectedOption === 'savings' || selectedOption === 'savings_withdraw'
  const isNormal = selectedOption === 'income' || selectedOption === 'expense'

  // ফিল্টার করা ক্যাটাগরি (selectedOption অনুযায়ী) - unique keys নিশ্চিত করছি
  const filteredCategories = categories.filter(cat => {
    if (selectedOption === 'income') return cat.type === 'income'
    if (selectedOption === 'expense') return cat.type === 'expense'
    return false
  })
  
  console.log('Filtered Categories for', selectedOption, ':', filteredCategories)

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
      else if (selectedOption === 'loan_taken') {
        // লোন নেওয়া - Liability টাইপ (নিজের দায়)
        payload.type = 'liability'
        payload.category = 'Loan Taken'
        payload.loanPersonName = formData.loanPersonName
        payload.personName = formData.loanPersonName // ব্যাকওয়ার্ড কম্প্যাটিবিলিটি
        payload.isLoanTaken = true // লোন নেওয়ার ফ্ল্যাগ
      }
      else if (selectedOption === 'loan_repayment') {
        // লোন পরিশোধ - Liability টাইপ (দায় কমানো)
        payload.type = 'liability'
        payload.category = 'Loan Repayment'
        payload.loanPersonName = formData.loanPersonName
        payload.personName = formData.loanPersonName // ব্যাকওয়ার্ড কম্প্যাটিবিলিটি
        payload.isLoanRepayment = true // লোন পরিশোধের ফ্ল্যাগ
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

      const transactionId = (transaction as any)?._id || transaction?.id

      if (transactionId) {
        await updateTransaction(transactionId, payload)
      } else {
        await createTransaction(payload)
      }

      setFormData({
        amount: '',
        selectedOption: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        personName: '',
        accountName: '',
        loanPersonName: '',
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
                setFormData({ ...formData, selectedOption: value, category: '', personName: '', accountName: '', loanPersonName: '' })
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
                <SelectItem value="loan_taken">🏦 Loan Taken (নেওয়া - Liability)</SelectItem>
                <SelectItem value="loan_repayment">💳 Loan Repayment (পরিশোধ)</SelectItem>
                <SelectItem value="savings">🏦 Savings Deposit</SelectItem>
                <SelectItem value="savings_withdraw">🏧 Savings Withdraw</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Person Name - for Loan Taken & Loan Repayment */}
          {isLoanTakenOrRepayment && (
            <div className="space-y-2">
              <Label htmlFor="loanPersonName" className="text-sm font-medium">
                {selectedOption === 'loan_taken' ? '👤 Loan Taken From (Person/Bank Name)' : '👤 Loan Repayment To (Person/Bank Name)'}
              </Label>
              <Input
                id="loanPersonName"
                type="text"
                placeholder={selectedOption === 'loan_taken' ? 'e.g., Bank Asia, Rahim, Friend' : 'e.g., Bank Asia, Rahim'}
                value={formData.loanPersonName}
                onChange={(e) => setFormData({ ...formData, loanPersonName: e.target.value })}
                className="h-11 text-base"
                required
              />
            </div>
          )}

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
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount ($)
              {selectedOption === 'loan_repayment' && (
                <span className="text-xs text-muted-foreground ml-2">(This will reduce your liability)</span>
              )}
              {selectedOption === 'loan_taken' && (
                <span className="text-xs text-muted-foreground ml-2">(This will increase your liability)</span>
              )}
            </Label>
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
                  {filteredCategories.map((cat) => (
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
                  selectedOption === 'loan_taken' ? 'Loan Taken (Liability)' :
                  selectedOption === 'loan_repayment' ? 'Loan Repayment' :
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

          {/* Info Note for Loan Taken */}
          {selectedOption === 'loan_taken' && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-md">
              ⚠️ Liability: This loan taken will be recorded as a liability (দায়) and will increase your total loan liability.
            </div>
          )}

          {/* Info Note for Loan Repayment */}
          {selectedOption === 'loan_repayment' && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded-md">
              ✅ This loan repayment will reduce your total loan liability (দায় কমানো হবে).
            </div>
          )}

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