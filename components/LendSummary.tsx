// components/LendSummary.tsx

'use client'

import { useState, useEffect } from 'react'
import { getLendSummary, getPendingLends } from '@/lib/mockData'
import { LendSummary as LendSummaryType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LendSummary() {
  const [summary, setSummary] = useState<LendSummaryType[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    setSummary(getLendSummary())
    setPendingCount(getPendingLends().length)
  }, [])

  if (summary.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Lend Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No lend/return records found</p>
        </CardContent>
      </Card>
    )
  }

  const totalGiven = summary.reduce((sum, s) => sum + s.totalGiven, 0)
  const totalReturned = summary.reduce((sum, s) => sum + s.totalReturned, 0)
  const totalPending = summary.reduce((sum, s) => sum + s.pending, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Lend Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Stats */}
        <div className="flex justify-between text-sm border-b pb-2">
          <span>Total Given: ${totalGiven}</span>
          <span className="text-green-600">Total Returned: ${totalReturned}</span>
          <span className="text-orange-600 font-bold">Pending: ${totalPending}</span>
        </div>

        {/* Per Person */}
        {summary.map(item => (
          <div key={item.personName} className="flex justify-between items-center">
            <span className="font-medium">{item.personName}</span>
            <div className="space-x-3 text-sm">
              <span className="text-red-600">Given: ${item.totalGiven}</span>
              <span className="text-green-600">Returned: ${item.totalReturned}</span>
              <span className={`font-bold ${item.pending > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                Pending: ${item.pending}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}