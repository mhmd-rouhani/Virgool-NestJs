import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFiles, ParseFilePipe, Res
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiBearerAuth, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto} from "./dto/profile.dto";
import {SwaggerConsumes} from "../../common/enums/swagger-consumes.enum";
import {AuthGuard} from "../auth/guards/Auth.guard";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {multerDestination, multerFilename, multerStorage} from "../../common/utils/multer.util";
import type {ProfileImages} from "./types/files";
import {UploadedOptionalFiles} from "../../common/decorators/upload-file.decorator";
import type {Response} from "express";
import {CookieKeys} from "../../common/enums/cookie.enum";
import {CookiesOptionsToken} from "../../common/utils/cookie.util";
import {PublicMessage} from "../../common/enums/message.enum";
import {CheckOtpDto} from "../auth/dto/auth.dto";

@Controller('user')
@ApiTags('User')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Put("/profile")
    @ApiConsumes(SwaggerConsumes.MultipartData, SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    @UseInterceptors(FileFieldsInterceptor([
        {name: "image_profile", maxCount: 1},
        {name: "bg_image", maxCount: 1},
    ], {
        storage: multerStorage("user-profile")
    }))
    changeProfile(
        @UploadedOptionalFiles() files: ProfileImages,
        @Body() profileDto: ProfileDto
    ) {
        return this.userService.changeProfile(files, profileDto);
    }

    @Get("/profile")
    profile() {
        return this.userService.profile()
    }

    @Patch("/change-email")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Res() res: Response) {
        const {code, token, message} = await this.userService.changeEmail(changeEmailDto.email)
        if (message) return res.json({message})
        res.cookie(CookieKeys.EmailOtp, token, CookiesOptionsToken());
        res.json({
            code,
            message: PublicMessage.SentOtp
        })
    }

    @Patch("/verify-email-otp")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async verifyEmail(@Body() checkOtpDto: CheckOtpDto) {
        return this.userService.verifyEmail(checkOtpDto.code)
    }

    @Patch("/change-phone")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async changePhone(@Body() changePhoneDto: ChangePhoneDto, @Res() res: Response) {
        const {code, token, message} = await this.userService.changePhone(changePhoneDto.phone)
        if (message) return res.json({message})
        res.cookie(CookieKeys.PhoneOtp, token, CookiesOptionsToken());
        res.json({
            code,
            message: PublicMessage.SentOtp
        })
    }

    @Patch("/verify-phone-otp")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async verifyPhone(@Body() checkOtpDto: CheckOtpDto) {
        return this.userService.verifyPhone(checkOtpDto.code)
    }

    @Patch("/change-username")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async changeUsername(@Body() changeUserDto: ChangeUsernameDto) {
        return this.userService.changeUsername(changeUserDto.username)
    }
}
