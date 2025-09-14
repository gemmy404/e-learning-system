import {PrismaClient} from "@prisma/client";

export class ResetPasswordCodeRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createResetCode(resetCode: any) {
        const createdCode = await this.prisma.reset_Password_Code.create({
            data: resetCode,
        });
        return createdCode;
    }

    async findByCode(code: string) {
        const savedCode = await this.prisma.reset_Password_Code.findUnique({
            where: {code},
            include:{
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                }
            }
        });
        return savedCode;
    }

    async InvalidateCodes(userId: string) {
        const savedCode = await this.prisma.reset_Password_Code.updateMany({
            where: {userId},
            data: {
                isValid: false,
            }
        });
        return savedCode;
    }

}