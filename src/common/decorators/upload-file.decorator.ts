import {applyDecorators, ParseFilePipe, UploadedFiles} from "@nestjs/common";
import type {ProfileImages} from "../../modules/user/types/files";

export const UploadedOptionalFiles = () => {
    return UploadedFiles(new ParseFilePipe({
        fileIsRequired: false,
    }))
};
