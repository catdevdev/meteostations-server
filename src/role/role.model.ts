import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { UserRole } from './user-roles.model';

interface RoleAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'Role' })
export class Role extends Model<Role, RoleAttrs> {
  @ApiProperty({ example: '1', description: 'Unique Id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'admin',
    description: 'this is role name',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  value: string;

  @ApiProperty({
    example: 'This role have all rights',
    description: 'this is role description',
  })
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  description: string; 
  
  @BelongsToMany(()=>User, ()=>UserRole)
  users: User[];
}
