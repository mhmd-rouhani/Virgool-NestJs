import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import {AuthDto} from "./dto/auth.dto";
import {AuthType} from "./enums/type.enum";
import {AuthMethod} from "./enums/method.enum";
import {isEmail, isMobilePhone} from "class-validator";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {ProfileEntity} from "../user/entities/profile.entity";
import {AuthMessage, BadRequestMessage, PublicMessage} from "../../common/enums/message.enum";
import {OtpEntity} from "../user/entities/otp.entity";
import {randomInt} from "crypto"
import {TokenService} from "./tokens.service";
import {Response} from "express";
import {CookieKeys} from "../../common/enums/cookie.enum";
import {AuthResponse} from "./types/response";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        private tokenService: TokenService,
    ) {
    }

    async userExistence(authDto: AuthDto, res: Response) {
        const {username, type, method} = authDto
        let result: AuthResponse;

        switch (type) {
            case AuthType.Register:
                result = await this.register(method, username)
                return this.sendResponse(res, result)

            case AuthType.Login:
                result = await this.login(method, username)
                return this.sendResponse(res, result)

            default:
                throw new UnauthorizedException();
        }
    }

    async register(method: AuthMethod, username: string) {
        // فقط یوزرنیم مجازه
        if (!isMobilePhone(username, 'fa-IR') && !isEmail(username)) {
            throw new BadRequestException(AuthMessage.NotUsername);
        }

        await this.existUsername(username)

        // اعتبارسنجی یوزرنیم براساس متد
        const safeUsername = this.usernameValidator(method, username);

        // جلوگیری از ساخت حساب تکراری
        const exists = await this.checkUserExist(method, safeUsername);
        if (exists) throw new ConflictException(AuthMessage.AlreadyExistAccount);

        // ساخت و ذخیره‌ی کاربر
        const user = await this.userRepository.save(
            this.userRepository.create({[method]: safeUsername})
        );

        await this.userRepository.update({id: user.id}, {username: `m_${user.id}`})

        // تولید/ذخیره‌ی OTP
        const otp = await this.saveOtp(user.id);
        const token = this.tokenService.createOtpToken({userId: user.id})

        return {
            token,
            code: otp.code,
        }; // خروجیِ مفید برای تست/مصرف بعدی
    }

    async login(method: AuthMethod, username: string) {
        // اعتبارسنجی یوزرنیم براساس متد
        const safeUsername = this.usernameValidator(method, username)
        // 2- بررسی می شود که ایا کاربر از قبل وجود داشته یا نه
        let user: UserEntity | null = await this.checkUserExist(method, safeUsername)
        //اگر وجود نداشت بهش خطا میدیم
        if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);

        const otp = await this.saveOtp(user.id)
        const token = this.tokenService.createOtpToken({userId: user.id})

        return {
            token,
            code: otp.code,
        };
    }

    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.Email:
                if (isEmail(username)) return username
                throw new BadRequestException(BadRequestMessage.EmailFormat);
            case AuthMethod.Phone:
                if (isMobilePhone(username, "fa-IR")) return username
                throw new BadRequestException(BadRequestMessage.MobileNumber);
            case AuthMethod.Username:
                return username

            default:
                throw new UnauthorizedException(AuthMessage.UsernameValidation);
        }
    }

    async checkUserExist(method: AuthMethod, username: string) {
        return await this.userRepository.findOneBy({[method]: username})
    }

    async saveOtp(userId: number) {
        const code = randomInt(10000, 99999).toString();
        const expires_in = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه اعتبار

        let otp = await this.otpRepository.findOneBy({user_id: userId});

        if (!otp) {
            otp = this.otpRepository.create({user_id: userId, code, expires_in});
            otp = await this.otpRepository.save(otp);

            await this.userRepository.update({id: userId}, {otp_id: otp.id});
            return otp;
        }

        // اگر OTP موجوده، فقط آپدیت می‌کنیم
        otp.code = code;
        otp.expires_in = expires_in;
        return this.otpRepository.save(otp);
    }

    async existUsername(username: string) {
        const exist = await this.userRepository.existsBy({username});
        if (exist) throw new ConflictException(AuthMessage.ExistUsername);
    }

    async checkOtp() {

    }

    async sendResponse(res: Response, result: AuthResponse) {
        const {token, code} = result
        res.cookie(CookieKeys.OTP, token, {httpOnly: true});
        res.json({
            message: PublicMessage.SentOtp,
            code
        })
    }
}
