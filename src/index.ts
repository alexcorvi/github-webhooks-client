import * as Http from 'http';
import * as Https from 'https';
import * as Url from 'url';
import * as QueryString from 'querystring';
import { EventEmitter } from 'events';
import * as Util from 'util';
import * as Crypto from 'crypto';
import { Request } from '_debugger';
import { Configurations } from './interfaces/configuration';
import * as payloads from './interfaces/payloads';

class GitHubWebHooksClient extends EventEmitter {
	port = 3420;
	host = '0.0.0.0';
	secret = '';
	path = '/github/callback';
	wildcard = false;
	trustProxy = false;
	enableHealthcheck = false;
	healthcheckCode = 204;
	server: Https.Server | Http.Server;

	constructor(options: Configurations) {
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
			this.server = Https.createServer(options.https, this._serverHandler.bind(this));
		} else {
			this.server = Http.createServer(this._serverHandler.bind(this));
		}
		EventEmitter.call(this);
		this._start();
	}

	onCommitComment(callback: (payload: payloads.ICommitComment) => void) {
		this.on('commit_comment', (repo: string, ref: string, data: payloads.ICommitComment) => callback(data));
	}

	onCreate(callback: (payload: payloads.ICreate) => void) {
		this.on('create', (repo: string, ref: string, data: payloads.ICreate) => callback(data));
	}

	onDelete(callback: (payload: payloads.IDelete) => void) {
		this.on('delete', (repo: string, ref: string, data: payloads.IDelete) => callback(data));
	}

	onDeployment(callback: (payload: payloads.IDeployment) => void) {
		this.on('deployment', (repo: string, ref: string, data: payloads.IDeployment) => callback(data));
	}

	onDeploymentStatus(callback: (payload: payloads.IDeployment_Status) => void) {
		this.on('deployment_status', (repo: string, ref: string, data: payloads.IDeployment_Status) => callback(data));
	}

	onFork(callback: (payload: payloads.IForK) => void) {
		this.on('fork', (repo: string, ref: string, data: payloads.IForK) => callback(data));
	}

	onGollum(callback: (payload: payloads.IGollum) => void) {
		this.on('gollum', (repo: string, ref: string, data: payloads.IGollum) => callback(data));
	}

	onInstallation(callback: (payload: payloads.IInstallation) => void) {
		this.on('installation', (repo: string, ref: string, data: payloads.IInstallation) => callback(data));
	}

	onInstallationRepository(callback: (payload: payloads.IInstallationRepository) => void) {
		this.on('installation_repositories', (repo: string, ref: string, data: payloads.IInstallationRepository) =>
			callback(data)
		);
	}

	onIssueComment(callback: (payload: payloads.IIssueComment) => void) {
		this.on('issue_comment', (repo: string, ref: string, data: payloads.IIssueComment) => callback(data));
	}

	onIssue(callback: (payload: payloads.IIssue) => void) {
		this.on('issue', (repo: string, ref: string, data: payloads.IIssue) => callback(data));
	}

	onLabel(callback: (payload: payloads.ILabel) => void) {
		this.on('label', (repo: string, ref: string, data: payloads.ILabel) => callback(data));
	}

	onMembership(callback: (payload: payloads.IMembership) => void) {
		this.on('membership', (repo: string, ref: string, data: payloads.IMembership) => callback(data));
	}

	onMilestone(callback: (payload: payloads.IMilestone) => void) {
		this.on('milestone', (repo: string, ref: string, data: payloads.IMilestone) => callback(data));
	}

	onOrganization(callback: (payload: payloads.IOrganization) => void) {
		this.on('organization', (repo: string, ref: string, data: payloads.IOrganization) => callback(data));
	}

	onOrganizationBlock(callback: (payload: payloads.IOrgBlock) => void) {
		this.on('org_block', (repo: string, ref: string, data: payloads.IOrgBlock) => callback(data));
	}

	onPageBuild(callback: (payload: payloads.IPageBuild) => void) {
		this.on('page_build', (repo: string, ref: string, data: payloads.IPageBuild) => callback(data));
	}

	onPullRequest(callback: (payload: payloads.IPullRequest) => void) {
		this.on('pull_request', (repo: string, ref: string, data: payloads.IPullRequest) => callback(data));
	}

	onPullRequestReview(callback: (payload: payloads.IPullRequestReview) => void) {
		this.on('pull_request_review', (repo: string, ref: string, data: payloads.IPullRequestReview) =>
			callback(data)
		);
	}

	onPullRequestReviewComment(callback: (payload: payloads.IPullRequestReviewComment) => void) {
		this.on('pull_request_review_comment', (repo: string, ref: string, data: payloads.IPullRequestReviewComment) =>
			callback(data)
		);
	}

	onPush(callback: (payload: payloads.IPush) => void) {
		this.on('push', (repo: string, ref: string, data: payloads.IPush) => callback(data));
	}

	onRelease(callback: (payload: payloads.IRelease) => void) {
		this.on('release', (repo: string, ref: string, data: payloads.IRelease) => callback(data));
	}

	onRepository(callback: (payload: payloads.IRepository) => void) {
		this.on('repository', (repo: string, ref: string, data: payloads.IRepository) => callback(data));
	}

	onStatus(callback: (payload: payloads.IStatus) => void) {
		this.on('status', (repo: string, ref: string, data: payloads.IStatus) => callback(data));
	}

	onWatch(callback: (payload: payloads.IWatch) => void) {
		this.on('watch', (repo: string, ref: string, data: payloads.IWatch) => callback(data));
	}

	_start(callback?: () => void) {
		this.server.listen(this.port, this.host, () => {
			console.log(Util.format('listening for hook events on %s:%d', this.host, this.port));
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	_checkUrl(url: { pathname: string; wildcard: string }) {
		if (url.pathname === this.path) {
			return true;
		}
		if (this.wildcard && url.pathname.indexOf(this.path + '/') === 0) {
			return true;
		}
		return false;
	}

	_getSecret(req: Http.Server, next: any) {
		if (typeof this.secret === 'function') {
			return this.secret(req, next);
		}
		return next(null, this.secret);
	}

	_serverHandler(req: any, res: any) {
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

		req.on('data', (chunk: any) => {
			if (failed) {
				return;
			}

			buffer.push(chunk);
			bufferLength += chunk.length;
		});

		req.on('end', (chunk: any) => {
			if (failed) {
				return;
			}

			var data: any;

			if (chunk) {
				buffer.push(chunk);
				bufferLength += chunk.length;
			}

			console.log(Util.format('received %d bytes from %s', bufferLength, remoteAddress));
			var event =
				req.headers['x-github-event'] ||
				req.headers['x-gogs-event'] ||
				req.headers['x-event-key'] ||
				(req.headers['x-gitlab-event'] ? req.headers['x-gitlab-event'].split(' ')[0].toLowerCase() : 'unknown');
			if (event === 'ping') {
				this.emit(event, null, null, data);
				return reply(200, res);
			}

			if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
				isForm = true;
				data = Buffer.concat(buffer, bufferLength).toString();
			} else {
				//this is already a string when sent as JSON
				data = Buffer.concat(buffer, bufferLength);
			}

			this._getSecret(req, (err: any, secret: any) => {
				if (err) {
					console.error(Util.format('error getting secret for %s, returning 403', res.url));
					console.error(err.stack);
					return reply(403, res);
				}

				if (secret) {
					var signature = req.headers['x-hub-signature'];

					if (!signature) {
						console.error('secret configured, but missing signature, returning 403');
						return reply(403, res);
					}

					signature = signature.replace(/^sha1=/, '');
					var digest = Crypto.createHmac('sha1', secret).update(data).digest('hex');

					if (signature !== digest) {
						console.error('got invalid signature, returning 403');
						return reply(403, res);
					}
				}

				if (isForm) {
					data = QueryString.parse(data).payload;
				}
				data = parse(data);

				// invalid json
				if (!data) {
					console.error(Util.format('received invalid data from %s, returning 400', remoteAddress));
					return reply(400, res);
				}

				data.request = req;

				// handle GitLab system hook
				if (event !== 'system') {
					// invalid json
					if (!data.repository || !data.repository.name) {
						console.error(Util.format('received incomplete data from %s, returning 400', remoteAddress));
						return reply(400, res);
					}

					var repo = data.repository.name;
					var ref = data.ref;

					// and now we emit a bunch of data
					if (ref) {
						console.log(Util.format('got %s event on %s:%s from %s', event, repo, ref, remoteAddress));
					} else {
						console.log(Util.format('got %s event on %s from %s', event, repo, remoteAddress));
					}
					this.emit('*', event, repo, ref, data);
					this.emit(repo, event, ref, data);
					this.emit(repo + ':' + ref, event, data);
					this.emit(event, repo, ref, data);
					this.emit(event + ':' + repo, ref, data);
					this.emit(event + ':' + repo + ':' + ref, data);
				} else {
					var type = data.event_name;

					// invalid json
					if (!type) {
						console.error(Util.format('received incomplete data from %s, returning 400', remoteAddress));
						return reply(400, res);
					}

					console.log(Util.format('got %s event of type %s from %s', event, type, remoteAddress));

					// and now we emit a bunch of data
					this.emit('*', event, type, data);
					this.emit(type, event, data);
				}

				reply(200, res);
			});
		});

		console.log(Util.format(req.method, req.url, remoteAddress));

		// 404 if the path is wrong
		if (!this._checkUrl(url as any)) {
			console.error(Util.format('got invalid path from %s, returning 404', remoteAddress));
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
			console.error(Util.format('got invalid method from %s, returning 405', remoteAddress));
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
			console.error(
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

export { GitHubWebHooksClient };
export default GitHubWebHooksClient;
