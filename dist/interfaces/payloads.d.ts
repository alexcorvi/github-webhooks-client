import { Repository, User, Deployment, Issue, Milestone, Branch, Comment, Commit, Installation, Label, Organization, PullRequest, Release } from './objects';
export interface PayloadGeneric {
    sender: User;
}
export interface ICommitComment extends PayloadGeneric {
    action: string;
    comment: Comment;
    repository: Repository;
}
export interface ICreate extends PayloadGeneric {
    ref: string;
    ref_type: string;
    master_branch: string;
    description: string;
    pusher_type: string;
    repository: Repository;
}
export interface IDelete extends PayloadGeneric {
    ref: string;
    ref_type: string;
    pusher_type: string;
    repository: Repository;
}
export interface IDeployment extends PayloadGeneric {
    deployment: Deployment;
    repository: Repository;
}
export interface IDeployment_Status extends PayloadGeneric {
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
    repository: Repository;
}
export interface IForK extends PayloadGeneric {
    forkee: Repository;
    repository: Repository;
}
export interface IGollum extends PayloadGeneric {
    pages: {
        page_name: string;
        title: string;
        summary: string | null;
        action: string;
        sha: string;
        html_url: string;
    }[];
    repository: Repository;
}
export interface IInstallation extends PayloadGeneric {
    action: string;
    installation: Installation;
    sender: User;
}
export interface IInstallationRepository {
    action: string;
    installation: Installation;
    repository_selection: string;
    repositories_added: {
        id: number;
        name: string;
        full_name: string;
    }[];
    repositories_removed: {
        id: number;
        name: string;
        full_name: string;
    }[];
    sender: User;
    repository: Repository;
}
export interface IIssueComment extends PayloadGeneric {
    action: string;
    issue: Issue;
    comment: Comment;
    repository: Repository;
}
export interface IIssue extends PayloadGeneric {
    action: string;
    issue: Issue;
    repository: Repository;
}
export interface ILabel extends PayloadGeneric {
    action: string;
    label: Label;
    organization: Organization;
    repository: Repository;
}
export interface IMember extends PayloadGeneric {
    action: string;
    member: User;
    repository: Repository;
}
export interface IMembership extends PayloadGeneric {
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
}
export interface IMilestone extends PayloadGeneric {
    action: string;
    milestone: Milestone;
    organization: Organization;
    repository: Repository;
}
export interface IOrganization extends PayloadGeneric {
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
}
export interface IOrgBlock extends PayloadGeneric {
    action: string;
    blocked_user: User;
    organization: Organization;
}
export interface IPageBuild extends PayloadGeneric {
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
    repository: Repository;
}
export interface IPullRequest extends PayloadGeneric {
    action: string;
    number: number;
    pull_request: PullRequest;
    installation: {
        id: number;
    };
    repository: Repository;
}
export interface IPullRequestReview extends PayloadGeneric {
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
    repository: Repository;
}
export interface IPullRequestReviewComment extends PayloadGeneric {
    action: string;
    comment: Comment;
    pull_request: PullRequest;
    repository: Repository;
}
export interface IPush extends PayloadGeneric {
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
    repository: Repository;
}
export interface IRelease extends PayloadGeneric {
    action: string;
    release: Release;
    repository: Repository;
}
export interface IRepository extends PayloadGeneric {
    action: string;
    organization: Organization;
    repository: Repository;
}
export interface IStatus extends PayloadGeneric {
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
    repository: Repository;
}
export interface IWatch extends PayloadGeneric {
    action: string;
    repository: Repository;
}
