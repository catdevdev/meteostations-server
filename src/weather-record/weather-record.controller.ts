import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecord } from './weather-record.model';
import { WeatherRecordService } from './weather-record.service';

@ApiTags('Weather Record')
@Controller('weather-record')
export class WeatherRecordController {
  constructor(private weatherRecordService: WeatherRecordService) {}

  @ApiOperation({ summary: 'Creation Weather Record' })
  @ApiResponse({ status: 200, type: WeatherRecord })
  @Post()
  create(@Body() createWeatherRecordDto: CreateWeatherRecordDto) {
    return this.weatherRecordService.createWeatherRecord(
      createWeatherRecordDto,
    );
  }

  @ApiOperation({ summary: 'Return All Weather Records' })
  @ApiResponse({ status: 200, type: [WeatherRecord] })
  @Get()
  getAll() {
    return this.weatherRecordService.getAllWeatherRecords();
  }
}
