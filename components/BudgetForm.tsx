'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBudget, updateBudget } from '@/hooks/useBudgets'
import { Budget, Category } from '@/lib/types'

interface BudgetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget?: Budget
  categories: Category[]
  onSuccess?: () => void
}

export function BudgetForm({
  open,
  onOpenChange,
  budget,
  categories,
  onSuccess,
}: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || '',
    limit: budget?.limit.toString() || '',
    period: budget?.period || 'monthly' as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        categoryId: formData.categoryId,
        limit: parseFloat(formData.limit),
        period: formData.period,
      }

      if (budget) {
        await updateBudget(budget.id, payload)
      } else {
        await createBudget(payload)
      }

      setFormData({
        categoryId: '',
        limit: '',
        period: 'monthly',
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save budget:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? 'Edit Budget' : 'Create New Budget'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span>{cat.icon}</span> {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Limit */}
          <div className="space-y-2">
            <Label htmlFor="limit">Budget Limit</Label>
            <Input
              id="limit"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              required
            />
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value: any) => setFormData({ ...formData, period: value })}
            >
              <SelectTrigger id="period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : budget ? 'Update' : 'Create'} Budget
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
