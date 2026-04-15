export const IssueType = {
  EPIC: "EPIC",
  STORY: "STORY",
  TASK: "TASK",
  BUG: "BUG",
  SUBTASK: "SUBTASK",
} as const;
export type IssueType = (typeof IssueType)[keyof typeof IssueType];

export const IssueStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;
export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface IAttachement {
  type: "link" | "file";
  url: string;
  fileName?: string;
}
