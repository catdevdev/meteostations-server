import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';

import { DevicesService, pubSub } from './devices.service';
import { CurrentOnlineDevice, OnlineDevice } from './dto/device.dto';

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

  @Subscription(() => CurrentOnlineDevice)
  updateDeviceOnlineStatus() {
    return pubSub.asyncIterator('update_device_online_status');
  }
}
