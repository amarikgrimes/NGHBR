function createReviewHandler({supabase, getUserIdByEmail}) {
    return async (req, res) => {
// who is asking?: there must be a user email in the request header, otherwise we can't know who is asking. Thus if it is missing , the server will return a 401 error code because the user is not authenticated.
  const userEmail = req.headers['user-id'];
  if (!userEmail) {
    return res.status(401).json({ success: false, message: 'User authentication required' });
  }
//is the input valid?: the booking id is only valid with a uuid format, the rating is only valid with a number.isintegar javasctipt check for a true return paired with a 1-5 range check, and the comment is optional but if the feild is used it is only valid with a string of 500 characters or less. If any of these are invalid, the server will return an error code of 400
const { bookingId, rating, comment } = req.body;
  if (!bookingId || typeof bookingId !== 'string' || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(bookingId)) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }
  if (!rating || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }
  const hasComment = comment !== undefined && comment !== null;

  if (hasComment && typeof comment !== 'string'){
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }
  if (hasComment && comment.length > 500) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }
  console.log(`Received review submission for bookingId: ${bookingId}, rating: ${rating}, comment: ${comment}`);
  res.json({ success: true, message: 'okay from reviews.js' });
    };
}
module.exports = { createReviewHandler };

//is the email a real user?: the email must be a user in the authentication system for an actual label to be output, otherwise it will return a null user id. The server will return a 401 instead of a 404 in order to avoid user enumeration attacks, and exposing internal information about the system and whether a user is authorized or not.

//does the booking exist?: check for the booking through a maybesingle supabase javascript call, first it will check for a general error which will return a 500 error code as to specify it is a server error that needs fixing, next if there is not general error but the booking itself is not found (row is null) then the server will return a 404 error code otherwise the booking will be returned to the server for further checks.

//is this the customers booking?: the booking.customer_id value must equal the id returned by the getUserIdByEmail function, otherwise the server will return a 403 error code because it knows who the user is but it can not give them access to a booking that is not theirs.

//has the booking been paid?: the booking must have a status of 'paid' in the supabase database, otherwise the server will return an error code of 409 becauase the booking has not been paid for yet and thus the customer can not leave a review for a booking for it.

//save the review: if all of the above checks pass, then the server will save the review to the supabase database, the booking_id and tasker_id will come from the booking row fetched beforehand (tasker_id comes from the booking so that a customer may not request and review any tasker, only the one tasked to their booking), the customr_id comes from userlookup that happened earlier, the rating and comment come from the request body, and the created_at will be set to the current time by the supabase database.

//duplicate reviews: the code will insert directly and let the unique constraint refuse a second one, if the customer has already left a review for this booking, i.e posgres returns an error code of 23505, then the server will return a error code of 409 because the customers request conflicts with the existing review.

//something else: if any other error occurs, the server will return a 500 error code because it is an internal server error and the server does not know what went wrong or can not specify to the user because the risk of exposing internal infomration so the raw error code would print to the console instead . 

//when successful, the server will return a 201 status code and state that the review was successfully created.