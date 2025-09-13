import crypto from "crypto";

export const generateEnrollmentsCodes = (length: number): string => {
    const ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";

    const timestampPart = Date.now().toString().slice(-length);

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * ALPHANUM.length);
        randomPart += ALPHANUM.charAt(index) + timestampPart[i];
    }

    return randomPart;
}

export const generateResetPasswordCode = (length: number) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length);
    return crypto.randomInt(min, max).toString();
};