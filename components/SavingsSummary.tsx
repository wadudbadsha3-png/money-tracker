// components/SavingsSummary.tsx

'use client'

import { useState, useEffect } from 'react'
import { getSavingsSummary, getTotalSavingsBalance } from '@/lib/mockData'
import { SavingsSummary as SavingsSummaryType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SavingsSummary() {
  const [summary, setSummary] = useState<SavingsSummaryType[]>([])
  const [totalBalance, setTotalBalance] = useState(0)

  useEffect(() => {
    setSummary(getSavingsSummary())
    setTotalBalance(getTotalSavingsBalance())
  }, [])

  if (summary.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏦 Savings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No savings records found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏦 Savings Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Balance */}
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <span className="text-sm text-muted-foreground">Total Savings Balance</span>
          <p className="text-2xl font-bold text-green-600">${totalBalance}</p>
        </div>

        {/* Per Account */}
        {summary.map(item => (
          <div key={item.accountName} className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">{item.accountName}</span>
            <div className="space-x-2 text-sm">
              <span className="text-blue-600">Deposit: ${item.totalDeposit}</span>
              <span className="text-orange-600">Withdraw: ${item.totalWithdraw}</span>
              <span className={`font-bold ${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Balance: ${item.balance}
              </span>
            </div>
          </