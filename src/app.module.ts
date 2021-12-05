import { Module } from '@nestjs/common';
import { WeatherRecordController } from './weather-record/weather-record.controller';
import { WeatherRecordService } from './weather-record/weather-record.service';

import { ConfigModule } from '@nestjs/config';
import { WeatherRecord } from './weather-record/weather-record.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { WeatherRecordModule } from './weather-record/weather-record.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { User } from './user/user.model';
import { Role } from './role/role.model';
import { UserRole } from './role/user-roles.model';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [WeatherRecord, User, Role, UserRole],
      autoLoadModels: true,
      synchronize: true,
    }),
    WeatherRecordModule,
    UserModule,
    RoleModule,
    AuthModule,
  ],
})
export class AppModule {}
