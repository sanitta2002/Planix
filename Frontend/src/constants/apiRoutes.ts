export const API_ROUTES = {
  Auth: {
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-otp",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_LOGIN: "/auth/google",
    LOGOUT: "/auth/logout",
  },

  Admin: {
    LOGIN: "/admin/login",
    GETUSERS: "/admin/users",
    BASE: "/admin",
    SUBSCRIPTION_PLAN: "/admin/subscriptionPlan",
    WORKSPACES: "/admin/workspaces",
    paymets:"/admin/paymets",
    REPORT:"/admin/report"
  },
  USER: {
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    UPLOAD_AVATAR: "/users/avatar",
    GET_PROFILE: "/users/profile",
  },
  WORKSPACE: {
    CREATE: "workspaces/workspace",
    GETWORKSPACE: "workspaces/workspace",
    GET_MEMBERS: "workspaces/:workspaceId/members",
    DELETE_MEMBERS:"workspaces/:workspaceId/members/:memberId",
    GET_PROFILE:"workspaces/:workspaceId",
    UPDATE:"workspaces/:workspaceId",
    UPLOAD_LOGO:"workspaces/:workspaceId/logo",
    GET_PAYMENT_DETAILS: "/workspaces/:workspaceId/payment",   
  },

  SUBSCRIPTION: {
    GET_PLANS: "subscriptions/plans",
    CREATE: "/subscriptions",
    UPGRADE:"/subscriptions/upgrade"
  },

  PAYMENT: {
    CHECKOUT: "/payment/checkout",
    CONFIRM: "/payment/confirm",
    RETRY: "/payment/retry",
    INVOICE: "/payment/invoice/:invoiceId"

  },
  INVITATION: {
    INVITE_MEMBER: "/invitation/:workspaceId",
    ACCEPT_INVITATION: "/invitation/accept/:token",
    COMPLETEPROFILE: "/invitation/complete/:token",
  },
  ROLE: {
    CREATE_ROLE: "/role/role",
    GET_ROLES: "/role/roles",
    UPDATE_ROLE: "/role/:roleId",
    DELETE_ROLE:"/role/:roleId"
  },
  PROJECT:{
    CREATE_PROJECT:'/projects/:workspaceId',
    GET_ALL_PROJECTS:'/projects/:workspaceId/projects',
    UPDATE_PROJECT:"/projects/:projectId",
     DELETE_PROJECT:"/projects/:projectId",
    REMOVE_MEMBER: "/projects/:projectId/member/:userId",
  },
  ISSUE: {
    CREATE_ISSUE: "/issues", 
    GET_ISSUES_BY_PROJECT: "/issues/:projectId",
    UPDATE_ISSUE: "/issues/:issueId",
    ADD_ATTACHMENT:"issues/:issueId/attachments",
    DELETE_ATTACHMENT:"issues/:issueId/attachments",
    GET_ATTACHMENT_URL:"issues/:issueId/attachments/url"
  },
  SPRINT: {
    CREATE: "/sprint",
    GET_BY_PROJECT: "/sprint/project/:projectId",
    START_SPRINT: "/sprint/:id/start",
    COMPLETE_SPRINT: "/sprint/:id/complete"
  }
};
