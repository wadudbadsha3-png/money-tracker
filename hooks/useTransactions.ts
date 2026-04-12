'use client'

import useSWR from 'swr'
import { Transaction, ApiResponse } from '@/lib/types'

const fetcher = (url: string) => 
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch transactions')
    return res.json()
  })

export function useTransactions() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Transaction[]>>(
    '/api/transactions', 
    fetcher,
    {
      // Performance improvements
      revalidateOnFocus: false,        // ট্যাব চেঞ্জ করলে আবার fetch করবে না
      revalidateOnReconnect: false,
      revalidateIfStale: false,        // stale data থাকলেও auto refetch করবে না
      dedupingInterval: 10000,         // ১০ সেকেন্ডের মধ্যে একই রিকোয়েস্ট duplicate হবে না
      refreshInterval: 0,              // auto polling বন্ধ
      keepPreviousData: true,          // পুরানো ডাটা দেখিয়ে নতুন লোড করবে (UX ভালো)
    }
  )

  return {
    transactions: data?.data || [],
    error,
    isLoading: isLoading || !data,   // প্রথম লোডে সঠিক লোডিং দেখাবে
    mutate,
  }
}

// অন্যান্য ফাংশনগুলো একই রাখলাম
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

  if (!response.ok) throw new Error('Failed to create transaction')
  return response.json()
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Failed to update transaction')
  return response.json()
}

export async function deleteTransaction(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error('Failed to delete transaction')
  return response.json()
}