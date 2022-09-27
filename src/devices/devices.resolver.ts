import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  WeatherRecordGroupedByTimeIntervalType,
  WeatherRecordType,
} from 'src/weather-record/dto/weather-record.dto';
import {
  WeatherStationBetweenDates,
  WeatherStationSpecifications,
} from 'src/weather-record/inputs/current-weather-station-data.input';
import { WeatherRecordService } from 'src/weather-record/weather-record.service';
import { Dictionary } from 'underscore';

import { DevicesService, pubSub } from './devices.service';
import {
  DeviceWithWeatherRecords,
  DeviceStatus,
  CurrentOnlineDevice,
  DeviceWithWeatherRecordsGroupedByTimeInterval,
} from './dto/device.dto';

@Resolver()
export class DevicesResolver {
  constructor(
    private devicesService: DevicesService,
    private weatherRecordService: WeatherRecordService,
  ) {}
  @Query(() => [DeviceWithWeatherRecords])
  async devicesWithWeatherRecords(
    @Args('dateRange') dateRange: WeatherStationBetweenDates,
    @Args('weatherStationIds')
    weatherStationSpecifications: WeatherStationSpecifications,
  ): Promise<DeviceWithWeatherRecords[]> {
    const devices = await this.devicesService.getAllDevices();
    const weatherStationRecords =
      (await this.weatherRecordService.getWeatherRecordsByDateInterval(
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
        weatherStationSpecifications.weatherStationIds.map(
          ({ userId }) => userId,
        ),
      )) as WeatherRecordType[];

    return devices.map(({ device, isOnline }) => {
      return {
        device: { userId: device.id, username: device.username },
        isOnline,
        weatherRecords: weatherStationRecords.filter(
          ({ userId }) => userId === device.id,
        ),
      };
    });
  }

  @Query(() => [DeviceWithWeatherRecordsGroupedByTimeInterval])
  async devicesWithWeatherRecordsGroupByTimeInterval(
    @Args('dateRange') dateRange: WeatherStationBetweenDates,
    @Args('weatherStationIds')
    weatherStationSpecifications: WeatherStationSpecifications,
    @Args('groupByInterval')
    groupByInterval: string,
  ): Promise<DeviceWithWeatherRecordsGroupedByTimeInterval[]> {
    const weatherStationDataByTimeIntervalDictionaryArray =
      (await this.weatherRecordService.getWeatherRecordsByTimeIntervalGroupedByUserId(
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
        weatherStationSpecifications.weatherStationIds.map(
          ({ userId }) => userId,
        ),
        groupByInterval,
      )) as Dictionary<WeatherRecordType[]>[];

    // const weatherStationDataByTimeInterval =

    const weatherStationDataByTimeInterval =
      weatherStationDataByTimeIntervalDictionaryArray.map(
        (weatherStationDataByTimeIntervalDictionary) => {
          return {
            weatherStationId: Object.keys(
              weatherStationDataByTimeIntervalDictionary,
            ).map((key) => {
              return weatherStationDataByTimeIntervalDictionary[key].map(
                (record) => {
                  return record.userId;
                },
              )[0];
            })[0],
            weatherRecordsGroupedByTimeInterval: Object.keys(
              weatherStationDataByTimeIntervalDictionary,
            ).map((key) => {
              return {
                groupByInterval: key,
                records: weatherStationDataByTimeIntervalDictionary[key].map(
                  (weatherStationRecord) => {
                    return {
                      pressureFromBMP180:
                        weatherStationRecord.pressureFromBMP180,
                      temperatureFromBMP180:
                        weatherStationRecord.temperatureFromBMP180,
                      temperatureFromDTH22:
                        weatherStationRecord.temperatureFromDTH22,
                      humidityFromDTH22: weatherStationRecord.humidityFromDTH22,
                      analogSignalFromRainSensor:
                        weatherStationRecord.analogSignalFromRainSensor,
                      rssi: weatherStationRecord.rssi,
                      userId: weatherStationRecord.userId,
                      createdAt: weatherStationRecord.createdAt,
                    };
                  },
                ),
              };
            }) as WeatherRecordGroupedByTimeIntervalType[],
          };
        },
      );

    const records = weatherStationDataByTimeInterval.filter((record) => {
      return record.weatherStationId;
    });

    console.log(records);

    return records;
  }

  @Query(() => [DeviceStatus])
  async devicesStatus(): Promise<DeviceStatus[]> {
    const devices = await this.devicesService.getAllDevices();

    return devices.map(({ device, isOnline }) => {
      return {
        device: { userId: device.id, username: device.username },
        isOnline,
      };
    });
  }

  @Subscription(() => CurrentOnlineDevice)
  updateDeviceOnlineStatus() {
    return pubSub.asyncIterator('update_device_online_status');
  }
}
