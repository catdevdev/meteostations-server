import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/user/user.model';
import { WeatherRecord } from 'src/weather-record/weather-record.model';
import * as moment from 'moment';
import { Role } from 'src/role/role.model';
import { OnlineUser } from './types';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  public OnlineDevices: User[] = [];

  private async getOnlineDevices() {
    const onlineDevices = await this.userRepository.findAll({
      where: {
        // @ts-ignore
        '$weatherRecord.createdAt$': {
          [Op.gte]: moment().subtract(10, 'seconds').toDate(),
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
