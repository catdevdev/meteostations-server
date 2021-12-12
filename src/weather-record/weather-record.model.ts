import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

interface WeatherRecordAttrs {
  pressureFromBMP180: number;
  temperatureFromBMP180: number;
  temperatureFromDTH22: number;
  humidityFromDTH22: number;
  analogSignalFromRainSensor: number;
}

@Table({ tableName: 'WeatherRecord' })
export class WeatherRecord extends Model<WeatherRecord, WeatherRecordAttrs> {
  @ApiProperty({ example: '1', description: 'Unique Id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '100045.23',
    description: 'Pressure from sensor BMP180',
  })
  @Column({
    type: DataType.DOUBLE,
  })
  pressureFromBMP180: number;

  @ApiProperty({
    example: '23.44',
    description: 'Temperature from sensor BMP180',
  })
  @Column({
    type: DataType.DOUBLE,
  })
  temperatureFromBMP180: number;

  @ApiProperty({
    example: '23.44',
    description: 'Temperature from sensor DHT22',
  })
  @Column({
    type: DataType.DOUBLE,
  })
  temperatureFromDTH22: number;

  @ApiProperty({
    example: '73.44',
    description: 'Humidity from sensor DHT22',
  })
  @Column({
    type: DataType.DOUBLE,
  })
  humidityFromDTH22: number;

  @ApiProperty({
    example: '433',
    description: 'Analog signal from rain sensor',
  })
  @Column({
    type: DataType.INTEGER,
  })
  analogSignalFromRainSensor: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  meteostation: string;
}
