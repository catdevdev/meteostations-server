import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecord } from './weather-record.model';

@Injectable()
export class WeatherRecordService {
  constructor(
    @InjectModel(WeatherRecord)
    private weatherRecordModel: typeof WeatherRecord,
  ) {}

  async createWeatherRecord(dto: CreateWeatherRecordDto) {
    const weatherRecord = await this.weatherRecordModel.create(dto);
    return weatherRecord;
  }

  async getAllWeatherRecords() {
    const weatherRecord = await this.weatherRecordModel.findAll();
    return weatherRecord;
  }
}
