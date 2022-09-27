import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { runInContext } from 'lodash';
import { Dictionary } from 'underscore';
import {
  WeatherRecordGroupedByTimeIntervalType,
  WeatherRecordType,
} from './dto/weather-record.dto';
import {
  CurrentWeatherStationDataInput,
  WeatherStationBetweenDates,
  WeatherStationSpecifications,
} from './inputs/current-weather-station-data.input';
import { pubSub, WeatherRecordService } from './weather-record.service';

@Resolver()
export class WeatherRecordResolver {
  constructor(private weatherRecordService: WeatherRecordService) {}

  @Query(() => [WeatherRecordType])
  async weatherStationData(
    @Args('dateRange') dateRange: WeatherStationBetweenDates,
    @Args('weatherStationIds')
    weatherStationSpecifications: WeatherStationSpecifications,
  ): Promise<WeatherRecordType[]> {
    const weatherStationData =
      (await this.weatherRecordService.getWeatherRecordsByDateInterval(
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
        weatherStationSpecifications.weatherStationIds.map(
          ({ userId }) => userId,
        ),
      )) as WeatherRecordType[];

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

  @Query(() => [WeatherRecordGroupedByTimeIntervalType])
  async weatherStationDataGroupByTimeInterval(
    @Args('dateRange') dateRange: WeatherStationBetweenDates,
    @Args('weatherStationIds')
    weatherStationSpecifications: WeatherStationSpecifications,
    @Args('groupByInterval')
    groupByInterval: string,
  ): Promise<WeatherRecordGroupedByTimeIntervalType[]> {
    const weatherStationDataByTimeInterval =
      (await this.weatherRecordService.getWeatherRecordsByTimeInterval(
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
        weatherStationSpecifications.weatherStationIds.map(
          ({ userId }) => userId,
        ),
        groupByInterval,
      )) as Dictionary<WeatherRecordType[]>;

    return Object.keys(weatherStationDataByTimeInterval).map((key) => {
      return {
        groupByInterval: key,
        records: weatherStationDataByTimeInterval[key].map(
          (weatherStationRecord) => {
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
          },
        ),
      };
    });
  }

  @Subscription(() => WeatherRecordType, {
    filter: (payload, variables) => {
      if (variables.input.userIds) {
        return variables.input.userIds.some((userId: number) => {
          return payload.currentWeatherStationData.userId === userId;
        });
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
