import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateWeatherRecordDto } from './dto/create-weather-record.dto';
import { WeatherRecordService } from './weather-record.service';

@Controller('weather-record')
export class WeatherRecordController {
  constructor(private weatherRecordService: WeatherRecordService) {}
  @Post()
  create(@Body() createWeatherRecordDto: CreateWeatherRecordDto) {
    return this.weatherRecordService.createWeatherRecord(
      createWeatherRecordDto,
    );
  }

  @Get()
  getAll() {
    return this.weatherRecordService.getAllWeatherRecords();
  }
}
