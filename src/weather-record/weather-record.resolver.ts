import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { WeatherRecordType } from './dto/weather-record.dto';
import {
  CurrentWeatherStationDataInput,
  WeatherStationBetweenDates,
} from './inputs/current-weather-station-data.input';
import { WeatherRecord } from './weather-record.model';
import { pubSub, WeatherRecordService } from './weather-record.service';
import test from 'simplify-js';

@Resolver()
export class WeatherRecordResolver {
  constructor(private weatherRecordService: WeatherRecordService) {}
  @Query(() => [WeatherRecordType])
  async weatherStationData(
    @Args('input') input: WeatherStationBetweenDates,
  ): Promise<WeatherRecordType[]> {
    const weatherStationData =
      (await this.weatherRecordService.getWeatherRecordsByDateInterval(
        new Date(input.startDate),
        new Date(input.endDate),
      )) as WeatherRecordType[];

    console.log(weatherStationData.length);
    test.

    return weatherStationData.map((weatherStationRecord) => {
      return {
        pressureFromBMP180: weatherStationRecord.pressureFromBMP180,
        temperatureFromBMP180: weatherStationRecord.temperatureFromBMP180,
        temperatureFromDTH22: weatherStationRecord.temperatureFromDTH22,
        humidityFromDTH22: weatherStationRecord.humidityFromDTH22,
        analogSignalFromRainSensor:
          weatherStationRecord.analogSignalFromRainSensor,
        rssi: weatherStationRecord.rssi,
        userId: weatherStationRecord.userId,
        createdAt: weatherStationRecord.createdAt,
      };
    });
  }

  @Subscription(() => WeatherRecordType, {
    filter: (payload, variables) => {
      if (variables.input.userId) {
        return (
          payload.currentWeatherStationData.userId == variables.input.userId
        );
      }
      return true;
    },
  })
  currentWeatherStationData(
    @Args('input') input: CurrentWeatherStationDataInput,
  ) {
    return pubSub.asyncIterator('weather_station_record');
  }
}
