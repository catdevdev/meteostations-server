import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'MODERATOR',
    description: 'role value',
  })
  readonly value: string;

  @ApiProperty({
    example: 'this is role for control values',
    description: 'description',
  })
  readonly description: string;
}
