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
<<<<<<< HEAD
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
=======
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
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
<<<<<<< HEAD
      let payload: any = {
=======
      const basePayload = {
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
      }

<<<<<<< HEAD
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
=======
      // ট্রান্সফারের জন্য অতিরিক্ত তথ্য যোগ করুন
      const payload = formData.type === 'transfer' 
        ? { ...basePayload, fromAccount: formData.fromAccount, toAccount: formData.toAccount }
        : basePayload

      if (transaction) {
        await updateTransaction(transaction.id, payload)
      } else {
        await createTransaction(payload as any)
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
      }

      setFormData({
        amount: '',
        selectedOption: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
<<<<<<< HEAD
        personName: '',
        accountName: '',
=======
        fromAccount: 'Main Account',
        toAccount: 'Savings Account',
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
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
<<<<<<< HEAD
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] w-full rounded-lg p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl">
=======
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
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
=======
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
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
              </SelectContent>
            </Select>
            {isSavingsCategory && (
              <p className="text-xs text-blue-500">Savings automatically uses 'Transfer' type</p>
            )}
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f

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

<<<<<<< HEAD
          {/* Submit Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
=======
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
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
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