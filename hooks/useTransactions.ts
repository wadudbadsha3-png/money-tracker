'use client'

import useSWR from 'swr'
import { Transaction, ApiResponse } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useTransactions(category?: string, type?: string) {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (type) params.append('type', type)

  const url = `/api/transactions${params.toString() ? `?${params.toString()}` : ''}`
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Transaction[]>>(url, fetcher)

  return {
    transactions: data?.data || [],
    error,
    isLoading,
    mutate,
  }
}

export function useTransaction(id: string) {
  const { data, error, isLoading } = useSWR<ApiResponse<Transaction>>(
    id ? `/api/transactions/${id}` : null,
    fetcher
  )

  return {
    transaction: data?.data,
    error,
    isLoading,
  }
}

export async function createTransaction(data: {
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  description: string
}) {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function deleteTransaction(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}
