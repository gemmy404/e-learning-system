import {PageResponse} from "../dto/page.response.ts";

export const toPageResponse = (size: number, page: number, counts: number): PageResponse => {
    return {
        currentPage: page,
        pageSize: size,
        totalElements: counts,
        totalPages: Math.ceil(counts / size),
        firstPage: page === 1,
        lastPage: page >= Math.ceil(counts / size),
    };
}