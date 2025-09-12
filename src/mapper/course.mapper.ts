import {CourseResponse} from '../dto/course.response';

export const toCourseResponse = (course: any): CourseResponse => {
    return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        instructor: course.instructor.name,
        category: course.category.name,
        thumbnail: course.thumbnailUrl
    };
};

export const toCourse = (course: any, file: any) => {
    return {
        title: course.title,
        description: course.description,
        thumbnailUrl: file?.path,
        price: Number(course.price) || undefined,
        categoryId: course.categoryId,
        instructorId: course.instructorId,
    };
};