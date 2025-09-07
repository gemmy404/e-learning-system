export interface UserResponse {
    id?: string;
    name: string;
    email?: string;
    profilePictureUrl?: string | null;
    isActive?: boolean;
    role?: string;
}