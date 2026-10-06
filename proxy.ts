import {NextRequest,NextResponse} from 'next/server';
import {SESSION_COOKIE,verifySession} from '@/lib/session';
const open=['/login','/api/login'];
export async function proxy(req:NextRequest){const {pathname}=req.nextUrl;if(open.includes(pathname))return NextResponse.next();if(await verifySession(req.cookies.get(SESSION_COOKIE)?.value))return NextResponse.next();if(pathname.startsWith('/api/'))return NextResponse.json({error:'Sessão expirada. Entre novamente.'},{status:401});return NextResponse.redirect(new URL('/login',req.url));}
export const config={matcher:['/((?!_next/|art/|fonts/|favicon\\.svg).*)']};
