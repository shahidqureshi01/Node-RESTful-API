#### How to use this API ####
1 - New user can be created by POST method and sending required data to /users. Likewise
users can be updated, searched and deleted by PUT, GET and DELETE methods. 

2 - Users can create token by going onto /tokens URL. This token can be created, searched, 
updated and deleted with POST, GET, DELETE and PUT methods. In other words, user can log in
by creating a token and log out by deleting the token. 

3 - '/menu' route return hard-coded simple menu with GET request. We currently assume that 
the price of each item is £1. 

4 - A logged in user can created a cart by going onto '/cart' route. user can add/delete item
from the cart by PUT and POST. 

5 - A user can send it's cart to stripe to place an order. The function is in the helpers.js
file.

6 - The details of an order could be sent to a user by sendEmail function in helper.js file.
Mailgun has temporarily disabled my account. I'm trying to resolve the issue at the moment.