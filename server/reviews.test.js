//node testing for the reviews.js file, this is a test for the createReviewHandler function. It will test the function with a valid booking id, a valid rating, and a valid comment. It will also test the function with many invalid situations and return the correct corropsonding error codes.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createReviewHandler } = require('./reviews');
const CUSTOMER_ID = '11111111-1111-1111-1111-111111111111';
const TASKER_ID = '22222222-2222-2222-2222-222222222222';
const BOOKING_ID = '33333333-3333-3333-3333-333333333333';
const paidBooking = { 
    id: BOOKING_ID, 
    customer_id: CUSTOMER_ID, 
    tasker_id: TASKER_ID, 
    status: 'paid' };

// stand-in for Supabase client: it records what was inserted, and can be set up to return a booking or an error.
function makeFakeSupabase({ booking = null, insertError = null } = {}) {
  const inserted = [];
  return {
    inserted,
    from(table) {
      if (table === 'bookings') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: booking, error: null }),
            }),
          }),
        };
      }
      if (table === 'reviews') {
        return {
          insert: async (row) => {
            if (!insertError) inserted.push(row); // a refused insert saves nothing
            return { error: insertError };
          },
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  };
}
// stand-in for Express's res object: it records what the handler sent.
function makeRes() {
  return {
    statusCode: 200, body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}
// builds the handler with fakes, calls it, and hands back what happened.
async function callHandler({
  booking,
  insertError,
  userId = CUSTOMER_ID,
  headers = { 'user-id': 'customer@example.com' },
  body = { bookingId: BOOKING_ID, rating: 5, comment: 'Great work' },
} = {}) {
  const supabase = makeFakeSupabase({ booking, insertError });
  const handler = createReviewHandler({
    supabase,
    getUserIdByEmail: async () => userId,
  });
  const res = makeRes();
  await handler({ headers, body }, res);
  return { res, supabase };
}

test('saves a review for a paid booking and returns 201', async () => {
  const { res, supabase } = await callHandler({ booking: paidBooking });
  assert.equal(res.statusCode, 201);
  assert.equal(supabase.inserted.length, 1);
  assert.equal(supabase.inserted[0].tasker_id, TASKER_ID);
  assert.equal(supabase.inserted[0].customer_id, CUSTOMER_ID);
});

test('no header returns 401', async () => {
  const { res } = await callHandler({ headers: {} });
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'User authentication required');
});

test('unkown user returns 401', async () => {
  const { res } = await callHandler({ userId: null });
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'User authentication required');
});

test('invalid booking id returns 400', async () => {
  const { res } = await callHandler({ body: { bookingId: 'not-a-uuid', rating: 5 } });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, 'Invalid input data');
});

test('invalid rating returns 400', async () => {
  const { res } = await callHandler({ body: { bookingId: BOOKING_ID, rating: 6 } });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, 'Invalid input data');
});

test('invalid comment returns 400', async () => {
  const longComment = 'a'.repeat(501);
  const { res } = await callHandler({ body: { bookingId: BOOKING_ID, rating: 5, comment: longComment } });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, 'Invalid input data');
});

test ('booking not found returns 404', async () => {
  const { res } = await callHandler({ booking: null });
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.message, 'Booking not found');
});

test('booking not paid returns 409', async () => {
  const unpaidBooking = { ...paidBooking, status: 'pending' };
  const { res } = await callHandler({ booking: unpaidBooking });
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.message, 'Conflict: Booking has not been paid for yet');
});

test('booking belongs to another customer returns 403', async () => {
  const otherCustomerBooking = { ...paidBooking, customer_id: '99999999-9999-9999-9999-999999999999' };
  const { res } = await callHandler({ booking: otherCustomerBooking });
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.message, 'Forbidden: You do not have access to this booking');
});

test ('duplicate review returns 409', async () => {
  const insertError = { code: '23505' }; // Postgres unique violation
  const { res } = await callHandler({ booking: paidBooking, insertError });
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.message, 'Conflict: Review already exists for this booking');
});

test('other insert error returns 500', async () => {
  const insertError = { code: '99999' }; // some other error
  const { res } = await callHandler({ booking: paidBooking, insertError });
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, 'Internal server error');
});


