import {MulterFile} from "../../../common/utils/multer.util";

export type ProfileImages = {
    image_profile: MulterFile[],
    bg_image: MulterFile[],

}