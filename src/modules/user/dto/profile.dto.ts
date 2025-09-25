import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDate, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, Length} from "class-validator";
import {Gender} from "../enums/gender.enum";
import {ValidationMessage} from "../../../common/enums/message.enum";

export class ProfileDto {
    @ApiPropertyOptional({example: ""})
    @IsOptional()
    @Length(3, 100, {message: "نام مستعار باید بیشتر از 3 کاراکتر و کمتر از 100 باشد"})
    nick_name: string

    @ApiPropertyOptional({nullable: true})
    @Length(10, 200, {message: "بیو باید بیشتر از 10 و کمتر از 200 کاراکتر باشد"})
    bio: string

    @ApiPropertyOptional({nullable: true, format: "binary"})
    image_profile: string

    @ApiPropertyOptional({nullable: true, format: "binary"})
    bg_image: string

    @ApiPropertyOptional({nullable: true, enum: Gender})
    @IsEnum(Gender)
    gender: Gender

    @ApiPropertyOptional({nullable: true, example: "2025-09-17T08:00:08.612Z"})
    birthday: Date

    @ApiPropertyOptional({nullable: true})
    linkedin_profile: string

    @ApiPropertyOptional({nullable: true})
    x_profile: string
}

export class ChangeEmailDto {
    @ApiProperty()
    @IsEmail({}, {message: ValidationMessage.InvalidEmailFormat})
    email: string
}

export class ChangePhoneDto {
    @ApiProperty()
    @IsMobilePhone("fa-IR", {}, {message: ValidationMessage.InvalidPhoneFormat})
    phone: string
}

export class ChangeUsernameDto {
    @ApiProperty({example: ""})
    @IsString()
    @Length(3, 100)
    username: string
}