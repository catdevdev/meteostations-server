import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CurrentWeatherStationDataInput {
  @Field()
  userId: string;
}
