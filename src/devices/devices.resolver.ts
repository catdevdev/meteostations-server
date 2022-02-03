import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { pubSub } from 'src/weather-record/weather-record.service';
import { DevicesService } from './devices.service';
import { OnlineDevice } from './dto/device.dto';

@Resolver()
export class DevicesResolver {
  constructor(private devicesService: DevicesService) {}
  @Query(() => [OnlineDevice])
  async devices(): Promise<OnlineDevice[]> {
    const devices = await this.devicesService.getAllDevices();

    return devices.map(({ device, isOnline }) => {
      return {
        device: { userId: device.id, username: device.username },
        isOnline,
      };
    });
  }

  @Subscription(() => OnlineDevice)
  updateDeviceOnlineStatus() {
    return pubSub.asyncIterator('update_device_online_status');
  }
}
