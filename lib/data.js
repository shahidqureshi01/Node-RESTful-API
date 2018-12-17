/*
 * Name: data.js
 * Description: This file implements CRUD operations
 * Author: Shahid
 *
 */

 // Dependencies

let fs = require('fs');
let path = require('path');

let lib = {};

// Save base directory as variable 
lib.base = path.join(__dirname, '/../.data/');

// Function for creating users
lib.create = function(dir, fileName, data, callback) {
 	// Open the file if write mod
 	fs.open(lib.base  + dir + '/' + fileName + '.json','wx', function(error, fileDescriptor) {
 		if(!error && fileDescriptor){
 			// Convert the data into string
 			stringData = JSON.stringify(data);

 			// Write to the file and close it
 			fs.write(fileDescriptor, stringData, function(error) {
 				if(!error) {
 					fs.close(fileDescriptor, function(error) {
 						if(!error) {
 							callback(false);
 						} else {
 							callback('Could not close the file');
 						}
 					});
 				} else {
 					callback('Could not write to file');
 				}
 			});
 		} else {
 			callback('Could not open the file, it may already exist');
 		}
 	});
}

// Function for reading users' data
lib.read = function(dir, fileName, callback) {
	fs.readFile(lib.base + dir + '/' + fileName + '.json', 'utf8', function(error, data) {
		callback(error, data);
	});
}

// Function to update file
lib.update = function(dir, fileName, data, callback) {
	// Open the file for update, throw an error if it doesn't exit
	fs.open(lib.base + dir + '/' + fileName + '.json', 'r+', function(error, fileDescriptor) {
		if(!error && fileDescriptor) {
			// truncate the file if it already has some data
			fs.ftruncate(fileDescriptor, function(error){
				if(!error) {
					let stringData = JSON.stringify(data);
					fs.writeFile(lib.base + dir + '/' + fileName + '.json', stringData, function(error) {
						if(!error) {
							fs.close(fileDescriptor, function(error) {
								if(!error) {
									callback(false);
								} else {
									callback('Could not close the file');
								}
							});
						} else {
							callback('could not write to the file');
						}

					});

				} else {
					callback('could not truncate the file');
				}
			});
		} else {
			callback('Could not open the file');
		}
	});
}

//{ Function to delete users
lib.delete = function(dir, fileName, callback) {
	fs.unlink(lib.base + dir + '/' + fileName + '.json', function(error){
		if(!error) {
			callback(false);
		} else {
			callback('Could not delete the file');
		}
	});
}


 module.exports = lib;