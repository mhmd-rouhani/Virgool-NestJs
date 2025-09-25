import {AuthType} from "../enums/type.enum";
import {AuthMethod} from "../enums/method.enum";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsString, Length} from "class-validator";

export class AuthDto {
    @ApiProperty({
        example: ""
    })
    @IsString()
    @Length(3, 100)
    username: string;

    @ApiProperty({
        description: "Enter type: Login / Register",
        enum: AuthType,
        example: AuthType.Login,
    })
    @IsEnum(AuthType, {message: 'Type must be one of: Login, Register'})
    type: AuthType;

    @ApiProperty({
        description: "Enter type: Username / Email / Phone",
        enum: AuthMethod,
        example: AuthMethod.Username,
    })
    @IsEnum(AuthMethod, {message: 'Method must be one of: Username, Email, Phone'})
    method: AuthMethod;
}

export class CheckOtpDto {
    @ApiProperty({
        example: ""
    })
    @IsString()
    @Length(5, 5, {message: "کد وارد شده اشتباه می باشد"})
    code: string
}