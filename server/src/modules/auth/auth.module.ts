import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import {
  BcryptPasswordService,
  PasswordService,
} from './services/password.service';
import {
  JwtTokenService,
  AuthTokenService,
} from './services/auth-token.service';
import { JwtStrategy } from './strategies/jwt-strategy.service';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [PassportModule, JwtModule.register({}), UserModule],
  providers: [
    { provide: PasswordService, useClass: BcryptPasswordService },
    { provide: AuthTokenService, useClass: JwtTokenService },
    JwtStrategy,
    RefreshTokenStrategy,
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
