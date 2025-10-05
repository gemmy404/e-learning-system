import {PageResponse} from "../dto/page.response.ts";

export const toPageResponse = (size: number, page: number, counts: number): PageResponse => {
   const totalPages = Math.ceil(counts / size);
    return {
        currentPage: page,
        pageSize: size,
        totalElements: counts,
        totalPages,
        firstPage: page === 1,
        lastPage: page === totalPages,
    };
}