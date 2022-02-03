import { forwardRef, Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesResolver } from './devices.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { WeatherRecord } from 'src/weather-record/weather-record.model';

@Module({
  providers: [DevicesService, DevicesResolver],
  imports: [
    forwardRef(() => WeatherRecord),
    SequelizeModule.forFeature([User, WeatherRecord]),
  ],
  exports: [DevicesService],
})
export class DevicesModule {}
