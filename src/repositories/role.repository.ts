import {PrismaClient, UserRole} from "@prisma/client";

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

    async findAllRoles(take: number, skip: number) {
        const roles = await this.prisma.role.findMany({
            take,
            skip
        });
        return roles;
    }

}