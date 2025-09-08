import {PrismaClient} from '@prisma/client';

export class CategoryRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createCategory(categoryName: string) {
        const createdCategory = await this.prisma.category.create({
            data: {
                name: categoryName,
            },
        });
        return createdCategory;
    }

    async findAllCategories(take: number, skip: number) {
        const categories = await this.prisma.category.findMany({
            take,
            skip
        });
        return categories;
    }

    async findCategoryByName(name: string) {
        let savedCategory = await this.prisma.category.findUnique({
            where: {name}
        });
        return savedCategory;
    }

}