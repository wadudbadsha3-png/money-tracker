// hooks/useTransactions.ts

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
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 10000,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  )

  return {
    transactions: data?.data || [],
    error,
    isLoading: isLoading || !data,
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
  personName?: string
  accountName?: string
}) {
  console.log('📤 createTransaction called with:', data)
  
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const responseData = await response.json()
  console.log('📥 createTransaction response:', responseData)

  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to create transaction')
  }
  
  return responseData
}

// =============================================
// ✅ UPDATE TRANSACTION - URL ঠিক করা হয়েছে
// =============================================
export async function updateTransaction(id: string, data: Partial<Transaction>) {
  console.log('✏️ updateTransaction called with id:', id);
  console.log('📦 updateTransaction data:', data);
  
  const response = await fetch(`/api/transactions?id=${id}`, {  // ← এটা ঠিক করুন
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const responseData = await response.json()
  console.log('📥 updateTransaction response:', responseData)

  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to update transaction')
  }
  
  return responseData
}

// =============================================
// ✅ DELETE TRANSACTION - URL ঠিক করা হয়েছে
// =============================================
export async function deleteTransaction(id: string) {
  console.log('🗑️ deleteTransaction called with id:', id);
  
  const response = await fetch(`/api/transactions?id=${id}`, {  // ← এটা ঠিক করুন
    method: 'DELETE',
  })

  const responseData = await response.json()
  console.log('📥 deleteTransaction response:', responseData)

  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to delete transaction')
  }
  
  return responseData
}