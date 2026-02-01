export const API_ROUTES ={
    Auth:{
        REGISTER: "/auth/register",
        VERIFY_EMAIL: "/auth/verify-email",
        RESEND_OTP: "/auth/resend-otp",
        LOGIN:"/auth/login",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD:"/auth/reset-password",
        GOOGLE_LOGIN: "/auth/google",
        LOGOUT:"/auth/logout"
    },

    Admin:{
        LOGIN:"/admin/login",
        GETUSERS:'/admin/users',
        BASE: "/admin",
    }
}


