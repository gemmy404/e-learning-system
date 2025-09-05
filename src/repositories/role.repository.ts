import {PrismaClient, Role, UserRole} from "@prisma/client";

export class RoleRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createRole(role: any) {
        const createdRole = await this.prisma.role.create({
            data: role,
        });
        return createdRole;
    }

    async findRoleById(id: string) {
        const saveRole = await this.prisma.role.findUnique({
            where: {id}
        });
        return saveRole;
    }

    async findRoleByName(name: UserRole) {
        const saveRole = await this.prisma.role.findUnique({
            where: {name}
        });
        return saveRole;
    }

}