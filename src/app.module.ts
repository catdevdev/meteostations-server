import { Module } from '@nestjs/common';
import { WeatherRecordController } from './weather-record/weather-record.controller';
import { WeatherRecordService } from './weather-record/weather-record.service';

import { ConfigModule } from '@nestjs/config';
import { WeatherRecord } from './weather-record/weather-record.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { WeatherRecordModule } from './weather-record/weather-record.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [UsersService],
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
      models: [WeatherRecord],
      autoLoadModels: true,
      synchronize: true,
    }),
    WeatherRecordModule,
    UsersModule,
  ],
})
export class AppModule {}
