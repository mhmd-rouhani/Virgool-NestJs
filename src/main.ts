import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {SwaggerConfigInit} from "./config/swagger.config";
import {ValidationPipe} from "@nestjs/common";
import cookieParser from "cookie-parser";
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets("public")
  //#region SWAGGER
  SwaggerConfigInit(app)
  //#endregion

  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser(process.env.COOKIE_SECRET))

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`Swagger: http://localhost:${process.env.PORT ?? 3000}/swagger`);
  });
}
bootstrap();
