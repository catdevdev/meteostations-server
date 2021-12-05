import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'pos5nashaa',
    description: 'username',
  })
  readonly username: string;

  @ApiProperty({
    example: 'p@ssw0rd',
    description: 'password',
  })
  readonly password: string;
}
