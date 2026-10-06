import {cookies} from 'next/headers';
import {SESSION_COOKIE} from '@/lib/session';
export async function POST(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'Origem inválida'},{status:403});(await cookies()).delete(SESSION_COOKIE);return Response.json({ok:true});}
