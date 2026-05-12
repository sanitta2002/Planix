export const AUTH_MESSAGES = {
  // success
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS:
    'OTP sent to your email. Please verify to complete registration.',
  EMAIL_VERIFIED: 'Email verified successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  GOOGLE_LOGIN_SUCCESS: 'Google login successful',

  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_EMAIL: 'Invalid email',
  INVALID_PASSWORD: 'Invalid password',
  EMAIL_ALREADY_REGISTERED: 'Email already registered',
  EMAIL_NOT_EXIsTING: 'Email not existing',
  EMAIL_NOT_VERIFIED: 'Please verify your email',
  ACCOUNT_BLOCKED: 'Your account has been blocked by admin',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_REQUEST: 'invalid request',
  INVALID_TOKEN: 'invalid token',
  USER_NOT_AUTHORIZED: 'User not authorized',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_NOT_MATCH: 'password do not match',
  PASSWORD_RESET_FAILED: 'Failed to reset password',
  REGISTRATION_EXPIRED: 'Registration expired',
};

export const USER_MESSAGES = {
  BLOCKED: 'User blocked successfully',
  UNBLOCKED: 'User unblocked successfully',
  FETCHED: 'Users fetched successfully',
  NOT_FOUND: 'User not found',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  AVATAR_UPLOADED: 'Avatar uploaded successfully',
  PASSWORD_NOT_AVAILABLE:
    'Password change is not available for Google login users',
};

export const ADMIN_MESSAGES = {
  LOGIN_SUCCESS: 'Admin login successful',
  LOGOUT_SUCCESS: 'Admin logout successful',
  INVALID_CREDENTIALS: 'Invalid admin credentials',
};

export const OTP_MESSAGES = {
  SENT: 'OTP sent successfully',
  VERIFIED: 'OTP verified successfully',
  RESENT: 'OTP resent successfully',

  FAILED_TO_GENERATE: 'Failed to generate OTP',
  REGISTRATION_EXPIRED: 'Registration expired',
  USER_NOT_FOUND: 'User not found',
};

export const GENERAL_MESSAGES = {
  SUCCESS: 'Operation successful',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Conflict occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  FILE_REQUIRED: 'File is required',
};

export const SUBSCRIPTION_MESSAGE = {
  NOT_FOUND: 'Subscription plan not found',
  SUBSCRIPTION_SUCCESS: 'Subscription  created successfully',
  SUBSCRIPTION_FETCH: 'Subcription  frtched successfully ',
  SUBSCRIPTION_UPDATE: 'Subcription update successfully',
  SUBSCRIPTION_DELETE: 'Subcription plan delete successfully',
  ALLACTIVEPLAN: 'Active plans fetched',
  PAYMENT_RETRY_SUCCESS: 'Payment retry successfully',
  NO_SUBCRIPTION: 'No subscription found for this workspace',
  SUBSCRIPTION_FAILD: 'subscription update failed',
  SUBSCRIPTION: 'subscription already active',
  SUBSCRIPTION_EXPIED: 'Subscription expired',
  ACTIVE_SUBSCRIPTION:
    'Youre already subscribed for this workspace. No need to make another payment',
};

export const WORKSPACE_MESSAGE = {
  NOT_FOUND: 'workspace not found',
  CREATED: 'workspace created',
  FETCHED: 'workspace fetched',
  CONFLICT: 'Workspace name already exists',
  MEMBERS: 'All members for fetched ',
  NOT_ACTIVE: 'Workspace has no active subscription',
  MEMBER_DELETED: 'Member removed successfully',
  UPDATED: 'workspace updated successfully',
  LOGO_UPDATED: 'logo updated successfully',
  USER_ALREADY_EXISTS: 'User already exists in workspace',
  MEMBER_LIMIT: 'Workspace member limit reached',
};

export const PAYMENT_MESSAGE = {
  NOT_COMPLETED: 'Payment not completed',
  MISSING_DATA: 'Subscription metadata missing',
  PAYMENT_FETCH: 'payment fetch successfully',
};

export const INVITE_MESSAGE = {
  FORBIDDEN: 'Only owner can invite members',
  BADREQUEST: 'Invitation already sent',
  SUCCESS: 'Invitation successfully send',
  NOT_FOUND: 'Invitation not found',
  CONFLICT: 'Invitation already used',
  INVALID: 'Invalid invitation',
};

export const ROLE_MESSAGE = {
  CONFLICT: 'Role already used',
  ROLE_FETCHING_FAILED: 'Failed to fetch roles !',
  ROLE_NOT_FOUND: 'Role not found !',
  PERMISSION_CANNOT_EMPTY: 'Permission cannot be empty !',
  ROLE_NAME_ALREADY_EXISTS: 'Role name already exists !',

  ROLE_CREATED: 'Role created successfully',
  ROLE_FETCHED: 'Roles fetched successfully',
  ROLE_UPDATED: 'Role updated successfully',
  ROLE_DELETED: 'Role deleted successfully',
};

export const OWNER_MESSAGE = {
  OWNER_ONLY: 'Only owner can update workspace',
};

export const PROJECT = {
  PROJECT_CREATED_SUCCESSFULLY: 'Project created successfully',
  PROJECT_FETCH_SUCCESS: 'Project fetched successfully',
  PROJECT_REMOVED_SUCCESSFULLY: 'Project removed successfully',
  PROJECT_UPDATED_SUCCESSFULLY: 'Project updated successfully',
  STATUS_UPDATED_SUCCESSFULLY: 'Project status updated successfully',
  GET_ALL_PROJECTS: 'Fetched projects successfully',
  PROJECT_DELETED_SUCCESSFULLY: 'Project deleted successfully',
  PROJECT_MEMBER_ADDED_SUCCESSFULLY: 'Project member added successfully',
  PROJECT_MEMBER_REMOVED_SUCCESSFULLY: 'Project member removed successfully',
  PROJECT_MEMBER_UPDATED_SUCCESSFULLY: 'Project member updated successfully',
};

export const PROJECT_ERRORS = {
  PROJECT_NOT_FOUND: 'Project not found !',
  PROJECT_CREATION_FAILED: 'Project creation failed',
  PROJECT_INVALIDATION: 'Error while validating project !',
  NO_PROJECTS_FOUND: 'No projects found',
  PROJECT_ALREADY_EXISTS: 'Project Already Exists',
  PROJECT_FETCHING_FAILED: 'Failed to fetch projects !',
  PROJECT_ROLE_NOT_FOUND: 'Project role not found !',
  PROJECT_MEMBER_ALREADY_EXISTS: 'Project member already exists !',
  PROJECT_ROLE_REQUIRED: 'Project role is required !',
  PROJECT_UPDATE_FAILED: 'Project update failed !',
  PROJECT_MEMBER_NOT_FOUND: 'Project member not found !',
  INVALID_DATA: 'ProjectId, UserId and RoleId are required.',
  ROLE_NOT_FOUND: 'Role not found !',
  CANNOT_REMOVE_CREATOR: 'Creator cannot be removed from project !',
  ISSUE_NOT_FOUND: 'Issue not found !',
  ISSUE_CREATION_FAILED: 'Issue creation failed',
  ISSUE_INVALIDATION: 'Error while validating issue !',
  NO_ISSUES_FOUND: 'No issues found',
  ISSUE_ALREADY_EXISTS: 'Issue Already Exists',
  ISSUE_FETCHING_FAILED: 'Failed to fetch issues !',
  ISSUE_MEMBER_ALREADY_EXISTS: 'Issue member already exists !',
  ISSUE_ROLE_REQUIRED: 'Issue role is required !',
  ISSUE_UPDATE_FAILED: 'Issue update failed !',
  ISSUE_MEMBER_NOT_FOUND: 'Issue member not found !',
  NON_EPIC_ISSUE_WITHOUT_PARENT: 'Non epic issues must have a parent Issue',
  CONTENT_TYPE_REQUIRED: 'Content Type is required',
  INVALID_ISSUE_TYPE: 'Invalid issue type',
  INVALID_DATES: 'Invalid dates',
  MEMBER_NOT_FOUND: 'Member not found in project !',
  NOT_AUTHORIZED: 'You are not authorized to delete this issue !',
  HAS_CHILDREN: 'Cannot delete issue with child issues',
  CANNOT_REMOVE_MEMBER_HAS_ISSUES:
    'Cannot remove member who has assigned issues in this project',
  FAILED_TO_UPDATE_ISSUE: 'Failed to update issue',
  ONLY_PROJECT_MANAGER_CAN_START_SPRINT:
    'Only project manager can start sprint',
  ONLY_PROJECT_MANAGER_CAN_CREATE_SPRINT:
    'Only project manager can create sprint',
  UNAUTHORIZED_TO_CREATE_PROJECT:
    'Unauthorized to create project in this workspace',
  UNAUTHORIZED_TO_UPDATE_PROJECT:
    'Unauthorized to update project in this workspace',
  UNAUTHORIZED_TO_ADD_PROJECT_MEMBER: 'Unauthorized to add project member',
  UNAUTHORIZED_TO_REMOVE_PROJECT_MEMBER:
    'Unauthorized to remove project member',
  UNAUTHORIZED_TO_DELETE_PROJECT: 'Unauthorized to delete project',
  UNAUTHORIZED_TO_UPDATE_MEMBER_ROLE:
    'Unauthorized to update project member role',
};

export const ISSUE_SUCCESS = {
  ISSUE_CREATED: 'Issue created successfully',
  ISSUE_UPDATED: 'Issue updated successfully',
  ISSUE_DELETED: 'Issue deleted successfully',

  ISSUE_FETCHED: 'Issue fetched successfully',
  ISSUES_FETCHED: 'Issues fetched successfully',

  CHILD_ISSUES_FETCHED: 'Child issues fetched successfully',
};

export const ISSUE_ERRORS = {
  INVALID_TITLE: 'Issue title is required',

  ISSUE_NOT_FOUND: 'Issue not found',
  PARENT_ISSUE_NOT_FOUND: 'Parent issue not found',

  PROJECT_NOT_FOUND: 'Project not found',
  USER_NOT_PROJECT_MEMBER: 'User is not a member of this project',

  NOT_AUTHORIZED: 'You are not authorized to perform this action',

  EPIC_CANNOT_HAVE_PARENT: 'Epic cannot have a parent',
  STORY_PARENT_INVALID: 'Story must have an Epic as parent',
  TASK_PARENT_INVALID: 'Task or Bug must have a Story as parent',
  SUBTASK_PARENT_INVALID: 'Subtask must have a Task as parent',

  INVALID_ISSUE_TYPE: 'Invalid issue type',

  ISSUE_CREATION_FAILED: 'Failed to create issue',
  ISSUE_UPDATE_FAILED: 'Failed to update issue',
  ISSUE_DELETE_FAILED: 'Failed to delete issue',
};

export const SPRINT_MESSAGES = {
  CREATED: 'Sprint created successfully',
  FETCHED: 'Sprints fetched successfully',
  UPDATED: 'Sprints update successfully',
  STARTED: 'Sprint Started successfully',
  INVALID_DATES: 'End date must be after start date',
  INVALID_DATE_FORMAT: 'Invalid date format',
  START_DATE_IN_PAST: 'Start date cannot be in the past',
  SPRINT_NOT_STARTED_YET: 'Sprint has not started yet',

  ACTIVE_SPRINT_EXISTS: 'An active sprint already exists for this project',
  SPRINT_NOT_FOUND: 'Sprint not found',
  PROJECT_NOT_FOUND: 'Project not found',
  SPRINT_ALREADY_COMPLETED: 'Sprint is already completed',
  SPRINT_ALREADY_ACTIVE: 'Sprint is already active',
  SPRINT_NOT_STARTED: 'Sprint has not been started yet',

  ONLY_PLANNED_CAN_START: 'Only planned sprints can be started',
  ONLY_ACTIVE_CAN_COMPLETE: 'Only active sprints can be completed',

  REQUIRED_FIELDS: 'All required fields must be provided',
  INVALID_SPRINT_ID: 'Invalid sprint ID',

  SPRINT_OVERLAP: 'Sprint dates overlap with an existing sprint',

  CANNOT_MODIFY_COMPLETED: 'Cannot modify a completed sprint',
  CANNOT_CHANGE_START_DATE: 'Cannot change start date of active sprint',

  ISSUE_ALREADY_ASSIGNED: 'Issue is already assigned to another sprint',
  ISSUE_NOT_FOUND: 'Issue not found',
};

export const COMMENT_MESSAGES = {
  CREATED: 'Comment added successfully.',
  FETCHED: 'Comments retrieved successfully.',
  UPDATED: 'Comment updated successfully.',
  DELETED: 'Comment deleted successfully.',

  NOT_FOUND: 'Comment not found or has been deleted.',
  ISSUE_NOT_FOUND: 'The issue you are trying to comment on does not exist.',
  FORBIDDEN_UPDATE: 'You do not have permission to edit this comment.',
  FORBIDDEN_DELETE: 'You do not have permission to delete this comment.',
  CREATE_FAILED: 'Failed to add comment. Please try again later.',
  UPDATE_FAILED: 'Failed to update comment. Please try again later.',
  DELETE_FAILED: 'Failed to delete comment. Please try again later.',
  FETCH_FAILED: 'Failed to retrieve comments. Please try again later.',

  CONTENT_REQUIRED: 'Comment content cannot be empty.',
  CONTENT_TOO_LONG: 'Comment content exceeds the maximum character limit.',
  INVALID_ISSUE_ID: 'Invalid issue ID provided.',
};

export const NOTIFICATION_MESSAGES = {
  FETCHED: 'Notifications fetched successfully',
  COUNT_FETCHED: 'Unread count fetched successfully',
  MARKED_AS_READ: 'Notification marked as read',
  ALL_MARKED_AS_READ: 'All notifications marked as read',
  INVALID_RECEIVER_ID: 'Invalid receiver ID provided',
  INVALID_NOTIFICATION_ID: 'Invalid notification ID provided',
  NOT_FOUND: 'Notification not found',
};

export const NOTIFICATION_TEMPLATES = {
  ISSUE_CREATED: (title: string) => `A new issue "${title}" has been created.`,
  ISSUE_ASSIGNED: (title: string) =>
    `You have been assigned to the issue "${title}".`,
  ISSUE_UPDATED: (title: string) => `The issue "${title}" has been updated.`,
  ISSUE_MENTIONED: (sender: string, title: string) =>
    `${sender} mentioned you in "${title}".`,
  PROJECT_MEMBER_ADDED: (projectName: string) =>
    `You have been added to the project "${projectName}".`,
  SPRINT_STARTED: (sprintName: string) =>
    `The sprint "${sprintName}" has started.`,
  NEW_MESSAGE: (sender: string) => `New message from ${sender}.`,
};
