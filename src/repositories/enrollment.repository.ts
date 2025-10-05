import {PrismaClient} from "@prisma/client";

export class EnrollmentRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createEnrollment(enrollRequest: any) {
        const enrolledCourse = await this.prisma.enrollment.create({
            data: enrollRequest
        });
        return enrolledCourse;
    }

    async findEnrolledCourseByStudentIdAndCourseId(userId: string, courseId: string) {
        const enrolledCourse = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        return enrolledCourse;
    }

    async findAllEnrolledCourseByStudentId(take: number, skip: number, userId: string) {
       const where = {userId};

       const [enrolledCourses, counts] = await Promise.all([
        this.prisma.enrollment.findMany({
            where,
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {name: true}
                        },
                        category: {
                            select: {name: true}
                        }
                    }
                }
            },
            take,
            skip,
            orderBy: {
                enrollmentDate: 'desc'
            }
        }),
           this.prisma.enrollment.count({where})
       ]);

        return {enrolledCourses, counts};
    }

}