import {PrismaClient} from "@prisma/client";

export class CodeRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createCodes(codes: any) {
        const result = await this.prisma.course_Code.createManyAndReturn({
            data: codes,
        });
        return result;
    }

    async findAllCodes(instructorId: string, take: number, skip: number) {
        const codes = await this.prisma.course_Code.findMany({
            where: {
                AND: [
                    {instructorId},
                    {isValid: true},
                ]
            },
            take,
            skip,
            orderBy: [
                {isUsed: 'asc'},
                {expireAt: 'asc'},
            ]
        });
        return codes;
    }

    async deactivateCode(instructorId: string) {
        const result = await this.prisma.course_Code.updateMany({
            where: {
                AND: [
                    {instructorId},
                    {expireAt: {lt: new Date()}},
                    {isValid: true}
                ]
            },
            data: {
                isValid: false
            }
        });
        return result;
    }

}