import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: '583947b1-19f4-4573-a595-faf52e147cf5',
    description: 'Meteostation Id',
  })
  readonly username: string;

  @ApiProperty({
    example: '100045.23',
    description: 'Pressure from sensor BMP180',
  })
  readonly password: string;
}
