import multer, {Multer} from 'multer';
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "./httpStatusText.ts";
import {AppError} from "./appError.ts";

export const upload = (type: string): Multer => {
    const diskStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${type}`);
        },
        filename: (req, file, cb) => {
            let [fileType, ext] = file.mimetype.split('/');
            if (fileType === 'video') {
                ext = 'mp4'
            }
            const fileName = `${fileType}-${Date.now()}.${ext}`;
            cb(null, fileName);
        }
    });

    const fileFilter = (req: any, file: any, cb: any) => {
        const [fileType, pdf] = file.mimetype.split('/');
        if (fileType === 'image' || fileType === 'video' || pdf === 'pdf') {
            return cb(null, true);
        }
        const errorResponse: ErrorResponse = {
            status: HttpStatus.FAIL,
            message: "File must be an image, video, or pdf",
            data: null
        };
        const error: AppError = new AppError(errorResponse, 400);
        cb(error, false);
    }

    return multer({
        storage: diskStorage,
        fileFilter
    });
}

