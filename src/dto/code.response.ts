export interface CodeResponse {
    code: string;
    createdAt: string;
    expireAt: string;
    isValid: boolean;
    isUsed: boolean;
    usedAt: string | null;
}