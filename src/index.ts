import * as Http from 'http';
import * as Https from 'https';
import * as Url from 'url';
import * as QueryString from 'querystring';
import { EventEmitter } from 'events';
import * as Util from 'util';
import * as Crypto from 'crypto';
import { Request } from '_debugger';

class Test extends EventEmitter {
	port = 3420;
	host = '0.0.0.0';
	secret = '';
	logger = console;
	path = '/github/callback';
	wildcard = false;
	trustProxy = false;
	enableHealthcheck = false;
	healthcheckCode = 204;
	server: Https.Server | Http.Server;

	constructor(options: any) {
		super();
		if (options.port) {
			options.port = options.port;
		}
		if (options.host) {
			options.host = options.host;
		}
		if (options.secret) {
			options.secret = options.secret;
		}
		if (options.logger) {
			options.logger = options.logger;
		}
		if (options.path) {
			options.path = options.path;
		}
		if (options.wildcard) {
			options.wildcard = options.wildcard;
		}
		if (options.trustProxy) {
			options.trustProxy = options.trustProxy;
		}
		if (options.enableHealthcheck) {
			options.enableHealthcheck = options.enableHealthcheck;
		}
		if (options.healthcheckCode) {
			options.healthcheckCode = options.healthcheckCode;
		}
		if (options.https) {
			this.server = Https.createServer(options.https, this.serverHandler);
		} else {
			this.server = Http.createServer(this.serverHandler);
		}
		EventEmitter.call(this);
	}

	onRelease(callback: () => void) {
		this.on('release', function() {
			callback();
		});
	}

	start(callback?: () => void) {
		this.server.listen(this.port, this.host, () => {
			this.logger.log(Util.format('listening for hook events on %s:%d', this.host, this.port));
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	checkUrl(url: { pathname: string; wildcard: string }) {
		if (url.pathname === this.path) {
			return true;
		}
		if (this.wildcard && url.pathname.indexOf(this.path + '/') === 0) {
			return true;
		}
		return false;
	}

	stop(callback?: () => void) {
		this.server.close(() => {
			this.logger.log('stopped listening for github events');
			this.server = Http.createServer(this.serverHandler.bind(this));
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	getSecret(req: Http.Server, next: any) {
		if (typeof this.secret === 'function') {
			return this.secret(req, next);
		}
		return next(null, this.secret);
	}

	serverHandler(req: any, res: any) {
		var self = this;
		var url = Url.parse(req.url, true);
		var buffer: any = [];
		var bufferLength = 0;
		var failed = false;
		var isForm = false;
		var remoteAddress: any;
		if (this.trustProxy !== false) {
			remoteAddress = req.headers['x-forwarded-for'];
		}
		remoteAddress = remoteAddress || req.ip || req.socket.remoteAddress || req.socket.socket.remoteAddress;

		req.on('data', function(chunk: any) {
			if (failed) {
				return;
			}

			buffer.push(chunk);
			bufferLength += chunk.length;
		});

		req.on('end', function(chunk: any) {
			if (failed) {
				return;
			}

			var data: any;

			if (chunk) {
				buffer.push(chunk);
				bufferLength += chunk.length;
			}

			self.logger.log(Util.format('received %d bytes from %s', bufferLength, remoteAddress));
			var event =
				req.headers['x-github-event'] ||
				req.headers['x-gogs-event'] ||
				req.headers['x-event-key'] ||
				(req.headers['x-gitlab-event'] ? req.headers['x-gitlab-event'].split(' ')[0].toLowerCase() : 'unknown');
			if (event === 'ping') {
				self.emit(event, null, null, data);
				return reply(200, res);
			}

			if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
				isForm = true;
				data = Buffer.concat(buffer, bufferLength).toString();
			} else {
				//this is already a string when sent as JSON
				data = Buffer.concat(buffer, bufferLength);
			}

			self.getSecret(req, function(err: any, secret: any) {
				if (err) {
					self.logger.error(Util.format('error getting secret for %s, returning 403', res.url));
					self.logger.error(err.stack);
					return reply(403, res);
				}

				if (secret) {
					var signature = req.headers['x-hub-signature'];

					if (!signature) {
						self.logger.error('secret configured, but missing signature, returning 403');
						return reply(403, res);
					}

					signature = signature.replace(/^sha1=/, '');
					var digest = Crypto.createHmac('sha1', secret).update(data).digest('hex');

					if (signature !== digest) {
						self.logger.error('got invalid signature, returning 403');
						return reply(403, res);
					}
				}

				if (isForm) {
					data = QueryString.parse(data).payload;
				}
				data = parse(data);

				// invalid json
				if (!data) {
					self.logger.error(Util.format('received invalid data from %s, returning 400', remoteAddress));
					return reply(400, res);
				}

				data.request = req;

				// handle GitLab system hook
				if (event !== 'system') {
					// invalid json
					if (!data.repository || !data.repository.name) {
						self.logger.error(
							Util.format('received incomplete data from %s, returning 400', remoteAddress)
						);
						return reply(400, res);
					}

					var repo = data.repository.name;
					var ref = data.ref;

					// and now we emit a bunch of data
					if (ref) {
						self.logger.log(Util.format('got %s event on %s:%s from %s', event, repo, ref, remoteAddress));
					} else {
						self.logger.log(Util.format('got %s event on %s from %s', event, repo, remoteAddress));
					}
					self.emit('*', event, repo, ref, data);
					self.emit(repo, event, ref, data);
					self.emit(repo + ':' + ref, event, data);
					self.emit(event, repo, ref, data);
					self.emit(event + ':' + repo, ref, data);
					self.emit(event + ':' + repo + ':' + ref, data);
				} else {
					var type = data.event_name;

					// invalid json
					if (!type) {
						self.logger.error(
							Util.format('received incomplete data from %s, returning 400', remoteAddress)
						);
						return reply(400, res);
					}

					self.logger.log(Util.format('got %s event of type %s from %s', event, type, remoteAddress));

					// and now we emit a bunch of data
					self.emit('*', event, type, data);
					self.emit(type, event, data);
				}

				reply(200, res);
			});
		});

		self.logger.log(Util.format(req.method, req.url, remoteAddress));

		// 404 if the path is wrong
		if (!self.checkUrl(url as any)) {
			self.logger.error(Util.format('got invalid path from %s, returning 404', remoteAddress));
			failed = true;
			return reply(404, res);
		}

		// 204 if healthchecks are enabled and it's a GET
		// note that we flag the request as failed only to
		// stop processing any further incoming request data
		if (req.method === 'GET' && this.enableHealthcheck) {
			failed = true;
			return reply(this.healthcheckCode, res);
		}

		// 405 if the method is wrong
		if (req.method !== 'POST') {
			self.logger.error(Util.format('got invalid method from %s, returning 405', remoteAddress));
			failed = true;
			return reply(405, res);
		}

		// 400 if it's not a github, gitlab, or bitbucket event
		if (
			!req.headers.hasOwnProperty('x-github-event') &&
			!req.headers.hasOwnProperty('x-gitlab-event') &&
			!req.headers.hasOwnProperty('x-gogs-event') &&
			!req.headers.hasOwnProperty('x-event-key')
		) {
			self.logger.error(
				Util.format(
					'missing x-github-event, x-gitlab-event, x-gogs-event, or x-event-key header from %s, returning 400',
					remoteAddress
				)
			);
			failed = true;
			return reply(400, res);
		}
	}
}

function reply(statusCode: number, res: Http.ServerResponse) {
	const message = JSON.stringify({
		message: (Http.STATUS_CODES[statusCode] || '').toLowerCase(),
		result: statusCode >= 400 ? 'error' : 'ok'
	});

	const headers = {
		'Content-Type': 'application/json',
		'Content-Length': message.length
	};

	res.writeHead(statusCode, headers);
	res.end(message);
}

function parse(data: any): any {
	let result;
	try {
		result = JSON.parse(data);
	} catch (e) {
		result = false;
	}
	return result;
}

new Test({}).onRelease(() => {
	console.log('released');
});
