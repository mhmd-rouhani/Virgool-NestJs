import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProfileEntity} from "../user/entities/profile.entity";
import {UserEntity} from "../user/entities/user.entity";
import {UserModule} from "../user/user.module";
import {JwtService} from "@nestjs/jwt";
import {TokenService} from "./tokens.service";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
