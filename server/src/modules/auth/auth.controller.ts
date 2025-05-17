import { Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/database';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(): Promise<User> {
    return this.authService.register();
  }

  @Get('secret/:walletPublicKey')
  async getRawSecret(
    @Param('walletPublicKey') walletPublicKey: string,
  ): Promise<{ privateKey: string }> {
    const privateKey = await this.authService.getRawSecret(walletPublicKey);
    return { privateKey };
  }

  // @Post()
  // @SwaggerApiResponse(
  //   RequestMethod.POST,
  //   'An object containing the DB user and tokens',
  //   AuthResponseDto,
  // )
  // async auth(@Body() body: AuthDto): Promise<AuthResponseDto> {
  //   const decodedJwt = decodeJwt(body.credential);

  //   const dbUser = await this.userService.getOrCreateUser(decodedJwt?.email);
  //   console.log('🚀 ~ AuthController ~ auth ~ dbUser:', dbUser);

  //   const { accessToken, refreshToken } = this.generateTokens(dbUser);
  //   await this.userService.updateRefreshToken(dbUser.id, refreshToken);

  //   return {
  //     user: dbUser,
  //     tokens: { accessToken, refreshToken },
  //     wallets: [],
  //   };
  // }

  // @Get('refresh-token')
  // @UseGuards(RefreshTokenGuard)
  // @SwaggerApiResponse(
  //   RequestMethod.GET,
  //   'An object containing the new refreshed tokens - requires the refresh token in the Authorization header',
  //   TokensDto,
  //   true,
  // )
  // async refreshTokens(@Req() req: Request) {
  //   const userId = (req as any).user['sub'];
  //   const refreshToken = (req as any).user['refreshToken'];

  //   const user = await this.userService.findById(userId);
  //   if (!user || !user.refreshToken)
  //     throw new ForbiddenException('Access Denied');
  //   const refreshTokenMatches = await argon2.verify(
  //     user.refreshToken,
  //     refreshToken,
  //   );
  //   if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  //   const tokens = this.generateTokens(user);
  //   await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
  //   return tokens;
  // }

  // private generateTokens(user: User) {
  //   const tokenPayload = {
  //     sub: user.id,
  //     email: user.email,
  //   };
  //   return {
  //     accessToken: this.authTokenService.generateToken(
  //       tokenPayload,
  //       TokenType.ACCESS,
  //     ),
  //     refreshToken: this.authTokenService.generateToken(
  //       tokenPayload,
  //       TokenType.REFRESH,
  //     ),
  //   };
  // }
}
