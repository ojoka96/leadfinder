# LeadFinder

SaaS de prospecção comercial para encontrar empresas, identificar presença digital e priorizar oportunidades.

## Rodar no VS Code

Requisitos:
- Node.js 20+
- npm

```bash
npm install
npm run dev
```

Abra a URL exibida pelo Vite.

## O que já está pronto

- Dashboard
- Nova pesquisa
- Modo demonstração
- Lista de leads
- Filtros
- Lead Score
- Detalhes do lead
- Website Audit visual
- CRM Kanban
- Oportunidades
- Histórico de pesquisas
- Configurações
- Layout responsivo
- Estrutura preparada para Supabase

## Próximas configurações

1. Criar projeto no Supabase.
2. Criar as tabelas e RLS usando o SQL em `supabase/schema.sql`.
3. Criar `.env` baseado em `.env.example`.
4. Conectar o frontend ao Supabase.
5. Criar as Edge Functions.
6. Configurar a API de Places/Maps escolhida.
7. Guardar chaves privadas nas Secrets das Edge Functions.
8. Substituir o modo DEMO pela busca real.

## Arquitetura recomendada

Frontend React/Vite
→ Supabase Auth
→ Supabase PostgreSQL
→ Supabase Edge Functions
→ Places/Maps API
→ Website Audit

Não faça scraping direto do HTML do Google Maps. Use uma API apropriada para Places/Maps e respeite os termos aplicáveis.

## Observação

O projeto entregue é uma base funcional de frontend com dados DEMO. A parte que depende de credenciais externas (Supabase/Places) fica deliberadamente desacoplada para você configurar com suas próprias contas e chaves.
