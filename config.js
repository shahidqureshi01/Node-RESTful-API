let environments = {};

// Define staging environment 
environments.staging = {
	port: 5000,
	envName: 'staging'
}

// Define production environment
environments.production = {
	port: 3000,
	envName: 'production'
}

// Get the command line argument
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';

// Check if the argument is correct
let envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// export the environment object
module.exports = envToExport;
