// components/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import { LogOut } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/transactions', label: 'Transactions', icon: '💸' },
    { href: '/reports', label: 'Reports', icon: '📉' },
  ]

  const handleLogout = () => {
    // localStorage ক্লিয়ার করা
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    
    // কুকি ডিলিট করা
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    // লগইন পেজে রিডাইরেক্ট
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">💰</span>
            <span className="inline text-foreground text-sm sm:text-base">Money Tracker</span>
          </Link>

          {/* Navigation Links & Theme Toggle & Logout */}
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
            
            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-1 p-2 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}