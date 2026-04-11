'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BudgetCard } from '@/components/BudgetCard'
import { BudgetForm } from '@/components/BudgetForm'
import { useBudgets } from '@/hooks/useBudgets'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { Budget } from '@/lib/types'

export default function BudgetsPage() {
  const { budgets, isLoading: budgetLoading, mutate: mutateBudgets } = useBudgets()
  const { transactions, isLoading: txLoading } = useTransactions()
  const { categories, isLoading: catLoading } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>()

  const isLoading = budgetLoading || txLoading || catLoading

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    mutateBudgets()
    setEditingBudget(undefined)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Budgets</h1>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
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
            <h1 className="text-3xl font-bold mb-2">Budgets</h1>
            <p className="text-muted-foreground">Set and track spending limits by category</p>
          </div>
          <Button onClick={() => setFormOpen(true)} size="lg">
            + New Budget
          </Button>
        </div>

        {/* Budgets Grid */}
        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No budgets yet. Create one to get started!</p>
            <Button onClick={() => setFormOpen(true)}>Create Your First Budget</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={() => mutateBudgets()}
              />
            ))}
          </div>
        )}

        {/* Budget Form Dialog */}
        <BudgetForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) setEditingBudget(undefined)
          }}
          budget={editingBudget}
          categories={categories}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  )
}
