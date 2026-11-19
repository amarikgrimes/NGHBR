-- Replace both emails with the ones you created under Authentication > Users

insert into profiles (user_id, display_name, role)
select id, 'Test Customer', 'customer' from auth.users where email = 'customer@example.com';

insert into profiles (user_id, display_name, role)
select id, 'Test Neighbor', 'tasker' from auth.users where email = 'tasker@example.com';

insert into taskers (user_id, business_name, paystack_subaccount_code, bank_code, account_number_last4)
select id, 'Test Neighbor Services', 'ACCT_test123', '000', '1234'
from auth.users where email = 'tasker@example.com';

insert into tasks (tasker_id, title, description, category, location, price)
select id, 'Test cleaning', 'Task used to test reviews', 'cleaning', 'Test City', 1000
from auth.users where email = 'tasker@example.com';

-- One paid booking and one pending booking, both for the customer
insert into bookings (task_id, tasker_id, customer_id, amount, payment_reference, status)
select (select id from tasks where title = 'Test cleaning' limit 1),
       n.id, c.id, 1000, 'test-ref-paid', 'paid'
from auth.users n, auth.users c
where n.email = 'tasker@example.com' and c.email = 'customer@example.com';

insert into bookings (task_id, tasker_id, customer_id, amount, payment_reference, status)
select (select id from tasks where title = 'Test cleaning' limit 1),
       n.id, c.id, 1000, 'test-ref-pending', 'pending'
from auth.users n, auth.users c
where n.email = 'tasker@example.com' and c.email = 'customer@example.com';

-- Then list the bookings so you can copy their IDs
select id, status, payment_reference from bookings;