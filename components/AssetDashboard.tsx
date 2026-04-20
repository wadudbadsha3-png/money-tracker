// components/AssetDashboard.tsx

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, HandCoins, PiggyBank, TrendingUp } from 'lucide-react'

interface AssetData {
  cashBalance: number
  totalLend: number
  totalSavings: number
  totalAsset: number
}

export function AssetDashboard() {
  const [asset, setAsset] = useState<AssetData>({
    cashBalance: 0,
    totalLend: 0,
    totalSavings: 0,
    totalAsset: 0
  })

  useEffect(() => {
    fetchAsset()
  }, [])

  const fetchAsset = async () => {
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      if (data.asset) {
        setAsset(data.asset)
      }
    } catch (error) {
      console.error('Failed to fetch asset:', error)
    }
  }

  const cards = [
    {
      title: 'Cash in Hand',
      value: asset.cashBalance,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Available cash'
    },
    {
      title: 'Pending Lend',
      value: asset.totalLend,
      icon: HandCoins,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Yet to be returned'
    },
    {
      title: 'Savings Balance',
      value: asset.totalSavings,
      icon: PiggyBank,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total in savings'
    },
    {
      title: 'Total Asset',
      value: asset.totalAsset,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Cash + Lend + Savings',
      highlight: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {cards.map((card, i) => (
        <Card key={i} className={card.highlight ? 'border-2 border-purple-200 shadow-lg' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.highlight ? 'text-purple-600' : ''}`}>
              ৳ {card.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}