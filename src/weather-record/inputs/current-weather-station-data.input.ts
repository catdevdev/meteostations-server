import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class WeatherStationBetweenDates {
  @Field()
  startDate: string;
  @Field()
  endDate: string;
}
@InputType()
export class WeatherStationSpecifications {
  @Field()
  weatherStationIds: number[];
}

@InputType()
export class WeatherStationUsers {
  @Field()
  startDate: string;
  @Field()
  endDate: string;
}

@InputType()
export class CurrentWeatherStationDataInput {
  @Field()
  userId: number;
}
