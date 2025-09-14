import {ContentType} from "@prisma/client";

export interface LessonResponse {
    id: string;
    name: string;
    contentType: ContentType;
    contentUrl: string;
    orderIndex: number;
}