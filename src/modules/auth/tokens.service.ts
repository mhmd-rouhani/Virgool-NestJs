import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as process from "node:process";
import {AccessTokenPayload, CookiePayload, EmailTokenPayload, PhoneTokenPayload} from "./types/payload";
import {AuthMessage, BadRequestMessage} from "../../common/enums/message.enum";

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

    verifyOtpToken(token: string): CookiePayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.OTP_TOKEN_SECRET,
            })
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.TryAgain)
        }
    }

    createAccessToken(payload: AccessTokenPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: "1y",
        });
    }

    verifyAccessToken(token: string): AccessTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            })
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.LoginAgain)
        }
    }

    createEmailToken(payload: EmailTokenPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.EMAIL_TOKEN_SECRET,
            expiresIn: 60 * 2,
        });
    }

    verifyEmailToken(token: string): EmailTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.EMAIL_TOKEN_SECRET,
            })
        } catch (error) {
            throw new BadRequestException(BadRequestMessage.SomethingWrong)
        }
    }

    createPhoneToken(payload: PhoneTokenPayload) {
        return this.jwtService.sign(payload, {
            secret: process.env.PHONE_TOKEN_SECRET,
            expiresIn: 60 * 2,
        });
    }

    verifyPhoneToken(token: string): PhoneTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.PHONE_TOKEN_SECRET,
            })
        } catch (error) {
            throw new BadRequestException(BadRequestMessage.SomethingWrong)
        }
    }
}