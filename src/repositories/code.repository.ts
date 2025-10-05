import {Course_Code, PrismaClient} from "@prisma/client";

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
        const where = {instructorId, isValid: true};

        const [codes, counts] = await Promise.all([
            this.prisma.course_Code.findMany({
                where,
                take,
                skip,
                orderBy: [
                    {isUsed: 'asc'},
                    {expireAt: 'asc'},
                ],
            }),
            this.prisma.course_Code.count({where}),
        ]);

        return {codes, counts};
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

    async findCode(enrollCode: string) {
        const code = await this.prisma.course_Code.findUnique({
            where: {
                code: enrollCode,
            }
        });
        return code;
    }

    async updateCode(updatedCode: Course_Code) {
        const result = await this.prisma.course_Code.update({
            where: {
                id: updatedCode.id
            },
            data: updatedCode
        });
        return result;
    }

}