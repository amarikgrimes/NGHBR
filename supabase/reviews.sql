create table reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null unique references bookings(id) on delete cascade, -- preventing duplicates
  tasker_id   uuid not null references profiles(user_id),
  customer_id uuid not null references profiles(user_id),
  rating      smallint not null check (rating between 1 and 5), --secure rule so ratings stay 1-5
  comment     text check (comment is null or char_length(comment) <= 500),
  created_at  timestamptz not null default now()
);

-- assisting with computing average rating for a tasker
create index reviews_tasker_id_idx on reviews (tasker_id);

alter table reviews enable row level security;