# NGHBR - Task Marketplace

NGHBR is a web application that enables Kenyan residents to provide services to each other. This application includes user authentication, listing management, and payment processing with Paystack.

## Features

- User authentication with email verification
- Create, view, and search taskers
- Availability management
- Secure payment processing via Paystack
- Responsive UI for both desktop and mobile

## Tech Stack

- **Frontend**: React.js with custom CSS
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Payment Processing**: Paystack API

## Reviews feature (take-home)
A customer can submit a review of the neighbor for the specific booking that they placed. The reviewers/customer will submit a 1-5 rating of the neighbor with the opinional choice of a 500 or less comment.  Once the original project has fledged out the 'completed' status of a task and how it should be addressed, when a custoemr can review will be based on that instead. As of right now the submit endpoint built and tested, along with test cases to check their validity. 

### Endpoint: POST /api/reviews

- **Header**: user-id, holds the email of the customer
- **Body**: bookingID (required), rating (required), comment (optional)

| Status | When it happens |
|---|---|
| 201 | When a review is successfully submitted |
| 400 | When input data for the review is invalid (i.e invalid bookingID format, rating is a whole number above 5 or below 1, comment is longer than 500 characters, or not a string) |
| 401 | When a user is not authorized or the header is missing or the email does not match a registered user |
| 403 | When the booking belongs to a different customer |
| 404 | When the booking is not found |
| 409 | When there is a conflict with what is expected and what is actually being requested, two reasons for this are duplicate reviews and bookings do not have a 'paid' status|
| 500 | unexpected server or database error |

### Setup

**Step 1. Create a free Supabase project**
- Get the URL (Project settings -> API KEYS -> 'Connect' top navigation bar )
- Get Service Role Key (Project settings -> API KEYS -> 'View legacy API keys' button -> copy 'Service_role')

**Step 2. SQL database**
- In Supabase SQL Editor run 'schema.sql' first and then AFTER run 'reviews.sql'
The order matters because reviews.sql references bookings and profiles tables

**Step 3. Create Test Users**
- Create two authorized users (Authentication tab -> top right 'new user' button -> create two users with emails one for a customer and one you will use as a neighbor/tasker)
- In Supabase SQL Editor run: supabase/seed.sql (insert your own two emails in their respective spots)

**Step 4. Create a server .env file**
- ADD 3-4 variables and paste what was found earlier SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PAYSTACK_SECRET_KEY, and optionally PORT.

**Step 5. Start the server** 
- open a terminal and run npm start in project root folder
- server listens on port 5050

### Running the tests
 In order to run tests open a terminal and navigate to the server folder (cd ./server) and then in the second terminal type "npm test" 
 This does not require the server to run because there are automated tests that only need the funcrion of the handler and do not require the supabase or server to function

### Design notes

All design notes and decisions made can be found here:[DECISIONS.md](DECISIONS.md)
duplicates are blocked by a unique constraint in the database, and the Neighbor’s ID comes from the booking.

### Not built

Only the submit endpoint, its SQL, and its tests are done. These pieces are not built yet:

- **Get-rating endpoint** (for example `GET /api/neighbors/:id/rating`): would return a Neighbor's average rating and review count by aggregating the `reviews` table on `tasker_id` (the index on that column is there for this). The card would show the raw average and count.
- **Screens**: a review form (1-5 stars and an optional comment) on the customer's dashboard for paid bookings that don't have a review yet, plus the average rating and review count on each Neighbor's card in search results.
- **`completed` booking status**: reviews are gated on `paid` because it's the only post-payment status today, but a customer can review before the work is done. Once a `completed` status exists, the check should move to it.