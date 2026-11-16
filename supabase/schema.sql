-- original sql from project 

create table profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url   text,
  role         text not null,
  location     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table taskers (
  user_id                  uuid primary key references profiles(user_id) on delete cascade,
  business_name            text not null,
  paystack_subaccount_code text not null,
  bank_code                text not null,
  account_number_last4     text not null,
  onboarded_at             timestamptz not null default now()
);

create table tasks (
  id          bigint generated always as identity primary key,
  tasker_id   uuid not null references profiles(user_id),
  title       text not null,
  description text not null,
  category    text not null,
  location    text not null,
  price       numeric not null,
  "imageURL"  text,
  created_at  timestamptz not null default now()
);

create table bookings (
  id                uuid primary key default gen_random_uuid(),
  task_id           bigint not null references tasks(id),
  tasker_id         uuid not null references profiles(user_id),
  customer_id       uuid not null references profiles(user_id),
  amount            numeric not null,
  payment_reference text not null unique,
  status            text not null default 'pending'
                    check (status in ('pending', 'paid')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);