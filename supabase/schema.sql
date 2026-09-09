create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  keyword text not null,
  city text,
  state text,
  country text not null default 'BR',
  radius integer,
  results_requested integer,
  results_found integer default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  search_id uuid references public.searches(id) on delete set null,
  business_name text not null,
  category text,
  address text,
  city text,
  state text,
  postal_code text,
  phone text,
  website text,
  instagram text,
  facebook text,
  google_place_id text,
  google_maps_url text,
  rating numeric,
  review_count integer,
  has_website boolean default false,
  website_status text default 'unknown',
  website_score integer default 0,
  lead_score integer default 0,
  opportunity_level text default 'Baixa',
  sales_status text default 'new',
  notes text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.website_audits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  url text,
  is_accessible boolean,
  http_status integer,
  uses_https boolean,
  response_time integer,
  has_title boolean,
  has_meta_description boolean,
  has_viewport boolean,
  mobile_friendly boolean,
  has_contact_form boolean,
  has_whatsapp boolean,
  has_ssl boolean,
  technology text,
  overall_score integer default 0,
  issues jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create table if not exists public.lead_tags (
  lead_id uuid not null references public.leads(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (lead_id, tag_id)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_user_id_idx on public.leads(user_id);
create index if not exists leads_search_id_idx on public.leads(search_id);
create index if not exists leads_place_id_idx on public.leads(google_place_id);
create index if not exists leads_score_idx on public.leads(lead_score);
create index if not exists leads_status_idx on public.leads(sales_status);
create index if not exists leads_city_idx on public.leads(city);
create index if not exists leads_category_idx on public.leads(category);

alter table public.profiles enable row level security;
alter table public.searches enable row level security;
alter table public.leads enable row level security;
alter table public.website_audits enable row level security;
alter table public.tags enable row level security;
alter table public.lead_tags enable row level security;
alter table public.notes enable row level security;

create policy "profiles own" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "searches own" on public.searches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "leads own" on public.leads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tags own" on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes own" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "audit via own lead" on public.website_audits
for all using (
  exists (select 1 from public.leads l where l.id = lead_id and l.user_id = auth.uid())
) with check (
  exists (select 1 from public.leads l where l.id = lead_id and l.user_id = auth.uid())
);

create policy "lead tags via own lead" on public.lead_tags
for all using (
  exists (select 1 from public.leads l where l.id = lead_id and l.user_id = auth.uid())
) with check (
  exists (select 1 from public.leads l where l.id = lead_id and l.user_id = auth.uid())
);
