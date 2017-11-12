export interface User {
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
export interface Branch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
}
export interface Release {
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
export interface Commit {
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
export interface Comment {
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
export interface Repository {
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
export interface Deployment {
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
export interface Installation {
    id: number;
    account: User;
    repository_selection: string;
    access_tokens_url: string;
    repositories_url: string;
}
export interface Milestone {
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
export interface Issue {
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
export interface Label {
    url: string;
    name: string;
    color: string;
}
export interface PullRequest {
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
export interface Organization {
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
