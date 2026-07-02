-- ════════════════════════════════════════════════════════════════
--  cuidadores.xyz — Esquema de base de datos (Supabase / PostgreSQL)
--  Ejecuta este script en: Supabase → SQL Editor → New query
-- ════════════════════════════════════════════════════════════════

-- ── Extensiones ───────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tipos enumerados ──────────────────────────────────────────────
do $$ begin
  create type tipo_cuidado as enum ('ninos', 'mayores', 'dependientes');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_destacado as enum ('7dias', 'mensual');
exception when duplicate_object then null; end $$;

-- ════════════════════════════════════════════════════════════════
--  TABLA: profiles  (perfil público de cada cuidador/a)
-- ════════════════════════════════════════════════════════════════
create table if not exists public.profiles (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  nombre            text not null,
  foto_url          text,
  descripcion       text,                 -- descripción corta para la tarjeta
  curriculum        text,                 -- CV / experiencia completa
  zona              text,                 -- ciudad / comarca / barrio
  experiencia_anios integer default 0,
  tarifa_hora       numeric(6,2),         -- € por hora
  telefono          text,
  email_contacto    text,
  tipo_cuidado      tipo_cuidado not null default 'mayores',
  disponibilidad    text,                 -- texto libre: "mañanas", "fines de semana"...
  -- Campos de destacado denormalizados para ordenar/filtrar rápido:
  destacado_hasta   timestamptz,          -- null o pasado = no destacado
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Un usuario = un perfil de cuidador
create unique index if not exists profiles_user_id_uidx on public.profiles(user_id);
create index if not exists profiles_tipo_idx       on public.profiles(tipo_cuidado);
create index if not exists profiles_zona_idx       on public.profiles(zona);
create index if not exists profiles_destacado_idx  on public.profiles(destacado_hasta);
create index if not exists profiles_created_idx    on public.profiles(created_at desc);

-- ════════════════════════════════════════════════════════════════
--  TABLA: subscriptions  (pagos de destacado vía Stripe)
-- ════════════════════════════════════════════════════════════════
create table if not exists public.subscriptions (
  id                uuid primary key default uuid_generate_v4(),
  profile_id        uuid not null references public.profiles(id) on delete cascade,
  plan              plan_destacado not null,
  stripe_payment_id text,                 -- id de la sesión / payment_intent
  destacado_hasta   timestamptz not null, -- fecha de expiración del destacado
  activo            boolean not null default true,
  created_at        timestamptz not null default now()
);

create index if not exists subs_profile_idx on public.subscriptions(profile_id);
create index if not exists subs_activo_idx   on public.subscriptions(activo);

-- ════════════════════════════════════════════════════════════════
--  TABLA: contacts  (mensajes de familias a cuidadores)
-- ════════════════════════════════════════════════════════════════
create table if not exists public.contacts (
  id            uuid primary key default uuid_generate_v4(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  nombre_familia text not null,
  email         text not null,
  telefono      text,
  mensaje       text not null,
  created_at    timestamptz not null default now()
);

create index if not exists contacts_profile_idx on public.contacts(profile_id);

-- ════════════════════════════════════════════════════════════════
--  Trigger: mantener updated_at
-- ════════════════════════════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════
--  Vista de ayuda: ¿está un perfil destacado AHORA?
-- ════════════════════════════════════════════════════════════════
-- NOTA RGPD: la vista pública NO expone telefono ni email_contacto.
-- El contacto con el cuidador/a se hace siempre por el formulario. El dueño
-- del perfil sigue viendo esos campos porque su panel lee de la tabla base.
drop view if exists public.profiles_publicos;

create view public.profiles_publicos as
  select
    id, user_id, nombre, foto_url, descripcion, curriculum, zona,
    experiencia_anios, tarifa_hora, tipo_cuidado, disponibilidad,
    destacado_hasta, created_at, updated_at,
    (destacado_hasta is not null and destacado_hasta > now()) as destacado_activo
  from public.profiles;

-- Acceso de lectura a la vista para el cliente (anon) y usuarios logueados.
-- Defensivo: garantiza el SELECT aunque los privilegios por defecto no cubran la vista.
grant select on public.profiles_publicos to anon, authenticated;

-- ════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.contacts      enable row level security;

-- profiles: cualquiera puede LEER (listado público de familias)
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

-- profiles: cada cuidador inserta/edita/borra SOLO su propio perfil
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- subscriptions: el cuidador ve sus propias suscripciones.
-- (las escrituras las hace el webhook con la service_role key, que omite RLS)
drop policy if exists "subs_select_own" on public.subscriptions;
create policy "subs_select_own"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles pr
      where pr.id = subscriptions.profile_id and pr.user_id = auth.uid()
    )
  );

-- contacts: cualquiera (familia anónima) puede INSERTAR un mensaje.
drop policy if exists "contacts_insert_public" on public.contacts;
create policy "contacts_insert_public"
  on public.contacts for insert
  with check (true);

-- contacts: solo el cuidador dueño del perfil puede LEER sus mensajes.
drop policy if exists "contacts_select_own" on public.contacts;
create policy "contacts_select_own"
  on public.contacts for select
  using (
    exists (
      select 1 from public.profiles pr
      where pr.id = contacts.profile_id and pr.user_id = auth.uid()
    )
  );

-- ════════════════════════════════════════════════════════════════
--  STORAGE: bucket público para fotos de perfil
-- ════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

-- Lectura pública de las fotos
drop policy if exists "fotos_public_read" on storage.objects;
create policy "fotos_public_read"
  on storage.objects for select
  using (bucket_id = 'fotos');

-- Subida solo para usuarios autenticados, en su propia carpeta {user_id}/...
drop policy if exists "fotos_auth_insert" on storage.objects;
create policy "fotos_auth_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fotos_auth_update" on storage.objects;
create policy "fotos_auth_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fotos_auth_delete" on storage.objects;
create policy "fotos_auth_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ════════════════════════════════════════════════════════════════
--  FIN del esquema
-- ════════════════════════════════════════════════════════════════
