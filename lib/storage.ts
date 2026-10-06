import 'server-only';
import {createClient,SupabaseClient} from '@supabase/supabase-js';
let client:SupabaseClient|undefined;
export function database(){if(client)return client;const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});return client;}
