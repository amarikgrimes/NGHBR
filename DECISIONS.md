# Decisions

## Who can review and when
Users are able to review taskers once the task they have asked for has been completed. The option will pop up beforehand but most people will not review a job until completed. It is the same situation that happens on facebook marketplace. Once the transaction is completed you are able to begin reviewing the exchange even if the good has not been recieved yet. I may change my mind on this eventually but those are my inital thoughts. 

## Preventing Duplicates 
to have a full proof way of preventing duplicates there will be sql schema that makes sure that reviews are connected to the one booking they paid for which is enforced by the "uuid not null unique references bookings(id)" and then an endpoint that gives an error if a user attempts to submit multiple reviews for the same booking 

## Known Limits
 - Users may review before task is completed, once a completed status is fully fledged out I believe using that as the prompt for a review will be best
 - 

## Ranking: Tasker with one 5-star review vs a tasker with fourty reviews at 4.6 stars 


## Where AI was used
