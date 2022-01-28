import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeatherRecordType {
  @Field() pressureFromBMP180: number;
  @Field() temperatureFromBMP180: number;
  @Field() temperatureFromDTH22: number;
  @Field() humidityFromDTH22: string;
  @Field() analogSignalFromRainSensor: number;
  @Field() rssi: number;
  @Field() userId: number;
  @Field() createdAt: Date;
}
