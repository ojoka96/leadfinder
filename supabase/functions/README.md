# Edge Functions

Crie estas funções no Supabase:

- `search-places`
- `audit-website`
- `calculate-lead-score`

As credenciais das APIs devem ser configuradas como Secrets no Supabase.

## search-places

Entrada:
```json
{
  "keyword": "clínicas odontológicas",
  "city": "Palhoça",
  "state": "SC",
  "radius": 10000,
  "limit": 25
}
```

Responsabilidades:
- consultar uma API oficial de Places/Maps;
- normalizar resultados;
- deduplicar por place_id;
- salvar em `leads`;
- retornar resultados.

## audit-website

Entrada:
```json
{
  "lead_id": "uuid",
  "url": "https://example.com"
}
```

Responsabilidades:
- timeout;
- GET público;
- status HTTP;
- HTTPS;
- title/meta/viewport;
- sinais de contato/WhatsApp;
- score;
- salvar em `website_audits`.

Não executar código arbitrário, não acessar áreas privadas e não tentar contornar controles de acesso.

## calculate-lead-score

Pode ser chamada após cada import/audit para recalcular o score.
