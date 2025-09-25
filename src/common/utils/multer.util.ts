import {Request} from "express";
import {Express} from "express";
import {join, extname} from "path"; // اضافه کردن extname برای استخراج پسوند فایل
import {mkdirSync} from "fs";
import {BadRequestException} from "@nestjs/common";
import {BadRequestMessage} from "../enums/message.enum";
import {diskStorage} from "multer"; // برای ایجاد دایرکتوری‌ها

export type CallBackFilename = (error: Error | null, filename: string) => void;
export type CallBackDestination = (error: Error | null, destination: string) => void;
export type MulterFile = Express.Multer.File;

// تابع multerDestination که مقصد ذخیره فایل‌ها را مشخص می‌کند
export const multerDestination = (fieldName: string) => {
    return function (
        req: Request,
        file: MulterFile, // فایل از نوع MulterFile
        callback: CallBackDestination
    ): void {
        // مسیر ذخیره‌سازی فایل
        const path = join("public", "uploads", fieldName);

        // ایجاد دایرکتوری مقصد در صورت عدم وجود
        mkdirSync(path, {recursive: true});

        // فراخوانی callback با مسیر دایرکتوری
        callback(null, path);
    };
};

// تابع multerFilename برای تعیین نام فایل
export const multerFilename = (
    req: Request,
    file: MulterFile, // فایل از نوع MulterFile
    callback: CallBackFilename
): void => {
    // استخراج پسوند فایل
    const ext = extname(file.originalname).toLowerCase();

    // بررسی فرمت تصویر معتبر
    if (!isValidImageFormat(ext)) {
        // ارسال خطا به callback
        callback(
            new BadRequestException(BadRequestMessage.InvalidImageFormat),
            "" // در اینجا به جای `null` از یک رشته خالی استفاده می‌کنیم
        );
    } else {
        // ایجاد نام فایل جدید با زمان جاری به عنوان پیشوند
        const filename = `${Date.now()}${ext}`;

        // فراخوانی callback با نام فایل جدید
        callback(null, filename);
    }
};

// تابع برای بررسی فرمت‌های تصویر معتبر
const isValidImageFormat = (ext: string) => {
    return [".png", ".jpg", ".jpeg"].includes(ext);
};

export const multerStorage = (folderName: string) => {
    return diskStorage({
        destination: multerDestination(folderName),
        filename: multerFilename
    })
}