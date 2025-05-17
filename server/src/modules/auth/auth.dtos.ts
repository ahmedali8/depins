import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/database';

export class AuthDto {
  @ApiProperty({
    required: true,
    description: 'The oidcToken from the provider',
  })
  @IsNotEmpty()
  credential: string;
}

export class TokensDto {
  @ApiProperty({
    required: true,
    description: 'The access token',
  })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    required: true,
    description: 'The refresh token',
  })
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({
    required: true,
    type: User,
  })
  user: User;

  @ApiProperty({
    required: true,
    type: TokensDto,
  })
  tokens: TokensDto;
}

export class RefreshTokenDto {
  @ApiProperty({
    required: true,
    description: 'The refresh token',
  })
  @IsNotEmpty()
  refreshToken: string;
}
