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
	let firstName = isValidData(data.payload.firstName, 'string', 0);
	let lastName = isValidData(data.payload.lastName, 'string', 0);
	let email = isValidData(data.payload.email, 'string', 0);
	let password = isValidData(data.payload.password, 'string', 0);
	let address = isValidData(data.payload.address, 'string', 10);
	
	// If all fields were valid
	if(firstName, lastName, email, password, address) {
		// Test if user already exist
		_data.read('users', email, function(error, data){
			if(error) {
				// Get the password hashed
				let hashedPassword = helpers.hash(password);

				if(hashedPassword) {
					// Get all the data into a users object
					let userOjb = {
						firstName,
						lastName, 
						email,
						hashedPassword,
						address
					};

					// Create the users 
					_data.create('users', email, userOjb, function(error){
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
		callback(405, {error: 'required fields are missing'});
	}
	
}

// Function for handling GET requests for users
handlers._users.get = function(data, callback) {
	let email = isValidData(data.queryStrObj.email, 'string', 0);
	if(email) {
		_data.read('users', email, function(error, data){
			if(!error && data) {
				data = JSON.parse(data);
				delete data.hashedPassword;
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
	let email = isValidData(data.payload.email, 'string', 0);

	// Test if non-mandatory fields were sent
	let firstName = isValidData(data.payload.firstName, 'string', 0);
	let lastName = isValidData(data.payload.lastName, 'string', 0);
	let password = isValidData(data.payload.password, 'string', 0);
	let address = isValidData(data.payload.address, 'string', 0);

	if(email) {
		if(firstName || lastName || password || address) {
			_data.read('users', email, function(error, userData) {
				userData = helpers.parseJsonToObject(userData);
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
	let email = isValidData(data.queryStrObj.email, 'string', 0);
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

// Token Hanlder code 

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

	let email = isValidData(data.payload.email, 'string', 0);
	let password = isValidData(data.payload.password, 'string', 0);
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
	let id = isValidData(data.queryStrObj.id, 'string', 0);
	if(id) {
		_data.read('tokens', id, function(error, data){
			if(!error && data) {
				data = JSON.parse(data);
				callback(200, data);
			} else {
				callback(404, error);
			}
		});
	} else {
		callback(404, {error: 'missing required data'});
	}
}

// Function for handling put requests for token

handlers._token.put = function(data, callback){
	let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
	let id = isValidData(data.payload.id, 'string', 0);
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
	let id = isValidData(data.payload.id, 'string', 0);
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
		callback(400, {error: 'missing required data'});
	}
}

module.exports = handlers