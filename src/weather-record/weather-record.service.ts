import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PubSub } from 'graphql-subscriptions';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { DevicesService } from 'src/devices/devices.service';
import { User } from 'src/user/user.model';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecord } from './weather-record.model';
import _, { Dictionary } from 'underscore';

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
          [Op.in]: weatherStationIds,
        },
      },
    });

    return weatherRecords;
  }

  async getWeatherRecordsByTimeInterval(
    startDate: Date,
    endDate: Date,
    weatherStationIds: number[],
    groupByInterval: string,
  ) {
    const recordsByDateInterval = await this.getWeatherRecordsByDateInterval(
      startDate,
      endDate,
      weatherStationIds,
    );
    // const records = [...recordsByDateInterval];
    const intervals = {
      minute: 'yyyy-hh-mm',
      hour: 'yyyy-MMM-d-hh',
      day: 'yyyy-MMM-d',
      week: 'yyyy-MMM-ww',
      month: 'yyyy-MMM',
    };
    const groupedByRecords = _.groupBy(recordsByDateInterval, (record) => {
      return moment(record.createdAt).format(intervals[groupByInterval]);
    });
    return groupedByRecords;
  }

  async getWeatherRecordsByTimeIntervalGroupedByUserId(
    startDate: Date,
    endDate: Date,
    weatherStationIds: number[],
    groupByInterval: string,
  ): Promise<Dictionary<WeatherRecord[]>[]> {
    const recordsByDateInterval = await this.getWeatherRecordsByDateInterval(
      startDate,
      endDate,
      weatherStationIds,
    );

    const recordsGroupedByUserId = weatherStationIds.map((userId) => {
      return recordsByDateInterval.filter((record) => {
        return record.userId === userId;
      });
    });

    const intervals = {
      minute: 'yyyy-hh-mm',
      hour: 'yyyy-MMM-d-hh',
      day: 'yyyy-MMM-d',
      week: 'yyyy-MMM-ww',
      month: 'yyyy-MMM',
    };

    const recordsGroupedByUserIdObject = recordsGroupedByUserId.map(
      (records) => {
        return _.groupBy(records, (record) => {
          return moment(record.createdAt).format(intervals[groupByInterval]);
        });
      },
    );

    const records = Object.keys(recordsGroupedByUserIdObject).map((key) => {
      return recordsGroupedByUserIdObject[key];
    }) as Dictionary<WeatherRecord[]>[];

    return records;
  }
}
