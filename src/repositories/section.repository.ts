import {PrismaClient} from "@prisma/client";

export class SectionRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createSection(section: any) {
        return this.prisma.$transaction(async (tx) => {
            const conflict = await tx.section.findFirst({
                where: {
                    courseId: section.courseId,
                    orderIndex: section.orderIndex,
                }
            });

            if (conflict) {
                await tx.section.updateMany({
                    where: {
                        courseId: section.courseId,
                        orderIndex: {
                            gte: section.orderIndex,
                        }
                    },
                    data: {
                        orderIndex: {
                            increment: 1
                        }
                    }
                });
            }

            const createdSection = await tx.section.create({
                data: {
                    name: section.sectionName,
                    orderIndex: section.orderIndex,
                    courseId: section.courseId,
                }
            });
            return createdSection;
        });
    }

    async findAllSectionsByCourseId(take: number, skip: number, courseId: string) {
        const where = {courseId};

        const [sections, counts] = await Promise.all([
            this.prisma.section.findMany({
                where,
                take,
                skip,
                orderBy: {
                    orderIndex: 'asc'
                },
                include: {
                    _count: {
                        select: {
                            lessons: true
                        }
                    }
                }
            }),
            this.prisma.section.count({where})
        ]);
        return {sections, counts};
    }

    async findSectionById(sectionId: string) {
        const savedSection = await this.prisma.section.findUnique({
            where: {
                id: sectionId
            },
            include: {
                course: {
                    select: {
                        instructorId: true,
                    }
                }
            }
        });
        return savedSection;
    }

    async updateSection(section: any) {
        return this.prisma.$transaction(async (tx) => {
            if (section.orderIndex) {
                const savedSection = await tx.section.findUnique({
                    where: {
                        id: section.id
                    }
                });
                if (savedSection && section.orderIndex < savedSection.orderIndex) {
                    await tx.section.updateMany({
                        where: {
                            courseId: section.courseId,
                            orderIndex: {
                                gte: section.orderIndex,
                                lt: savedSection.orderIndex
                            }
                        },
                        data: {
                            orderIndex: {
                                increment: 1
                            }
                        }
                    });
                } else if (savedSection && section.orderIndex > savedSection.orderIndex) {
                    await tx.section.updateMany({
                        where: {
                            courseId: section.courseId,
                            orderIndex: {
                                gt: savedSection.orderIndex,
                                lte: section.orderIndex
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
            const updatedSection = await tx.section.update({
                where: {
                    id: section.id
                },
                data: {
                    name: section.sectionName,
                    orderIndex: section.orderIndex
                }
            });
            return updatedSection;
        });
    }

    async deleteSection(sectionId: string) {
        const deletedSection = await this.prisma.section.delete({
            where: {
                id: sectionId
            }
        });
        return deletedSection;
    }

}