'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionTable } from '@/components/TransactionTable'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const { transactions, isLoading: txLoading, mutate } = useTransactions()
  const { categories, isLoading: catLoading } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()

  const isLoading = txLoading || catLoading

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    mutate()
    setEditingTransaction(undefined)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Transactions</h1>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transactions</h1>
            <p className="text-muted-foreground">Manage all your income and expenses</p>
          </div>
          <Button onClick={() => setFormOpen(true)} size="lg">
            + Add Transaction
          </Button>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          categories={categories}
          onEdit={handleEdit}
          onDelete={() => mutate()}
        />

        {/* Transaction Form Dialog */}
        <TransactionForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) setEditingTransaction(undefined)
          }}
          transaction={editingTransaction}
          categories={categories}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  )
}
