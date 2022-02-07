import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeatherRecordType {
  @Field({
    nullable: true,
  })
  pressureFromBMP180: number;
  @Field({
    nullable: true,
  })
  temperatureFromBMP180: number;
  @Field({
    nullable: true,
  })
  temperatureFromDTH22: number;
  @Field({
    nullable: true,
  })
  humidityFromDTH22: number;

  @Field() analogSignalFromRainSensor: number;
  @Field() rssi: number;
  @Field() userId: number;
  @Field() createdAt: Date;
}
