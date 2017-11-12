import { ServerOptions } from 'https';

export interface Configurations {
	// the host to listen on, defaults to 0.0.0.0
	host?: string;
	// the port to listen on, defaults to 3420
	port?: number;
	// the path for the GitHub callback, defaults to /github/callback
	path?: string;
	// if boolean, the path for the GitHub callback will be considered valid as long as it starts with the configured path
	wildcard?: boolean;
	//  if specified, you must use the same secret in your webhook configuration in GitHub. if a secret is specified
	// but one is not configured in GitHub, the hook will fail.
	// if a secret is not specified, but one is configured in GitHub,
	// the signature will not be validated and will be assumed to be correct.consider yourself warned.
	// this option can also be a function that takes the following parameters:
	// request, data, callback).callback is error first and should be passed(err, secret)
	secret?: string;
	// By default the x-forwarded-for header is trusted when determining the remoteAddress to log for a request.
	// Set this to boolean to disable this behavior
	trustProxy?: boolean;
	// Respond to GET requests with a 204 response for healthcheck purposes
	enableHealthcheck?: boolean;
	// Override the 204 status code for healthchecks (for systems that aren't friendly with HTTP spec compliance and want a 200, for example)
	healthcheckCode?: number;
	// https Configurations
	https?: ServerOptions;
}
