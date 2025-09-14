import {LessonResponse} from "../dto/lesson.response.ts";

export const toLessonResponse = (lesson: any): LessonResponse => {
    return {
        id: lesson.id,
        name: lesson.name,
        contentType: lesson.contentType,
        contentUrl: lesson.contentUrl,
        orderIndex: lesson.orderIndex,
    };
};

export const toLesson = (lessonId?: string, lesson?: any, contentUrl?: string) => {
    return {
        id: lessonId,
        name: lesson.name,
        sectionId: lesson.sectionId,
        contentType: lesson.contentType,
        contentUrl: contentUrl,
        orderIndex: +lesson.orderIndex || undefined,
    };
}