import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PubSub } from 'graphql-subscriptions';
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
    @InjectModel(User)
    private userModel: typeof User,
    private devicesService: DevicesService,
  ) {}

  async createWeatherRecord(dto: CreateWeatherRecordDto & { userId: number }) {
    const weatherRecord = await this.weatherRecordModel.create(dto);
    pubSub.publish('weather_station_record', {
      currentWeatherStationData: weatherRecord,
    });

    const userThatCreatedWeatherRecord = await this.userModel.findOne({
      where: {
        id: dto.userId,
      },
    });

    const onlineDevice = {
      device: {
        userId: userThatCreatedWeatherRecord.id,
        username: userThatCreatedWeatherRecord.username,
      },
      isOnline: true,
    };

    pubSub.publish('update_device_online_status', {
      updateDeviceOnlineStatus: onlineDevice,
    });
    this.devicesService.OnlineDevices.push(userThatCreatedWeatherRecord);
    return weatherRecord;
  }

  async getAllWeatherRecords() {
    const weatherRecords = await this.weatherRecordModel.findAll();
    return weatherRecords;
  }
}
