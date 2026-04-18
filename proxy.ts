// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // কুকি থেকে লগইন স্ট্যাটাস চেক করা
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  
  // বর্তমান পাথ চেক করা
  const { pathname } = request.nextUrl
  
  // অথেনটিকেশন পেজগুলো
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  // হোম পেজ চেক করা
  const isHomePage = pathname === '/'
  
  console.log('Proxy - Path:', pathname, 'IsLoggedIn:', isLoggedIn) // ডিবাগিং এর জন্য

  // কেস 1: লগইন করা নেই এবং অথেনটিকেশন পেজেও না → লগইন পেজে পাঠাও
  if (!isLoggedIn && !isAuthPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // কেস 2: লগইন করা আছে এবং অথেনটিকেশন পেজে → হোম পেজে পাঠাও
  if (isLoggedIn && isAuthPage) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  // বাকি সব ক্ষেত্রে স্বাভাবিকভাবে চলতে দাও
  return NextResponse.next()
}

// প্রক্সি কোন পাথগুলিতে রান করবে
export const config = {
  matcher: [
    /*
    
     * এই পাথগুলিতে প্রক্সি রান করবে:
     * - সব পাথ except:
     *   - api (API routes)
     *   - _next/static (static files)
     *   - _next/image (image optimization files)
     *   - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}