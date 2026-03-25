export interface AcceptInviteResponseDTO {
    accessToken: string;
    refreshToken: string;
    workspaceId: string;
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
    }
}