Github Webhooks Receiver
================

This is a client library for listening to GitHub Webhooks and execute a callback on them.


> Note: This client library based on the excellent [Node Github Hook](https://github.com/nlf/node-github-hook) library.

To Install:
-----------
```
npm install github-webhooks-listener
```

To Use:
-------

```typescript

import GHClient from "github-webhooks-listener";

const github = new GHClient({
  /* options: see below */
});

github.onPush((data) => {
  console.log(data.commits.map(x => x.author)); // prints the authors of the commits
});
```

## Methods and evens

The library has the following methods and supports their respective events:

Method | Event | GitHub Reference
--- | --- | ---
`listener.onCommitComment(cb)` | `commit_comment` | [Reference](https://developer.github.com/v3/activity/events/types/#commitcommentevent)
`listener.onCreate(cb)` | `create` | [Reference](https://developer.github.com/v3/activity/events/types/#createevent)
`listener.onDelete(cb)` | `delete` | [Reference](https://developer.github.com/v3/activity/events/types/#deleteevent)
`listener.onDeployment(cb)` | `deployment` | [Reference](https://developer.github.com/v3/activity/events/types/#deploymentevent)
`listener.onDeploymentStatus(cb)` | `deployment_status` | [Reference](https://developer.github.com/v3/activity/events/types/#deploymentstatusevent)
`listener.onFork(cb)` | `fork` | [Reference](https://developer.github.com/v3/activity/events/types/#forkevent)
`listener.onGollum(cb)` | `gollum` | [Reference](https://developer.github.com/v3/activity/events/types/#gollumevent)
`listener.onInstallation(cb)` | `installation` | [Reference](https://developer.github.com/v3/activity/events/types/#installationevent)
`listener.onInstallationRepository(cb)` | `installation_repository` | [Reference](https://developer.github.com/v3/activity/events/types/#installationrepositoryevent)
`listener.onIssueComment(cb)` | `issue_comment` | [Reference](https://developer.github.com/v3/activity/events/types/#issuecommentevent)
`listener.onIssue(cb)` | `issue` | [Reference](https://developer.github.com/v3/activity/events/types/#issueevent)
`listener.onLabel(cb)` | `label` | [Reference](https://developer.github.com/v3/activity/events/types/#labelevent)
`listener.onMembership(cb)` | `membership` | [Reference](https://developer.github.com/v3/activity/events/types/#membershipevent)
`listener.onMilestone(cb)` | `milestone` | [Reference](https://developer.github.com/v3/activity/events/types/#milestoneevent)
`listener.onOrganization(cb)` | `organization` | [Reference](https://developer.github.com/v3/activity/events/types/#organizationevent)
`listener.onOrganizationBlock(cb)` | `organizationBlock` | [Reference](https://developer.github.com/v3/activity/events/types/#organizationblockevent)
`listener.onPageBuild(cb)` | `page_build` | [Reference](https://developer.github.com/v3/activity/events/types/#pagebuildevent)
`listener.onPullRequest(cb)` | `pull_request` | [Reference](https://developer.github.com/v3/activity/events/types/#pullrequestevent)
`listener.onPullRequestReview(cb)` | `pull_request_review` | [Reference](https://developer.github.com/v3/activity/events/types/#pullrequestreviewevent)
`listener.onPullRequestReviewComment(cb)` | `pull_request_review_comment` | [Reference](https://developer.github.com/v3/activity/events/types/#pullrequestreviewcommentevent)
`listener.onPush(cb)` | `push` | [Reference](https://developer.github.com/v3/activity/events/types/#pushevent)
`listener.onRelease(cb)` | `release` | [Reference](https://developer.github.com/v3/activity/events/types/#releaseevent)
`listener.onRepository(cb)` | `repository` | [Reference](https://developer.github.com/v3/activity/events/types/#repositoryevent)
`listener.onStatus(cb)` | `status` | [Reference](https://developer.github.com/v3/activity/events/types/#statusevent)
`listener.onWatch(cb)` | `watch` | [Reference](https://developer.github.com/v3/activity/events/types/#watchevent)

## Options

Available options are:

* **host**: the host to listen on, defaults to '0.0.0.0'
* **port**: the port to listen on, defaults to 3420
* **path**: the path for the GitHub callback, defaults to '/github/callback'
* **wildcard**: if true, the path for the GitHub callback will be considered valid as long as it *starts* with the configured path
* **secret**: if specified, you must use the same secret in your webhook configuration in GitHub. if a secret is specified, but one is not configured in GitHub, the hook will fail. if a secret is *not* specified, but one *is* configured in GitHub, the signature will not be validated and will be assumed to be correct. consider yourself warned. this option can also be a function that takes the following parameters: (request, data, callback). callback is error first and should be passed (err, secret)
* **logger**: an optional instance of a logger that supports the "log" and "error" methods and one parameter for data (like console), default is `console`.
* **https**: Options to pass to nodejs https server. If specified, you must follow documentation about nodejs https library (See options in https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)
* **trustProxy**: By default the `x-forwarded-for` header is trusted when determining the remoteAddress to log for a request. Set this to `false` to disable this behavior
* **enableHealthcheck**: Respond to GET requests with a 204 response for healthcheck purposes
* **healthcheckCode**: Override the 204 status code for healthchecks (for systems that aren't friendly with HTTP spec compliance and want a 200, for example)

```typescript
new GHClient({
	enableHealthcheck: false,
	healthcheckCode: 200,
	host: '0.0.0.0',
	https: {
		ciphers: 'something'
	},
	path: 'listen',
	port: 3000,
	secret: 'mysecretkey',
	trustProxy: true,
	wildcard: true
});
```


License
=======

MIT
