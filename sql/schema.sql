create extension if not exists "uuid-ossp";

create table if not exists issues (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issue_date date not null,
  description text not null,
  tags text[] default '{}',
  featured boolean default false,
  pdf_url text not null,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create table if not exists ratings (
  id uuid primary key default uuid_generate_v4(),
  issue_id uuid not null references issues(id) on delete cascade,
  voter_hash text not null,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique(issue_id, voter_hash)
);

create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  issue_id uuid not null references issues(id) on delete cascade,
  name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  logo_url text,
  banner_url text,
  updated_at timestamptz not null default now()
);

create or replace view issues_with_rating as
select
  i.*,
  coalesce(avg(r.rating), 0)::numeric(10,2) as avg_rating
from issues i
left join ratings r on r.issue_id = i.id
group by i.id;
