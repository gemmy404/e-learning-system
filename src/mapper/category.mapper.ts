import {CategoryResponse} from "../dto/category.response.ts";

export const toCategoryResponse = (category: any): CategoryResponse => {
    return {
        name: category.name,
    };
};