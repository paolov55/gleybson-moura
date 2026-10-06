import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'GM • Studio de Treinos',description:'Seu espaço para criar fichas de treino. Gleybson Moura Personal Trainer.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR" className="dark"><body>{children}</body></html>}
