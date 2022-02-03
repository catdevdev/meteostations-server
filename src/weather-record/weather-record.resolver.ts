import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { WeatherRecordType } from './dto/weather-record.dto';
import { CurrentWeatherStationDataInput } from './inputs/current-weather-station-data.input';
import { pubSub, WeatherRecordService } from './weather-record.service';

@Resolver()
export class WeatherRecordResolver {
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
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
