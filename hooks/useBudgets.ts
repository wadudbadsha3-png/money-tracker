'use client'

import useSWR from 'swr'
import { Budget, ApiResponse } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useBudgets() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Budget[]>>(
    '/api/budgets',
    fetcher
  )

  return {
    budgets: data?.data || [],
    error,
    isLoading,
    mutate,
  }
}

export function useBudget(id: string) {
  const { data, error, isLoading } = useSWR<ApiResponse<Budget>>(
    id ? `/api/budgets/${id}` : null,
    fetcher
  )

  return {
    budget: data?.data,
    error,
    isLoading,
  }
}

export async function createBudget(data: {
  categoryId: string
  limit: number
  period: 'monthly' | 'yearly'
}) {
  const response = await fetch('/api/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function updateBudget(id: string, data: Partial<Budget>) {
  const response = await fetch(`/api/budgets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function deleteBudget(id: string) {
  const response = await fetch(`/api/budgets/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}
