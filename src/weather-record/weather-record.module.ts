import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/user.model';
import { WeatherRecordController } from './weather-record.controller';
import { WeatherRecord } from './weather-record.model';
import { WeatherRecordService } from './weather-record.service';
import { WeatherRecordResolver } from './weather-record.resolver';
import { DevicesModule } from 'src/devices/devices.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([WeatherRecord, User]),
    DevicesModule,
  ],
  providers: [WeatherRecordService, WeatherRecordResolver],
  controllers: [WeatherRecordController],
  exports: [SequelizeModule],
})
export class WeatherRecordModule {}
