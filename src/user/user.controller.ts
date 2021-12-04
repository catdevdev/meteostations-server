import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateWeatherRecordDto } from 'src/weather-record/dto/create-weather-record.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Creation Weather Record' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() сreateUserDto: CreateUserDto) {
    return this.userService.createUser(сreateUserDto);
  }

  @ApiOperation({ summary: 'Return All Weather Records' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }
}
