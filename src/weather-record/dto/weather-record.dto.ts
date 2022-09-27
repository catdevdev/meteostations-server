import { Field, ObjectType } from '@nestjs/graphql';

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

  @Field({
    nullable: true,
  })
  analogSignalFromRainSensor: number;
  @Field({
    nullable: true,
  })
  rssi: number;
  @Field({
    nullable: true,
  })
  userId: number;
  @Field({
    nullable: true,
  })
  createdAt: Date;
}

@ObjectType()
export class WeatherRecordGroupedByTimeIntervalType {
  @Field()
  groupByInterval: string;
  @Field(() => [WeatherRecordType])
  records: WeatherRecordType[];
}
