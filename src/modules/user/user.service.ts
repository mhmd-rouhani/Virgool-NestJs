import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    Scope,
    UnauthorizedException
} from '@nestjs/common';
import {ProfileDto} from "./dto/profile.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {ProfileEntity} from "./entities/profile.entity";
import {Repository} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {REQUEST} from "@nestjs/core";
import type {Request} from "express";
import {isDate} from "class-validator";
import {Gender} from "./enums/gender.enum";
import {AuthMessage, BadRequestMessage, ConflictMessage, PublicMessage} from "../../common/enums/message.enum";
import {ProfileImages} from "./types/files";
import {AuthService} from "../auth/auth.service";
import {TokenService} from "../auth/tokens.service";
import {CookieKeys} from "../../common/enums/cookie.enum";
import {OtpEntity} from "./entities/otp.entity";
import {AuthMethod} from "../auth/enums/method.enum";

@Injectable({scope: Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private readonly profileRepository: Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private readonly otpRepository: Repository<OtpEntity>,
        @Inject(REQUEST) private request: Request,
        private authService: AuthService,
        private tokenService: TokenService,
    ) {
    }

    async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
        if (files?.image_profile?.length > 0) {
            let [image] = files?.image_profile
            profileDto.image_profile = image?.path?.slice(7)
        }
        if (files?.bg_image?.length > 0) {
            let [image] = files?.bg_image
            profileDto.bg_image = image?.path?.slice(7)
        }
        const {id: userId} = this.request.user
        const {linkedin_profile, x_profile, bio, nick_name, gender, birthday, image_profile, bg_image} = profileDto

        let profile = await this.profileRepository.findOneBy({user_id: userId})

        if (profile) {
            if (bio) profile.bio = bio;
            if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
            if (gender && Object.values(Gender).includes(gender)) profile.gender = gender;
            if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
            if (x_profile) profile.x_profile = x_profile;
            if (image_profile) profile.image_profile = image_profile;
            if (bg_image) profile.bg_image = bg_image;
            await this.profileRepository.save(profile);
        } else {
            profile = this.profileRepository.create({
                    linkedin_profile,
                    x_profile,
                    bio,
                    nick_name,
                    gender,
                    birthday,
                    user_id: userId,
                    image_profile,
                    bg_image,
                }
            )
            profile = await this.profileRepository.save(profile)
            await this.userRepository.update({id: userId}, {profile_id: profile.id})
        }

        return {
            message: PublicMessage.Updated
        }
    }

    profile() {
        const {id} = this.request.user
        return this.userRepository.findOne({
            where: {id},
            relations: ["profile"]
        })
    }

    async changeEmail(email: string) {
        const {id: userId} = this.request.user
        const existingUser = await this.userRepository.findOneBy({email})

        // email belongs to another user → conflict
        if (existingUser && existingUser.id !== userId) {
            throw new ConflictException(ConflictMessage.Email)
        }

        // email is already the same as current user's email → nothing to change
        if (existingUser && existingUser.id === userId) {
            return {message: PublicMessage.Updated}
        }

        // assign as pending new email
        const user = await this.userRepository.findOneBy({id: userId})
        if (!user) {
            throw new NotFoundException(AuthMessage.LoginAgain)
        }

        user.new_email = email
        await this.userRepository.save(user)
        const otp = await this.authService.saveOtp(userId, AuthMethod.Email)
        const token = this.tokenService.createEmailToken({email})
        console.log("token:", token)

        return {
            code: otp.code,
            token,
        }
    }

    async changePhone(phone: string) {
        const {id: userId} = this.request.user
        const existingUser = await this.userRepository.findOneBy({phone})

        // email belongs to another user → conflict
        if (existingUser && existingUser.id !== userId) {
            throw new ConflictException(ConflictMessage.Phone)
        }

        // email is already the same as current user's email → nothing to change
        if (existingUser && existingUser.id === userId) {
            return {message: PublicMessage.Updated}
        }

        // assign as pending new email
        const user = await this.userRepository.findOneBy({id: userId})
        if (!user) {
            throw new NotFoundException(AuthMessage.LoginAgain)
        }

        user.new_phone = phone
        await this.userRepository.save(user)
        const otp = await this.authService.saveOtp(userId, AuthMethod.Phone)
        const token = this.tokenService.createPhoneToken({phone})

        return {
            code: otp.code,
            token,
        }
    }

    async verifyEmail(code: string) {
        const {id: userId, new_email} = this.request.user
        const token = this.request.cookies?.[CookieKeys.EmailOtp]
        if (!token) {
            throw new BadRequestException(AuthMessage.ExpiredCode)
        }

        const {email} = this.tokenService.verifyEmailToken(token)

        if (email !== new_email) {
            throw new BadRequestException(BadRequestMessage.SomethingWrong)
        }

        const otp = await this.checkOtp(userId, code)

        if (otp.method !== AuthMethod.Email) {
            throw new BadRequestException(BadRequestMessage.SomethingWrong)
        }

        await this.userRepository.update({id: userId}, {
            email,
            verify_email: true,
            new_email: null
        })

        return {
            message: PublicMessage.Updated,
        }

    }

    async verifyPhone(code: string) {
        const {id: userId, new_phone} = this.request.user
        const token = this.request.cookies?.[CookieKeys.PhoneOtp]
        if (!token) {
            throw new BadRequestException(AuthMessage.ExpiredCode)
        }

        const {phone} = this.tokenService.verifyPhoneToken(token)

        if (phone !== new_phone) {
            throw new BadRequestException(BadRequestMessage.SomethingWrong)
        }

        const otp = await this.checkOtp(userId, code)

        if (otp.method !== AuthMethod.Phone) {
            throw new BadRequestException(BadRequestMessage.SomethingWrong)
        }

        await this.userRepository.update({id: userId}, {
            phone,
            verify_phone: true,
            new_phone: null
        })

        return {
            message: PublicMessage.Updated,
        }

    }

    async checkOtp(userId: number, code: string) {
        const otp = await this.otpRepository.findOneBy({user_id: userId})

        if (!otp) {
            throw new NotFoundException(AuthMessage.LoginAgain)
        }

        const now = new Date()
        if (otp.expires_in < now) {
            throw new UnauthorizedException(AuthMessage.ExpiredCode)
        }

        if (otp.code !== code) {
            throw new UnauthorizedException(AuthMessage.LoginAgain)
        }

        return otp
    }


    async changeUsername(username: string) {
        const {id} = this.request.user
        const existingUser = await this.userRepository.findOneBy({username})

        if (existingUser && existingUser?.id !== id) {
            throw new ConflictException(ConflictMessage.Username)
        }
        if (existingUser && existingUser.id === id) {
            return {
                message: PublicMessage.Updated
            }
        }

        // assign as pending new email
        const user = await this.userRepository.findOneBy({id})
        if (!user) {
            throw new NotFoundException(AuthMessage.LoginAgain)
        }
        user.username = username
        await this.userRepository.save(user)

        return {
            message: PublicMessage.Updated
        }
    }
}
