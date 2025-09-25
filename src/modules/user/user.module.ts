import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserEntity} from "./entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProfileEntity} from "./entities/profile.entity";
import {OtpEntity} from "./entities/otp.entity";
import {AuthModule} from "../auth/auth.module";
import {AuthService} from "../auth/auth.service";
import {TokenService} from "../auth/tokens.service";
import {JwtService} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProfileEntity, OtpEntity]),
        AuthModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {
}
