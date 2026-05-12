export class IssueAssignedEvent {
  constructor(
    public readonly issueId: string,
    public readonly issueTitle: string,
    public readonly assigneeId: string,
    public readonly actorId: string,
  ) {}
}

export class IssueCommentedEvent {
  constructor(
    public readonly issueId: string,
    public readonly issueTitle: string,
    public readonly commentContent: string,
    public readonly receiverId: string,
    public readonly senderId: string,
  ) {}
}

export class SprintStartedEvent {
  constructor(
    public readonly sprintId: string,
    public readonly sprintName: string,
    public readonly projectMembers: string[],
    public readonly actorId: string,
  ) {}
}

export class ProjectMemberEvent {
  constructor(
    public readonly projectId: string,
    public readonly projectName: string,
    public readonly memberId: string,
    public readonly actorId: string,
  ) {}
}
