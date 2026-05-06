// components/Navigation.tsx - আপডেটেড ভার্সন (clearBackup ছাড়া)
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
// ❌ এই লাইনটি সরান: import { clearBackup } from '@/hooks/useTransactions'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ✅ অটো লগইন চেক (ফোনের জন্য)
  useEffect(() => {
    setIsClient(true)
    
    const checkLogin = () => {
      const storageLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const hasCookie = document.cookie.includes('isLoggedIn=true')
      
      setIsLoggedIn(storageLoggedIn || hasCookie)
      
      if (!storageLoggedIn && !hasCookie && pathname !== '/login' && pathname !== '/signup') {
        console.log('🚀 Auto-login for mobile device...')
        
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', 'mobile@user.com')
        localStorage.setItem('userName', 'Mobile User')
        document.cookie = "isLoggedIn=true; path=/; max-age=2592000"
        
        setIsLoggedIn(true)
      }
    }
    
    checkLogin()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [pathname])

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/transactions', label: 'Transactions', icon: '💸' },
    { href: '/reports', label: 'Reports', icon: '📉' },
  ]

  const handleLogout = () => {
    // লোকাল স্টোরেজ ক্লিয়ার করা
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('transactions_backup')
    localStorage.removeItem('transactions_backup_time')
    
    // ❌ clearBackup() সরিয়ে দিন
    
    // কুকি ডিলিট করা
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "isLoggedIn=; path=/; max-age=0"
    
    setIsLoggedIn(false)
    router.push('/login')
  }

  if (!isClient) {
    return null
  }

  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  if (!isLoggedIn && pathname !== '/login' && pathname !== '/signup') {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">💰</span>
            <span className="inline text-foreground text-sm sm:text-base">Money Tracker</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <span className="text-base sm:text-sm">{link.icon}</span>
                <span className="hidden sm:inline ml-1">{link.label}</span>
              </Link>
            ))}
            
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-1 p-2 rounded-md text-foreground hover:bg-muted transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}