import { Field, ID, ObjectType } from '@nestjs/graphql';
import { WeatherRecordType } from 'src/weather-record/dto/weather-record.dto';

@ObjectType()
class Device {
  @Field() userId: number;
  @Field() username: string;
}

@ObjectType()
export class OnlineDevice {
  @Field(() => Device) device: Device;
  @Field() isOnline: boolean;
  @Field(() => [WeatherRecordType]) weatherRecords: WeatherRecordType[];
}

@ObjectType()
export class CurrentOnlineDevice {
  @Field() userId: number;
  @Field() isOnline: boolean;
}
