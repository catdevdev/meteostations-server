import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface WeatherRecordAttrs {
  meteostationId: string;
  pressureFromBMP180: number;
  temperatureFromBMP180: number;
  temperatureFromDTH22: number;
  humidityFromDTH22: number;
  analogSignalFromRainSensor: number;
}

@Table({ tableName: 'WeatherRecord' })
export class WeatherRecord extends Model<WeatherRecord, WeatherRecordAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  meteostationId: string;

  @Column({
    type: DataType.DOUBLE,
  })
  pressureFromBMP180: number;

  @Column({
    type: DataType.DOUBLE,
  })
  temperatureFromBMP180: number;

  @Column({
    type: DataType.DOUBLE,
  })
  temperatureFromDTH22: number;

  @Column({
    type: DataType.DOUBLE,
  })
  humidityFromDTH22: number;

  @Column({
    type: DataType.INTEGER,
  })
  analogSignalFromRainSensor: number;
}
