import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from 'src/role/role.model';
import { UserRole } from 'src/role/user-roles.model';
import { WeatherRecord } from 'src/weather-record/weather-record.model';

interface UserAttrs {
  username: string;
  password: string;
}

@Table({ tableName: 'User' })
export class User extends Model<User, UserAttrs> {
  @ApiProperty({ example: '1', description: 'Unique Id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'catdev576',
    description: 'username',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  username: string;

  @ApiProperty({
    example: 'hash',
    description: 'password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @HasMany(() => WeatherRecord)
  weatherRecord: WeatherRecord[];
}
