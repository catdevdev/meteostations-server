import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PubSub } from 'graphql-subscriptions';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecord } from './weather-record.model';

export const pubSub = new PubSub();

@Injectable()
export class WeatherRecordService {
  constructor(
    @InjectModel(WeatherRecord)
    private weatherRecordModel: typeof WeatherRecord,
  ) {}

  async createWeatherRecord(dto: CreateWeatherRecordDto & { userId: number }) {
    const weatherRecord = await this.weatherRecordModel.create(dto);
    pubSub.publish('weather_station_record', {
      currentWeatherStationData: weatherRecord,
    });
    return weatherRecord;
  }

  async getAllWeatherRecords() {
    const weatherRecords = await this.weatherRecordModel.findAll();
    return weatherRecords;
  }

  async getAvailableDates(options: ) {
    const weatherRecord = await this.weatherRecordModel.findAll();
    return weatherRecord;
  }
}
