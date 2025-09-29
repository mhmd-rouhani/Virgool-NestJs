import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {AuthMessage} from "../../../common/enums/message.enum";
import {isJWT} from "class-validator";
import {AuthService} from "../auth.service";
import {Reflector} from "@nestjs/core";
import {SKIP_AUTH} from "../../../common/decorators/skip-auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext) {
        const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler())

        if (isSkippedAuthorization) return true;

        const httpContext = context.switchToHttp();
        const request: Request = httpContext.getRequest<Request>()

        const token = this.extractToken(request)

        request.user = await this.authService.validateAccessToken(token)
        return true
    }

    protected extractToken(request: Request) {
        const {authorization} = request.headers;

        if (!authorization || authorization.trim() === "") {
            throw new UnauthorizedException(AuthMessage.LoginIsRequired)
        }

        const [bearer, token] = authorization.split(" ");
        if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
            throw new UnauthorizedException(AuthMessage.LoginIsRequired)
        }

        return token;
    }

}