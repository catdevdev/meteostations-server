import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { WeatherRecord } from './weather-record/weather-record.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { WeatherRecordModule } from './weather-record/weather-record.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { User } from './user/user.model';
import { Role } from './role/role.model';
import { UserRole } from './role/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      // introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      installSubscriptionHandlers: true,
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
