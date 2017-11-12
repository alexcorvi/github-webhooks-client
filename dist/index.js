"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Https = require("https");
const Url = require("url");
const QueryString = require("querystring");
const events_1 = require("events");
const Util = require("util");
const Crypto = require("crypto");
class GitHubWebHooksClient extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.port = 3420;
        this.host = '0.0.0.0';
        this.secret = '';
        this.path = '/github/callback';
        this.wildcard = false;
        this.trustProxy = false;
        this.enableHealthcheck = false;
        this.healthcheckCode = 204;
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
        }
        else {
            this.server = Http.createServer(this._serverHandler.bind(this));
        }
        events_1.EventEmitter.call(this);
        this._start();
    }
    onCommitComment(callback) {
        this.on('commit_comment', (repo, ref, data) => callback(data));
    }
    onCreate(callback) {
        this.on('create', (repo, ref, data) => callback(data));
    }
    onDelete(callback) {
        this.on('delete', (repo, ref, data) => callback(data));
    }
    onDeployment(callback) {
        this.on('deployment', (repo, ref, data) => callback(data));
    }
    onDeploymentStatus(callback) {
        this.on('deployment_status', (repo, ref, data) => callback(data));
    }
    onFork(callback) {
        this.on('fork', (repo, ref, data) => callback(data));
    }
    onGollum(callback) {
        this.on('gollum', (repo, ref, data) => callback(data));
    }
    onInstallation(callback) {
        this.on('installation', (repo, ref, data) => callback(data));
    }
    onInstallationRepository(callback) {
        this.on('installation_repositories', (repo, ref, data) => callback(data));
    }
    onIssueComment(callback) {
        this.on('issue_comment', (repo, ref, data) => callback(data));
    }
    onIssue(callback) {
        this.on('issue', (repo, ref, data) => callback(data));
    }
    onLabel(callback) {
        this.on('label', (repo, ref, data) => callback(data));
    }
    onMembership(callback) {
        this.on('membership', (repo, ref, data) => callback(data));
    }
    onMilestone(callback) {
        this.on('milestone', (repo, ref, data) => callback(data));
    }
    onOrganization(callback) {
        this.on('organization', (repo, ref, data) => callback(data));
    }
    onOrganizationBlock(callback) {
        this.on('org_block', (repo, ref, data) => callback(data));
    }
    onPageBuild(callback) {
        this.on('page_build', (repo, ref, data) => callback(data));
    }
    onPullRequest(callback) {
        this.on('pull_request', (repo, ref, data) => callback(data));
    }
    onPullRequestReview(callback) {
        this.on('pull_request_review', (repo, ref, data) => callback(data));
    }
    onPullRequestReviewComment(callback) {
        this.on('pull_request_review_comment', (repo, ref, data) => callback(data));
    }
    onPush(callback) {
        this.on('push', (repo, ref, data) => callback(data));
    }
    onRelease(callback) {
        this.on('release', (repo, ref, data) => callback(data));
    }
    onRepository(callback) {
        this.on('repository', (repo, ref, data) => callback(data));
    }
    onStatus(callback) {
        this.on('status', (repo, ref, data) => callback(data));
    }
    onWatch(callback) {
        this.on('watch', (repo, ref, data) => callback(data));
    }
    _start(callback) {
        this.server.listen(this.port, this.host, () => {
            console.log(Util.format('listening for hook events on %s:%d', this.host, this.port));
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
    _checkUrl(url) {
        if (url.pathname === this.path) {
            return true;
        }
        if (this.wildcard && url.pathname.indexOf(this.path + '/') === 0) {
            return true;
        }
        return false;
    }
    _getSecret(req, next) {
        if (typeof this.secret === 'function') {
            return this.secret(req, next);
        }
        return next(null, this.secret);
    }
    _serverHandler(req, res) {
        var url = Url.parse(req.url, true);
        var buffer = [];
        var bufferLength = 0;
        var failed = false;
        var isForm = false;
        var remoteAddress;
        if (this.trustProxy !== false) {
            remoteAddress = req.headers['x-forwarded-for'];
        }
        remoteAddress = remoteAddress || req.ip || req.socket.remoteAddress || req.socket.socket.remoteAddress;
        req.on('data', (chunk) => {
            if (failed) {
                return;
            }
            buffer.push(chunk);
            bufferLength += chunk.length;
        });
        req.on('end', (chunk) => {
            if (failed) {
                return;
            }
            var data;
            if (chunk) {
                buffer.push(chunk);
                bufferLength += chunk.length;
            }
            console.log(Util.format('received %d bytes from %s', bufferLength, remoteAddress));
            var event = req.headers['x-github-event'] ||
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
            }
            else {
                //this is already a string when sent as JSON
                data = Buffer.concat(buffer, bufferLength);
            }
            this._getSecret(req, (err, secret) => {
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
                    }
                    else {
                        console.log(Util.format('got %s event on %s from %s', event, repo, remoteAddress));
                    }
                    this.emit('*', event, repo, ref, data);
                    this.emit(repo, event, ref, data);
                    this.emit(repo + ':' + ref, event, data);
                    this.emit(event, repo, ref, data);
                    this.emit(event + ':' + repo, ref, data);
                    this.emit(event + ':' + repo + ':' + ref, data);
                }
                else {
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
        if (!this._checkUrl(url)) {
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
        if (!req.headers.hasOwnProperty('x-github-event') &&
            !req.headers.hasOwnProperty('x-gitlab-event') &&
            !req.headers.hasOwnProperty('x-gogs-event') &&
            !req.headers.hasOwnProperty('x-event-key')) {
            console.error(Util.format('missing x-github-event, x-gitlab-event, x-gogs-event, or x-event-key header from %s, returning 400', remoteAddress));
            failed = true;
            return reply(400, res);
        }
    }
}
exports.GitHubWebHooksClient = GitHubWebHooksClient;
function reply(statusCode, res) {
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
function parse(data) {
    let result;
    try {
        result = JSON.parse(data);
    }
    catch (e) {
        result = false;
    }
    return result;
}
exports.default = GitHubWebHooksClient;
