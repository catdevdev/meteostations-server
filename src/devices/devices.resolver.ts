import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { WeatherRecordType } from 'src/weather-record/dto/weather-record.dto';
import {
  WeatherStationBetweenDates,
  WeatherStationSpecifications,
} from 'src/weather-record/inputs/current-weather-station-data.input';
import { WeatherRecordService } from 'src/weather-record/weather-record.service';

import { DevicesService, pubSub } from './devices.service';
import { CurrentOnlineDevice, OnlineDevice } from './dto/device.dto';

@Resolver()
export class DevicesResolver {
  constructor(
    private devicesService: DevicesService,
    private weatherRecordService: WeatherRecordService,
  ) {}
  @Query(() => [OnlineDevice])
  async devices(
    @Args('dateRange') dateRange: WeatherStationBetweenDates,
    @Args('weatherStationIds')
    weatherStationSpecifications: WeatherStationSpecifications,
  ): Promise<OnlineDevice[]> {
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

  @Subscription(() => CurrentOnlineDevice)
  updateDeviceOnlineStatus() {
    return pubSub.asyncIterator('update_device_online_status');
  }
}
