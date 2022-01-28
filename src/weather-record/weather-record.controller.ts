import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/user/user.model';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecord } from './weather-record.model';
import { WeatherRecordService } from './weather-record.service';

@ApiTags('Weather Record')
@Controller('weather-record')
export class WeatherRecordController {
  constructor(private weatherRecordService: WeatherRecordService) {}

  @ApiOperation({ summary: 'Creation Weather Record' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: WeatherRecord })
  @Roles('WEATHERSTATION')
  @UseGuards(RolesGuard)
  @Post()
  createWeatherRecord(
    @Body() createWeatherRecordDto: CreateWeatherRecordDto,
    @CurrentUser() user: User,
  ) {
    return this.weatherRecordService.createWeatherRecord({
      ...createWeatherRecordDto,
      userId: user.id,
    });
  }

  @ApiOperation({ summary: 'Return All Weather Records' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [WeatherRecord] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.weatherRecordService.getAllWeatherRecords();
  }
}
