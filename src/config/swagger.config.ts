import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {SecuritySchemeObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const SwaggerConfigInit = (app: INestApplication) => {
    const document = new DocumentBuilder()
        .setTitle('Virgool Swagger ')
        .setDescription('Backend of Virgool Swagger Documentation')
        .setVersion('v1.0.0')
        .addBearerAuth(SwaggerAuthConfig(), "Authorization")
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, document);

    SwaggerModule.setup("/swagger", app, swaggerDocument);
}

export const SwaggerAuthConfig = (): SecuritySchemeObject => {
    return {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer",
    }
}