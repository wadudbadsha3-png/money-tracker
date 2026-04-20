<<<<<<< HEAD
// hooks/useTransactions.ts

=======
// hooks/useTransactions.ts - সম্পূর্ণ ফিক্সড ভার্সন
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
'use client'

import useSWR from 'swr'
import { Transaction, ApiResponse, CreateTransactionInput } from '@/lib/types'

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
  type: 'income' | 'expense' | 'transfer'
  category: string
  date: string
  description: string
<<<<<<< HEAD
  personName?: string
  accountName?: string
=======
  fromAccount?: string
  toAccount?: string
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
}) {
  console.log('📤 createTransaction called with:', data)
  
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

<<<<<<< HEAD
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
=======
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to create transaction')
  }
  return response.json()
}

// ✅ ফিক্সড - সঠিক URL ফরম্যাট
export async function updateTransaction(id: string, data: Partial<{
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category: string
  date: string
  description: string
  fromAccount?: string
  toAccount?: string
}>) {
  if (!id) {
    throw new Error('Transaction ID is required for update')
  }

  const response = await fetch(`/api/transactions?id=${id}`, {
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

<<<<<<< HEAD
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
=======
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update transaction')
  }
  return response.json()
}

// ✅ ফিক্সড - সঠিক URL ফরম্যাট
export async function deleteTransaction(id: string) {
  if (!id) {
    throw new Error('Transaction ID is required for delete')
  }

  const response = await fetch(`/api/transactions?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete transaction')
  }
  return response.json()
}

// বাকি ফাংশনগুলো একই থাকবে...
export function useIncomeTransactions() {
  const { transactions, ...rest } = useTransactions()
  const incomeTransactions = transactions.filter(t => t.type === 'income')
  return { transactions: incomeTransactions, ...rest }
}

export function useExpenseTransactions() {
  const { transactions, ...rest } = useTransactions()
  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  return { transactions: expenseTransactions, ...rest }
}

export function useTransferTransactions() {
  const { transactions, ...rest } = useTransactions()
  const transferTransactions = transactions.filter(t => t.type === 'transfer')
  return { transactions: transferTransactions, ...rest }
}

export function useTransactionsByCategory(categoryName: string) {
  const { transactions, ...rest } = useTransactions()
  const filteredTransactions = transactions.filter(t => t.category === categoryName)
  return { transactions: filteredTransactions, ...rest }
}

export function useTransactionsByDateRange(startDate: string, endDate: string) {
  const { transactions, ...rest } = useTransactions()
  const filteredTransactions = transactions.filter(t => t.date >= startDate && t.date <= endDate)
  return { transactions: filteredTransactions, ...rest }
}

export async function getAssetSummary() {
  const response = await fetch('/api/transactions/asset-summary')
  if (!response.ok) throw new Error('Failed to fetch asset summary')
  return response.json()
}

export async function createMultipleTransactions(transactions: CreateTransactionInput[]) {
  const response = await fetch('/api/transactions/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactions }),
  })
  if (!response.ok) throw new Error('Failed to create transactions')
  return response.json()
}

export async function exportTransactions(format: 'csv' | 'json' = 'json') {
  const response = await fetch(`/api/transactions/export?format=${format}`)
  if (!response.ok) throw new Error('Failed to export transactions')
  return response.json()
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
}