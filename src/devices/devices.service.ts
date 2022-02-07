import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/user/user.model';
import { WeatherRecord } from 'src/weather-record/weather-record.model';
import * as moment from 'moment';
import { Role } from 'src/role/role.model';

import { PubSub } from 'graphql-subscriptions';

export const pubSub = new PubSub();

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  private timerID: ReturnType<typeof setTimeout>;

  private onlineDevicesId: number[] = [];

  public async updateOnlineStatusOfDevice(userId: number) {
    clearTimeout(this.timerID);
    const isOnlineDevice = this.onlineDevicesId.some(
      (deviceId) => userId === deviceId,
    );
    if (!isOnlineDevice) {
      const onlineDevice = {
        userId,
        isOnline: true,
      };
      pubSub.publish('update_device_online_status', {
        updateDeviceOnlineStatus: onlineDevice,
      });
      this.onlineDevicesId.push(userId);
    }
    this.timerID = setTimeout(() => {
      const offlineDevice = {
        userId,
        isOnline: false,
      };
      pubSub.publish('update_device_online_status', {
        updateDeviceOnlineStatus: offlineDevice,
      });
      this.onlineDevicesId = this.onlineDevicesId.filter(
        (deviceId) => deviceId !== userId,
      );
    }, 5000);
  }

  private async getOnlineDevices() {
    const onlineDevices = await this.userRepository.findAll({
      where: {
        // @ts-ignore
        '$weatherRecord.createdAt$': {
          [Op.gte]: moment().subtract(5, 'seconds').toDate(),
        },
      },
      include: [
        {
          model: WeatherRecord,
          order: [['createdAt', 'DESC']],
        },
      ],
    });
    return onlineDevices;
  }

  async getAllDevices() {
    const devices = await this.userRepository.findAll({
      include: [
        {
          model: Role,
          where: {
            '$roles.id$': {
              [Op.eq]: 3,
            },
          },
        },
      ],
    });
    const onlineDevices = await this.getOnlineDevices();

    const devicesWithOnlineStatus = devices.map((device) => {
      return {
        device,
        isOnline: onlineDevices.some((onlineDevice) => {
          return device.id === onlineDevice.id;
        }),
      };
    });

    return devicesWithOnlineStatus;
  }
}
