import {PrismaClient} from "@prisma/client";

export class LessonRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createLesson(lesson: any) {
        return this.prisma.$transaction(async (tx) => {
            const conflict = await tx.lesson.findFirst({
                where: {
                    sectionId: lesson.sectionId,
                    orderIndex: lesson.orderIndex,
                }
            });

            if (conflict) {
                await tx.lesson.updateMany({
                    where: {
                        sectionId: lesson.sectionId,
                        orderIndex: {
                            gte: lesson.orderIndex,
                        }
                    },
                    data: {
                        orderIndex: {
                            increment: 1
                        }
                    }
                });
            }
            const createdLesson = await tx.lesson.create({
                data: lesson
            });
            return createdLesson;
        });
    }

    async findAllLessonsBySectionId(take: number, skip: number, sectionId: string) {
        const lessons = await this.prisma.lesson.findMany({
            where: {
                sectionId
            },
            take,
            skip,
            orderBy: {
                orderIndex: 'asc'
            }
        });
        return lessons;
    }

    async findLessonById(lessonId: string) {
        const savedLesson = await this.prisma.lesson.findUnique({
            where: {
                id: lessonId
            },
            include: {
                section: {
                    select: {
                        course: {
                            select: {
                                instructorId: true,
                            }
                        }
                    }
                }
            }
        });
        return savedLesson;
    }

    async updateLesson(lesson: any) {
        return this.prisma.$transaction(async (tx) => {
            if (lesson.orderIndex) {
                const savedLesson = await tx.lesson.findUnique({
                    where: {
                        id: lesson.id
                    }
                });
                if (savedLesson && lesson.orderIndex < savedLesson.orderIndex) { // 2 3 4 5 6 | +1
                    await tx.lesson.updateMany({
                        where: {
                            sectionId: lesson.sectionId,
                            orderIndex: {
                                gte: lesson.orderIndex,
                                lt: savedLesson.orderIndex
                            }
                        },
                        data: {
                            orderIndex: {
                                increment: 1
                            }
                        }
                    });
                } else if (savedLesson && lesson.orderIndex > savedLesson.orderIndex) { // 2 3 4 5 6
                    await tx.lesson.updateMany({
                        where: {
                            sectionId: lesson.sectionId,
                            orderIndex: {
                                gt: savedLesson.orderIndex,
                                lte: lesson.orderIndex
                            }
                        },
                        data: {
                            orderIndex: {
                                decrement: 1
                            }
                        }
                    });
                }
            }
            const updatedLesson = await tx.lesson.update({
                where: {
                    id: lesson.id
                },
                data: lesson
            });
            return updatedLesson;
        });
    }

    async deleteLesson(lessonId: string) {
        const deletedLesson = await this.prisma.lesson.delete({
            where: {
                id: lessonId
            }
        });
        return deletedLesson;
    }

}