import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as process from "node:process";
import {CookiePayload} from "./types/payload";

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) {
    }

    createOtpToken(payload: CookiePayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.OTP_TOKEN_SECRET,
            expiresIn: 60 * 2,
        });
    }
}