'use client'

import useSWR from 'swr'
import { Category, ApiResponse } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Category[]>>(
    '/api/categories',
    fetcher
  )

  return {
    categories: data?.data || [],
    error,
    isLoading,
    mutate,
  }
}

export async function createCategory(data: {
  name: string
  icon: string
  color: string
}) {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return response.json()
}
