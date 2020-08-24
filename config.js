const env = process.env.NODE_ENV || 'production'

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
	development :{
		APIKey : 'P9xBzrKFSTmhu_Ca0EfP0w',
		APISecret : 'Cli2AZfRrj8z7YCBnUlq3HzOhdtq0UQ7APgE'
	},
	production:{	
		APIKey : 'P9xBzrKFSTmhu_Ca0EfP0w',
		APISecret : 'Cli2AZfRrj8z7YCBnUlq3HzOhdtq0UQ7APgE'
	}
};

module.exports = config[env]
