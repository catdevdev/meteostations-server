import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({
    example: 'MODERATOR',
    description: 'Add existing role for user',
  })
  readonly value: string;

  @ApiProperty({
    example: '3',
    description: 'Just simple user id from postgres',
  })
  readonly userId: number;
}
