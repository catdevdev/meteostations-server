import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { DevicesModule } from 'src/devices/devices.module';
import { Role } from 'src/role/role.model';
import { RoleModule } from 'src/role/role.module';
import { WeatherRecord } from 'src/weather-record/weather-record.model';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([User, Role, WeatherRecord]),
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
