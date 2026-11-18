# Decisions

## Who can review and when
Users are able to review taskers once the task they have asked for has been completed. The option will pop up beforehand but most people will not review a job until completed. It is the same situation that happens on facebook marketplace. Once the transaction is completed you are able to begin reviewing the exchange even if the good has not been recieved yet. I may change my mind on this eventually but those are my inital thoughts. 

## Preventing Duplicates 
to have a full proof way of preventing duplicates there will be sql schema that makes sure that reviews are connected to the one booking they paid for which is enforced by the "uuid not null unique references bookings(id)" and then an endpoint that gives an error if a user attempts to submit multiple reviews for the same booking 

## Known Limits
 - Users may review before task is completed, once a completed status is fully fledged out I believe using that as the prompt for a review will be best

## Ranking: Tasker with one 5-star review vs a tasker with fourty reviews at 4.6 stars 


## Where AI was used

I used Claude throughout this assignment. Specifically:

- **SQL:** Claude wrote the first drafts of `schema.sql` and `reviews.sql`. I had been rusty on my sql skills and my beginning thought process needed more work and better retraints for my project. Helped with RLS security as well.
- **Endpoint design:** Claude assisted me in thinking through security measures/error codes that would assist my process of creating endpoints for review submission. Suggested I start a plain-English outline of every check. Claude reviewed my outline and asked questions, and I revised it until I could explain each rule on my own accurately. Assisted in endpoint review and error debugging.