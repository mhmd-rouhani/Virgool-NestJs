import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import * as process from "node:process";
import {join} from "path"
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfig} from "../../config/typeorm.config";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: join(process.cwd(), ".env")
        }),
        TypeOrmModule.forRoot(TypeOrmConfig()),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
