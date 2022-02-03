import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Device {
  @Field() userId: number;
  @Field() username: string;
}

@ObjectType()
export class OnlineDevice {
  @Field(() => Device) device: Device;
  @Field() isOnline: boolean;
}
