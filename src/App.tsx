import { useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  BarChart3, Bell, Building2, ChevronDown, CircleHelp, Download, ExternalLink,
  Globe, LayoutDashboard, LogOut, Menu, MessageCircle, Search, Settings,
  ShieldCheck, SlidersHorizontal, Sparkles, Target, UserRound, Users, X
} from 'lucide-react'

type Lead = {
  id: string; business_name: string; category: string; city: string; state: string;
  phone?: string; website?: string; instagram?: string; rating: number;
  review_count: number; has_website: boolean; website_status: string;
  website_score: number; lead_score: number; opportunity_level: string;
  sales_status: string; google_maps_url: string; notes?: string;
}

const demoLeads: Lead[] = [
  {id:'1',business_name:'Clínica Sorriso',category:'Clínica odontológica',city:'Palhoça',state:'SC',phone:'(48) 99999-1001',instagram:'@clinicasorriso',rating:4.8,review_count:247,has_website:false,website_status:'not_found',website_score:0,lead_score:94,opportunity_level:'Muito alta',sales_status:'new',google_maps_url:'https://www.google.com/maps',notes:'Excelente oportunidade para primeiro contato.'},
  {id:'2',business_name:'Auto Prime Seminovos',category:'Revenda de veículos',city:'Palhoça',state:'SC',phone:'(48) 99999-1002',website:'https://example.com',rating:4.7,review_count:181,has_website:true,website_status:'online',website_score:48,lead_score:76,opportunity_level:'Alta',sales_status:'contacted',google_maps_url:'https://www.google.com/maps'},
  {id:'3',business_name:'Studio Bella',category:'Estética',city:'São José',state:'SC',phone:'(48) 99999-1003',instagram:'@studiobella',rating:4.9,review_count:112,has_website:false,website_status:'not_found',website_score:0,lead_score:88,opportunity_level:'Muito alta',sales_status:'new',google_maps_url:'https://www.google.com/maps'},
  {id:'4',business_name:'Contábil Mais',category:'Contabilidade',city:'Florianópolis',state:'SC',phone:'(48) 99999-1004',website:'https://example.com',rating:4.5,review_count:73,has_website:true,website_status:'online',website_score:82,lead_score:51,opportunity_level:'Média',sales_status:'interested',google_maps_url:'https://www.google.com/maps'},
  {id:'5',business_name:'Odonto Prime',category:'Clínica odontológica',city:'Florianópolis',state:'SC',phone:'(48) 99999-1005',website:'https://example.com',rating:4.6,review_count:301,has_website:true,website_status:'offline',website_score:20,lead_score:71,opportunity_level:'Alta',sales_status:'proposal',google_maps_url:'https://www.google.com/maps'}
]

function App(){
  return <Routes>
    <Route path="*" element={<Shell/>}/>
  </Routes>
}

function Shell(){
  const [mobileOpen,setMobileOpen]=useState(false)
  const nav=[
    ['/','Dashboard',LayoutDashboard],['/search','Nova pesquisa',Search],['/leads','Leads',Users],
    ['/opportunities','Oportunidades',Target],['/crm','CRM',SlidersHorizontal],['/searches','Pesquisas',BarChart3],['/settings','Configurações',Settings]
  ] as const
  return <div className="app">
    <aside className={mobileOpen?'sidebar open':'sidebar'}>
      <div className="brand"><div className="brand-mark"><Sparkles size={18}/></div><div><b>LeadFinder</b><span>Sales Intelligence</span></div><button className="close-mobile" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="workspace"><span className="dot"></span> Workspace principal <ChevronDown size={14}/></div>
      <nav>{nav.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setMobileOpen(false)}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="upgrade"><Sparkles size={17}/><div><b>Modo demonstração</b><small>Conecte o Supabase para dados reais.</small></div></div>
        <NavLink to="/settings"><Settings size={18}/><span>Configurações</span></NavLink>
        <button className="logout"><LogOut size={18}/> Sair</button>
      </div>
    </aside>
    {mobileOpen && <div className="backdrop" onClick={()=>setMobileOpen(false)} />}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="crumb">LeadFinder <span>/</span> Prospecção</div><div className="top-actions"><button><CircleHelp size={18}/></button><button><Bell size={18}/><i></i></button><div className="avatar">G</div></div></header>
      <div className="content"><Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/leads" element={<LeadsPage/>}/>
        <Route path="/leads/:id" element={<LeadDetails/>}/>
        <Route path="/opportunities" element={<Opportunities/>}/>
        <Route path="/crm" element={<CRM/>}/>
        <Route path="/searches" element={<Searches/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
      </Routes></div>
    </main>
  </div>
}

function Header({title,subtitle,action}:{title:string,subtitle?:string,action?:React.ReactNode}){
 return <div className="page-header"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>
}
function Score({n}:{n:number}){return <span className={`score ${n>=80?'hot':n>=60?'high':'mid'}`}>{n}</span>}
function Status({status}:{status:string}){
 const map:any={new:['Novo','gray'],contacted:['Contatado','blue'],responded:['Respondeu','purple'],interested:['Interessado','green'],proposal:['Proposta','orange'],won:['Ganho','green'],lost:['Perdido','red']}
 const [t,c]=map[status]||['Novo','gray']; return <span className={`status ${c}`}>{t}</span>
}

function Dashboard(){
 const stats=useMemo(()=>({total:demoLeads.length,noSite:demoLeads.filter(x=>!x.has_website).length,contacted:demoLeads.filter(x=>x.sales_status!=='new').length,interested:demoLeads.filter(x=>x.sales_status==='interested').length}),[])
 return <><Header title="Dashboard" subtitle="Encontre empresas com potencial para seus serviços." action={<button className="primary" onClick={()=>location.href='/search'}><Search size={17}/> Nova pesquisa</button>}/>
 <div className="stats">
  <Stat label="Total de leads" value={stats.total.toString()} icon={Users}/>
  <Stat label="Empresas sem site" value={stats.noSite.toString()} icon={Globe} emphasis/>
  <Stat label="Contatados" value={stats.contacted.toString()} icon={MessageCircle}/>
  <Stat label="Interessados" value={stats.interested.toString()} icon={Target}/>
 </div>
 <div className="grid-2">
  <section className="panel"><div className="panel-head"><div><h3>Principais oportunidades</h3><p>Leads com maior potencial comercial</p></div><a href="/opportunities">Ver todos</a></div>
   <div className="opportunity-list">{[...demoLeads].sort((a,b)=>b.lead_score-a.lead_score).slice(0,4).map(l=><LeadRow key={l.id} lead={l}/>)}</div>
  </section>
  <section className="panel"><div className="panel-head"><div><h3>Distribuição dos leads</h3><p>Visão geral da base atual</p></div></div>
    <div className="bars"><Bar label="Sem site" value={40}/><Bar label="Site com problemas" value={28}/><Bar label="Site saudável" value={32}/></div>
    <div className="legend"><span><i/> Sem site</span><span><i/> Com problemas</span><span><i/> Saudável</span></div>
  </section>
 </div>
 <section className="panel"><div className="panel-head"><div><h3>Atividade recente</h3><p>Últimas oportunidades adicionadas</p></div><a href="/leads">Abrir leads</a></div><div className="mini-table">
  {demoLeads.slice(0,3).map(l=><div className="mini-row" key={l.id}><div className="company-avatar">{l.business_name[0]}</div><div className="grow"><b>{l.business_name}</b><small>{l.category} · {l.city}</small></div><Score n={l.lead_score}/><Status status={l.sales_status}/></div>)}
 </div></section>
 </>}
function Stat({label,value,icon:Icon,emphasis}:{label:string,value:string,icon:any,emphasis?:boolean}){return <div className={`stat ${emphasis?'emphasis':''}`}><div className="stat-icon"><Icon size={20}/></div><div><small>{label}</small><strong>{value}</strong></div></div>}
function Bar({label,value}:{label:string,value:number}){return <div className="bar-item"><div><span>{label}</span><b>{value}%</b></div><div className="track"><div style={{width:`${value}%`}}/></div></div>}
function LeadRow({lead}:{lead:Lead}){const nav=useNavigate();return <div className="lead-row" onClick={()=>nav('/leads/'+lead.id)}><div className="company-avatar">{lead.business_name[0]}</div><div className="grow"><b>{lead.business_name}</b><small>{lead.city} · {lead.category}</small></div><div className="site-state">{lead.has_website?'Site encontrado':'Sem site'}</div><Score n={lead.lead_score}/></div>}

function SearchPage(){
 const [keyword,setKeyword]=useState(''),[city,setCity]=useState(''),[state,setState]=useState('SC'),[limit,setLimit]=useState('25'),[running,setRunning]=useState(false),[done,setDone]=useState(false)
 const run=()=>{setRunning(true);setDone(false);setTimeout(()=>{setRunning(false);setDone(true)},1800)}
 return <><Header title="Nova pesquisa" subtitle="Encontre empresas por nicho e localização."/>
 <div className="search-layout"><section className="panel search-card"><div className="section-title"><div className="icon-box"><Search size={20}/></div><div><h3>Configurar pesquisa</h3><p>Use dados públicos para encontrar novas oportunidades.</p></div></div>
  <label>Nicho ou palavra-chave<input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Ex.: clínicas odontológicas"/></label>
  <div className="form-grid"><label>Cidade<input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ex.: Palhoça"/></label><label>Estado<select value={state} onChange={e=>setState(e.target.value)}><option>SC</option><option>PR</option><option>RS</option><option>SP</option><option>RJ</option></select></label></div>
  <div className="form-grid"><label>Raio<select><option>5 km</option><option>10 km</option><option>25 km</option><option>50 km</option></select></label><label>Quantidade<select value={limit} onChange={e=>setLimit(e.target.value)}><option>10</option><option>25</option><option>50</option><option>100</option></select></label></div>
  <button className="primary wide" onClick={run} disabled={running}><Search size={17}/>{running?'Pesquisando...':'Pesquisar empresas'}</button>
  {running&&<div className="progress-box"><b>Pesquisa em andamento</b><p>Encontrando empresas e preparando análise...</p><div className="progress"><div/></div></div>}
  {done&&<div className="success-box"><ShieldCheck size={20}/><div><b>Pesquisa concluída</b><p>Modo demonstração: 25 empresas encontradas. Conecte uma API para dados reais.</p></div><a href="/leads">Ver leads →</a></div>}
 </section>
 <section className="panel tips"><h3>Como funciona</h3><Step n="01" title="Encontre empresas" text="Pesquise por nicho, cidade e raio."/><Step n="02" title="Verifique presença digital" text="O sistema identifica e audita websites."/><Step n="03" title="Priorize oportunidades" text="Lead Score destaca quem merece seu contato primeiro."/><Step n="04" title="Entre em contato" text="Abra WhatsApp, Instagram ou Google Maps."/>
 </section></div></>
}
function Step({n,title,text}:{n:string,title:string,text:string}){return <div className="step"><span>{n}</span><div><b>{title}</b><p>{text}</p></div></div>}

function LeadsPage(){
 const [filter,setFilter]=useState('all'),[q,setQ]=useState('')
 const filtered=demoLeads.filter(l=>(filter==='all'||(filter==='nosite'&&!l.has_website)||(filter==='high'&&l.lead_score>=80)||(filter==='problem'&&l.has_website&&l.website_score<60))&&l.business_name.toLowerCase().includes(q.toLowerCase()))
 return <><Header title="Leads" subtitle="Gerencie e qualifique sua base de prospecção." action={<button className="secondary"><Download size={17}/> Exportar CSV</button>}/>
 <div className="toolbar"><div className="search-input"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar empresa..."/></div><div className="filters">{[['all','Todos'],['nosite','Sem site'],['problem','Site ruim'],['high','Alta oportunidade']].map(([v,t])=><button className={filter===v?'active':''} key={v} onClick={()=>setFilter(v)}>{t}</button>)}</div></div>
 <section className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Empresa</th><th>Localização</th><th>Website</th><th>Score</th><th>Status</th><th></th></tr></thead><tbody>{filtered.map(l=><tr key={l.id}><td><div className="table-company"><div className="company-avatar">{l.business_name[0]}</div><div><b>{l.business_name}</b><small>{l.category}</small></div></div></td><td>{l.city} · {l.state}</td><td>{l.has_website?<span className={l.website_score<60?'warn':'ok'}>{l.website_status==='offline'?'Offline':'Online'} · {l.website_score}</span>:<span className="danger">Não encontrado</span>}</td><td><Score n={l.lead_score}/></td><td><Status status={l.sales_status}/></td><td><a className="icon-btn" href={'/leads/'+l.id}><ExternalLink size={16}/></a></td></tr>)}</tbody></table></div></section></>
}

function LeadDetails(){
 const {id}=useParams(); const lead=demoLeads.find(x=>x.id===id)||demoLeads[0]
 return <><Header title="Detalhes do lead" subtitle="Visão comercial e análise de presença digital." action={<button className="secondary" onClick={()=>history.back()}>← Voltar</button>}/>
 <div className="detail-grid"><section className="panel lead-profile"><div className="profile-top"><div className="big-avatar">{lead.business_name[0]}</div><div className="grow"><div className="eyebrow">{lead.category}</div><h2>{lead.business_name}</h2><p>📍 {lead.city} · {lead.state}</p></div><Score n={lead.lead_score}/></div>
 <div className="contact-grid"><Info label="Telefone" value={lead.phone||'Não informado'}/><Info label="Avaliação" value={`⭐ ${lead.rating} · ${lead.review_count} avaliações`}/><Info label="Website" value={lead.website||'Não encontrado'}/><Info label="Instagram" value={lead.instagram||'Não informado'}/></div>
 <div className="actions"><a className="primary" href={lead.phone?'https://wa.me/55'+lead.phone.replace(/\D/g,''):undefined}><MessageCircle size={17}/> WhatsApp</a><a className="secondary" href={lead.google_maps_url} target="_blank"><ExternalLink size={17}/> Google Maps</a></div></section>
 <section className="panel score-card"><div className="score-circle"><strong>{lead.lead_score}</strong><span>/100</span></div><h3>Oportunidade {lead.opportunity_level.toLowerCase()}</h3><p>Priorize este lead de acordo com o potencial identificado.</p><div className="score-reasons"><span>{lead.has_website?'✓ Website encontrado':'✓ Empresa sem website'}</span><span>✓ Telefone disponível</span><span>✓ Presença no Google</span></div></section></div>
 <section className="panel"><div className="panel-head"><div><h3>Website Audit</h3><p>Análise básica da presença digital</p></div>{lead.has_website&&<a href={lead.website} target="_blank">Abrir site <ExternalLink size={14}/></a>}</div>{lead.has_website?<div className="audit-grid"><Audit name="HTTPS" ok={true}/><Audit name="Site online" ok={lead.website_status==='online'}/><Audit name="Mobile" ok={lead.website_score>=60}/><Audit name="SEO básico" ok={lead.website_score>=70}/><Audit name="WhatsApp" ok={lead.website_score>=60}/><Audit name="Formulário" ok={lead.website_score>=70}/></div>:<div className="empty-opportunity"><Globe size={28}/><div><h3>Esta empresa não possui website identificado</h3><p>Este é um lead prioritário para oferta de criação de site.</p></div><span>🔥 Alta oportunidade</span></div>}</section>
 <section className="panel notes"><h3>Notas comerciais</h3><textarea placeholder="Adicione observações sobre este lead..." defaultValue={lead.notes}/><button className="primary">Salvar notas</button></section>
 </>}
function Info({label,value}:{label:string,value:string}){return <div><small>{label}</small><b>{value}</b></div>}
function Audit({name,ok}:{name:string,ok:boolean}){return <div className="audit"><span>{ok?'✓':'×'}</span><div><b>{name}</b><small>{ok?'Identificado':'Não identificado'}</small></div></div>}

function Opportunities(){const list=[...demoLeads].sort((a,b)=>b.lead_score-a.lead_score);return <><Header title="Oportunidades" subtitle="Os leads com maior potencial comercial."/><div className="opportunity-grid">{list.map((l,i)=><div className="panel opp-card" key={l.id}><div className="rank">#{i+1}</div><div className="company-avatar">{l.business_name[0]}</div><h3>{l.business_name}</h3><p>{l.category} · {l.city}</p><div className="opp-score"><Score n={l.lead_score}/><span>oportunidade {l.opportunity_level.toLowerCase()}</span></div><div className="opp-tags"><span>{l.has_website?'Site existente':'Sem site'}</span>{l.review_count>100&&<span>{l.review_count} avaliações</span>}</div><a className="secondary wide" href={'/leads/'+l.id}>Ver oportunidade</a></div>)}</div></>}

function CRM(){const columns=[['new','Novos'],['contacted','Contatados'],['responded','Respondeu'],['interested','Interessado'],['proposal','Proposta'],['won','Ganho']];return <><Header title="CRM" subtitle="Acompanhe seus leads do primeiro contato até a venda."/><div className="kanban">{columns.map(([status,title])=><div className="kanban-col" key={status}><div className="kanban-head"><b>{title}</b><span>{demoLeads.filter(l=>l.sales_status===status).length}</span></div>{demoLeads.filter(l=>l.sales_status===status).map(l=><div className="kanban-card" key={l.id}><b>{l.business_name}</b><small>{l.city}</small><div><Score n={l.lead_score}/><a href={'/leads/'+l.id}>Abrir</a></div></div>)}</div>)}</div></>}

function Searches(){return <><Header title="Pesquisas" subtitle="Histórico das buscas realizadas."/><section className="panel table-panel"><table><thead><tr><th>Pesquisa</th><th>Localização</th><th>Resultados</th><th>Status</th><th>Data</th></tr></thead><tbody><tr><td><b>Clínicas odontológicas</b></td><td>Palhoça · SC</td><td>25</td><td><Status status="interested"/></td><td>09/09/2026</td></tr><tr><td><b>Revendas de veículos</b></td><td>São José · SC</td><td>50</td><td><Status status="interested"/></td><td>08/09/2026</td></tr></tbody></table></section></>}

function SettingsPage(){return <><Header title="Configurações" subtitle="Configure integrações e preferências do LeadFinder."/><div className="settings-grid"><section className="panel"><div className="section-title"><div className="icon-box"><UserRound size={19}/></div><div><h3>Perfil</h3><p>Informações da sua conta</p></div></div><label>Nome<input defaultValue="George"/></label><label>Email<input defaultValue="seu@email.com"/></label><button className="primary">Salvar alterações</button></section><section className="panel"><div className="section-title"><div className="icon-box"><ShieldCheck size={19}/></div><div><h3>Integrações</h3><p>Chaves e serviços externos</p></div></div><div className="integration"><div><b>Supabase</b><small>Banco, autenticação e Edge Functions</small></div><span className="connected">Pronto para configurar</span></div><div className="integration"><div><b>Places / Maps API</b><small>Pesquisa de empresas e locais</small></div><span className="pending">Não configurado</span></div><div className="notice">As chaves privadas devem ficar nas Secrets das Edge Functions, nunca no frontend.</div></section><section className="panel"><div className="section-title"><div className="icon-box"><MessageCircle size={19}/></div><div><h3>WhatsApp</h3><p>Mensagem usada no primeiro contato</p></div></div><textarea defaultValue="Olá! Tudo bem? Meu nome é George. Trabalho com criação de sites profissionais para empresas e encontrei a empresa de vocês pelo Google. Gostaria de apresentar uma ideia rápida que pode ajudar a melhorar a presença digital da empresa."/><button className="primary">Salvar mensagem</button></section></div></>}

export default App
