import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { WeatherRecordType } from './dto/weather-record.dto';
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

  @Subscription(() => WeatherRecordType, {
    filter: (payload, variables) => {
      // if (variables.input.userIds) {
      //   return (
      //     payload.currentWeatherStationData.userId == variables.input.userId
      //   );
      // }
      // return true;
      if (variables.input.userIds) {
        return variables.input.userIds.some((userId: number) => {
          console.log(payload.currentWeatherStationData.userId);
          console.log(userId);
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
