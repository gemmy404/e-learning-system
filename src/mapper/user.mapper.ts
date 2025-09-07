import {UserResponse} from "../dto/user.response.ts";

export const toUserResponse = (user: any): UserResponse => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        isActive: user.isActive,
        role: user.role?.name
    };
};