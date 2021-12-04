import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherRecordController } from './weather-record.controller';
import { WeatherRecord } from './weather-record.model';
import { WeatherRecordService } from './weather-record.service';

@Module({
  imports: [SequelizeModule.forFeature([WeatherRecord])],
  providers: [WeatherRecordService],
  controllers: [WeatherRecordController],
})
export class WeatherRecordModule {}
