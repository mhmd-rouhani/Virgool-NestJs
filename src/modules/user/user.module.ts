import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserEntity} from "./entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProfileEntity} from "./entities/profile.entity";
import {OtpEntity} from "./entities/otp.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProfileEntity, OtpEntity]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {
}
