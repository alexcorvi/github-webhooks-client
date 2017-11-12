declare namespace githubhook {
	interface User {
		login: string;
		id: number;
		avatar_url: string;
		gravatar_id: string;
		url: string;
		html_url: string;
		followers_url: string;
		following_url: string;
		gists_url: string;
		starred_url: string;
		subscriptions_url: string;
		organizations_url: string;
		repos_url: string;
		events_url: string;
		received_events_url: string;
		type: string;
		site_admin: boolean;
	}

	interface Branch {
		name: string;
		commit: {
			sha: string;
			url: string;
		};
	}

	interface Release {
		url: string;
		assets_url: string;
		upload_url: string;
		html_url: string;
		id: number;
		tag_name: string;
		target_commitish: string;
		name: null | string;
		draft: boolean;
		author: User;
		prerelease: boolean;
		created_at: string;
		published_at: string;
		assets: string[];
		tarball_url: string;
		zipball_url: string;
		body: null | string;
	}

	interface Commit {
		id: string;
		tree_id: string;
		distinct: boolean;
		message: string;
		timestamp: string;
		url: string;
		author: {
			name: string;
			email: string;
			username: string;
		};
		committer: {
			name: string;
			email: string;
			username: string;
		};
		added: string[];
		removed: string[];
		modified: string[];
	}

	interface Comment {
		url: string;
		html_url: string;
		id: number;
		user: User;
		position: number;
		line: number;
		path: number;
		commit_id: string;
		created_at: string;
		updated_at: string;
		body: string;
	}

	interface Repository {
		id: number;
		name: string;
		full_name: string;
		owner: User;
		private: boolean;
		html_url: string;
		description: string;
		fork: boolean;
		url: string;
		forks_url: string;
		keys_url: string;
		collaborators_url: string;
		teams_url: string;
		hooks_url: string;
		issue_events_url: string;
		events_url: string;
		assignees_url: string;
		branches_url: string;
		tags_url: string;
		blobs_url: string;
		git_tags_url: string;
		git_refs_url: string;
		trees_url: string;
		statuses_url: string;
		languages_url: string;
		stargazers_url: string;
		contributors_url: string;
		subscribers_url: string;
		subscription_url: string;
		commits_url: string;
		git_commits_url: string;
		comments_url: string;
		issue_comment_url: string;
		contents_url: string;
		compare_url: string;
		merges_url: string;
		archive_url: string;
		downloads_url: string;
		issues_url: string;
		pulls_url: string;
		milestones_url: string;
		notifications_url: string;
		labels_url: string;
		releases_url: string;
		created_at: string;
		updated_at: string;
		pushed_at: string;
		git_url: string;
		ssh_url: string;
		clone_url: string;
		svn_url: string;
		homepage: string | null;
		size: number;
		stargazers_count: number;
		watchers_count: number;
		language: string | null;
		has_issues: boolean;
		has_downloads: boolean;
		has_wiki: boolean;
		has_pages: boolean;
		forks_count: number;
		mirror_url: string | null;
		open_issues_count: number;
		forks: number;
		open_issues: number;
		watchers: number;
		default_branch: string;
	}

	interface Deployment {
		url: string;
		id: number;
		sha: string;
		ref: string;
		task: string;
		payload: {};
		environment: string;
		description: string | null;
		creator: User;
		created_at: string;
		updated_at: string;
		statuses_url: string;
		repository_url: string;
	}

	interface Installation {
		id: number;
		account: User;
		repository_selection: string;
		access_tokens_url: string;
		repositories_url: string;
	}

	interface Milestone {
		url: string;
		html_url: string;
		labels_url: string;
		id: number;
		number: number;
		title: string;
		description: string | null;
		creator: User;
		open_issues: number;
		closed_issues: number;
		state: 'open' | 'closed';
		created_at: string;
		updated_at: string;
		due_on: string | null;
		closed_at: string | null;
	}

	interface Issue {
		url: string;
		labels_url: string;
		comments_url: string;
		events_url: string;
		html_url: string;
		id: number;
		number: number;
		title: string;
		user: User;
		labels: Label[];
		state: 'open' | 'closed';
		locked: boolean;
		assignee: User | null;
		milestone: Milestone | null;
		comments: number;
		created_at: string;
		updated_at: string;
		closed_at: string | null;
		body: string;
	}

	interface Label {
		url: string;
		name: string;
		color: string;
	}

	interface PullRequest {
		url: string;
		id: number;
		html_url: string;
		diff_url: string;
		patch_url: string;
		issue_url: string;
		number: number;
		state: 'open' | 'closed';
		locked: boolean;
		title: string;
		user: User;
		body: string;
		created_at: string;
		updated_at: string;
		closed_at: null | string;
		merged_at: null | string;
		merge_commit_sha: null | string;
		assignee: null | string;
		milestone: null | string;
		commits_url: string;
		review_comments_url: string;
		review_comment_url: string;
		comments_url: string;
		statuses_url: string;
		head: {
			label: string;
			ref: string;
			sha: string;
			user: User;
			repo: Repository;
		};
		base: {
			label: string;
			ref: string;
			sha: string;
			user: User;
			repo: Repository;
		};
		_links: {
			self: {
				href: string;
			};
			html: {
				href: string;
			};
			issue: {
				href: string;
			};
			comments: {
				href: string;
			};
			review_comments: {
				href: string;
			};
			review_comment: {
				href: string;
			};
			commits: {
				href: string;
			};
			statuses: {
				href: string;
			};
		};
		merged: boolean;
		mergeable: null | boolean;
		mergeable_state: string;
		merged_by: null | string;
		comments: number;
		review_comments: number;
		commits: number;
		additions: number;
		deletions: number;
		changed_files: number;
	}

	interface Organization {
		login: string;
		id: number;
		url: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string;
	}

	interface PayloadGeneric {
		repository: Repository;
		sender: User;
	}

	interface ICommitComment extends PayloadGeneric {
		action: string;
		comment: Comment;
	}

	interface ICreate extends PayloadGeneric {
		ref: string;
		ref_type: string;
		master_branch: string;
		description: string;
		pusher_type: string;
	}

	interface IDelete extends PayloadGeneric {
		ref: string;
		ref_type: string;
		pusher_type: string;
	}

	interface IDeployment extends PayloadGeneric {
		deployment: Deployment;
	}

	interface IDeployment_Status extends PayloadGeneric {
		deployment_status: {
			url: string;
			id: number;
			state: string;
			creator: User;
			description: string | null;
			target_url: string | null;
			created_at: string;
			updated_at: string;
			statuses_url: string;
			repository_url: string;
		};
		deployment: Deployment;
	}

	interface IForK extends PayloadGeneric {
		forkee: Repository;
	}

	interface IGollum extends PayloadGeneric {
		pages: {
			page_name: string;
			title: string;
			summary: string | null;
			action: string;
			sha: string;
			html_url: string;
		}[];
	}

	interface IInstallation extends PayloadGeneric {
		action: string;
		installation: Installation;
		repository: undefined;
		sender: User;
	}

	interface IInstallationRepository {
		action: string;
		installation: Installation;
		repository_selection: string;
		repositories_added: { id: number; name: string; full_name: string }[];
		repositories_removed: { id: number; name: string; full_name: string }[];
		sender: User;
	}

	interface IIssueComment extends PayloadGeneric {
		action: string;
		issue: Issue;
		comment: Comment;
	}

	interface IIssueEvent extends PayloadGeneric {
		action: string;
		issue: Issue;
	}

	interface ILabelEvent extends PayloadGeneric {
		action: string;
		label: Label;
		organization: Organization;
	}

	interface IMemberEvent extends PayloadGeneric {
		action: string;
		member: User;
	}

	interface IMembership extends PayloadGeneric {
		action: string;
		scope: string;
		member: User;
		team: {
			name: string;
			id: number;
			slug: string;
			permission: string;
			url: string;
			members_url: string;
			repositories_url: string;
		};
		organization: Organization;
		repository: undefined;
	}

	interface IMilestone extends PayloadGeneric {
		action: string;
		milestone: Milestone;
		organization: Organization;
	}

	interface IOrganization extends PayloadGeneric {
		action: string;
		invitation: {
			id: number;
			login: string;
			email: string | null;
			role: string;
		};
		membership: {
			url: string;
			state: string;
			role: string;
			organization_url: string;
			user: User;
		};
		organization: Organization;
		repository: undefined;
	}

	interface IOrgBlock extends PayloadGeneric {
		action: string;
		blocked_user: User;
		organization: Organization;
		repository: undefined;
	}

	interface IPageBuild extends PayloadGeneric {
		id: number;
		build: {
			url: string;
			status: string;
			error?: {
				message: string | null;
			};
			pusher: User;
			commit: string;
			duration: number;
			created_at: string;
			updated_at: string;
		};
	}

	interface IPullRequest extends PayloadGeneric {
		action: string;
		number: number;
		pull_request: PullRequest;
		installation: {
			id: number;
		};
	}

	interface IPullRequestReview extends PayloadGeneric {
		action: string;
		review: {
			id: number;
			user: User;
			body: string;
			submitted_at: string;
			state: string;
			html_url: string;
			pull_request_url: string;
		};
		pull_request: PullRequest;
	}

	interface IPullRequestReviewComment extends PayloadGeneric {
		action: string;
		comment: Comment;
		pull_request: PullRequest;
	}

	interface IPushEvent extends PayloadGeneric {
		ref: string;
		before: string;
		after: string;
		created: boolean;
		deleted: boolean;
		forced: boolean;
		base_ref: null | string;
		compare: string;
		commits: Commit[];
		head_commit: Commit;
		pusher: {
			name: string;
			email: string;
		};
	}

	interface IRelease extends PayloadGeneric {
		action: string;
		release: Release;
	}

	interface IRepository extends PayloadGeneric {
		action: string;
		organization: Organization;
	}

	interface IStatus extends PayloadGeneric {
		id: number;
		sha: string;
		name: string;
		target_url: string;
		context: string;
		description: string | null;
		state: string;
		commit: {
			sha: string;
			commit: Commit;
			url: string;
			html_url: string;
			comments_url: string;
			author: User;
			committer: User;
			parents: any[];
		};
		branches: Branch[];
		created_at: string;
		updated_at: string;
	}

	interface IWatchEvent extends PayloadGeneric {
		action: string;
	}

	interface Configurations {
		// the host to listen on, defaults to 0.0.0.0
		host?: string;
		// the port to listen on, defaults to 3420
		port?: number;
		// the path for the GitHub callback, defaults to /github/callback
		path?: string;
		// if boolean, the path for the GitHub callback will be considered valid as long as it starts with the configured path
		wildcard?: boolean;
		//  if specified, you must use the same secret in your webhook configuration in GitHub. if a secret is specified, but one is not configured in GitHub, the hook will fail. if a secret is not specified, but one is configured in GitHub, the signature will not be validated and will be assumed to be correct. consider yourself warned. this option can also be a function that takes the following parameters: (request, data, callback). callback is error first and should be passed (err, secret)
		secret?: string;
		// an optional instance of a logger that supports the log and error methods and one parameter for data (like console), default is console.
		logger?: {
			log: (...params: string[]) => any;
			error: (...params: string[]) => any;
		};
		// Options to pass to nodejs string
		string;
		// By default the x-forwarded-for header is trusted when determining the remoteAddress to log for a request. Set this to boolean to disable this behavior
		trustProxy?: boolean;
		// Respond to GET requests with a 204 response for healthcheck purposes
		enableHealthcheck?: boolean;
		// Override the 204 status code for healthchecks (for systems that arent friendly with HTTP spec compliance and want a 200, for example)
		healthcheckCode?: number;
	}

	type EventCallback = (event: string, repository: string, ref: string, data: any) => void;

	function githubhook(
		arg: Configurations
	): {
		on: (event: string, callback: EventCallback) => void;
		listen: (callback?: () => void) => void;
		stop: (callback?: () => void) => void;
	};
}

export = githubhook.githubhook;
