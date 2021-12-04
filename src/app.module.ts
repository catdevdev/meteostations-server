import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherRecordResolver } from './weather-record/weather-record.resolver';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WeatherRecordResolver],
})
export class AppModule {}
