import {Course, Prisma, PrismaClient} from '@prisma/client';

export class CourseRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createCourse(course: any) {
        const createdCourse = await this.prisma.course.create({
            data: course,
        });
        return createdCourse;
    }

    async findAllCourses(take: number, skip: number, instructorId?: string) {
        const courses = await this.prisma.course.findMany({
            where: {instructorId},
            take,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                instructor: {
                    select: {name: true}
                },
                category: {
                    select: {name: true}
                }
            }
        });

        return courses;
    }

    async findCourseById(courseId: string) {
        const course = await this.prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                instructor: {
                    select: {name: true}
                },
                category: {
                    select: {name: true}
                }
            }
        });
        return course;
    }

    async findCoursesByTitle(courseTitle: string, take: number, skip: number) {
        const courses = await this.prisma.course.findMany({
            where: {
                title: {
                    mode: Prisma.QueryMode.insensitive,
                    contains: courseTitle,
                }
            },
            take,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                instructor: {
                    select: {name: true}
                },
                category: {
                    select: {name: true}
                }
            }
        });

        return courses;
    }

    async findCoursesByCategory(categoryName: string, take: number, skip: number) {
        const courses = await this.prisma.course.findMany({
            where: {
                category: {
                    name: {
                        mode: Prisma.QueryMode.insensitive,
                        startsWith: categoryName
                    }
                }
            },
            take,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                instructor: {
                    select: {name: true}
                },
                category: {
                    select: {name: true}
                }
            }
        });

        return courses;
    }

    async updateCourse(courseId: string, course: any) {
        const updatedCourse = await this.prisma.course.update({
            where: {
                id: courseId
            },
            data: course,
            include: {
                instructor: {
                    select: {name: true}
                },
                category: {
                    select: {name: true}
                }
            }
        });
        return updatedCourse;
    }

    async deleteCourse(courseId: string) {
        const savedCourse = await this.prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                id: true
            }
        });
        if (!savedCourse) {
            return null;
        }

        const deletedCourse = await this.prisma.course.delete({
            where: {
                id: courseId
            }
        });
        return deletedCourse;
    }

}