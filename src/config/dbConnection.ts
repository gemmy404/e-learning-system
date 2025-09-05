import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDb() {
    try {
        await prisma.$connect();
        console.log('Connected to database successfully!');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
}