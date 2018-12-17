/*
 * Name: handlers.js
 * Description: This file implements CRUD operations
 * Author: Shahid
 *
 */

 // Dependencies
const helpers = require('./helpers');
const _data = require('./data');

// Add the handlers
const handlers = {};

// Container function to handle /users route
handlers.users = function(data, callback) {
	let allowedMethods = ['get', 'post', 'put', 'delete'];
	if(allowedMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
}

handlers._users = {};

// Function to test type and length of a field
function isValidData(field, type, len) {
	return typeof(field) == type && field.trim().length > len ? field : false;
}

// Function for handling POST requests for users
handlers._users.post = function(data, callback) {
	// Validate the incoming data
	const firstName = isValidData(data.payload.firstName, 'string', 0);
	const lastName = isValidData(data.payload.lastName, 'string', 0);
	const email = isValidData(data.payload.email, 'string', 0);
	const password = isValidData(data.payload.password, 'string', 0);
	const address = isValidData(data.payload.address, 'string', 10);
	
	// If all fields were valid
	if(firstName && lastName && email && password && address) {
		// Test if user already exist
		_data.read('users', email, function(error, data){
			if(error) {
				// Get the password hashed
				let hashedPassword = helpers.hash(password);

				if(hashedPassword) {
					// Get all the data into a users object
					let userObj = {
						firstName,
						lastName, 
						email,
						hashedPassword,
						address
					};

					// Create the users 
					_data.create('users', email, userObj, function(error){
						if(!error) {
							callback(200);
						} else {
							callback(500, {error: 'could not create users'});
						}
					});
				} else {
					callback(500, {error: 'could not hash password'});
				}
			} else {
				callback(500, {error: 'user already exist!'})
			}
		});
	} else {
		callback(405, {error: 'one or more required fields are missing'});
	}
	
}

// Function for handling GET requests for users
handlers._users.get = function(data, callback) {
	// Validate the email, the only required field
	let email = isValidData(data.queryStrObj.email, 'string', 0);

	if(email) {
		_data.read('users', email, function(error, data){
			if(!error && data) {
				data = JSON.parse(data);
				delete data.hashedPassword;
				delete data.password;
				callback(200, data);
			} else {
				callback(404);
			}
		});
	} else {
		callback(404, {error: 'missing required data'});
	}
}

// Function for handling PUT requests for users
handlers._users.put = function(data, callback) {
	// Test if required email field was sent
	const email = isValidData(data.payload.email, 'string', 0);

	// Test if non-mandatory fields were sent
	const firstName = isValidData(data.payload.firstName, 'string', 0);
	const lastName = isValidData(data.payload.lastName, 'string', 0);
	const password = isValidData(data.payload.password, 'string', 0);
	const address = isValidData(data.payload.address, 'string', 0);

	if(email) {
		if(firstName || lastName || password || address) {
			_data.read('users', email, function(error, userData) {
				userData = helpers.parseJsonToObject(userData);
				// If user was found
				if(!error && userData) {
					if(firstName) {
						userData.firstName = firstName;
					}
					if(lastName) {
						userData.lastName = lastName;
					} 
					if(password) {
						userData.password = helpers.hash(password);
					}
					if(address) {
						userData.address = address;
					}
					// Update the the file with new data
					_data.update('users', email, userData, function(error) {
						if(!error) {
							callback(200);
						} else {
							callback(500, {error: 'Could not update the users.'});
						}
					});

				} else {
					callback(404, {error: 'user does not exist.'});
				}
			});
		} else {
			callback(400, {error: 'One of the non-mandatory field is missing.'})
		}
	} else {
		callback(400, {error: 'email was missing.'});
	}

}

// Function for handling DELETE requests for users
handlers._users.delete = function(data, callback) {
	// Test if the mandatory emails was part of query string
	const email = isValidData(data.queryStrObj.email, 'string', 0);
	if(email) {
		_data.read('users', email, function(error, data){
			if(!error && data) {
				_data.delete('users', email, function(error){
					if(!error) {
						callback(200);
					} else {
						callback(500, {Error: 'Could not delete the users.'})
					}
				});
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, {error: 'missing required data'});
	}
}

handlers.hello = function(data,callback){
	callback(406, {hello: 'World!'});
};

handlers.notFound = function(data,callback){
	callback(404);
};

// Token handler code 

// Container function to handle /token route
handlers.token = function(data, callback) {
	let allowedMethods = ['get', 'post', 'put', 'delete'];
	if(allowedMethods.indexOf(data.method) > -1) {
		handlers._token[data.method](data, callback);
	} else {
		callback(405);
	}
}

handlers._token = {};

// Function for handling POST requests for token
handlers._token.post = function(data, callback) {

	const email = isValidData(data.payload.email, 'string', 0);
	const password = isValidData(data.payload.password, 'string', 0);
	// If both fields were valid
	if(email, password) {
		// read user's data
		_data.read('users', email, function(error, userData){
			if(!error && userData) {
				// Hash the password sent
				let hashedPassword = helpers.hash(password);
				userData = helpers.parseJsonToObject(userData);
				if(hashedPassword == userData.hashedPassword){
					// Passwords matched now create the token object with the help of helper function
					let id = helpers.createRandomStr(20);
					let expiry = Date.now() + 1000 * 60 * 60;
					let tokenObj = {
						id,
						expiry,
						email
					};

					// Store the token
					_data.create('tokens', id, tokenObj, function(error){
						if(!error) {
							callback(200, tokenObj);
						} else {
							callback(500, {Error: 'Could not create token'});
						}

					});
				} else {
					callback(400, {Error: 'password did not match the specified user\'s stored password.'});
				}

			} else {
				callback(500, {error: error });
			}
		});
	} else {
		callback(405, {error: 'required fields are missing'});
	}
	
}

// Function for handling GET requests for token
handlers._token.get = function(data, callback) {
	// Test if valid id was provided in query string
	const id = isValidData(data.queryStrObj.id, 'string', 0);
	if(id) {
		_data.read('tokens', id, function(error, data){
			if(!error && data) {
				data = JSON.parse(data);
				callback(200, data);
			} else {
				callback(404, 'No token found.');
			}
		});
	} else {
		callback(404, {error: 'missing required data'});
	}
}

// Function for handling put requests for token
handlers._token.put = function(data, callback){
	const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
	const id = isValidData(data.payload.id, 'string', 0);
	// if Id and expiray are valid
	if(extend && id) {
		// Read the token data
		_data.read('tokens', id, function(error, tokenData){
			// if no error
			if(!error && tokenData) {
				// Converst JSON to object
				tokenData = helpers.parseJsonToObject(tokenData);
				if(tokenData.expiry > Date.now()) {
					// set the expiry increased by an hour
					tokenData.expiry = Date.now() + 1000 * 60 * 60;
					// Store the new token data
					_data.update('tokens', id, tokenData, function(error){
						if(!error) {
							callback(200)
						} else {
							callback(500, {Error: 'Could not update expiry date.'})
						}
					});
				} else {
					callback(400, {Error: 'Token is already expired.'});
				}
			} else {
				callback(404, {Error: 'User does not exist'});
			}
		});
	} else {
		callback(400, {Error: 'Missing required fields.'});
	}
}

// Function for handling DELETE requests for tokens
handlers._token.delete = function(data, callback) {
	// Test if id was provided
	const id = isValidData(data.payload.id, 'string', 0);
	if(id) {
		_data.read('tokens', id, function(error, data){
			if(!error && data) {
				_data.delete('tokens', id, function(error){
					if(!error) {
						callback(200);
					} else {
						callback(500, {Error: 'Could not delete the token.'})
					}
				});
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, {error: 'missing required data.'});
	}
}


// Handler to return all possible menues
/*
 * This function only return an object which is hardcode.
 * @TODO We'll update this simple data structure to include  
 * price etc. POST, PUT and DELETE methods could also be included
 * to give users more flexibility. 
 */
handlers.menu = function(data, callback) {
	if(data.method == 'get') {
		if(data.headers.token) {
			_data.read('tokens', data.headers.token, function(error, userData){
				if(!error && userData) {
					userData = helpers.parseJsonToObject(userData);
					if(userData.id == data.headers.token) {
						let menu = {};
						menu.indian = ['Chiken Tikka', 'Chicken masla', 'Chicken Korma'],
						menu.italian = ['Lasagne', 'Carbonara', 'Cannoli']
						callback(200, menu);
					} else {
						callback(400, {Error: 'Wrong token'});
					}
				} else {
					callback(404, {Erro: 'Token not found.'})
				}
			});
		} else {
			callback(400, {Error: 'required token is missing.'})
		}
	} else {
		callback(402, {Error: 'Method not allowed'})
	}
}

// Container handler function for cart
handlers.cart = function(data, callback) {
	let methodAllowed = ['get', 'put', 'post', 'delete'];
	if(methodAllowed.indexOf(data.method) > -1) {
		handlers._cart[data.method](data, callback);
	} else {
		callback(400, {Error: 'Method not allowed'});
	}
}

handlers._cart = {};
// Post function for cart
handlers._cart.post = function(data, callback){
	// Test if the user is logged in
	const token = data.headers.token;
	const item = isValidData(data.payload.item, 'string', 0);
	if(item && token){
		_data.read('tokens', token, function(error, userData){
			if(!error && userData) {
				// Test if there's a cart for currently logged in user
				userData = helpers.parseJsonToObject(userData);
				_data.read('carts', userData.email, function(error, cartData){
					if(!error && cartData) {
						// push data to already created cart
						_data.delete('carts', userData.email, function(error){
							if(!error) {
								cartData = helpers.parseJsonToObject(cartData);
								cartData.items.push(item);
								_data.create('carts', cartData.email, cartData, function(error){});
								if(!error) {
									callback(200);
								} else {
									callback(500, {Error: 'Could not create cart after deletion.'});
								}
							} else {
								callback(500, {Error: 'Could not delete cart'});
							}
						})
					} else {
						// New cart because no cart found for current user
						let cartObj = {
							email: userData.email,
							items: [item]
						};
						_data.create('carts', cartObj.email, cartObj, function(error){
							if(!error) {
								callback(200);
							} else {
								 callback(500, {Error: 'Could not create new cart'});
							}
						});
					}
				});
			} else {
				callback(402, {Error: 'You are not logged in.'})
			}
		});
	} else {
		// Dish/token is mising from payload
		callback(400, {Error: 'required data is missing from the request.'});		
	}
}

// Get function for cart
handlers._cart.get = function(data, callback){
	// Validate email
	const email = isValidData(data.queryStrObj.email, 'string', 0);
	const token = data.headers.token;
	if(email && token) {
		_data.read('tokens', token, function(error, tokenData){
			if(!error && tokenData) {
				_data.read('carts', email, function(error, data){
					if(!error && data) {
						data = JSON.parse(data);
						callback(200, data);
					} else {
						callback(404);
					}
				});
			} else {
				callback(400, {error: 'You are not logged in.'});
			}
		});
	} else {
		callback(404, {error: 'missing required data'});
	}
}

// Put function for cart, mainly used to removed an item from cart
/*
 * You can add item into the cart via POST method, so the only other requirement is 
 * is to be able to remove an item from the cart, updating an item doesn't make sense
 * in this context.
 */
handlers._cart.put = function(data, callback){
	// Validate the incoming data
	const token = isValidData(data.headers.token, 'string', 0);
	const item = isValidData(data.payload.item, 'string', 0);
	const email = isValidData(data.payload.email, 'string', 0);

	if(email && item && token) {
		// If valid email and item then check to see if user is logged in
		_data.read('tokens', token, function(error, tokenData){
			console.log('tokendata', token);
			if(!error && tokenData) {
				_data.read('carts', email, function(error, cartData){
					if(!error && cartData) {
						cartData = helpers.parseJsonToObject(cartData);
						_data.delete('carts', email, function(error){
							if(!error) {
								cartData.items = cartData.items.filter(ele => ele !== item);
								_data.create('carts', email, cartData, function(error){
									if(!error) {
										callback(200);
									} else {
										callback(500, {Error: 'Could not update the cart.'});
									}
								});
							} else {
								callback(500, {Error: 'Could not delete cart before update.'});
							}
						});
					} else {
						callback(404, {Error: 'No cart found.'});
					} 
				});
			} else {
				callback(400, {error: 'You are not logged in.'});
			}
		});
	} else {
		callback(400, {Error: 'required field missing.'});
	}
}

// Delete function for cart, once the order is placed, we need to remote the cart
handlers._cart.delete = function(data, callback){
	// Validate incoming data
	const email = isValidData(data.queryStrObj.email, 'string', 0);
	const token = data.headers.token;

	if(email && token) {
		_data.read('tokens', token, function(error, tokenData){
			if(!error && tokenData) {
				_data.read('carts', email, function(error, data){
					if(!error && data) {
						_data.delete('carts', email, function(error){
							if(!error) {
								callback(200);
							} else {
								callback(500, {Error: 'Could not delete the cart.'})
							}
						});
					} else {
						callback(404);
					}
				});
			} else {
				callback(400, {error: 'You are not logged in'});
			}
		});
	} else {
		callback(400, {error: 'missing required data'});
	}	
}



module.exports = handlers