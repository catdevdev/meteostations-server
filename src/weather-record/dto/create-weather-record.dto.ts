import { ApiProperty } from '@nestjs/swagger';

export class CreateWeatherRecordDto {
  @ApiProperty({
    example: '100045.23',
    description: 'Pressure from sensor BMP180',
  })
  readonly pressureFromBMP180: number;

  @ApiProperty({
    example: '23.44',
    description: 'Temperature from sensor BMP180',
  })
  readonly temperatureFromBMP180: number;

  @ApiProperty({
    example: '23.44',
    description: 'Temperature from sensor DHT22',
  })
  readonly temperatureFromDTH22: number;

  @ApiProperty({
    example: '73.44',
    description: 'Humidity from sensor DHT22',
  })
  readonly humidityFromDTH22: number;

  @ApiProperty({
    example: '432',
    description: 'Analog signal from rain sensor',
  })
  readonly analogSignalFromRainSensor: number;

  @ApiProperty({
    example: '192',
    description: 'signal level per record',
  })
  readonly rssi: number;

  // @ApiProperty({
  //   example: '2',
  //   description: 'meteostation 1',
  // })
  // readonly meteostationId: number;
}
