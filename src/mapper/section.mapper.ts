import {SectionResponse} from "../dto/section.response.ts";

export const toSectionResponse = (section: any): SectionResponse => {
    return {
        id: section.id,
        sectionName: section.name,
        orderIndex: section.orderIndex,
        numberOfLessons: section._count?.lessons || 0
    };
};