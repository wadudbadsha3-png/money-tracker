// hooks/useTransactions.ts - সিম্পল ফিক্সড ভার্সন
'use client'

import useSWR from 'swr'
import { Transaction, ApiResponse, CreateTransactionInput } from '@/lib/types'
import { useEffect, useState } from 'react'

// ✅ টাইমআউট সহ ফেচার
const fetcher = async (url: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 সেকেন্ড
  
  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    
    // ✅ API সফল হলে ব্যাকআপ সেভ করুন
    if (data?.data) {
      localStorage.setItem('transactions_backup', JSON.stringify(data.data))
    }
    
    return data
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

export function useTransactions() {
  const [backupData, setBackupData] = useState<Transaction[]>([])
  
  // ✅ লোকাল ব্যাকআপ লোড করুন
  useEffect(() => {
    const backup = localStorage.getItem('transactions_backup')
    if (backup) {
      try {
        setBackupData(JSON.parse(backup))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Transaction[]>>(
    '/api/transactions', 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
      dedupingInterval: 10000,
      refreshInterval: 0,
      keepPreviousData: true,
      errorRetryCount: 2, // ২ বার রিট্রাই
      errorRetryInterval: 3000, // ৩ সেকেন্ড পর
    }
  )

  // ✅ API ডাটা থাকলে সেটা না থাকলে ব্যাকআপ
  const transactions = (data?.data && data.data.length > 0) ? data.data : backupData
  
  // ✅ ব্যাকআপ থাকলে লোডিং দেখাবেন না
  const showLoading = isLoading && backupData.length === 0

  return {
    transactions,
    error: error && backupData.length === 0 ? error : null,
    isLoading: showLoading,
    mutate,
  }
}

// ❌ বাকি সব ফাংশন ঠিক আগের মতো থাকবে (কোনো পরিবর্তন দরকার নেই)
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
  personName?: string
  accountName?: string
  fromAccount?: string
  toAccount?: string
}) {
  console.log('📤 createTransaction called with:', data)
  
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to create transaction')
  }
  
  const result = await response.json()
  
  // ✅ ব্যাকআপ আপডেট করুন
  if (result?.data) {
    const backup = localStorage.getItem('transactions_backup')
    if (backup) {
      const transactions = JSON.parse(backup)
      transactions.push(result.data)
      localStorage.setItem('transactions_backup', JSON.stringify(transactions))
    }
  }
  
  return result
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  if (!id) throw new Error('Transaction ID is required')
  
  const response = await fetch(`/api/transactions?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update transaction')
  }
  
  const result = await response.json()
  
  // ✅ ব্যাকআপ আপডেট করুন
  if (result?.data) {
    const backup = localStorage.getItem('transactions_backup')
    if (backup) {
      let transactions = JSON.parse(backup)
      transactions = transactions.map((t: Transaction) => 
        t.id === id ? { ...t, ...data } : t
      )
      localStorage.setItem('transactions_backup', JSON.stringify(transactions))
    }
  }
  
  return result
}

export async function deleteTransaction(id: string) {
  if (!id) throw new Error('Transaction ID is required')
  
  const response = await fetch(`/api/transactions?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete transaction')
  }
  
  const result = await response.json()
  
  // ✅ ব্যাকআপ আপডেট করুন
  const backup = localStorage.getItem('transactions_backup')
  if (backup) {
    let transactions = JSON.parse(backup)
    transactions = transactions.filter((t: Transaction) => t.id !== id)
    localStorage.setItem('transactions_backup', JSON.stringify(transactions))
  }
  
  return result
}

// বাকি হেল্পার ফাংশনগুলো ঠিক আগের মতো (কোনো পরিবর্তন নাই)
export function useIncomeTransactions() {
  const { transactions, ...rest } = useTransactions()
  return { transactions: transactions.filter(t => t.type === 'income'), ...rest }
}

export function useExpenseTransactions() {
  const { transactions, ...rest } = useTransactions()
  return { transactions: transactions.filter(t => t.type === 'expense'), ...rest }
}

export function useTransferTransactions() {
  const { transactions, ...rest } = useTransactions()
  return { transactions: transactions.filter(t => t.type === 'transfer'), ...rest }
}

export function useTransactionsByCategory(categoryName: string) {
  const { transactions, ...rest } = useTransactions()
  return { transactions: transactions.filter(t => t.category === categoryName), ...rest }
}

export function useTransactionsByDateRange(startDate: string, endDate: string) {
  const { transactions, ...rest } = useTransactions()
  return { 
    transactions: transactions.filter(t => t.date >= startDate && t.date <= endDate), 
    ...rest 
  }
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
}