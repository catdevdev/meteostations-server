import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { RoleController } from './role.controller';
import { Role } from './role.model';
import { UserRole } from './user-roles.model';

@Module({
  controllers: [RoleController],
  imports: [SequelizeModule.forFeature([Role, User, UserRole])],
})
export class RoleModule {}
