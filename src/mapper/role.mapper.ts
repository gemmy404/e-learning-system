import {RoleResponse} from "../dto/role.response.ts";

export const toRoleResponse = (role: any): RoleResponse => {
    return {
        name: role.name,
    }
}