'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, calculateBudgetProgress, getBudgetStatus } from '@/lib/utils'
import { Budget, Transaction } from '@/lib/types'
import { deleteBudget } from '@/hooks/useBudgets'

interface BudgetCardProps {
  budget: Budget
  transactions: Transaction[]
  onEdit: (budget: Budget) => void
  onDelete?: () => void
}

export function BudgetCard({
  budget,
  transactions,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const spent = transactions
    .filter(t => t.category === budget.categoryName && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const progress = calculateBudgetProgress(budget, spent)
  const status = getBudgetStatus(progress)
  const remaining = Math.max(0, budget.limit - spent)

  const handleDelete = async () => {
    if (window.confirm(`Delete budget for ${budget.categoryName}?`)) {
      try {
        await deleteBudget(budget.id)
        onDelete?.()
      } catch (error) {
        console.error('Failed to delete budget:', error)
      }
    }
  }

  const statusColor = {
    safe: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    exceeded: 'bg-red-100 text-red-800',
  }

  const progressColor = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    exceeded: 'bg-red-500',
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{budget.categoryName}</h3>
            <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}>
            {status === 'safe' && 'On Track'}
            {status === 'warning' && 'Warning'}
            {status === 'exceeded' && 'Exceeded'}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Amount Info */}
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Spent</p>
            <p className="font-semibold">{formatCurrency(spent)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Budget</p>
            <p className="font-semibold">{formatCurrency(budget.limit)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className={`font-semibold ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-center">
          <p className="text-2xl font-bold">{Math.round(progress)}%</p>
          <p className="text-xs text-muted-foreground">of budget used</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(budget)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
