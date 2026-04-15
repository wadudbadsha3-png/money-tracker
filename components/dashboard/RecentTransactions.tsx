// components/dashboard/RecentTransactions.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Get last 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold">Recent Transactions</h2>
        <Link href="/transactions" className="text-xs sm:text-sm text-primary hover:underline">
          View All →
        </Link>
      </div>
      
      <div className="space-y-2">
        {recentTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No transactions yet. Add your first transaction!
          </p>
        ) : (
          recentTransactions.map((transaction, index) => (
            // ✅ key হিসেবে id না থাকলে index ব্যবহার করছে
            <div 
              key={transaction.id || `transaction-${index}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className={`text-sm sm:text-base font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}