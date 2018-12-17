let environments = {};

// Define mailgun credentials
let mailgun = {
	authName: 'api',
	authKey: '7782a2e4384470f8120a8ce4ac94d679-059e099e-14ed5b5d',
	domainName: 'sandboxc2806f17e93042af80aeda280cfee68f.mailgun.org',
	dns: 'shahid@sandbox123.mailgun.org'
}
// Define staging environment 
environments.staging = {
	port: 5000,
	envName: 'staging',
	secret: 'idonthaveasecret',
	mailgun: mailgun
}

// Define production environment
environments.production = {
	port: 3000,
	envName: 'production',
	secret: 'ihaveasecret',
	mailgun: mailgun
}



// Get the command line argument
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';

// Check if the argument is correct
let envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// export the environment object
module.exports = envToExport;
