export class CreateWeatherRecordDto {
  readonly meteostationId: string;
  readonly pressureFromBMP180: number;
  readonly temperatureFromBMP180: number;
  readonly temperatureFromDTH22: number;
  readonly humidityFromDTH22: number;
  readonly analogSignalFromRainSensor: number;
}
