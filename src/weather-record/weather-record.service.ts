import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PubSub } from 'graphql-subscriptions';
import { Op } from 'sequelize';
import { DevicesService } from 'src/devices/devices.service';
import { User } from 'src/user/user.model';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecord } from './weather-record.model';

export const pubSub = new PubSub();

@Injectable()
export class WeatherRecordService {
  constructor(
    @InjectModel(WeatherRecord)
    private weatherRecordModel: typeof WeatherRecord,
    private devicesService: DevicesService,
  ) {}

  async createWeatherRecord(dto: CreateWeatherRecordDto & { userId: number }) {
    const weatherRecord = await this.weatherRecordModel.create(dto);
    pubSub.publish('weather_station_record', {
      currentWeatherStationData: weatherRecord,
    });
    this.devicesService.updateOnlineStatusOfDevice(dto.userId);
    return weatherRecord;
  }

  async getAllWeatherRecords() {
    const weatherRecords = await this.weatherRecordModel.findAll();
    return weatherRecords;
  }

  async getWeatherRecordsByDateInterval(
    startDate: Date,
    endDate: Date,
    weatherStationIds: number[],
  ) {
    const weatherRecords = await this.weatherRecordModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: {
          [Op.contained]: weatherStationIds,
        },
      },
    });

    return weatherRecords;
  }
}
