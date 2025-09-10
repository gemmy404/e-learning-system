import {CodeResponse} from "../dto/code.response.ts";

export const toCodeResponse = (codeEntity: any): CodeResponse => {
    return {
        code: codeEntity.code,
        createdAt: codeEntity.createdAt.toISOString(),
        expireAt: codeEntity.expireAt.toISOString(),
        isValid: codeEntity.isValid,
        isUsed: codeEntity.isUsed,
        usedAt: codeEntity.usedAt ? codeEntity.usedAt.toISOString() : null,
    };
};