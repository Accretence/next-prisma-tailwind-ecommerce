import { NextResponse } from 'next/server'

export function middleware(request) {
    if (!request.cookies.get('AJWT'))
        return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*'],
}