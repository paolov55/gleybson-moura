import { z } from 'zod';
export const studentSchema=z.object({id:z.string().min(1).max(80),name:z.string().trim().min(2).max(100),goal:z.string().trim().min(1).max(100),gender:z.string().max(40),age:z.union([z.literal(''),z.number().int().min(1).max(120)]),start:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)});
const exerciseSchema=z.object({id:z.string().min(1).max(80),name:z.string().max(120),sets:z.string().regex(/^\d{0,2}$/),cadence:z.string().max(20),note:z.string().max(500)});
export const planSchema=z.object({id:z.string().min(1).max(80),studentId:z.string().min(1).max(80),title:z.string().trim().min(1).max(100),start:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),mesocycle:z.string().max(60),weeks:z.number().int().min(1).max(16),status:z.enum(['draft','ready']),workouts:z.array(z.object({id:z.string().min(1).max(80),name:z.string().max(100),exercises:z.array(exerciseSchema).max(60)})).max(14),days:z.array(z.object({day:z.number().int().min(0).max(6),workoutId:z.string().max(80)})).max(7),periods:z.array(z.object({id:z.string().min(1).max(80),min:z.string().regex(/^\d{0,3}$/),max:z.string().regex(/^\d{0,3}$/),rest:z.string().regex(/^\d{0,4}$/),weeks:z.array(z.number().int().min(1).max(16)).max(16)})).max(16),snapshot:studentSchema,createdAt:z.string(),updatedAt:z.string()});
export type Student=z.infer<typeof studentSchema>;
export type Plan=z.infer<typeof planSchema>;
export type Workout=Plan['workouts'][number];
export type Exercise=Workout['exercises'][number];
export type Studio={students:Student[];plans:Plan[];library:string[]};
export const weekdays=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
export const uid=()=>crypto.randomUUID();
export const today=()=>new Date().toLocaleDateString('sv-SE');
export const dateLabel=(s:string)=>s?new Date(s.slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR'):'—';
export const freshExercise=():Exercise=>({id:uid(),name:'',sets:'3',cadence:'3010',note:''});
export function freshPlan(s:Student):Plan {const now=new Date().toISOString();return {id:uid(),studentId:s.id,snapshot:{...s},title:'Nova ficha',start:today(),mesocycle:'1º mesociclo',weeks:4,status:'draft',workouts:[{id:uid(),name:'Treino A',exercises:[freshExercise()]}],days:[],periods:[{id:uid(),min:'8',max:'12',rest:'60',weeks:[1,2,3,4]}],createdAt:now,updatedAt:now};}
export function validatePlan(p:Plan){if(!p.title.trim())return 'Dê um nome à ficha.';if(!p.workouts.length)return 'Adicione pelo menos um treino.';if(new Set(p.workouts.map(w=>w.id)).size!==p.workouts.length)return 'Há treinos duplicados.';for(const w of p.workouts){if(!w.name.trim()||!w.exercises.length)return 'Preencha o nome e adicione exercícios a cada treino.';for(const e of w.exercises)if(!e.name.trim()||!Number(e.sets)||Number(e.sets)>99||!e.cadence.trim())return `Complete exercício, séries e cadência de ${w.name}.`;}
if(!p.days.length||new Set(p.days.map(d=>d.day)).size!==p.days.length||p.days.some(d=>!p.workouts.some(w=>w.id===d.workoutId)))return 'Selecione os dias e vincule um treino a cada um.';
for(let week=1;week<=p.weeks;week++){const ps=p.periods.filter(r=>r.weeks.includes(week));if(ps.length!==1)return `A semana ${week} precisa ter exatamente uma faixa de periodização.`;}
if(p.periods.some(r=>!r.weeks.length||r.weeks.some(w=>w>p.weeks)||!Number(r.min)||Number(r.max)<Number(r.min)||!r.rest||Number(r.rest)<0))return 'Revise repetições, intervalo e semanas da periodização.';return '';}
