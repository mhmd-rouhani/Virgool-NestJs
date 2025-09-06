import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export const SwaggerConfigInit = (app: INestApplication) => {
    const document = new DocumentBuilder()
        .setTitle('Virgool Swagger ')
        .setDescription('Backend of Virgool Swagger Documentation')
        .setVersion('v1.0.0')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, document);

    SwaggerModule.setup("/swagger", app, swaggerDocument);
}