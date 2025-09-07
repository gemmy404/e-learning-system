import {PrismaClient, User, UserRole} from "@prisma/client";
import {RoleRepository} from "./role.repository.ts";
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";

export class UserRepository {
    private prisma: PrismaClient;
    private roleRepository: RoleRepository;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
        this.roleRepository = new RoleRepository(this.prisma);
    }

    async createUser(user: User) {
        const role = await this.roleRepository.findRoleByName(UserRole.USER);
        if (!role) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "Role not found",
            };
            const error: AppError = new AppError(errorResponse, 404);
            throw error;
        }
        user.roleId = role.id;
        const savedUser = await this.prisma.user.create({
            data: user,
            omit: {
                password: true
            }
        });
        return savedUser;
    }

    async findUserById(userId: string) {
        const savedUser = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                role: {
                    select: {name: true}
                }
            },
            omit: {
                password: true
            }
        });
        return savedUser;
    }

    async findUserByEmail(email: string) {
        const savedUser = await this.prisma.user.findUnique({
            where: {email},
            include: {
                role: {
                    select: {name: true}
                }
            }
        });
        return savedUser;
    }

    async findUsersByRole(role: UserRole, take: number, skip: number) {
        const users = await this.prisma.user.findMany({
            where: {
                role: {
                    name: role
                }
            },
            include: {
                role: {
                    select: {name: true}
                }
            },
            omit: {
                password: true
            },
            take,
            skip
        });
        return users;
    }

    async updateUserProfile(userId: string, profile: any) {
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: profile?.name,
                profilePictureUrl: profile?.profilePictureUrl,
                isActive: profile?.isActive
            },
            include: {
                role: {
                    select: {name: true}
                }
            },
            omit: {
                password: true
            }
        });
        return updatedUser;
    }

    async changeUserRole(userId: string, roleId: string) {
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                roleId: roleId
            },
            include: {
                role: {
                    select: {name: true}
                }
            },
            omit: {
                password: true
            }
        });
        return updatedUser;
    }

}