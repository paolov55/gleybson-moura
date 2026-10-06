export const SESSION_COOKIE='gm_session';
export const SESSION_SECONDS=60*60*24*30;
const enc=new TextEncoder();
const b64=(buf:ArrayBuffer)=>btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function sign(value:string){const secret=process.env.SESSION_SECRET;if(!secret||secret.length<16)throw new Error('SESSION_SECRET ausente ou curto demais.');const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64(await crypto.subtle.sign('HMAC',key,enc.encode(value)));}
export function safeEqual(a:string,b:string){const x=enc.encode(a),y=enc.encode(b);let diff=x.length^y.length;for(let i=0;i<Math.max(x.length,y.length);i++)diff|=(x[i]??0)^(y[i]??0);return diff===0;}
export async function createSession(){const exp=Math.floor(Date.now()/1000)+SESSION_SECONDS;return `${exp}.${await sign(String(exp))}`;}
export async function verifySession(token?:string){if(!token)return false;const [exp,sig]=token.split('.');if(!exp||!sig||!/^\d+$/.test(exp)||Number(exp)<Date.now()/1000)return false;try{return safeEqual(sig,await sign(exp));}catch{return false;}}
