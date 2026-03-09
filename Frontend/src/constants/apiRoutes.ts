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
  },

  SUBSCRIPTION: {
    GET_PLANS: "subscriptions/plans",
    CREATE: "/subscriptions",
  },

  PAYMENT: {
    CHECKOUT: "/payment/checkout",
    CONFIRM: "/payment/confirm",
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
};
