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

export const toCourse = (course: any) => {
    return {
        title: course.title,
        description: course.description,
        price: Number(course.price) || undefined,
        thumbnailUrl: course.thumbnailUrl
    }
};